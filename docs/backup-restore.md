# Prosedur Backup dan Uji Restore Database

Dokumen ini hanya panduan operasional. Perintah restore di bawah menggunakan **database pengujian terpisah** dan tidak menimpa database aktif. Jangan menghapus backup lama atau menjalankan restore ke database produksi untuk pengujian.

## 1. Persiapan

Pastikan MySQL client tersedia:

```bash
mysqldump --version
mysql --version
gzip --version
```

Muat variabel konfigurasi tanpa menampilkan isinya ke terminal:

```bash
set -a
source backend/.env
set +a
```

Periksa bahwa `DB_HOST`, `DB_USER`, dan `DB_NAME` sudah terisi. Jangan membagikan file `.env` atau password.

## 2. Membuat backup konsisten

```bash
mkdir -p backups
BACKUP_FILE="backups/${DB_NAME}_$(date +%Y%m%d_%H%M%S).sql.gz"

mysqldump \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  --password \
  --single-transaction \
  --routines \
  --triggers \
  --default-character-set=utf8mb4 \
  "$DB_NAME" | gzip > "$BACKUP_FILE"

gzip -t "$BACKUP_FILE"
ls -lh "$BACKUP_FILE"
```

Masukkan password MySQL saat diminta. Pastikan perintah selesai dengan exit code 0 dan `gzip -t` tidak melaporkan kerusakan. Simpan salinan backup di lokasi terpisah yang aksesnya dibatasi.

## 3. Uji restore tanpa menyentuh database produksi

Pilih nama database pengujian yang belum digunakan, misalnya `web_sekolah_restore_test`. Pastikan akun MySQL memiliki izin membuat database pengujian.

```bash
RESTORE_DB="web_sekolah_restore_test"
BACKUP_FILE="GANTI_DENGAN_PATH_BACKUP.sql.gz"

mysql \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  --password \
  -e "CREATE DATABASE \`$RESTORE_DB\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

gunzip -c "$BACKUP_FILE" | mysql \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  --password \
  "$RESTORE_DB"
```

Ganti `BACKUP_FILE` dengan path backup yang benar. Masukkan password saat diminta. Jangan arahkan perintah restore ke `$DB_NAME` atau database produksi.

## 4. Verifikasi hasil restore

```bash
mysql \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  --password \
  "$RESTORE_DB" \
  -e "SHOW TABLES; SELECT COUNT(*) AS total_admin FROM admins; SELECT COUNT(*) AS total_profile FROM school_profile;"
```

Bandingkan jumlah tabel dan beberapa jumlah record dengan sumber backup. Untuk uji yang lebih lengkap, periksa juga berita, guru, galeri, agenda, program, PPDB, serta relasi yang relevan.

## 5. Kriteria lulus

- File backup ada, ukurannya masuk akal, dan lolos `gzip -t`.
- Database pengujian berhasil dibuat dan diisi dari backup.
- Tabel wajib tersedia dan query verifikasi berhasil.
- Data penting cocok dengan sumber backup.
- Aplikasi dapat membaca database hasil restore setelah konfigurasi pengujian diarahkan secara terisolasi.

**Status:** dokumentasi tersedia; backup dan restore aktual tetap harus dijalankan oleh operator pada lingkungan yang memiliki akses database. Jangan menganggap dokumentasi ini sebagai bukti restore telah berhasil.
