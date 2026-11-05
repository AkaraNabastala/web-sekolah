# 🏫 Website Resmi SMP Islam Caruy

Portal Profil Sekolah, Sistem Informasi Terpadu, Layanan PPDB Online, dan Dashboard Administrator Interaktif SMP Islam Caruy, Cipari, Cilacap.

---

## 🏗️ Arsitektur Proyek

Proyek ini telah direkonstruksi menjadi arsitektur modular yang memisahkan frontend dan backend secara profesional:

```text
web-sekolah/
├── frontend/                   # Aplikasi React + Vite
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # API Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── scripts/
│   │   └── server.ts
│   ├── database/               # schema, seed, dan offline store
│   ├── uploads/
│   └── package.json
├── scripts/                    # Orkestrasi development dan build produksi
├── .env.example
├── .gitignore
└── README.md
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
mysql -u root -p web-sekolah < backend/database/schema.sql
mysql -u root -p web-sekolah < backend/database/seeds/seed.sql
```

### 4. Instalasi dependensi
Jalankan dari root proyek:
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 5. Menjalankan Development
Cukup dari root proyek:
```bash
npm run dev
```
Satu perintah ini menjalankan dua proses terpisah:
- Backend Express: `http://localhost:5000`
- Frontend Vite: `http://localhost:5173`

Vite meneruskan permintaan `/api` dan `/uploads` ke backend port 5000. Jika ingin menjalankan satu layanan saja, gunakan `npm run dev:backend` atau `npm run dev:frontend`.

---

## 📦 Build Produksi & Deployment

Build seluruh aplikasi dan siapkan paket server:
```bash
npm run build
```
Perintah tersebut membangun frontend dan backend, lalu membuat paket hasil build di folder `deployment/`. Folder ini adalah artefak hasil generate, bukan sumber kode yang diedit manual.

Untuk menjalankan paket produksi:
```bash
cd deployment
npm install --omit=dev
npm start
```

---

## 📊 Statistik Pengunjung & Laporan
- **Metrik Privasi**: Menggunakan *one-way SHA-256 daily salt hashing* pada IP pengunjung dan User-Agent, sehingga privasi pengunjung terlindungi tanpa menyimpan IP mentah.
- **Ekspor Dokumen**: Laporan analitik kunjungan dapat diunduh langsung dalam format **Microsoft Excel (.xlsx)** dan **CSV** melalui Dashboard Admin pada menu `Statistik Pengunjung`.
