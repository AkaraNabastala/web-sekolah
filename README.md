# 🏫 Website Resmi SMP Islam Caruy

Portal Profil Sekolah, Sistem Informasi Terpadu, Layanan PPDB Online, dan Dashboard Administrator Interaktif SMP Islam Caruy, Cipari, Cilacap.

---

## 🏗️ Arsitektur Proyek

Proyek ini telah direkonstruksi menjadi arsitektur modular yang memisahkan frontend dan backend secara profesional:

```text
web-sekolah/
├── frontend/                     # Client Application (React 19, Vite 7, Tailwind CSS v4, TypeScript)
│   ├── public/                   # Asset statis & favicon
│   ├── src/
│   │   ├── components/           # Komponen UI, Navbar dropdown & accordion mobile, Footer
│   │   ├── context/              # AuthContext (JWT) & SchoolContext
│   │   ├── pages/
│   │   │   ├── public/           # Halaman publik (Beranda, Profil, Guru, Berita, Galeri, Fasilitas, PPDB, Kontak)
│   │   │   └── admin/            # Dashboard Admin & Statistik Pengunjung
│   │   └── services/             # Axios REST API Client
│   ├── package.json              # Dependensi frontend
│   └── vite.config.ts            # Proxy API development & build config
│
├── backend/                      # API Backend Service (Node.js, Express, TypeScript, Multer, ExcelJS)
│   ├── src/
│   │   ├── config/               # database.ts (MySQL2 Connection Pool & Health Check)
│   │   ├── middleware/           # auth.ts (JWT Auth & Role Guard)
│   │   ├── routes/               # api.ts (Endpoints publik, admin CRUD, upload, tracking)
│   │   ├── services/             # StatisticsService.ts (Pengunjung unik, sesi, ekspor XLSX/CSV)
│   │   ├── utils/                # privacy.ts (SHA-256 IP anonymization)
│   │   ├── scripts/              # setupAdmin.ts (CLI setup superadmin pertama)
│   │   └── server.ts             # Express server runtime
│   ├── uploads/                  # Penyimpanan berkas terunggah (gambar & dokumen)
│   └── package.json              # Dependensi backend
│
├── database/
│   ├── schema.sql                # Skema DDL MySQL 8.0+ (20 tabel relasional)
│   └── seeds/
│       └── seed.sql              # Data inisialisasi awal (tanpa password default)
│
├── .env.example                  # Template variabel lingkungan
├── .gitignore                    # Rule pengabaian file sensitif
├── scripts/                      # Skrip orkestrasi dev dan build produksi
└── README.md                     # Dokumentasi panduan
```

---

## 🔒 Keamanan & Pembuatan Administrator Pertama

Untuk menjaga integritas dan keamanan sistem, **tidak ada akun demo atau kata sandi bawaan** yang disimpan di dalam source code repository.

### Pembuatan Administrator Pertama (Setup Mandiri):
1. **Melalui Antarmuka Web**:  
   Saat pertama kali membuka `/admin/login` ketika database belum memiliki akun administrator, antarmuka setup awal akan otomatis aktif. Pemilik sistem dapat memasukkan nama lengkap, email, username, dan kata sandi pilihan (minimal 8 karakter). Setelah berhasil dibuat, alur setup ini terkunci secara permanen.
2. **Melalui Baris Perintah (CLI)**:
   ```bash
   cd backend
   npm run setup-admin
   ```
   Ikuti instruksi interaktif di terminal untuk mendaftarkan akun Superadmin pertama Anda.

---

## 🛠️ Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
- **Node.js**: Versi 20+ atau 24 LTS
- **NPM**: Versi 10+
- **Database**: MySQL 8.0+

### 2. Konfigurasi Environment (.env)
Salin `.env.example` menjadi `.env` di root atau di dalam folder `backend/`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi koneksi MySQL (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) serta buat string acak yang kuat untuk `JWT_SECRET`. **Jangan meng-commit file `.env` ke Git!**

### 3. Migrasi Database MySQL
Jalankan skema basis data pada server MySQL Anda:
```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < database/seeds/seed.sql
```

### 4. Menjalankan Backend (Development)
```bash
cd backend
npm install
npm run dev
```
Backend akan aktif di `http://localhost:5000`.

### 5. Menjalankan Frontend (Development)
Buka terminal baru:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend akan aktif di `http://localhost:5173`. Permintaan `/api` dan `/uploads` secara otomatis diteruskan (*proxy*) ke backend di port 5000.

---

## 📦 Build Produksi & Deployment

### Build Kompilasi:
```bash
# Build Frontend
cd frontend
npm run build

# Build Backend
cd ../backend
npm run build
```

### Menjalankan Server Produksi:
```bash
cd backend
npm start
```

---

## 📊 Statistik Pengunjung & Laporan
- **Metrik Privasi**: Menggunakan *one-way SHA-256 daily salt hashing* pada IP pengunjung dan User-Agent, sehingga privasi pengunjung terlindungi tanpa menyimpan IP mentah.
- **Ekspor Dokumen**: Laporan analitik kunjungan dapat diunduh langsung dalam format **Microsoft Excel (.xlsx)** dan **CSV** melalui Dashboard Admin pada menu `Statistik Pengunjung`.
