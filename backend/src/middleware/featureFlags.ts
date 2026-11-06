import { Request, Response, NextFunction } from 'express';
import { getPool } from '../config/database.js';

// Feature flag diperiksa di server; menyembunyikan menu di frontend bukan kontrol akses.
export function requireFeatureEnabled(feature: string) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [rows]: any = await getPool().query('SELECT feature_flags FROM website_settings ORDER BY id ASC LIMIT 1');
      let flags: any = rows?.[0]?.feature_flags ?? {};
      if (typeof flags === 'string') {
        try { flags = JSON.parse(flags); } catch { flags = {}; }
      }
      if (flags && flags[feature] === false) {
        return res.status(403).json({
          success: false,
          code: 'FEATURE_DISABLED',
          message: 'Modul ini sedang dinonaktifkan melalui pengaturan website.'
        });
      }
      return next();
    } catch (error) {
      // Fail closed: jika status flag tidak dapat diverifikasi, jangan izinkan perubahan data.
      return res.status(503).json({
        success: false,
        code: 'FEATURE_FLAG_UNAVAILABLE',
        message: 'Status modul belum dapat diverifikasi. Silakan coba kembali.'
      });
    }
  };
}
