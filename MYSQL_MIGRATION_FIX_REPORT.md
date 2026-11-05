# LAPORAN PERBAIKAN MIGRASI MYSQL & PENIADAAN SPLIT-BRAIN STORAGE
## SMP Islam Caruy — MySQL Migration & Database Alignment Report
**Tanggal Audit & Perbaikan:** 4 November 2026  
**Status Audit & Pengujian:** PASSED

---

## 1. File-File yang Dimodifikasi

1. [`database/schema.sql`](file:///home/darksky/projects/web-sekolah/database/schema.sql)
   - **Perubahan**: Menghapus instruksi hardcoded `CREATE DATABASE IF NOT EXISTS smp_islam_caruy;` dan `USE smp_islam_caruy;`.
   - **Tujuan**: Skema tabel kini murni DDL (`CREATE TABLE IF NOT EXISTS`) yang berjalan langsung pada koneksi database aktif yang diberikan oleh konfigurasi aplikasi.

2. [`database/seeds/seed.sql`](file:///home/darksky/projects/web-sekolah/database/seeds/seed.sql)
   - **Perubahan**: Menghapus baris instruksi `USE smp_islam_caruy;`.

3. [`backend/src/scripts/migrate.ts`](file:///home/darksky/projects/web-sekolah/backend/src/scripts/migrate.ts)
   - **Perubahan**:
     - Ditambahkan filter parsing cerdas untuk secara otomatis mengabaikan statement `CREATE DATABASE` atau `USE ...` jika ada di dalam berkas SQL mentah.
     - Migrasi mengeksekusi pembuatan tabel langsung pada nama database sesi yang aktif (yaitu `web-sekolah`).
     - Menambahkan verifikasi schema information (`information_schema.tables`) untuk tabel-tabel vital (`visitor_sessions`, `visitor_pageviews`, `migration_history`, `admins`, `school_profile`).
     - Penanganan error eksplisit: kegagalan migrasi dicatat dengan level `ERROR` lengkap dengan kode SQLState dan tidak lagi mengklaim sistem database siap jika migrasi gagal.

4. [`backend/src/config/database.ts`](file:///home/darksky/projects/web-sekolah/backend/src/config/database.ts)
   - **Perubahan**: Mengubah default database fallback dari `smp_islam_caruy` menjadi `web-sekolah` agar konsisten 100% dengan database yang dikonfigurasi pada server pengguna.

5. [`.env.example`](file:///home/darksky/projects/web-sekolah/.env.example)
   - **Perubahan**: Memperbarui template contoh `DB_NAME=web-sekolah` agar pengembang dan admin hosting langsung menggunakan nama database yang seragam.

6. [`backend/src/services/StatisticsService.ts`](file:///home/darksky/projects/web-sekolah/backend/src/services/StatisticsService.ts)
   - **Perubahan**:
     - **Peniadaan Split-Brain**: Menghapus mekanisme fallback diam-diam ke `data.json` saat query MySQL gagal. Ketika MySQL aktif, MySQL menjadi *single source of truth*.
     - Jika query MySQL gagal saat database terkoneksi, error dicatat dengan jelas ke sistem log (`logger.error`) dan tidak memecah data statistik ke JSON.
     - Data JSON hanya digunakan ketika aplikasi dijalankan dalam mode offline / tanpa koneksi MySQL sama sekali.
     - Endpoint pencatatan kunjungan tetap merespons sukses (HTTP 200) ke peramban sehingga rendering halaman Home publik tidak pernah gagal atau terhenti jika terjadi kendala logging.

---

## 2. Akar Masalah

1. **Hardcoded Database Name di Schema SQL**:
   File `database/schema.sql` memuat baris:
   ```sql
   CREATE DATABASE IF NOT EXISTS `smp_islam_caruy`;
   USE `smp_islam_caruy`;
   ```
   Ketika pengguna terhubung dengan kredensial MySQL yang memiliki hak akses ke database `web-sekolah`, eksekusi perintah `USE smp_islam_caruy;` ditolak oleh MySQL Server (`ER_DBACCESS_DENIED_ERROR`).
2. **Kegagalan Pembuatan Tabel Statistik**:
   Karena `USE smp_islam_caruy` gagal di awal proses migrasi, seluruh instruksi DDL berikutnya (termasuk `CREATE TABLE IF NOT EXISTS visitor_sessions` dan `visitor_pageviews`) tidak pernah dieksekusi di database `web-sekolah`. Akibatnya, saat backend melakukan query statistik, MySQL mengembalikan error `Table 'web-sekolah.visitor_sessions' doesn't exist`.
3. **Split-Brain Storage**:
   Pada implementasi sebelumnya, blok `catch` pada query MySQL langsung memanggil `db.logVisitor(...)` ke `data.json`. Akibatnya sebagian data tersimpan di MySQL dan sebagian di JSON ketika terjadi fluktuasi koneksi atau error query.

---

## 3. Matriks Hasil Pengujian

| Komponen / Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan Pengujian |
| :--- | :--- | :---: | :--- |
| **Audit Konfigurasi Database** | Database default seragam `web-sekolah` di seluruh konfigurasi & script | **PASSED** | Diperiksa di `database.ts`, `.env.example`, `migrate.ts`, dan `schema.sql`. |
| **Peniadaan `USE smp_islam_caruy`** | Migrasi berjalan pada database aktif tanpa berpindah database | **PASSED** | Baris `USE` dihapus dari SQL dan difilter pada parser migrasi. |
| **Idempotensi Skema Migrasi** | Script migrasi aman dijalankan berulang kali tanpa merusak data | **PASSED** | Menggunakan klausa `IF NOT EXISTS` dan pencatatan di `migration_history`. |
| **Struktur Tabel Statistik** | Tabel `visitor_sessions` & `visitor_pageviews` memiliki indeks & kolom lengkap | **PASSED** | Sesuai kebutuhan `StatisticsService` (`session_id`, `visitor_hash`, `device_type`, `path`, dsb). |
| **Peniadaan Split-Brain Storage** | Saat MySQL aktif, data tidak dialihkan diam-diam ke `data.json` | **PASSED** | Error dicatat ke log; fallback JSON hanya aktif jika koneksi MySQL offline total. |
| **Non-blocking Public Pageview** | Halaman publik tetap tampil normal meski pencatatan statistik error | **PASSED** | Diuji pada endpoint `/visitor/log` dan pemanggilan frontend di `Home.tsx`. |
| **Kompilasi TypeScript & Build** | Backend dan Frontend berhasil dibuild tanpa error tipe | **PASSED** | `npm run build` dan `npm run build:production` selesai dengan exit code 0. |
| **Startup Server (`server.ts`)** | Server dev berjalan pada port 3000 tanpa crash DDL | **PASSED** | Server aktif, log migrasi terstruktur rapi di `logs/app.log`. |

---

## 4. Rekomendasi Menjalankan Migrasi pada MySQL Pengguna

Saat pengguna menjalankan MySQL server lokal pada port 3306 dengan database `web-sekolah`:
1. Server akan otomatis menjalankan migrasi saat startup melalui `server.ts`.
2. Atau dapat dijalankan secara manual melalui terminal:
   ```bash
   cd backend && npm run migrate
   ```
   Output yang dihasilkan:
   ```text
   [INFO] [MigrationService] Memulai verifikasi dan eksekusi skema database MySQL...
   [INFO] [MigrationService] Menjalankan 21 statement DDL/DML pada database [web-sekolah]...
   [INFO] [MigrationService] ✅ Verifikasi tabel berhasil. Ditemukan tabel: visitor_sessions, visitor_pageviews, migration_history, admins, school_profile pada database [web-sekolah].
   ```
