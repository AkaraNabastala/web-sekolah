# School Website CMS

Template website sekolah dan sistem manajemen konten (CMS) berbasis React, TypeScript, Node.js, Express, dan MySQL.

Template ini dirancang sebagai produk generik yang dapat digunakan ulang untuk berbagai sekolah. Instalasi demo menggunakan identitas, konten, dan aset ilustrasi dummy. Tidak ada identitas sekolah atau data institusi nyata yang menjadi bawaan produk.

## Fitur utama

- Website publik responsif dengan profil, sejarah, visi-misi, organisasi, guru/staf, berita, agenda, pengumuman, galeri, prestasi, fasilitas, kontak, dan modul penerimaan peserta didik.
- Dashboard admin dengan pembagian peran pengelola.
- Pengaturan identitas sekolah, logo, favicon, warna, hero, SEO, dan visibilitas modul.
- Pengelolaan konten melalui CMS.
- Editor rich text berbasis PrimeReact Editor dan Quill.
- Autentikasi berbasis cookie HttpOnly, proteksi CSRF, serta pengelolaan profil dan password admin.
- Backend API dan database MySQL dengan migrasi terkelola.

## Struktur proyek

- `frontend/`: aplikasi React dan Vite.
- `backend/`: API Node.js/Express dan integrasi MySQL.
- `backend/database/`: skema, migrasi, dan data demo.
- `.github/workflows/`: pemeriksaan build dan validasi migrasi.

## Menjalankan secara lokal

1. Gunakan Node.js 22 atau versi LTS yang kompatibel.
2. Salin `.env.example` menjadi `.env`, isi konfigurasi database lokal, lalu buat secret acak untuk `JWT_SECRET` dan `ADMIN_SETUP_TOKEN` (masing-masing minimal 32 karakter; gunakan `openssl rand -hex 32`). Jangan memakai secret contoh atau mengunggah `.env` ke Git.
3. Buat database MySQL baru khusus demo. Jangan gunakan database yang berisi data sekolah nyata.
4. Pasang dependensi root, backend, dan frontend menggunakan `npm ci` pada direktori masing-masing.
5. Jalankan migrasi database sesuai panduan backend.
6. Isi database demo menggunakan `backend/database/seeds/seed.sql`.
7. Jalankan backend, buka halaman `/admin/login`, lalu gunakan token `ADMIN_SETUP_TOKEN` untuk membuat akun superadmin pertama. Setelah setup berhasil, kosongkan/nonaktifkan token setup dari environment dan restart backend.
8. Jalankan frontend dan backend dalam mode pengembangan.

## Identitas dan konten demo

Data awal memakai nama generik `Nama Sekolah Anda`, alamat kosong/placeholder, dan contoh teks yang harus diganti melalui dashboard. Ilustrasi demo berada di `frontend/public/demo/` agar tidak bergantung pada layanan foto pihak ketiga.

Untuk penggunaan produksi, pemilik instalasi harus memasukkan data sekolahnya sendiri, mengunggah logo dan foto yang memiliki hak penggunaan, mengatur domain, serta mengamankan konfigurasi server dan database.

## Catatan keamanan

- Jangan menggunakan kredensial demo pada server publik.
- Jangan menjalankan seed atau reset database terhadap database produksi.
- Buat cadangan database sebelum menjalankan migrasi pada instalasi yang sudah berisi data.
- Jangan menyimpan file dokumen pendaftar pada direktori publik.
- Jangan commit file `.env`, kredensial, atau data pribadi.
