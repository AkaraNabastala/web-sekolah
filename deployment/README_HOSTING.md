# Panduan Deployment SMP Islam Caruy

Paket ini dirancang untuk hosting berbasis Node.js (cPanel Node.js Selector, VPS Ubuntu/Debian, Docker, Railway, dsb.).

## 1. Persiapan Environment
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan nilai variabel lingkungan dengan konfigurasi hosting/database Anda.

## 2. Instalasi Dependensi
Jalankan di server hosting:
```bash
npm install --omit=dev
```

## 3. Menjalankan Aplikasi
```bash
npm start
```
Aplikasi akan aktif melayani website publik dan API pada port yang ditentukan (default 3000).

## 4. Setup Administrator Pertama
Jika database baru dibuat dan belum memiliki admin:
```bash
npm run setup-admin
```
