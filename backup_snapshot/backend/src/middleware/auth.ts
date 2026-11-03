import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'smp-islam-caruy-secure-key-2026';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak: Token autentikasi tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const admin = db.findAdminById(decoded.id);
    if (!admin || !admin.is_active) {
      return res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau akun dinonaktifkan.' });
    }
    req.admin = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau telah berakhir.' });
  }
}
