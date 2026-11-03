# Website Profil Sekolah SMP Islam Caruy

Portal Informasi Resmi dan Sistem Manajemen Konten (CMS Dashboard Admin) Terintegrasi untuk **SMP Islam Caruy**, sekolah menengah pertama Islam swasta modern di Desa Caruy, Kec. Cipari, Kab. Cilacap, Jawa Tengah.

---

## 🏫 Identitas Sekolah
- **Nama Sekolah**: SMP Islam Caruy
- **Jenjang**: Sekolah Menengah Pertama (SMP)
- **Status**: Swasta
- **Akreditasi**: A (Unggul)
- **NPSN**: 20301988
- **Tahun Berdiri**: 2005
- **Warna Identitas**: Hijau (Utama), Kuning/Gold, Putih, Oranye, Biru
- **Alamat**: Jl. Raya Caruy No. 12, Desa Caruy, Kec. Cipari, Kab. Cilacap, Jawa Tengah 53262

---

## 🚀 Teknologi & Arsitektur

### Frontend
- **Framework**: React.js 19 + Vite 7 (TypeScript / JSX)
- **Styling**: Tailwind CSS v4 + Animasi Kustom
- **Routing**: React Router DOM v7
- **Icons**: Lucide React + Remix Icon
- **Charts**: Recharts (Statistik Kunjungan & Kategori)
- **Form Management**: React Hook Form
- **HTTP Client**: Axios dengan JWT Interceptor

### Backend
- **Runtime**: Node.js v22 (ESM)
- **Web Framework**: Express.js 5
- **Authentication**: JWT (JSON Web Tokens) dengan middleware proteksi rute
- **Password Security**: BcryptJS salt rounds 10
- **File Upload**: Multer (upload thumbnail, galeri, foto guru, dokumen PPDB ke `/uploads`)
- **Dev Runner**: `tsx` (TypeScript Execution)

### Database
- **Dialect**: MySQL 8.0+
- **Production Schema**: `/database/schema.sql` (19 tabel relasional terstruktur dengan foreign keys, indexes, dan constraints)
- **Seed Data**: `/database/seeds/seed.sql` (Data awal lengkap: admin, profil sekolah, visi misi, guru/staf, berita, galeri, fasilitas, PPDB, pengaturan website)
- **Development Engine**: Persistent Atomic JSON Store (`/database/data.json`) dengan auto-seeding awal, logging pengunjung otomatis, dan audit aktivitas admin.

---

## 📂 Struktur Proyek

```text
├── backend/
│   └── src/
│       ├── db/
│       │   └── index.ts          # Storage engine & database handler
│       ├── middleware/
│       │   └── auth.ts           # JWT authentication middleware
│       └── routes/
│       │   └── api.ts            # RESTful API endpoints (Public & Protected)
├── database/
│   ├── schema.sql                # Skema DDL MySQL 19 tabel
│   ├── seeds/
│   │   └── seed.sql              # SQL seeder resmi
│   └── data.json                 # Penyimpanan relasional dev persisten
├── src/
│   ├── assets/                   # Logo resmi & aset statis
│   ├── components/
│   │   └── common/               # Navbar, Footer, Logo, Floating WhatsApp, PageHeader
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth provider & session token
│   │   └── SchoolContext.tsx     # Profil sekolah & pengaturan website
│   ├── pages/
│   │   ├── public/               # Halaman Beranda, Profil, Sejarah, Visi Misi,
│   │   │                         # Guru/Staf, Berita, Galeri, Prestasi, Fasilitas, PPDB, Kontak
│   │   └── admin/                # Dashboard Admin, Kelola Berita, Profil, Guru,
│   │                             # Organisasi, Galeri, Prestasi, PPDB, Pesan Masuk, Akun
│   ├── services/
│   │   └── api.ts                # Axios client & service API
│   ├── types/
│   │   └── index.ts              # Definisi interface TypeScript
│   ├── App.tsx                   # Master router aplikasi
│   ├── main.jsx                  # Entry point React
│   └── index.css                 # Style global & Tailwind
├── uploads/                      # Direktori upload media statis
├── server.ts                     # Full-stack server (Express API + Vite SPA)
├── vite.config.js                # Konfigurasi Vite
└── package.json                  # Dependencies & scripts
```

---

## 🔑 Kredensial Administrator Default

Gunakan kredensial berikut untuk masuk ke dashboard admin melalui `/admin/login`:

- **URL Login**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `adminCaruy2026!`
- **Role**: `superadmin`

*(Password dapat diganti kapan saja melalui menu Manajemen Akun di dalam Dashboard Admin).*

---

## 🛠️ Panduan Instalasi & Menjalankan

### 1. Prasyarat
- Node.js versi 18+ (disarankan Node.js 22 LTS)
- NPM versi 9+

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Opsional)
Salin `.env.example` ke `.env` bila ingin menyesuaikan port atau rahasia JWT:
```bash
PORT=3000
JWT_SECRET=caruy_islamic_school_super_secret_jwt_key_2026
```

### 4. Menjalankan di Mode Development
```bash
npm run dev
```
Buka browser di:
- **Website Publik**: `http://localhost:3000`
- **Dashboard Admin**: `http://localhost:3000/admin`

### 5. Build & Jalankan Mode Produksi
```bash
npm run build
npm start
```

---

## 🗄️ Menyiapkan Database MySQL untuk Produksi

Bila ingin menghubungkan ke server MySQL eksternal (misalnya pada server VPS / cPanel):

1. Masuk ke MySQL CLI atau phpMyAdmin:
   ```bash
   mysql -u root -p
   ```
2. Eksekusi skema database:
   ```sql
   SOURCE database/schema.sql;
   ```
3. Eksekusi data seeder:
   ```sql
   SOURCE database/seeds/seed.sql;
   ```

---

## 🌐 Fitur Utama Website

### 1. Website Publik
- **Beranda**: Hero interaktif, sambutan Kepala Sekolah, quick stats counter, 4 pilar nilai Islami, berita terkini, galeri, fasilitas unggulan, dan CTA PPDB.
- **Profil Sekolah**: Data identitas lengkap, NPSN, akreditasi, status, visi, dan filosofi pendidikan.
- **Sejarah Sekolah**: Narasi sejarah pendirian sekolah dan linimasa (milestone).
- **Visi & Misi**: Kartu visi, misi, tujuan strategis, dan nilai-nilai inti.
- **Struktur Organisasi**: Bagan hierarki kepemimpinan sekolah (Komite, Kepala Sekolah, Waka, Ka TU).
- **Guru & Tenaga Kependidikan**: Daftar dewan guru dengan filter mata pelajaran dan pencarian.
- **Berita & Artikel**: Indeks berita dengan filter kategori, pencarian, dan halaman detail artikel lengkap (share WhatsApp, views counter).
- **Galeri Foto & Video**: Galeri kegiatan siswa dengan kategori dan lightbox preview resolusi penuh.
- **Prestasi Siswa**: Dokumentasi pencapaian tingkat Kabupaten, Provinsi, dan Nasional.
- **Fasilitas Sekolah**: Daftar fasilitas lengkap dengan status kondisi dan kapasitas.
- **Informasi PPDB**: Jalur pendaftaran, persyaratan berkas, alur langkah, jadwal gelombang, rincian biaya, dan formulir pra-pendaftaran langsung ke WhatsApp panitia.
- **Kontak & Lokasi**: Peta interaktif Google Maps, data kontak resmi, dan formulir pesan pengunjung langsung tersimpan di inbox admin.
- **Tombol WhatsApp Mengambang**: Konsultasi cepat via WhatsApp dan tombol kembali ke atas (*scroll-to-top*).

### 2. Dashboard Administrator (`/admin`)
- **Dashboard Utama**: Ringkasan 8 indikator statistik (pengunjung total, hari ini, bulan ini, total berita, guru, galeri, prestasi, pesan), grafik tren traffic 7 hari terakhir (Recharts), diagram kategori berita, pesan terbaru, dan log aktivitas admin.
- **Manajemen Profil**: Pengaturan nama sekolah, sambutan kepala sekolah, foto, visi misi, dan sejarah.
- **Manajemen Berita**: Tambah, edit, hapus berita, upload thumbnail, pemilihan kategori, auto slug, dan status publikasi (Draft/Published).
- **Manajemen Guru & Staf**: Pengelolaan dewan guru dengan foto, jabatan, mata pelajaran, dan tingkat pendidikan.
- **Manajemen Organisasi**: Pengaturan bagan hierarki dan susunan pengurus sekolah.
- **Manajemen Galeri**: Unggah foto/video kegiatan sekolah dengan album dan kategori.
- **Manajemen Prestasi**: Pendataan prestasi lomba siswa dan sekolah beserta penyelenggara.
- **Manajemen Fasilitas**: Pendataan sarana & prasarana sekolah.
- **Manajemen PPDB**: Pengaturan tahun ajaran baru, status pendaftaran (Buka/Tutup), syarat, jadwal gelombang, dan rincian biaya masuk.
- **Manajemen Pesan Masuk**: Kotak masuk pesan dari pengunjung dengan status belum dibaca/sudah dibaca dan tombol balas cepat via WhatsApp/Email.
- **Pengaturan Website**: Penyesuaian nama situs, tagline, teks banner hero, nomor WhatsApp, media sosial, dan meta SEO.
- **Manajemen Akun Admin**: Ubah username, nama lengkap, dan pembaruan password dengan enkripsi bcrypt.

---

## 📄 Lisensi
Hak Cipta © 2026 SMP Islam Caruy. Seluruh hak cipta dilindungi undang-undang.
