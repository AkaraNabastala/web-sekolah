# LAPORAN AUDIT KEAMANAN DAN PEMBERSIHAN REPOSITORY
## SMP Islam Caruy — Repository: https://github.com/AkaraNabastala/web-sekolah
**Tanggal Audit & Pembersihan:** 4 November 2026  
**Auditor:** Tim Pengembang & Antigravity Security Agent  

---

## 1. Temuan Keamanan & Riwayat Git

> [!WARNING]
> **TEMUAN KRUSIAL PADA RIWAYAT GIT PUBLIK:**
> Berkas `.env` dan salinan `backup_snapshot/.env` sempat ter-commit ke dalam riwayat Git pada commit hash `eadfb379f466072a497a93304658addc211ae47c` ("*feat: reconstruct SMP Islam Caruy website*") dan telah terdorong ke remote GitHub (`origin/main`).  
> 
> Berkas tersebut memuat variabel konfigurasi sensitif (koneksi database dan JWT secret). Meskipun saat ini file `.env` dan `backup_snapshot/` **sudah dihapus dari index Git (`git rm --cached`)** dan diabaikan melalui `.gitignore`, **riwayat commit Git lama masih mencatat isi file tersebut**. Sesuai batasan pengerjaan (*tidak melakukan force-push atau pengubahan riwayat tanpa izin*), riwayat lama belum di-rebase secara paksa.

### Temuan Kredensial Lainnya:
1. **Password Administrator Demo Hardcoded**:
   - Ditemukan pada berkas dokumentasi (`README.md`), antarmuka login (`src/pages/admin/AdminLogin.tsx`), berkas seed basis data (`database/seeds/seed.sql`), serta objek state inisialisasi lokal (`backend/src/db/index.ts`).
2. **Metadata Sekolah Belum Dikonfirmasi**:
   - Data seperti NPSN dummy, akreditasi, dan nomor telepon kontak sampel ditemukan tertanam di beberapa komponen statis frontend.
3. **Penyimpanan Snapshot di Root Proyek**:
   - Direktori `backup_snapshot/` yang memuat duplikasi source code dan environment sempat berada di pohon pelacakan Git.

---

## 2. Tindakan Pembersihan yang Telah Berhasil Dilakukan

| No | Komponen / Berkas | Tindakan yang Diambil | Status |
|---|---|---|---|
| 1 | **Pelacakan `.env`** | Dikeluarkan dari Git index (`git rm --cached .env`). File `.env` lokal asli di server tetap dipertahankan agar sistem tetap dapat beroperasi. | Selesai & Terlindungi |
| 2 | **Pembersihan `backup_snapshot/`** | Seluruh pohon `backup_snapshot/` dihapus dari Git index dan dari direktori proyek (salinan lokal yang aman disimpan terisolasi di luar repository `/tmp/backup_snapshot_caruy`). | Selesai |
| 3 | **Pembaruan `.gitignore`** | Diperbarui untuk mengabaikan `.env`, `.env.*`, `*.env`, `backup_*/`, `*_snapshot/`, `uploads/`, `node_modules/`, dan `dist/`. | Selesai |
| 4 | **Pembersihan `.env.example`** | Dibuat ulang hanya berisi nama variabel dan contoh nilai placeholder aman, tanpa nilai kredensial rahasia apa pun. | Selesai |
| 5 | **Penghapusan Password Demo di Seed & DB** | - `database/seeds/seed.sql` dibersihkan dari query pembuatan admin default dan hash password demo.<br>- `backend/src/db/index.ts` dikosongkan dari user admin default dan hash password demo. | Selesai |
| 6 | **Penghapusan Password Demo di UI & README** | - Form login `AdminLogin.tsx` (baik di `frontend/` maupun legacy `src/`) telah dihapus dari tampilan kredensial demo.<br>- `README.md` diperbarui dengan instruksi setup administrator mandiri tanpa mencantumkan password statis. | Selesai |
| 7 | **Penggantian Data Belum Dikonfirmasi** | NPSN, nomor telepon, nama kepala sekolah, dan akreditasi pada komponen publik (`Profile.tsx`, `Navbar.tsx`, `Footer.tsx`) telah diubah menjadi placeholder (*"Dalam Proses Pembaruan"* atau *"Informasi Belum Tersedia"*). | Selesai |
| 8 | **Perbaikan Type Definition & Build Backend** | Mengoreksi ketidaksesuaian tipe Express parameters (`req.params.id`, `req.params.slug`) dan buffer ExcelJS di `StatisticsService.ts` dan `backend/src/routes/api.ts`. | Selesai |

---

## 3. Hasil Pemeriksaan Teknis Frontend & Backend

- **Frontend (`frontend/`)**:
  - Perintah: `npm run build`
  - Hasil: **SUKSES (Exit Code 0)** — Vite 7.3.7 berhasil mengompilasi 2.988 modul ke direktori `frontend/dist`.
- **Backend (`backend/`)**:
  - Perintah: `npm run build` (TypeScript Compiler `tsc`)
  - Hasil: **SUKSES (Exit Code 0)** — Seluruh modul TypeScript berhasil dikompilasi ke direktori `backend/dist` tanpa kesalahan tipe (*zero TypeScript errors*).
- **Backend Service Runtime**:
  - Layanan Express aktif berjalan di port 5000 (`http://0.0.0.0:5000`).
  - Endpoint publik `/api/health`, `/api/setup/status`, serta pencatatan statistik anonim `/api/visitor/log` merespons dengan format JSON valid.

---

## 4. Analisis Konsistensi Database (MySQL vs JSON)

- **Kondisi Aktual**:
  - Arsitektur backend telah menggunakan **MySQL 8.0+** sebagai target database utama (`mysql2/promise` connection pool).
  - Skema relasional DDL 20 tabel tersedia di `database/schema.sql`.
  - Pada lingkungan kerja sandbox saat ini, service daemon MySQL lokal tidak terpasang / tidak aktif (`ECONNREFUSED` di port 3306).
  - Oleh karena itu, backend mengaktifkan mekanisme proteksi *fallback atomic persistent store* (`database/data.json`) agar aplikasi dan pengujian tidak crash saat MySQL belum aktif.
- **Kesimpulan Transparan**:
  - **Secara kode, backend telah siap penuh untuk MySQL**, namun saat dijalankan di lingkungan tanpa service MySQL aktif, penyimpanan sementara berpindah ke JSON store. Ketika service MySQL di server produksi dinyalakan, backend akan langsung menggunakan MySQL secara penuh.

---

## 5. Potensi Risiko yang Masih Tersisa

1. **Riwayat Commit Git Masih Memuat File Rahasia Lama**:
   - Commit `eadfb37` yang sudah ada di remote GitHub masih memuat berkas `.env` lama. Siapa pun yang meng-clone repository atau melihat commit diff dapat membaca kredensial yang pernah di-commit tersebut.
2. **Direktori Legacy di Root Proyek**:
   - Di root masih terdapat folder legacy `src/` dan file konfigurasi root (`server.ts`, `vite.config.js`). Meskipun tidak mengganggu `frontend/` dan `backend/`, keberadaannya dapat menimbulkan kebingungan bagi developer baru.

---

## 6. Langkah Manual yang Harus Dilakukan Pemilik Proyek

Berikut adalah langkah-langkah penting yang **wajib segera dilakukan secara manual oleh pemilik proyek**:

1. **Rotasi Kredensial Database & JWT Secret**:
   - Karena password database dan JWT secret pernah masuk ke commit publik GitHub, **segera ubah password user MySQL Anda di server hosting / VPS**, dan buat string `JWT_SECRET` yang baru di file `.env` server Anda.
2. **Pembersihan Riwayat Commit Git (Git History Purge)**:
   - Jika repository ingin tetap berstatus publik tanpa meninggalkan jejak kredensial di commit lama, jalankan pembersihan riwayat commit lokal menggunakan tool seperti `git-filter-repo` atau `BFG Repo-Cleaner`:
     ```bash
     # Contoh menggunakan git-filter-repo (memerlukan force-push ke GitHub):
     git filter-repo --path .env --invert-paths
     git filter-repo --path backup_snapshot/ --invert-paths
     git push origin main --force
     ```
   *(Lakukan langkah ini hanya jika Anda telah menyetujui penulisan ulang riwayat Git).*
3. **Inisialisasi Administrator Pertama**:
   - Buat administrator utama sekolah melalui CLI di server:
     ```bash
     cd backend
     npm run setup-admin
     ```
   - Masukkan kata sandi pilihan yang kuat (minimal 8 karakter).
4. **Pengisian Data Resmi Sekolah**:
   - Setelah login ke Dashboard Admin, lengkapi data profil resmi sekolah (NPSN resmi, nomor kontak resmi, sambutan kepala sekolah, foto guru, dan informasi PPDB).

---

## 7. Status Kesiapan Proyek

Proyek saat ini berada dalam status **SIAP TAHAP PENGUJIAN & PENYESUAIAN DATA RESMI (READY FOR STAGING / DATA INPUT)**. Struktur modular `frontend/` dan `backend/` telah bersih, aman dari kredensial hardcoded di source code aktif, dan lulus uji kompilasi penuh.
