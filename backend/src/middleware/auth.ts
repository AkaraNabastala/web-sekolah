import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'caruy_islamic_school_production_secret_key_2026';

export interface AuthenticatedUser {
  id: number;
  username: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Sesi login diperlukan untuk mengakses endpoint ini.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak valid atau telah kedaluwarsa.'
    });
  }
}

export function requireSuperadmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAdmin(req, res, () => {
    if (req.user?.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Hak akses tidak memadai. Fitur ini hanya untuk Superadmin.'
      });
    }
    next();
  });
}
