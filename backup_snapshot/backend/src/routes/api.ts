import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db/index.js';
import { requireAdmin, AuthenticatedRequest, JWT_SECRET } from '../middleware/auth.js';

export const apiRouter = Router();

// Setup Multer for secure uploads
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'video/mp4', 'video/webm'
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe berkas tidak diizinkan. Hanya JPG, PNG, WEBP, PDF, dan MP4 yang didukung.'));
    }
  }
});

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  const admin = db.findAdminByUsername(username);
  if (!admin || !admin.is_active) {
    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  }

  const isMatch = bcrypt.compareSync(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  }

  db.updateAdmin(admin.id, { last_login: new Date().toISOString() });
  db.logActivity(admin.id, 'Login Sukses', `Admin '${admin.username}' berhasil masuk ke dashboard.`, req.ip || '127.0.0.1');

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...safeUser } = admin;
  return res.json({
    success: true,
    message: 'Login berhasil.',
    token,
    user: safeUser
  });
});

apiRouter.get('/auth/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const admin = db.findAdminById(req.admin!.id);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });
  }
  const { password, ...safeUser } = admin;
  return res.json({ success: true, user: safeUser });
});

apiRouter.put('/auth/profile', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { full_name, email, avatar, username } = req.body;
  const adminId = req.admin!.id;

  // Check unique username/email
  if (username) {
    const existing = db.findAdminByUsername(username);
    if (existing && existing.id !== adminId) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain.' });
    }
  }

  const updated = db.updateAdmin(adminId, { full_name, email, avatar, username });
  db.logActivity(adminId, 'Update Profil Admin', 'Admin memperbarui informasi profil akun.', req.ip || '');
  return res.json({ success: true, message: 'Profil berhasil diperbarui.', user: updated });
});

apiRouter.put('/auth/password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
  }

  const admin = db.findAdminById(req.admin!.id);
  if (!admin) return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });

  const isMatch = bcrypt.compareSync(currentPassword, admin.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Password lama tidak sesuai.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.updateAdmin(admin.id, { password: newHash });
  db.logActivity(admin.id, 'Ganti Password', 'Admin berhasil mengubah kata sandi.', req.ip || '');

  return res.json({ success: true, message: 'Password berhasil diubah. Silakan gunakan password baru pada login berikutnya.' });
});

// Admin Users & Roles Management
apiRouter.get('/admin/users', requireAdmin, (_req, res) => {
  res.json({ success: true, data: db.getAdmins() });
});

apiRouter.post('/admin/users', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { username, email, full_name, password, role, avatar } = req.body;
  if (!username || !email || !full_name || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, nama lengkap, dan password wajib diisi.' });
  }

  const existing = db.findAdminByUsername(username);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Username tersebut sudah terdaftar.' });
  }

  const created = db.createAdminUser({ username, email, full_name, password, role, avatar });
  db.logActivity(req.admin!.id, 'Tambah Admin', `Menambahkan akun pengelola baru: @${created.username} (${created.role})`, req.ip || '');
  res.status(201).json({ success: true, message: 'Akun pengelola berhasil ditambahkan.', data: created });
});

apiRouter.delete('/admin/users/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id);
  if (id === 1) {
    return res.status(403).json({ success: false, message: 'Akun Superadmin utama tidak dapat dihapus.' });
  }
  const deleted = db.deleteAdminUser(id);
  if (deleted) {
    db.logActivity(req.admin!.id, 'Hapus Admin', `Menghapus akun pengelola ID ${id}`, req.ip || '');
    return res.json({ success: true, message: 'Akun pengelola berhasil dihapus.' });
  }
  return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
});

// ==========================================
// 2. PUBLIC SCHOOL PROFILE ENDPOINTS
// ==========================================
apiRouter.get('/school-profile', (_req, res) => {
  res.json({ success: true, data: db.getSchoolProfile() });
});

apiRouter.get('/school-history', (_req, res) => {
  res.json({ success: true, data: db.getSchoolHistory() });
});

apiRouter.get('/vision-mission', (_req, res) => {
  res.json({ success: true, data: db.getVisionMission() });
});

apiRouter.get('/organization', (_req, res) => {
  res.json({ success: true, data: db.getOrganization() });
});

apiRouter.get('/teachers', (_req, res) => {
  res.json({ success: true, data: db.getTeachers() });
});

apiRouter.get('/staff', (_req, res) => {
  res.json({ success: true, data: db.getStaff() });
});

apiRouter.get('/news/categories', (_req, res) => {
  res.json({ success: true, data: db.getNewsCategories() });
});

apiRouter.get('/news', (req, res) => {
  const categorySlug = req.query.category as string;
  let items = db.getNews(false);
  if (categorySlug && categorySlug !== 'semua') {
    items = items.filter(n => n.category_slug === categorySlug);
  }
  res.json({ success: true, data: items });
});

apiRouter.get('/news/:slug', (req, res) => {
  const article = db.getNewsBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
  }
  res.json({ success: true, data: article });
});

apiRouter.get('/gallery/albums', (_req, res) => {
  res.json({ success: true, data: db.getGalleryAlbums() });
});

apiRouter.get('/gallery', (req, res) => {
  const category = req.query.category as string;
  res.json({ success: true, data: db.getGalleryMedia(category) });
});

apiRouter.get('/achievements', (_req, res) => {
  res.json({ success: true, data: db.getAchievements() });
});

apiRouter.get('/facilities', (_req, res) => {
  res.json({ success: true, data: db.getFacilities() });
});

apiRouter.get('/ppdb', (_req, res) => {
  res.json({ success: true, data: db.getPPDB() });
});

apiRouter.get('/settings', (_req, res) => {
  res.json({ success: true, data: db.getSettings() });
});

// Visitor message submit
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Nama, email, subjek, dan pesan wajib diisi.' });
  }

  const created = db.createContactMessage({ name, email, phone, subject, message });
  res.status(201).json({
    success: true,
    message: 'Pesan Anda berhasil terkirim. Terima kasih telah menghubungi SMP Islam Caruy.',
    data: created
  });
});

// Visitor log recording
apiRouter.post('/visitor/log', (req: Request, res: Response) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const ua = req.headers['user-agent'] || '';
  const { path = '/', referrer = '' } = req.body;
  db.logVisitor(String(ip), ua, path, referrer);
  res.json({ success: true });
});

// ==========================================
// 3. PROTECTED ADMIN MANAGEMENT ENDPOINTS
// ==========================================

// Dashboard stats & activities
apiRouter.get('/admin/dashboard/statistics', requireAdmin, (_req, res) => {
  res.json({ success: true, data: db.getDashboardStats() });
});

apiRouter.get('/admin/dashboard/activities', requireAdmin, (_req, res) => {
  res.json({ success: true, data: db.getAdminActivities() });
});

// Profile & Identity
apiRouter.put('/admin/school-profile', requireAdmin, (req: AuthenticatedRequest, res) => {
  const updated = db.updateSchoolProfile(req.body);
  db.logActivity(req.admin!.id, 'Update Profil Sekolah', 'Memperbarui identitas dan profil sekolah.', req.ip || '');
  res.json({ success: true, message: 'Profil sekolah berhasil disimpan.', data: updated });
});

apiRouter.put('/admin/school-history', requireAdmin, (req: AuthenticatedRequest, res) => {
  const updated = db.updateSchoolHistory(req.body);
  db.logActivity(req.admin!.id, 'Update Sejarah', 'Memperbarui konten artikel dan milestone sejarah sekolah.', req.ip || '');
  res.json({ success: true, message: 'Sejarah sekolah berhasil disimpan.', data: updated });
});

apiRouter.put('/admin/vision-mission', requireAdmin, (req: AuthenticatedRequest, res) => {
  const updated = db.updateVisionMission(req.body);
  db.logActivity(req.admin!.id, 'Update Visi Misi', 'Memperbarui visi, misi, tujuan, dan nilai utama sekolah.', req.ip || '');
  res.json({ success: true, message: 'Visi & Misi berhasil disimpan.', data: updated });
});

// Organization CRUD
apiRouter.post('/admin/organization', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createOrganizationMember(req.body);
  db.logActivity(req.admin!.id, 'Tambah Struktur', `Menambahkan anggota struktur: ${created.name} (${created.position})`, req.ip || '');
  res.status(201).json({ success: true, message: 'Anggota struktur berhasil ditambahkan.', data: created });
});

apiRouter.put('/admin/organization/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const updated = db.updateOrganizationMember(id, req.body);
  db.logActivity(req.admin!.id, 'Update Struktur', `Mengubah struktur ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Struktur berhasil diperbarui.', data: updated });
});

apiRouter.delete('/admin/organization/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteOrganizationMember(id);
  db.logActivity(req.admin!.id, 'Hapus Struktur', `Menghapus anggota struktur ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Anggota struktur berhasil dihapus.' });
});

// Teachers CRUD
apiRouter.post('/admin/teachers', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createTeacher(req.body);
  db.logActivity(req.admin!.id, 'Tambah Guru', `Menambahkan guru: ${created.name}`, req.ip || '');
  res.status(201).json({ success: true, message: 'Data guru berhasil ditambahkan.', data: created });
});

apiRouter.put('/admin/teachers/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const updated = db.updateTeacher(id, req.body);
  db.logActivity(req.admin!.id, 'Update Guru', `Memperbarui data guru ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Data guru berhasil diperbarui.', data: updated });
});

apiRouter.delete('/admin/teachers/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteTeacher(id);
  db.logActivity(req.admin!.id, 'Hapus Guru', `Menghapus data guru ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Data guru berhasil dihapus.' });
});

// Staff CRUD
apiRouter.post('/admin/staff', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createStaff(req.body);
  db.logActivity(req.admin!.id, 'Tambah Staf', `Menambahkan staf: ${created.name}`, req.ip || '');
  res.status(201).json({ success: true, message: 'Data staf berhasil ditambahkan.', data: created });
});

apiRouter.put('/admin/staff/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const updated = db.updateStaff(id, req.body);
  db.logActivity(req.admin!.id, 'Update Staf', `Memperbarui data staf ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Data staf berhasil diperbarui.', data: updated });
});

apiRouter.delete('/admin/staff/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteStaff(id);
  db.logActivity(req.admin!.id, 'Hapus Staf', `Menghapus data staf ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Data staf berhasil dihapus.' });
});

// News CRUD (includes drafts)
apiRouter.get('/admin/news', requireAdmin, (_req, res) => {
  res.json({ success: true, data: db.getNews(true) });
});

apiRouter.post('/admin/news', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createNews(req.body);
  db.logActivity(req.admin!.id, 'Tambah Berita', `Menerbitkan berita: "${created.title}"`, req.ip || '');
  res.status(201).json({ success: true, message: 'Berita berhasil disimpan.', data: created });
});

apiRouter.put('/admin/news/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const updated = db.updateNews(id, req.body);
  db.logActivity(req.admin!.id, 'Update Berita', `Memperbarui berita ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Berita berhasil diperbarui.', data: updated });
});

apiRouter.delete('/admin/news/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteNews(id);
  db.logActivity(req.admin!.id, 'Hapus Berita', `Menghapus berita ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Berita berhasil dihapus.' });
});

apiRouter.post('/admin/news/categories', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { name, slug, description } = req.body;
  const created = db.createNewsCategory({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description });
  res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan.', data: created });
});

// Gallery CRUD
apiRouter.post('/admin/gallery/albums', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createGalleryAlbum(req.body);
  res.status(201).json({ success: true, message: 'Album berhasil dibuat.', data: created });
});

apiRouter.delete('/admin/gallery/albums/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  db.deleteGalleryAlbum(parseInt(req.params.id));
  res.json({ success: true, message: 'Album berhasil dihapus.' });
});

apiRouter.post('/admin/gallery', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createGalleryMedia(req.body);
  db.logActivity(req.admin!.id, 'Upload Galeri', `Menambahkan media: ${created.title}`, req.ip || '');
  res.status(201).json({ success: true, message: 'Media berhasil disimpan ke galeri.', data: created });
});

apiRouter.delete('/admin/gallery/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteGalleryMedia(id);
  db.logActivity(req.admin!.id, 'Hapus Galeri', `Menghapus media ID ${id}`, req.ip || '');
  res.json({ success: true, message: 'Media berhasil dihapus dari galeri.' });
});

// Achievements CRUD
apiRouter.post('/admin/achievements', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createAchievement(req.body);
  db.logActivity(req.admin!.id, 'Tambah Prestasi', `Menambahkan prestasi: ${created.title}`, req.ip || '');
  res.status(201).json({ success: true, message: 'Prestasi berhasil ditambahkan.', data: created });
});

apiRouter.put('/admin/achievements/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const updated = db.updateAchievement(id, req.body);
  res.json({ success: true, message: 'Prestasi berhasil diperbarui.', data: updated });
});

apiRouter.delete('/admin/achievements/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteAchievement(id);
  res.json({ success: true, message: 'Prestasi berhasil dihapus.' });
});

// Facilities CRUD
apiRouter.post('/admin/facilities', requireAdmin, (req: AuthenticatedRequest, res) => {
  const created = db.createFacility(req.body);
  db.logActivity(req.admin!.id, 'Tambah Fasilitas', `Menambahkan fasilitas: ${created.name}`, req.ip || '');
  res.status(201).json({ success: true, message: 'Fasilitas berhasil ditambahkan.', data: created });
});

apiRouter.put('/admin/facilities/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const updated = db.updateFacility(id, req.body);
  res.json({ success: true, message: 'Fasilitas berhasil diperbarui.', data: updated });
});

apiRouter.delete('/admin/facilities/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteFacility(id);
  res.json({ success: true, message: 'Fasilitas berhasil dihapus.' });
});

// PPDB Management
apiRouter.put('/admin/ppdb', requireAdmin, (req: AuthenticatedRequest, res) => {
  const updated = db.updatePPDB(req.body);
  db.logActivity(req.admin!.id, 'Update PPDB', 'Memperbarui informasi dan pengaturan PPDB.', req.ip || '');
  res.json({ success: true, message: 'Informasi PPDB berhasil diperbarui.', data: updated });
});

// Contact Messages Management
apiRouter.get('/admin/messages', requireAdmin, (_req, res) => {
  res.json({ success: true, data: db.getContactMessages() });
});

apiRouter.put('/admin/messages/:id/read', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const updated = db.markMessageRead(id, req.body.is_read !== false);
  res.json({ success: true, message: 'Status pesan diperbarui.', data: updated });
});

apiRouter.delete('/admin/messages/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  db.deleteMessage(id);
  res.json({ success: true, message: 'Pesan berhasil dihapus.' });
});

// Website Settings
apiRouter.put('/admin/settings', requireAdmin, (req: AuthenticatedRequest, res) => {
  const updated = db.updateSettings(req.body);
  db.logActivity(req.admin!.id, 'Update Pengaturan Web', 'Memperbarui konfigurasi identitas dan tampilan website.', req.ip || '');
  res.json({ success: true, message: 'Pengaturan website berhasil disimpan.', data: updated });
});

// File Upload Handler (Single file with metadata storage)
apiRouter.post('/upload', requireAdmin, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada berkas yang diunggah.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const metadata = db.saveUploadedFile({
    original_name: req.file.originalname,
    file_name: req.file.filename,
    file_path: fileUrl,
    file_type: req.file.mimetype,
    file_size: req.file.size,
    uploaded_by: req.admin?.username || 'Admin'
  });

  res.status(201).json({
    success: true,
    message: 'Berkas berhasil diunggah.',
    fileUrl,
    metadata
  });
});
