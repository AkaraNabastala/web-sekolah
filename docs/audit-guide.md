# Panduan Audit Website SMP Islam Caruy

Perintah: npm run audit:all

Atur AUDIT_BASE_URL bila backend berjalan di alamat lain, contoh: AUDIT_BASE_URL=http://127.0.0.1:3000 npm run audit:all

Runner hanya membaca source, menjalankan build, dan mengirim HTTP GET. Runner TIDAK membuat/menghapus akun, TIDAK mengubah database, dan TIDAK mengirim payload serangan.

Fixture scripts/audit-fixtures.json hanya contoh data dummy, bukan seed otomatis. Sebelum uji CRUD mutatif, buat database MySQL terpisah (misalnya web_sekolah_audit_test) dan user database khusus. Jangan pernah arahkan tes mutatif ke database produksi. Jangan memasukkan password asli atau isi .env ke laporan.

Batasan: baseline ini bukan sertifikasi keamanan. Uji browser responsif, aksesibilitas, matriks peran, upload signature, SQL injection/XSS terkontrol, dan backup/restore membutuhkan tahap terpisah.
