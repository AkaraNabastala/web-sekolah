import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool, checkConnection, getStatus } from '../config/database.js';
import { JWT_SECRET, requireAdmin, requireSuperadmin, AuthenticatedRequest } from '../middleware/auth.js';
import { hashVisitor, parseDeviceAndBrowser, getClientIp } from '../utils/privacy.js';
import { StatisticsService } from '../services/StatisticsService.js';
import { db } from '../db/index.js'; // Fallback sync jika MySQL standalone belum terhubung
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

export const apiRouter = Router();

const dbFallback = new Proxy(db, {
  get(target, property, receiver) {
    const value = Reflect.get(target, property, receiver);
    if (typeof value !== 'function') return value;

    return (...args: any[]) => {
      const mysqlConnected = getStatus().connected;
      const fallbackEnabled = process.env.ALLOW_JSON_FALLBACK === 'true';
      if (process.env.NODE_ENV === 'production' || mysqlConnected || !fallbackEnabled) {
        throw new Error(
          'JSON fallback tidak diizinkan. Periksa koneksi dan skema MySQL; MySQL adalah sumber data utama.'
        );
      }
      return value.apply(target, args);
    };
  }
});


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
    } catch {
      hasAdmin = dbFallback.getAdmins().length > 0;
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
    } catch {
      hasAdmin = dbFallback.getAdmins().length > 0;
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
    } catch {
      // Fallback
      dbFallback.createAdminUser({
        username,
        email,
        full_name,
        password,
        role: 'superadmin'
      });
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
    } catch {
      adminUser = dbFallback.findAdminByUsername(username);
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
    } catch {
      dbFallback.updateAdmin(adminUser.id, { last_login: new Date().toISOString() });
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
    } catch {
      const a = dbFallback.findAdminById(req.user!.id);
      if (a) {
        const { password, ...safe } = a;
        admin = safe;
      }
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
    } catch {
      currentAdmin = dbFallback.findAdminById(req.user!.id);
    }

    if (!currentAdmin) return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });

    const match = await bcrypt.compare(currentPassword, currentAdmin.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    try {
      await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashed, req.user?.id]);
    } catch {
      dbFallback.updateAdmin(req.user!.id, { password: hashed });
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
  const actualSessionId = sessionId || `${visitorHash}-${new Date().toISOString().split('T')[0]}`;

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

// Dashboard CMS: seluruh metrik dihitung dari MySQL agar tidak menampilkan angka simulasi.
apiRouter.get('/admin/dashboard/statistics', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const connection = await checkConnection();
    if (!connection.connected) {
      return res.status(503).json({
        success: false,
        message: 'Statistik dashboard membutuhkan koneksi MySQL yang aktif.'
      });
    }

    const pool = getPool();
    const [countRows]: any = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM news) AS totalNews,
        (SELECT COUNT(*) FROM teachers WHERE is_active = 1) AS totalTeachers,
        (SELECT COUNT(*) FROM staff WHERE is_active = 1) AS totalStaff,
        (SELECT COUNT(*) FROM gallery_media) AS totalGallery,
        (SELECT COUNT(*) FROM achievements) AS totalAchievements,
        (SELECT COUNT(*) FROM facilities) AS totalFacilities,
        (SELECT COUNT(*) FROM contact_messages) AS totalMessages,
        (SELECT COUNT(*) FROM contact_messages WHERE is_read = 0) AS unreadMessages
    `);

    const summary = await StatisticsService.getSummaryMetrics();
    const analytics = await StatisticsService.getDetailedAnalytics(30);
    const [categoryRows]: any = await pool.query(`
      SELECT c.name, COUNT(n.id) AS count
      FROM news_categories c
      LEFT JOIN news n ON n.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY count DESC, c.name ASC
    `);

    const counts = countRows[0] || {};
    const toNumber = (value: unknown) => Number(value || 0);

    res.json({
      success: true,
      data: {
        totalVisitors: toNumber(summary.all_time.total_unique_visitors),
        visitorsToday: toNumber(summary.today.unique_visitors_today),
        visitorsThisMonth: toNumber(summary.last_30_days.unique_visitors_30d),
        totalNews: toNumber(counts.totalNews),
        totalTeachers: toNumber(counts.totalTeachers),
        totalStaff: toNumber(counts.totalStaff),
        totalGallery: toNumber(counts.totalGallery),
        totalAchievements: toNumber(counts.totalAchievements),
        totalFacilities: toNumber(counts.totalFacilities),
        totalMessages: toNumber(counts.totalMessages),
        unreadMessages: toNumber(counts.unreadMessages),
        visitorTraffic: analytics.trends.map((item: any) => ({
          date: item.date instanceof Date ? item.date.toISOString().slice(0, 10) : String(item.date).slice(0, 10),
          visitors: toNumber(item.unique_visitors),
          pageViews: toNumber(item.pageviews)
        })),
        categoryBreakdown: categoryRows.map((item: any) => ({
          name: item.name,
          count: toNumber(item.count)
        }))
      }
    });
  } catch (err: any) {
    logger.error('DashboardAPI', 'Gagal memuat statistik dashboard.', { code: err.code });
    res.status(500).json({ success: false, message: 'Gagal memuat statistik dashboard.' });
  }
});

apiRouter.get('/admin/dashboard/activities', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const connection = await checkConnection();
    if (!connection.connected) {
      return res.status(503).json({
        success: false,
        message: 'Riwayat aktivitas dashboard membutuhkan koneksi MySQL yang aktif.'
      });
    }

    const pool = getPool();
    const [rows]: any = await pool.query(`
      SELECT
        activity.id,
        activity.admin_id,
        admin.full_name AS admin_name,
        activity.action,
        activity.description,
        activity.ip_hash AS ip_address,
        activity.created_at
      FROM admin_activities AS activity
      LEFT JOIN admins AS admin ON admin.id = activity.admin_id
      ORDER BY activity.created_at DESC
      LIMIT 20
    `);

    res.json({ success: true, data: rows });
  } catch (err: any) {
    logger.error('DashboardAPI', 'Gagal memuat riwayat aktivitas administrator.', { code: err.code });
    res.status(500).json({ success: false, message: 'Gagal memuat riwayat aktivitas administrator.' });
  }
});

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
apiRouter.get('/school-profile', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM school_profile LIMIT 1');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows[0] });
  } catch {}
  res.json({ success: true, data: dbFallback.getSchoolProfile() });
});

apiRouter.get('/school-history', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM school_history LIMIT 1');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows[0] });
  } catch {}
  res.json({ success: true, data: dbFallback.getSchoolHistory() });
});

apiRouter.get('/vision-mission', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM school_vision_mission LIMIT 1');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows[0] });
  } catch {}
  res.json({ success: true, data: dbFallback.getVisionMission() });
});

apiRouter.get('/organization', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM school_organization ORDER BY display_order ASC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getOrganization() });
});

apiRouter.get('/teachers', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM teachers WHERE is_active = 1 ORDER BY display_order ASC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getTeachers() });
});

apiRouter.get('/staff', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM staff WHERE is_active = 1 ORDER BY display_order ASC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getStaff() });
});

apiRouter.get('/news', async (req: Request, res: Response) => {
  const category = req.query.category as string;
  const pool = getPool();
  try {
    let sql = 'SELECT * FROM news WHERE status = "published" ORDER BY published_at DESC';
    const params: any[] = [];
    if (category) {
      sql = 'SELECT n.* FROM news n JOIN news_categories c ON n.category_id = c.id WHERE n.status = "published" AND c.slug = ? ORDER BY n.published_at DESC';
      params.push(category);
    }
    const [rows]: any = await pool.query(sql, params);
    if (rows) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getNews() });
});

apiRouter.get('/news/categories', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM news_categories ORDER BY name ASC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getNewsCategories() });
});

apiRouter.get('/news/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM news WHERE slug = ? LIMIT 1', [slug]);
    if (rows && rows.length > 0) {
      await pool.query('UPDATE news SET views_count = views_count + 1 WHERE id = ?', [rows[0].id]);
      return res.json({ success: true, data: rows[0] });
    }
  } catch {}
  const n = dbFallback.getNewsBySlug(slug);
  if (!n) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
  res.json({ success: true, data: n });
});

apiRouter.get('/achievements', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM achievements ORDER BY year DESC, id DESC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getAchievements() });
});

apiRouter.get('/facilities', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM facilities ORDER BY display_order ASC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getFacilities() });
});

apiRouter.get('/gallery', async (req: Request, res: Response) => {
  const category = req.query.category as string;
  const pool = getPool();
  try {
    let sql = 'SELECT * FROM gallery_media ORDER BY display_order ASC, id DESC';
    const params: any[] = [];
    if (category && category !== 'Semua') {
      sql = 'SELECT * FROM gallery_media WHERE category = ? ORDER BY display_order ASC, id DESC';
      params.push(category);
    }
    const [rows]: any = await pool.query(sql, params);
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getGalleryMedia(category) });
});

apiRouter.get('/gallery/albums', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM gallery_albums ORDER BY id DESC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getGalleryAlbums() });
});

apiRouter.get('/ppdb', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM ppdb_information LIMIT 1');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows[0] });
  } catch {}
  res.json({ success: true, data: dbFallback.getPPDB() });
});

// Agendas Public Route
apiRouter.get('/agendas', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM agendas WHERE is_published = 1 ORDER BY event_date ASC');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getAgendas().filter((a: any) => a.is_published !== 0) });
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
  } catch {}
  let progs = dbFallback.getPrograms().filter((p: any) => p.is_active !== 0);
  if (category) progs = progs.filter((p: any) => p.category === category);
  res.json({ success: true, data: progs });
});

apiRouter.get('/settings', async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM website_settings LIMIT 1');
    if (rows && rows.length > 0) return res.json({ success: true, data: rows[0] });
  } catch {}
  res.json({ success: true, data: dbFallback.getSettings() });
});

apiRouter.post('/contact', async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Nama, email, subjek, dan pesan wajib diisi.' });
  }

  const pool = getPool();
  try {
    const [resInsert]: any = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, is_read, reply_status, created_at)
       VALUES (?, ?, ?, ?, ?, 0, 'unread', NOW())`,
      [name, email, phone || null, subject, message]
    );
    return res.json({
      success: true,
      message: 'Pesan berhasil terkirim ke pihak SMP Islam Caruy.',
      data: { id: resInsert.insertId, name, email, subject }
    });
  } catch {}

  const saved = dbFallback.createContactMessage({ name, email, phone, subject, message });
  res.json({ success: true, message: 'Pesan berhasil terkirim ke pihak SMP Islam Caruy.', data: saved });
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

// Catat aktivitas mutasi admin setelah respons sukses. Tidak menyimpan isi form, password, atau token.
apiRouter.use('/admin', (req: AuthenticatedRequest, res: Response, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  res.once('finish', () => {
    if (res.statusCode < 400 && req.user?.id) {
      const description = `${req.method} ${req.originalUrl}`.slice(0, 1000);
      getPool().query(
        'INSERT INTO admin_activities (admin_id, action, description, ip_hash) VALUES (?, ?, ?, NULL)',
        [req.user.id, req.method, description]
      ).catch((error: any) => {
        logger.error('AdminActivity', 'Gagal menyimpan log aktivitas administrator.', {
          code: error.code
        });
      });
    }
  });

  next();
});

// ==========================================
// 6. ADMIN CRUD OPERATIONS (DASHBOARD)
// ==========================================
// News CRUD
apiRouter.get('/admin/news', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM news ORDER BY id DESC');
    if (rows) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getNews(true) });
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
  } catch {}

  const saved = dbFallback.createNews(req.body);
  res.json({ success: true, message: 'Berita berhasil disimpan.', data: saved });
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
  } catch {}

  const updated = dbFallback.updateNews(id, req.body);
  res.json({ success: true, message: 'Berita berhasil diperbarui.', data: updated });
});

apiRouter.delete('/admin/news/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM news WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Berita berhasil dihapus.' });
  } catch {}

  dbFallback.deleteNews(id);
  res.json({ success: true, message: 'Berita berhasil dihapus.' });
});

// Profil Sekolah
apiRouter.put('/admin/school-profile', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE school_profile SET name = ?, npsn = ?, accreditation = ?, headmaster_name = ?, headmaster_photo = ?, headmaster_welcome = ?, description = ?, address = ?, phone = ?, whatsapp = ?, email = ?, maps_embed_url = ?, updated_at = NOW() WHERE id = 1`,
      [
        req.body.name, req.body.npsn, req.body.accreditation, req.body.headmaster_name,
        req.body.headmaster_photo, req.body.headmaster_welcome, req.body.description,
        req.body.address, req.body.phone, req.body.whatsapp, req.body.email, req.body.maps_embed_url
      ]
    );
  } catch {}
  const prof = dbFallback.updateSchoolProfile(req.body);
  res.json({ success: true, message: 'Profil sekolah berhasil disimpan.', data: prof });
});

// Pesan Masuk
apiRouter.get('/admin/messages', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM contact_messages ORDER BY id DESC');
    if (rows) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getContactMessages() });
});

apiRouter.put('/admin/messages/:id/read', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const { is_read } = req.body;
  const pool = getPool();
  try {
    await pool.query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
  } catch {}
  const upd = dbFallback.markMessageRead(id, is_read);
  res.json({ success: true, message: 'Status pesan diperbarui.', data: upd });
});

apiRouter.delete('/admin/messages/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
  } catch {}
  dbFallback.deleteMessage(id);
  res.json({ success: true, message: 'Pesan berhasil dihapus.' });
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
  } catch {}
  const saved = dbFallback.createTeacher(req.body);
  res.json({ success: true, message: 'Data guru berhasil ditambahkan.', data: saved });
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
  } catch {}
  const upd = dbFallback.updateTeacher(id, req.body);
  res.json({ success: true, message: 'Data guru berhasil diperbarui.', data: upd });
});

apiRouter.delete('/admin/teachers/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Data guru berhasil dihapus.' });
  } catch {}
  dbFallback.deleteTeacher(id);
  res.json({ success: true, message: 'Data guru berhasil dihapus.' });
});

// Admin Users CRUD (Superadmin Only)
apiRouter.get('/admin/users', requireSuperadmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admins');
    if (rows) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getAdmins() });
});

apiRouter.post('/admin/users', requireSuperadmin, async (req: Request, res: Response) => {
  const { username, email, full_name, password, role } = req.body;
  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
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
  } catch {}
  const saved = dbFallback.createAdminUser(req.body);
  res.json({ success: true, message: 'Pengguna admin berhasil ditambahkan.', data: saved });
});

apiRouter.delete('/admin/users/:id', requireSuperadmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (id === 1) return res.status(400).json({ success: false, message: 'Superadmin utama tidak dapat dihapus.' });

  const pool = getPool();
  try {
    await pool.query('DELETE FROM admins WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Akun admin berhasil dihapus.' });
  } catch {}
  dbFallback.deleteAdminUser(id);
  res.json({ success: true, message: 'Akun admin berhasil dihapus.' });
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
  } catch {}
  const saved = dbFallback.createFacility(req.body);
  res.json({ success: true, message: 'Fasilitas berhasil ditambahkan.', data: saved });
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
  } catch {}
  const upd = dbFallback.updateFacility(id, req.body);
  res.json({ success: true, message: 'Fasilitas berhasil diperbarui.', data: upd });
});

apiRouter.delete('/admin/facilities/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM facilities WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Fasilitas berhasil dihapus.' });
  } catch {}
  dbFallback.deleteFacility(id);
  res.json({ success: true, message: 'Fasilitas berhasil dihapus.' });
});

// Achievements CRUD
apiRouter.post('/admin/achievements', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [ins]: any = await pool.query(
      `INSERT INTO achievements (title, student_or_team, level, category, rank_position, year, organizer, photo, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.title, req.body.student_or_team || '', req.body.level || 'Kabupaten', req.body.category || 'Akademik', req.body.rank || req.body.rank_position || 'Juara 1', req.body.year || '2025', req.body.organizer || '', req.body.photo || null, req.body.description || '']
    );
    return res.json({ success: true, message: 'Prestasi berhasil disimpan.', data: { id: ins.insertId, ...req.body } });
  } catch {}
  const saved = dbFallback.createAchievement(req.body);
  res.json({ success: true, message: 'Prestasi berhasil disimpan.', data: saved });
});

apiRouter.put('/admin/achievements/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE achievements SET title = ?, student_or_team = ?, level = ?, category = ?, rank_position = ?, year = ?, organizer = ?, photo = ?, description = ? WHERE id = ?`,
      [req.body.title, req.body.student_or_team || '', req.body.level || 'Kabupaten', req.body.category || 'Akademik', req.body.rank || req.body.rank_position || 'Juara 1', req.body.year || '2025', req.body.organizer || '', req.body.photo || null, req.body.description || '', id]
    );
    return res.json({ success: true, message: 'Prestasi berhasil diperbarui.' });
  } catch {}
  const upd = dbFallback.updateAchievement(id, req.body);
  res.json({ success: true, message: 'Prestasi berhasil diperbarui.', data: upd });
});

apiRouter.delete('/admin/achievements/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM achievements WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Prestasi berhasil dihapus.' });
  } catch {}
  dbFallback.deleteAchievement(id);
  res.json({ success: true, message: 'Prestasi berhasil dihapus.' });
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
  } catch {}
  const saved = dbFallback.createGalleryMedia(req.body);
  res.json({ success: true, message: 'Foto galeri berhasil disimpan.', data: saved });
});

apiRouter.delete('/admin/gallery/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM gallery_media WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Foto galeri berhasil dihapus.' });
  } catch {}
  dbFallback.deleteGalleryMedia(id);
  res.json({ success: true, message: 'Foto galeri berhasil dihapus.' });
});

// Agendas CRUD
apiRouter.get('/admin/agendas', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM agendas ORDER BY event_date DESC');
    if (rows) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getAgendas() });
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
  } catch {}
  const saved = dbFallback.createAgenda(req.body);
  res.json({ success: true, message: 'Agenda berhasil ditambahkan.', data: saved });
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
  } catch {}
  const upd = dbFallback.updateAgenda(id, req.body);
  res.json({ success: true, message: 'Agenda berhasil diperbarui.', data: upd });
});

apiRouter.delete('/admin/agendas/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM agendas WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Agenda berhasil dihapus.' });
  } catch {}
  dbFallback.deleteAgenda(id);
  res.json({ success: true, message: 'Agenda berhasil dihapus.' });
});

// Programs CRUD
apiRouter.get('/admin/programs', requireAdmin, async (_req: Request, res: Response) => {
  const pool = getPool();
  try {
    const [rows]: any = await pool.query('SELECT * FROM programs ORDER BY display_order ASC');
    if (rows) return res.json({ success: true, data: rows });
  } catch {}
  res.json({ success: true, data: dbFallback.getPrograms() });
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
  } catch {}
  const saved = dbFallback.createProgram(req.body);
  res.json({ success: true, message: 'Program berhasil disimpan.', data: saved });
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
  } catch {}
  const upd = dbFallback.updateProgram(id, req.body);
  res.json({ success: true, message: 'Program berhasil diperbarui.', data: upd });
});

apiRouter.delete('/admin/programs/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const pool = getPool();
  try {
    await pool.query('DELETE FROM programs WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Program berhasil dihapus.' });
  } catch {}
  dbFallback.deleteProgram(id);
  res.json({ success: true, message: 'Program berhasil dihapus.' });
});

// Settings & PPDB
apiRouter.put('/admin/ppdb', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE ppdb_information SET academic_year = ?, is_open = ?, start_date = ?, end_date = ?, overview = ?, contact_person = ?, contact_phone = ?, contact_whatsapp = ?, updated_at = NOW() WHERE id = 1`,
      [req.body.academic_year, req.body.is_open ? 1 : 0, req.body.start_date || null, req.body.end_date || null, req.body.overview, req.body.contact_person || '', req.body.contact_phone || '', req.body.contact_whatsapp || '']
    );
  } catch {}
  const upd = dbFallback.updatePPDB(req.body);
  res.json({ success: true, message: 'Informasi PPDB berhasil diperbarui.', data: upd });
});

apiRouter.put('/admin/settings', requireAdmin, async (req: Request, res: Response) => {
  const pool = getPool();
  try {
    await pool.query(
      `UPDATE website_settings SET school_name = ?, tagline = ?, hero_title = ?, hero_subtitle = ?, facebook_url = ?, instagram_url = ?, youtube_url = ?, footer_text = ?, updated_at = NOW() WHERE id = 1`,
      [req.body.school_name, req.body.tagline || '', req.body.hero_title || '', req.body.hero_subtitle || '', req.body.facebook_url || '', req.body.instagram_url || '', req.body.youtube_url || '', req.body.footer_text || '']
    );
  } catch {}
  const upd = dbFallback.updateSettings(req.body);
  res.json({ success: true, message: 'Pengaturan website berhasil disimpan.', data: upd });
});
