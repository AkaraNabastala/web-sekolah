import '../config/env.js';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getPool } from '../config/database.js';

const configuredJwtSecret = process.env.JWT_SECRET;
if (!configuredJwtSecret || configuredJwtSecret.length < 32) {
  throw new Error('JWT_SECRET wajib diatur dan minimal 32 karakter. Gunakan secret acak yang baru.');
}
export const JWT_SECRET: string = configuredJwtSecret;

const SESSION_COOKIE = 'caruy_admin_session';
const CSRF_COOKIE = 'caruy_csrf';

export interface AuthenticatedUser {
  id: number;
  username: string;
  role: string;
  auth_version: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

function readCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.cookie || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) {
      try { return decodeURIComponent(part.slice(separator + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const csrfCookie = readCookie(req, CSRF_COOKIE);
  const csrfHeader = req.headers['x-csrf-token'];
  if (!csrfCookie || typeof csrfHeader !== 'string' || csrfCookie !== csrfHeader) {
    return res.status(403).json({
      success: false,
      message: 'Permintaan ditolak karena token keamanan CSRF tidak valid.'
    });
  }
  return next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionCookie = readCookie(req, SESSION_COOKIE);
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const token = sessionCookie || bearerToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Sesi login diperlukan untuk mengakses endpoint ini.'
    });
  }

  // Cookie session memerlukan double-submit CSRF token untuk semua request non-GET.
  if (sessionCookie && !['GET', 'HEAD', 'OPTIONS'].includes(req.method.toUpperCase())) {
    const csrfCookie = readCookie(req, CSRF_COOKIE);
    const csrfHeader = req.headers['x-csrf-token'];
    if (!csrfCookie || typeof csrfHeader !== 'string' || csrfCookie !== csrfHeader) {
      return res.status(403).json({
        success: false,
        message: 'Permintaan ditolak karena token keamanan CSRF tidak valid.'
      });
    }
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'smp-islam-caruy',
      audience: 'admin-panel'
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak valid atau telah kedaluwarsa.'
    });
  }

  // Selalu ambil status dan role terbaru dari database agar akun nonaktif/perubahan role
  // langsung berlaku dan auth_version dapat mencabut sesi lama setelah perubahan password.
  getPool().query(
    'SELECT id, username, role, is_active, auth_version FROM admins WHERE id = ? LIMIT 1',
    [decoded.id]
  ).then(([rows]: any) => {
    const admin = rows?.[0];
    if (!admin || !Number(admin.is_active)) {
      return res.status(401).json({ success: false, message: 'Akun administrator tidak aktif atau tidak ditemukan.' });
    }
    if (Number(decoded.auth_version ?? 0) !== Number(admin.auth_version ?? 0)) {
      return res.status(401).json({ success: false, message: 'Sesi telah dicabut. Silakan login kembali.' });
    }
    req.user = {
      id: Number(admin.id),
      username: String(admin.username),
      role: String(admin.role),
      auth_version: Number(admin.auth_version ?? 0)
    };
    return next();
  }).catch(next);
}

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    requireAdmin(req, res, () => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Hak akses tidak memadai untuk menjalankan fitur ini.'
        });
      }
      return next();
    });
  };
}

export const requireSuperadmin = requireRoles('superadmin');
export const requireContentAdmin = requireRoles('superadmin', 'admin_konten');
export const requirePpdbAdmin = requireRoles('superadmin', 'admin_ppdb');
