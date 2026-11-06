import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../config/database.js';
import { JWT_SECRET, requireAdmin, requireSuperadmin, AuthenticatedRequest } from '../middleware/auth.js';
import { hashVisitor, parseDeviceAndBrowser, getClientIp } from '../utils/privacy.js';
import { StatisticsService } from '../services/StatisticsService.js';
import { createHash } from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

import { dashboardRouter } from './dashboardRoutes.js';
import { adminActivityLogger } from '../middleware/adminActivityLogger.js';

export const apiRouter = Router();

// Konfigurasi Multer
const routeDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(routeDir, '../../');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(backendRoot, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^\w-]/g, '_');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase}-${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe berkas tidak didukung. Unggah file gambar, PDF, atau MP4.'));
    }
  }
});

// ==========================================
// 1. SETUP FIRST ADMIN (ONE-TIME LOCKED)
// ==========================================
apiRouter.get('/setup/status', async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    let hasAdmin = false;
    try {
      const [rows]: any = await pool.query('SELECT COUNT(*) as cnt FROM admins');
      hasAdmin = rows[0]?.cnt > 0;
    } catch (err: any) {
      logger.error('SetupRoute', 'Gagal memeriksa administrator di MySQL.', { code: err?.code, sqlState: err?.sqlState, message: err?.message });
      return res.status(500).json({ success: false, message: 'Status administrator tidak dapat diperiksa.' });
    }
    res.json({
      success: true,
      initialized: hasAdmin,
      message: hasAdmin
        ? 'Sistem administrator sudah terinisialisasi. Setup awal terkunci.'
        : 'Sistem belum memiliki administrator. Silakan lakukan setup admin pertama.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/setup/first-admin', async (req: Request, res: Response) => {
  const { username, email, password, full_name } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({
      success: false,
      message: 'Semua kolom (username, email, password, nama lengkap) wajib diisi.'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password administrator minimal 8 karakter demi keamanan.'
    });
  }

  try {
    const pool = getPool();
    let hasAdmin = false;
    try {
      const [rows]: any = await pool.query('SELECT COUNT(*) as cnt FROM admins');
      hasAdmin = rows[0]?.cnt > 0;
    } catch (err: any) {
      logger.error('SetupRoute', 'Gagal memeriksa administrator di MySQL.', { code: err?.code, sqlState: err?.sqlState, message: err?.message });
      return res.status(500).json({ success: false, message: 'Status administrator tidak dapat diperiksa.' });
    }

    if (hasAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Setup terkunci: Administrator pertama sudah pernah dibuat sebelumnya.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await pool.query(
        `INSERT INTO admins (username, email, password, full_name, role, is_active, created_at)
         VALUES (?, ?, ?, ?, 'superadmin', 1, NOW())`,
        [username.trim().toLowerCase(), email.trim().toLowerCase(), hashedPassword, full_name.trim()]
      );
    } catch (err: any) {
      logger.error('SetupRoute', 'Gagal membuat administrator di MySQL.', { code: err?.code, sqlState: err?.sqlState, message: err?.message });
      return res.status(500).json({ success: false, message: 'Administrator gagal dibuat di MySQL.' });
    }

    res.json({
      success: true,
      message: 'Administrator utama SMP Islam Caruy berhasil dibuat. Setup telah terkunci permanen.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 2. AUTHENTICATION (LOGIN, LOGOUT, PROFILE)
// ==========================================
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  try {
    const pool = getPool();
    let adminUser: any = null;

    try {
      const [rows]: any = await pool.query('SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1', [
        username.trim().toLowerCase(),
        username.trim().toLowerCase()
      ]);
      adminUser = rows[0];
    } catch (err: any) {
      logger.error('AuthRoute', 'Gagal mencari administrator di MySQL.', { code: err?.code, sqlState: err?.sqlState, message: err?.message });
      return res.status(500).json({ success: false, message: 'Login sementara tidak dapat diproses.' });
    }

    if (!adminUser) {
      return res.status(401).json({ success: false, message: 'Kombinasi kredensial tidak valid.' });
    }

    if (!adminUser.is_active) {
      return res.status(403).json({ success: false, message: 'Akun administrator Anda dinonaktifkan.' });
    }

    const match = await bcrypt.compare(password, adminUser.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Kombinasi kredensial tidak valid.' });
    }

    // Update last_login
    try {
      await pool.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [adminUser.id]);
    } catch (err: any) {
      logger.warn('AuthRoute', 'Gagal memperbarui waktu login terakhir.', { code: err?.code, sqlState: err?.sqlState });
    }

    const token = jwt.sign(
      { id: adminUser.id, username: adminUser.username, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = adminUser;
    res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/auth/me', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pool = getPool();
    let admin: any = null;
    try {
      const [rows]: any = await pool.query('SELECT id, username, email, full_name, avatar, role, is_active, last_login, created_at FROM admins WHERE id = ?', [req.user?.id]);
      admin = rows[0];
    } catch (err: any) {
      logger.error('AuthRoute', 'Gagal membaca profil administrator dari MySQL.', { code: err?.code, sqlState: err?.sqlState, message: err?.message });
      return res.status(500).json({ success: false, message: 'Profil administrator tidak dapat dimuat.' });
    }

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    res.json({ success: true, user: admin });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.put('/auth/password', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Password baru minimal 8 karakter.' });
  }

  try {
    const pool = getPool();
    let currentAdmin: any = null;
    try {
      const [rows]: any = await pool.query('SELECT * FROM admins WHERE id = ?', [req.user?.id]);
      currentAdmin = rows[0];
    } catch (err: any) {
      logger.error('AuthRoute', 'Gagal membaca administrator dari MySQL.', { code: err?.code, sqlState: err?.sqlState, message: err?.message });
      return res.status(500).json({ success: false, message: 'Password tidak dapat diperbarui.' });
    }

    if (!currentAdmin) return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });

    const match = await bcrypt.compare(currentPassword, currentAdmin.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    try {
      await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashed, req.user?.id]);
    } catch (err: any) {
      logger.error('AuthRoute', 'Gagal menyimpan password ke MySQL.', { code: err?.code, sqlState: err?.sqlState, message: err?.message });
      return res.status(500).json({ success: false, message: 'Password gagal disimpan.' });
    }

    res.json({ success: true, message: 'Password berhasil diperbarui.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 3. STATISTIK PENGUNJUNG (TRACK & ANALYTICS)
// ==========================================
apiRouter.post('/visitor/log', async (req: Request, res: Response) => {
  const { path: visitPath, pageTitle, sessionId } = req.body;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const referrer = (req.body.referrer || req.headers['referer'] || null) as string | null;

  // Privasi: Hashing anonim
  const { visitorHash } = hashVisitor(req);
  const { deviceType, browser } = parseDeviceAndBrowser(userAgent);
  const sessionSeed = String(sessionId || visitorHash);
  const actualSessionId = createHash('sha256').update(`${sessionSeed}-${new Date().toISOString().split('T')[0]}`).digest('hex');

  await StatisticsService.recordVisit({
    sessionId: actualSessionId,
    visitorHash,
    deviceType,
    browser,
    referrer,
    path: visitPath || '/',
    pageTitle
  });

  res.json({ success: true, sessionId: actualSessionId });
});

apiRouter.use('/admin/dashboard', dashboardRouter);

apiRouter.get('/admin/statistics/summary', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const summary = await StatisticsService.getSummaryMetrics();
    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/admin/statistics/analytics', requireAdmin, async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string, 10) || 30;
  try {
    const analytics = await StatisticsService.getDetailedAnalytics(days);
    res.json({ success: true, data: analytics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/admin/statistics/export/xlsx', requireAdmin, async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string, 10) || 30;
  try {
    const buffer = await StatisticsService.generateExcelReport(days);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=statistik_smp_islam_caruy_${days}hari.xlsx`);
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/admin/statistics/export/csv', requireAdmin, async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string, 10) || 30;
  try {
    const csv = await StatisticsService.generateCsvReport(days);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=statistik_smp_islam_caruy_${days}hari.csv`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. KONTEN PUBLIK (READ-ONLY)
// ==========================================
// MySQL adalah satu-satunya sumber data saat backend berjalan dengan database.
// Hasil kosong dikembalikan sebagai []/404; kegagalan query tidak dialihkan ke JSON.
const publicQueryError = (res: Response, route: string, err: any, message: string) => {
  logger.error(route, message, {
    code: err?.code,
    sqlState: err?.sqlState,
    message: err?.message
  });
  return res.status(500).json({
    success: false,
    message: 'Data sementara tidak dapat dimuat. Periksa log backend.'
  });
};

apiRouter.get('/school-profile', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM school_profile LIMIT 1');
    if (!rows.length) return res.status(404).json({ success: false, message: 'Profil sekolah belum dikonfigurasi.' });
    return res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    return publicQueryError(res, 'SchoolProfileRoute', err, 'Gagal membaca profil sekolah dari MySQL.');
  }
});

apiRouter.get('/school-history', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM school_history LIMIT 1');
    if (!rows.length) return res.json({ success: true, data: null });
    return res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    return publicQueryError(res, 'SchoolHistoryRoute', err, 'Gagal membaca sejarah sekolah dari MySQL.');
  }
});

apiRouter.get('/vision-mission', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM school_vision_mission LIMIT 1');
    if (!rows.length) return res.json({ success: true, data: null });
    return res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    return publicQueryError(res, 'VisionMissionRoute', err, 'Gagal membaca visi dan misi dari MySQL.');
  }
});

apiRouter.get('/organization', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM school_organization ORDER BY display_order ASC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'OrganizationRoute', err, 'Gagal membaca struktur organisasi dari MySQL.');
  }
});

apiRouter.get('/teachers', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM teachers WHERE is_active = 1 ORDER BY display_order ASC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'TeachersRoute', err, 'Gagal membaca data guru dari MySQL.');
  }
});

apiRouter.get('/staff', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM staff WHERE is_active = 1 ORDER BY display_order ASC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'StaffRoute', err, 'Gagal membaca data staf dari MySQL.');
  }
});

apiRouter.get('/news', async (req: Request, res: Response) => {
  const category = req.query.category as string;
  try {
    let sql = 'SELECT n.*, c.name AS category_name, c.slug AS category_slug FROM news n LEFT JOIN news_categories c ON n.category_id = c.id WHERE n.status = "published" ORDER BY n.published_at DESC';
    const params: any[] = [];
    if (category) {
      sql = 'SELECT n.*, c.name AS category_name, c.slug AS category_slug FROM news n LEFT JOIN news_categories c ON n.category_id = c.id WHERE n.status = "published" AND c.slug = ? ORDER BY n.published_at DESC';
      params.push(category);
    }
    const [rows]: any = await getPool().query(sql, params);
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'NewsRoute', err, 'Gagal membaca berita dari MySQL.');
  }
});

apiRouter.get('/news/categories', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM news_categories ORDER BY name ASC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'NewsCategoriesRoute', err, 'Gagal membaca kategori berita dari MySQL.');
  }
});

apiRouter.get('/news/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  try {
    const pool = getPool();
    const [rows]: any = await pool.query('SELECT n.*, c.name AS category_name, c.slug AS category_slug FROM news n LEFT JOIN news_categories c ON n.category_id = c.id WHERE n.slug = ? AND n.status = "published" LIMIT 1', [slug]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
    await pool.query('UPDATE news SET views_count = views_count + 1 WHERE id = ?', [rows[0].id]);
    return res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    return publicQueryError(res, 'NewsDetailRoute', err, 'Gagal membaca detail berita dari MySQL.');
  }
});

apiRouter.get('/achievements', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM achievements ORDER BY year DESC, id DESC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'AchievementsRoute', err, 'Gagal membaca prestasi dari MySQL.');
  }
});

apiRouter.get('/facilities', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM facilities ORDER BY display_order ASC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'FacilitiesRoute', err, 'Gagal membaca fasilitas dari MySQL.');
  }
});

apiRouter.get('/gallery', async (req: Request, res: Response) => {
  const category = req.query.category as string;
  try {
    let sql = 'SELECT * FROM gallery_media ORDER BY display_order ASC, id DESC';
    const params: any[] = [];
    if (category && category !== 'Semua') {
      sql = 'SELECT * FROM gallery_media WHERE category = ? ORDER BY display_order ASC, id DESC';
      params.push(category);
    }
    const [rows]: any = await getPool().query(sql, params);
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'GalleryRoute', err, 'Gagal membaca galeri dari MySQL.');
  }
});

apiRouter.get('/gallery/albums', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM gallery_albums ORDER BY id DESC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'GalleryAlbumsRoute', err, 'Gagal membaca album galeri dari MySQL.');
  }
});

apiRouter.get('/ppdb', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM ppdb_information LIMIT 1');
    if (!rows.length) return res.json({ success: true, data: null });
    return res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    return publicQueryError(res, 'PPDBRoute', err, 'Gagal membaca informasi PPDB dari MySQL.');
  }
});

// Agendas Public Route
apiRouter.get('/agendas', async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await getPool().query('SELECT * FROM agendas WHERE is_published = 1 ORDER BY event_date ASC');
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return publicQueryError(res, 'AgendasRoute', err, 'Gagal membaca agenda dari MySQL.');
  }
});

// Programs & Extracurricular Public Route
apiRouter.get('/programs', async (req: Request, res: Response) => {
  const category = req.query.category as string;
  const pool = getPool();
  try {
    let sql = 'SELECT * FROM programs WHERE is_active = 1 ORDER BY display_order ASC';
    const params: any[] = [];
    if (category) {
      sql = 'SELECT * FROM programs WHERE is_active = 1 AND category = ? ORDER BY display_order ASC';
      params.push(category);
    }
    const [rows]: any = await pool.query(sql, params);
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch (err: any) {
    logger.error('ProgramsRoute', 'Gagal membaca program sekolah dari MySQL.', { code: err.code, sqlState: err.sqlState, message: err.message });
    return res.status(500).json({ success: false, message: 'Program sekolah sementara tidak dapat dimuat.' });
  }
  return res.json({ success: true, data: [] });
});

apiRouter.get('/settings', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM website_settings LIMIT 1');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    logger.error('SettingsRoute', 'Gagal membaca pengaturan website dari MySQL.', { code: err.code, sqlState: err.sqlState, message: err.message });
    return res.status(500).json({ success: false, message: 'Pengaturan website sementara tidak dapat dimuat.' });
  }
  return res.status(404).json({ success: false, message: 'Pengaturan website belum dikonfigurasi.' });
});


// ==========================================
// 5. UPLOAD FILE
// ==========================================
apiRouter.post('/upload', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada berkas yang diunggah.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Berkas berhasil diunggah.',
    fileUrl,
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

apiRouter.use('/admin', adminActivityLogger);

// ==========================================
// 6. ADMIN CRUD OPERATIONS (DASHBOARD)
// ==========================================
// News CRUD
apiRouter.get('/admin/news', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT n.*, c.name AS category_name, c.slug AS category_slug FROM news n LEFT JOIN news_categories c ON n.category_id = c.id ORDER BY n.id DESC');
    if (rows) return res.json({ success: true, data: rows });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.post('/admin/news', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  const { title, category_id, summary, content, thumbnail, status } = req.body;
  const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-');

  try {
    const [result]: any = await pool.query(
      `INSERT INTO news (category_id, title, slug, summary, content, thumbnail, status, published_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [category_id || 1, title, slug, summary, content, thumbnail || null, status || 'published']
    );
    return res.json({ success: true, message: 'Berita berhasil disimpan.', data: { id: result.insertId, slug, title } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }

});

apiRouter.put('/admin/news/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE news SET title = ?, category_id = ?, summary = ?, content = ?, thumbnail = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [req.body.title, req.body.category_id, req.body.summary, req.body.content, req.body.thumbnail, req.body.status, id]
    );
    return res.json({ success: true, message: 'Berita berhasil diperbarui.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }

});

apiRouter.delete('/admin/news/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM news WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Berita berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }

});

// Profil Sekolah
apiRouter.put('/admin/school-profile', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE school_profile SET name = ?, npsn = ?, education_level = ?, status = ?, accreditation = ?, founding_year = ?, headmaster_name = ?, headmaster_photo = ?, headmaster_welcome = ?, description = ?, address = ?, village = ?, district = ?, regency = ?, province = ?, postal_code = ?, phone = ?, whatsapp = ?, email = ?, maps_embed_url = ?, updated_at = NOW() WHERE id = 1`,
      [
        req.body.name || 'SMP Islam Caruy', req.body.npsn || null, req.body.education_level || 'Sekolah Menengah Pertama (SMP)',
        req.body.status || 'Swasta', req.body.accreditation || null, req.body.founding_year || null,
        req.body.headmaster_name || '', req.body.headmaster_photo || null, req.body.headmaster_welcome || '',
        req.body.description || '', req.body.address || '', req.body.village || '', req.body.district || '',
        req.body.regency || '', req.body.province || '', req.body.postal_code || '', req.body.phone || '',
        req.body.whatsapp || '', req.body.email || '', req.body.maps_embed_url || null
      ]
    );
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
  const [rows]: any = await pool.query('SELECT * FROM school_profile ORDER BY id ASC LIMIT 1');
  return res.json({ success: true, message: 'Profil sekolah berhasil disimpan.', data: rows[0] ?? null });
});

// Pesan Masuk
apiRouter.get('/admin/messages', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM contact_messages ORDER BY id DESC');
    if (rows) return res.json({ success: true, data: rows });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.put('/admin/messages/:id/read', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const { is_read } = req.body;
  const pool = getPool();
  try {
    await pool.query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
  return res.json({ success: true, message: 'Status pesan diperbarui.' });
});

apiRouter.delete('/admin/messages/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
  return res.json({ success: true, message: 'Pesan berhasil dihapus.' });
});

// Teachers & Staff CRUD
apiRouter.post('/admin/teachers', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO teachers (name, title, nip, photo, position, subject, last_education, short_bio, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [req.body.name, req.body.title || '', req.body.nip || '-', req.body.photo || null, req.body.position || 'Guru', req.body.subject, req.body.last_education || '', req.body.short_bio || '', req.body.display_order || 0]
    );
    return res.json({ success: true, message: 'Data guru berhasil ditambahkan.', data: { id: ins.insertId, ...req.body } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.put('/admin/teachers/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE teachers SET name = ?, title = ?, nip = ?, photo = ?, position = ?, subject = ?, last_education = ?, short_bio = ?, display_order = ? WHERE id = ?`,
      [req.body.name, req.body.title || '', req.body.nip || '-', req.body.photo || null, req.body.position || 'Guru', req.body.subject, req.body.last_education || '', req.body.short_bio || '', req.body.display_order || 0, id]
    );
    return res.json({ success: true, message: 'Data guru berhasil diperbarui.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.delete('/admin/teachers/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Data guru berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

// Admin Users CRUD (Superadmin Only)
apiRouter.get('/admin/users', requireSuperadmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admins');
    if (rows) return res.json({ success: true, data: rows });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.post('/admin/users', requireSuperadmin, async (req: Request, res: Response) => {
  const { username, email, full_name, password, role } = req.body;
  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ success: false, message: 'Password administrator minimal 8 karakter.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const pool = getPool();
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO admins (username, email, password, full_name, role, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [username.trim().toLowerCase(), email.trim().toLowerCase(), hashed, full_name.trim(), role || 'admin_konten']
    );
    return res.json({ success: true, message: 'Pengguna admin berhasil ditambahkan.', data: { id: ins.insertId, username, full_name, role } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.delete('/admin/users/:id', requireSuperadmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (id === 1) return res.status(400).json({ success: false, message: 'Superadmin utama tidak dapat dihapus.' });

  const pool = getPool();
  try {
    await pool.query('DELETE FROM admins WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Akun admin berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

// Facilities CRUD
apiRouter.post('/admin/facilities', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO facilities (name, category, description, photo, capacity, condition_status, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.body.name, req.body.category || 'Ruang Belajar', req.body.description || '', req.body.photo || null, req.body.capacity || '', req.body.condition_status || 'Baik', req.body.display_order || 0]
    );
    return res.json({ success: true, message: 'Fasilitas berhasil ditambahkan.', data: { id: ins.insertId, ...req.body } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.put('/admin/facilities/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE facilities SET name = ?, category = ?, description = ?, photo = ?, capacity = ?, condition_status = ?, display_order = ? WHERE id = ?`,
      [req.body.name, req.body.category || 'Ruang Belajar', req.body.description || '', req.body.photo || null, req.body.capacity || '', req.body.condition_status || 'Baik', req.body.display_order || 0, id]
    );
    return res.json({ success: true, message: 'Fasilitas berhasil diperbarui.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.delete('/admin/facilities/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM facilities WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Fasilitas berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

// Achievements CRUD
apiRouter.post('/admin/achievements', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO achievements (title, student_or_team, level, category, rank, year, organizer, photo, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.title, req.body.student_or_team || '', req.body.level || 'Kabupaten', req.body.category || 'Akademik', req.body.rank || req.body.rank_position || 'Juara 1', req.body.year || '2025', req.body.organizer || '', req.body.photo || null, req.body.description || '']
    );
    return res.json({ success: true, message: 'Prestasi berhasil disimpan.', data: { id: ins.insertId, ...req.body } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.put('/admin/achievements/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE achievements SET title = ?, student_or_team = ?, level = ?, category = ?, rank = ?, year = ?, organizer = ?, photo = ?, description = ? WHERE id = ?`,
      [req.body.title, req.body.student_or_team || '', req.body.level || 'Kabupaten', req.body.category || 'Akademik', req.body.rank || req.body.rank_position || 'Juara 1', req.body.year || '2025', req.body.organizer || '', req.body.photo || null, req.body.description || '', id]
    );
    return res.json({ success: true, message: 'Prestasi berhasil diperbarui.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.delete('/admin/achievements/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM achievements WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Prestasi berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

// Gallery Media & Albums CRUD
apiRouter.post('/admin/gallery', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO gallery_media (album_id, title, media_type, file_url, video_url, caption, category, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.album_id || null, req.body.title, req.body.media_type || 'photo', req.body.file_url, req.body.video_url || null, req.body.caption || '', req.body.category || 'Akademik', req.body.display_order || 0]
    );
    return res.json({ success: true, message: 'Foto galeri berhasil disimpan.', data: { id: ins.insertId, ...req.body } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.delete('/admin/gallery/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM gallery_media WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Foto galeri berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

// Agendas CRUD
apiRouter.get('/admin/agendas', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM agendas ORDER BY event_date DESC');
    if (rows) return res.json({ success: true, data: rows });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.post('/admin/agendas', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  const slug = (req.body.title || `agenda-${Date.now()}`).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-');
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO agendas (title, slug, description, event_date, start_time, end_time, location, organizer, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.title, slug, req.body.description || '', req.body.event_date, req.body.start_time || '08:00', req.body.end_time || 'Selesai', req.body.location || 'Kampus SMP Islam Caruy', req.body.organizer || 'Panitia Sekolah', req.body.is_published ?? 1]
    );
    return res.json({ success: true, message: 'Agenda berhasil ditambahkan.', data: { id: ins.insertId, ...req.body, slug } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.put('/admin/agendas/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE agendas SET title = ?, description = ?, event_date = ?, start_time = ?, end_time = ?, location = ?, organizer = ?, is_published = ? WHERE id = ?`,
      [req.body.title, req.body.description || '', req.body.event_date, req.body.start_time || '08:00', req.body.end_time || 'Selesai', req.body.location || 'Kampus SMP Islam Caruy', req.body.organizer || 'Panitia Sekolah', req.body.is_published ?? 1, id]
    );
    return res.json({ success: true, message: 'Agenda berhasil diperbarui.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.delete('/admin/agendas/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM agendas WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Agenda berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

// Programs CRUD
apiRouter.get('/admin/programs', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM programs ORDER BY display_order ASC');
    if (rows) return res.json({ success: true, data: rows });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.post('/admin/programs', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  const slug = (req.body.name || `program-${Date.now()}`).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-');
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO programs (name, slug, category, description, photo, schedule_info, instructor, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.name, slug, req.body.category || 'unggulan', req.body.description || '', req.body.photo || null, req.body.schedule_info || '', req.body.instructor || '', req.body.display_order || 0, req.body.is_active ?? 1]
    );
    return res.json({ success: true, message: 'Program berhasil disimpan.', data: { id: ins.insertId, ...req.body, slug } });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.put('/admin/programs/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE programs SET name = ?, category = ?, description = ?, photo = ?, schedule_info = ?, instructor = ?, display_order = ?, is_active = ? WHERE id = ?`,
      [req.body.name, req.body.category || 'unggulan', req.body.description || '', req.body.photo || null, req.body.schedule_info || '', req.body.instructor || '', req.body.display_order || 0, req.body.is_active ?? 1, id]
    );
    return res.json({ success: true, message: 'Program berhasil diperbarui.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

apiRouter.delete('/admin/programs/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM programs WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Program berhasil dihapus.' });
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
});

// Settings & PPDB
apiRouter.put('/admin/ppdb', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE ppdb_information SET academic_year = ?, is_open = ?, start_date = ?, end_date = ?, banner_image = ?, overview = ?, requirements = ?, schedules = ?, steps = ?, show_fees = ?, fees_description = ?, fees_items = ?, contact_person = ?, contact_phone = ?, contact_whatsapp = ?, registration_url = ?, updated_at = NOW() WHERE id = 1`,
      [
        req.body.academic_year || 'Belum ditentukan', req.body.is_open ? 1 : 0, req.body.start_date || null,
        req.body.end_date || null, req.body.banner_image || null, req.body.overview || '',
        JSON.stringify(req.body.requirements || []), JSON.stringify(req.body.schedules || []),
        JSON.stringify(req.body.steps || []), req.body.show_fees ? 1 : 0, req.body.fees_description || '',
        JSON.stringify(req.body.fees_items || []), req.body.contact_person || '', req.body.contact_phone || '',
        req.body.contact_whatsapp || '', req.body.registration_url || '/ppdb#daftar-online'
      ]
    );
  } catch (err: any) {
    logger.error('AdminMySQL', 'Operasi admin gagal saat mengakses MySQL.', {
      code: err?.code,
      sqlState: err?.sqlState,
      message: err?.message
    });
    return res.status(500).json({
      success: false,
      message: 'Operasi gagal. Data tidak disimpan; periksa log backend.'
    });
  }
  const [rows]: any = await pool.query('SELECT * FROM ppdb_information ORDER BY id ASC LIMIT 1');
  return res.json({ success: true, message: 'Informasi PPDB berhasil diperbarui.', data: rows[0] ?? null });
});

apiRouter.put('/admin/settings', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE website_settings SET
         school_name = ?, tagline = ?, logo_url = ?, favicon_url = ?, hero_title = ?, hero_subtitle = ?, hero_image = ?,
         primary_color = ?, secondary_color = ?, accent_orange = ?, accent_blue = ?, feature_flags = ?,
         facebook_url = ?, instagram_url = ?, youtube_url = ?, tiktok_url = ?,
         seo_title = ?, seo_description = ?, footer_text = ?,
         stats_students = ?, stats_teachers = ?, stats_alumni = ?, stats_achievements = ?, updated_at = NOW()
       WHERE id = 1`,
      [
        req.body.school_name || 'SMP Islam Caruy', req.body.tagline || '', req.body.logo_url || '',
        req.body.favicon_url || '', req.body.hero_title || '', req.body.hero_subtitle || '', req.body.hero_image || '',
        req.body.primary_color || '#1B3B2B', req.body.secondary_color || '#E5C178',
        req.body.accent_orange || '#F97316', req.body.accent_blue || '#0284C7',
        JSON.stringify(req.body.feature_flags || {}), req.body.facebook_url || '',
        req.body.instagram_url || '', req.body.youtube_url || '', req.body.tiktok_url || '',
        req.body.seo_title || '', req.body.seo_description || '', req.body.footer_text || '',
        Number(req.body.stats_students) || 0, Number(req.body.stats_teachers) || 0,
        Number(req.body.stats_alumni) || 0, Number(req.body.stats_achievements) || 0
      ]
    );
  } catch (err: any) {
    logger.error('SettingsRoute', 'Gagal menyimpan pengaturan website ke MySQL.', { code: err.code, sqlState: err.sqlState, message: err.message });
    return res.status(500).json({ success: false, message: 'Pengaturan website gagal disimpan. Periksa log backend.' });
  }
  const [rows]: any = await pool.query('SELECT * FROM website_settings LIMIT 1');
  return res.json({ success: true, message: 'Pengaturan website berhasil disimpan.', data: rows[0] });
});


// ==========================================
// 7. ROUTE YANG DIGUNAKAN FORMULIR FRONTEND
// ==========================================
const routeWriteError = (res: Response, route: string, err: any) => {
  logger.error(route, 'Operasi MySQL gagal.', {
    code: err?.code, sqlState: err?.sqlState, message: err?.message
  });
  return res.status(500).json({ success: false, message: 'Operasi gagal diproses. Periksa log backend.' });
};

const makeSlug = (value: string) => String(value || '')
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/[\s-]+/g, '-');

// Contact form
apiRouter.post('/contact', async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Nama, email, subjek, dan pesan wajib diisi.' });
  }
  try {
    const [result]: any = await getPool().query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [String(name).trim(), String(email).trim(), phone || null, String(subject).trim(), String(message).trim()]
    );
    return res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim.',
      data: { id: result.insertId, name, email, phone: phone || null, subject, message, is_read: 0 }
    });
  } catch (err: any) {
    return routeWriteError(res, 'ContactRoute', err);
  }
});

// Update the currently authenticated administrator's own profile.
apiRouter.put('/auth/profile', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { username, email, full_name, avatar } = req.body || {};
  if (!username || !email || !full_name) {
    return res.status(400).json({ success: false, message: 'Username, email, dan nama lengkap wajib diisi.' });
  }
  try {
    const pool = getPool();
    const [result]: any = await pool.query(
      'UPDATE admins SET username = ?, email = ?, full_name = ?, avatar = ? WHERE id = ?',
      [String(username).trim().toLowerCase(), String(email).trim().toLowerCase(), String(full_name).trim(), avatar || null, req.user?.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Akun administrator tidak ditemukan.' });
    const [rows]: any = await pool.query(
      'SELECT id, username, email, full_name, avatar, role, is_active, last_login, created_at FROM admins WHERE id = ?',
      [req.user?.id]
    );
    return res.json({ success: true, message: 'Profil administrator berhasil diperbarui.', user: rows[0] });
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Username atau email sudah digunakan.' });
    return routeWriteError(res, 'AuthProfileRoute', err);
  }
});

// School history and vision-mission
apiRouter.put('/admin/school-history', requireAdmin, async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [existing]: any = await pool.query('SELECT id FROM school_history ORDER BY id ASC LIMIT 1');
    if (existing.length) {
      await pool.query(
        'UPDATE school_history SET title = ?, content = ?, featured_image = ?, milestones = ?, updated_at = NOW() WHERE id = ?',
        [req.body.title || 'Sejarah Sekolah', req.body.content || '', req.body.featured_image || null, JSON.stringify(req.body.milestones || []), existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO school_history (title, content, featured_image, milestones) VALUES (?, ?, ?, ?)',
        [req.body.title || 'Sejarah Sekolah', req.body.content || '', req.body.featured_image || null, JSON.stringify(req.body.milestones || [])]
      );
    }
    const [rows]: any = await pool.query('SELECT * FROM school_history ORDER BY id ASC LIMIT 1');
    return res.json({ success: true, message: 'Sejarah sekolah berhasil disimpan.', data: rows[0] });
  } catch (err: any) {
    return routeWriteError(res, 'AdminSchoolHistoryRoute', err);
  }
});

apiRouter.put('/admin/vision-mission', requireAdmin, async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [existing]: any = await pool.query('SELECT id FROM school_vision_mission ORDER BY id ASC LIMIT 1');
    const values = [
      req.body.vision || '', req.body.vision_motto || '',
      JSON.stringify(req.body.missions || []), JSON.stringify(req.body.goals || []),
      JSON.stringify(req.body.core_values || [])
    ];
    if (existing.length) {
      await pool.query(
        'UPDATE school_vision_mission SET vision = ?, vision_motto = ?, missions = ?, goals = ?, core_values = ?, updated_at = NOW() WHERE id = ?',
        [...values, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO school_vision_mission (vision, vision_motto, missions, goals, core_values) VALUES (?, ?, ?, ?, ?)',
        values
      );
    }
    const [rows]: any = await pool.query('SELECT * FROM school_vision_mission ORDER BY id ASC LIMIT 1');
    return res.json({ success: true, message: 'Visi dan misi berhasil disimpan.', data: rows[0] });
  } catch (err: any) {
    return routeWriteError(res, 'AdminVisionMissionRoute', err);
  }
});

// Organization CRUD
apiRouter.post('/admin/organization', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [result]: any = await getPool().query(
      'INSERT INTO school_organization (position, name, nip, photo, level, parent_id, display_order, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.body.position, req.body.name, req.body.nip || '-', req.body.photo || null, Number(req.body.level) || 1, req.body.parent_id || null, Number(req.body.display_order) || 0, req.body.description || '']
    );
    return res.status(201).json({ success: true, message: 'Anggota organisasi berhasil ditambahkan.', data: { id: result.insertId, ...req.body } });
  } catch (err: any) {
    return routeWriteError(res, 'AdminOrganizationRoute', err);
  }
});

apiRouter.put('/admin/organization/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const [result]: any = await getPool().query(
      'UPDATE school_organization SET position = ?, name = ?, nip = ?, photo = ?, level = ?, parent_id = ?, display_order = ?, description = ? WHERE id = ?',
      [req.body.position, req.body.name, req.body.nip || '-', req.body.photo || null, Number(req.body.level) || 1, req.body.parent_id || null, Number(req.body.display_order) || 0, req.body.description || '', id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Data organisasi tidak ditemukan.' });
    return res.json({ success: true, message: 'Data organisasi berhasil diperbarui.' });
  } catch (err: any) {
    return routeWriteError(res, 'AdminOrganizationRoute', err);
  }
});

apiRouter.delete('/admin/organization/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [result]: any = await getPool().query('DELETE FROM school_organization WHERE id = ?', [Number(req.params.id)]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Data organisasi tidak ditemukan.' });
    return res.json({ success: true, message: 'Data organisasi berhasil dihapus.' });
  } catch (err: any) {
    return routeWriteError(res, 'AdminOrganizationRoute', err);
  }
});

// Staff CRUD
apiRouter.post('/admin/staff', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [result]: any = await getPool().query(
      'INSERT INTO staff (name, photo, position, department, last_education, short_bio, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [req.body.name, req.body.photo || null, req.body.position, req.body.department || 'Tata Usaha', req.body.last_education || '', req.body.short_bio || '', Number(req.body.display_order) || 0]
    );
    return res.status(201).json({ success: true, message: 'Data staf berhasil ditambahkan.', data: { id: result.insertId, ...req.body, is_active: 1 } });
  } catch (err: any) {
    return routeWriteError(res, 'AdminStaffRoute', err);
  }
});

apiRouter.put('/admin/staff/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [result]: any = await getPool().query(
      'UPDATE staff SET name = ?, photo = ?, position = ?, department = ?, last_education = ?, short_bio = ?, display_order = ? WHERE id = ?',
      [req.body.name, req.body.photo || null, req.body.position, req.body.department || 'Tata Usaha', req.body.last_education || '', req.body.short_bio || '', Number(req.body.display_order) || 0, Number(req.params.id)]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Data staf tidak ditemukan.' });
    return res.json({ success: true, message: 'Data staf berhasil diperbarui.' });
  } catch (err: any) {
    return routeWriteError(res, 'AdminStaffRoute', err);
  }
});

apiRouter.delete('/admin/staff/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [result]: any = await getPool().query('DELETE FROM staff WHERE id = ?', [Number(req.params.id)]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Data staf tidak ditemukan.' });
    return res.json({ success: true, message: 'Data staf berhasil dihapus.' });
  } catch (err: any) {
    return routeWriteError(res, 'AdminStaffRoute', err);
  }
});

// News category and gallery album creation/deletion used by the API service.
apiRouter.post('/admin/news/categories', requireAdmin, async (req: Request, res: Response) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
  const slug = makeSlug(req.body.slug || name);
  try {
    const [result]: any = await getPool().query(
      'INSERT INTO news_categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, req.body.description || '']
    );
    return res.status(201).json({ success: true, message: 'Kategori berita berhasil dibuat.', data: { id: result.insertId, name, slug } });
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Nama atau slug kategori sudah digunakan.' });
    return routeWriteError(res, 'AdminNewsCategoryRoute', err);
  }
});

apiRouter.post('/admin/gallery/albums', requireAdmin, async (req: Request, res: Response) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ success: false, message: 'Nama album wajib diisi.' });
  const slug = makeSlug(req.body.slug || name);
  try {
    const [result]: any = await getPool().query(
      'INSERT INTO gallery_albums (name, slug, description, cover_image, category) VALUES (?, ?, ?, ?, ?)',
      [name, slug, req.body.description || '', req.body.cover_image || null, req.body.category || 'Umum']
    );
    return res.status(201).json({ success: true, message: 'Album galeri berhasil dibuat.', data: { id: result.insertId, name, slug } });
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Nama atau slug album sudah digunakan.' });
    return routeWriteError(res, 'AdminGalleryAlbumRoute', err);
  }
});

apiRouter.delete('/admin/gallery/albums/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [result]: any = await getPool().query('DELETE FROM gallery_albums WHERE id = ?', [Number(req.params.id)]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Album galeri tidak ditemukan.' });
    return res.json({ success: true, message: 'Album galeri berhasil dihapus.' });
  } catch (err: any) {
    return routeWriteError(res, 'AdminGalleryAlbumRoute', err);
  }
});
