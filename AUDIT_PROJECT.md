# LAPORAN AUDIT PROYEK — WEBSITE RESMI SMP ISLAM CARUY
**Tanggal Audit:** 3 November 2026  
**Lokasi Proyek:** `/home/darksky/projects/web-sekolah`  
**Status Backup:** Berhasil dibuat di `backup_snapshot/` (semua file, struktur kode, skema SQL, dan seed).

---

## 1. Ringkasan Audit dan Temuan Utama

| Komponen / Aspek | Kondisi Saat Ini | Masalah yang Ditemukan | Rencana Aksi Rekonstruksi |
|---|---|---|---|
| **Struktur Direktori** | Monolitik hibrid (`server.ts` Express melayani SPA Vite dalam satu root) | Frontend dan backend tercampur dalam satu `package.json` root. Tidak ada pemisahan port/service independen yang modular. | Pisahkan struktur menjadi `frontend/` dan `backend/` dengan `package.json`, TypeScript config, dan script masing-masing. |
| **Identitas & Residu Proyek Lama** | Sisa identitas Nota Hidup terdeteksi di `index.html` (`<title>Nota Hidup</title>`) dan `package.json` (`web-notahidup`) | Ketergantungan lama pada prototype Nota Hidup masih ada pada metadata aplikasi. | Bersihkan seluruh identitas Nota Hidup, ubah judul, metadata SEO, package name menjadi SMP Islam Caruy secara menyeluruh. |
| **Kredensial & Autentikasi Demo** | Akun demo `admin` / `adminCaruy2026!` ditanam di `AdminLogin.tsx`, `backend/src/db/index.ts`, dan `database/seeds/seed.sql` | Kelemahan keamanan krusial: password bawaan terpampang di form login dan di-hardcode di file database seed. | Hapus kredensial hardcoded dari form login. Buat endpoint aman `POST /api/setup/admin` yang hanya aktif jika belum ada admin terdaftar di database MySQL, kemudian terkunci permanen. |
| **Penyimpanan Data & Database** | Terdapat `database/data.json` sebagai fallback engine dan MySQL 8 di `database.ts` | Penyimpanan berbasis JSON masih terpakai aktif. Perlu migrasi agar MySQL menjadi satu-satunya sumber data utama aplikasi dengan koneksi dan query murni. | Jadikan MySQL sebagai data layer utama dengan pooling, parameterized queries, migrasi terstruktur, dan cegah dependensi ke file JSON sebagai database produksi. |
| **Sistem Statistik Pengunjung** | Hanya ada `visitor_logs` sederhana tanpa identifikasi pengunjung unik (unique visitors), sessions, device/browser parsing, dan tidak ada export laporan. | Belum memenuhi kriteria akurasi: metrik unique visitor, session duration, bot filtering, visual chart analitik, dan export file Excel (XLSX) / CSV belum ada. | Rancang tabel baru `visitor_sessions` dan `visitor_pageviews` dengan hash anonim privasi (SHA-256 IP salt per hari + User-Agent), sistem session timeout, dashboard analytics lengkap, dan fitur download report XLSX/CSV. |
| **Navigasi & UI/UX** | Semua menu dan submenu di navbar flat/berjejal, submenu profil ditampilkan sebagai daftar panjang di halaman utama. | Pengalaman navigasi membingungkan, belum ada dropdown/mega-menu bertingkat dengan active state dan accordion mobile yang rapi. | Rancang ulang Navbar: Menu utama bersih dengan dropdown elegan untuk Profil Sekolah, Informasi, dan Galeri. Mobile navigation dengan accordion menu. Setiap submenu memiliki rute mandiri. |
| **Data Contoh / Fiktif** | Beberapa data masih menggunakan placeholder (misal nomor registrasi, nama sampel tertentu) | Konten resmi sekolah belum seluruhnya terisi dan tidak boleh dikarang. | Berikan state *Informasi Resmi Belum Tersedia / Sedang Dalam Pembaruan* untuk bagian yang belum diisi pihak sekolah, serta berikan formulir input langsung di Dashboard Admin. |

---

## 2. Rincian Temuan Kredensial Hardcoded & Residu
1. **`index.html`**:
   - Baris 8: `<title>Nota Hidup</title>`
   - Baris 10: `<meta property="og:title" content="Nota Hidup" />`
2. **`package.json`**:
   - `"name": "web-notahidup"`
   - `"homepage": "https://github.com/AkaraNabastala/Web_NotaHidup.git"`
3. **`src/pages/admin/AdminLogin.tsx`**:
   - `const [password, setPassword] = useState('adminCaruy2026!');`
   - Boks teks helper login menampilkan password `adminCaruy2026!`.
4. **`backend/src/db/index.ts`** & **`database/seeds/seed.sql`**:
   - Menginisialisasi user `admin` dengan hash default `adminCaruy2026!`.

---

## 3. Rencana Restrukturisasi Folder (Target Tahap 2)
```text
web-smp-islam-caruy/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   └── admin/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── server.ts
│   ├── uploads/
│   └── package.json
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── .env.example
├── .gitignore
├── AUDIT_PROJECT.md
└── README.md
```

---

## 4. Kesimpulan Audit
Audit telah selesai dan snapshot backup telah diamankan. Rekonstruksi akan dilanjutkan ke Tahap 2 (Restrukturisasi Frontend & Backend), Tahap 3 (Pembersihan Data Demo & Kredensial), Tahap 4 (Database MySQL & Backend Terstruktur), Tahap 5 (Setup Admin Aman & Autentikasi), Tahap 6 (Statistik Pengunjung & Export XLSX/CSV), dan Tahap 7 (Navigasi Dropdown & UI/UX).
