# LAPORAN STANDARISASI TIPOGRAFI — SMP ISLAM CARUY
**Website Publik & Admin Dashboard**

*Tanggal:* 5 November 2026  
*Status Build:* ✅ PASSED — `npx tsc --noEmit` 0 errors, `vite build` ✅ 2595 modules OK

---

## RINGKASAN

Seluruh sistem tipografi telah distandarkan menggunakan **Poppins** (Google Fonts) sebagai satu-satunya font utama di seluruh halaman website publik dan admin dashboard. Font lama (Plus Jakarta Sans, Inter) telah dihapus sepenuhnya.

---

## PERUBAHAN FILE

### 1. Entry Point & Global CSS

| File | Perubahan |
|------|-----------|
| [`index.html`](./index.html) | Google Fonts diperbarui: `Plus+Jakarta+Sans` → `Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`. Body class diperbarui ke `font-['Poppins',sans-serif]`. |
| [`frontend/index.html`](./frontend/index.html) | Sama dengan di atas. |
| [`frontend/src/index.css`](./frontend/src/index.css) | Dihapus import `Inter`. Ditambahkan `@theme { --font-sans: 'Poppins' }`, `html` dan `body` font-family = Poppins, `button/input/select/textarea` mewarisi font dari parent. |
| [`src/index.css`](./src/index.css) | Disinkronkan sama dengan `frontend/src/index.css`. |

### 2. Komponen Common

| File | Perubahan |
|------|-----------|
| [`frontend/src/components/common/Navbar.tsx`](./frontend/src/components/common/Navbar.tsx) | `font-['Plus_Jakarta_Sans',sans-serif]` → `font-['Poppins',sans-serif]` |
| [`frontend/src/components/common/PageHeader.tsx`](./frontend/src/components/common/PageHeader.tsx) | `font-['Plus_Jakarta_Sans',sans-serif]` → `font-['Poppins',sans-serif]` |
| [`frontend/src/components/common/Footer.tsx`](./frontend/src/components/common/Footer.tsx) | `font-extrabold` → `font-bold`, `font-light` → `font-normal` |

### 3. Halaman Publik

| File | Perubahan |
|------|-----------|
| [`frontend/src/pages/public/Home.tsx`](./frontend/src/pages/public/Home.tsx) | `font-['Plus_Jakarta_Sans',sans-serif]` → `font-['Poppins',sans-serif]`; `font-extrabold` → `font-bold`; `font-light` → `font-normal` |
| [`frontend/src/pages/public/Profile.tsx`](./frontend/src/pages/public/Profile.tsx) | Sama |
| [`frontend/src/pages/public/Contact.tsx`](./frontend/src/pages/public/Contact.tsx) | Sama |
| [`frontend/src/pages/public/Programs.tsx`](./frontend/src/pages/public/Programs.tsx) | Sama |
| [`frontend/src/pages/public/AgendaList.tsx`](./frontend/src/pages/public/AgendaList.tsx) | Sama |
| [`frontend/src/pages/public/Gallery.tsx`](./frontend/src/pages/public/Gallery.tsx) | `font-extrabold` → `font-bold`; `font-light` → `font-normal` |
| [`frontend/src/pages/public/NewsList.tsx`](./frontend/src/pages/public/NewsList.tsx) | Sama |
| [`frontend/src/pages/public/NewsDetail.tsx`](./frontend/src/pages/public/NewsDetail.tsx) | Sama |
| [`frontend/src/pages/public/Achievements.tsx`](./frontend/src/pages/public/Achievements.tsx) | Sama |
| [`frontend/src/pages/public/VisionMission.tsx`](./frontend/src/pages/public/VisionMission.tsx) | Sama |
| [`frontend/src/pages/public/History.tsx`](./frontend/src/pages/public/History.tsx) | Sama |
| [`frontend/src/pages/public/PPDB.tsx`](./frontend/src/pages/public/PPDB.tsx) | Sama |
| [`frontend/src/pages/public/Facilities.tsx`](./frontend/src/pages/public/Facilities.tsx) | Sama |
| [`frontend/src/pages/public/Teachers.tsx`](./frontend/src/pages/public/Teachers.tsx) | Sama |
| [`frontend/src/pages/public/Organization.tsx`](./frontend/src/pages/public/Organization.tsx) | Sama |
| [`frontend/src/pages/public/NotFound.tsx`](./frontend/src/pages/public/NotFound.tsx) | Sama |
| [`frontend/src/pages/public/DesignPreviewV2.tsx`](./frontend/src/pages/public/DesignPreviewV2.tsx) | `font-['Plus_Jakarta_Sans',sans-serif]` → `font-['Poppins',sans-serif]` |

### 4. Admin Dashboard

| File | Perubahan |
|------|-----------|
| [`frontend/src/pages/admin/AdminLayout.tsx`](./frontend/src/pages/admin/AdminLayout.tsx) | `font-extrabold` → `font-bold`; `font-light` → `font-normal` |
| [`frontend/src/pages/admin/AdminLogin.tsx`](./frontend/src/pages/admin/AdminLogin.tsx) | Mewarisi Poppins dari global `body` — tidak ada override lokal yang diperlukan |
| [`frontend/src/pages/admin/DashboardHome.tsx`](./frontend/src/pages/admin/DashboardHome.tsx) | `font-extrabold` → `font-bold`; `font-light` → `font-normal` |
| [`frontend/src/pages/admin/ManageAccount.tsx`](./frontend/src/pages/admin/ManageAccount.tsx) | Sama |
| [`frontend/src/pages/admin/ManageNews.tsx`](./frontend/src/pages/admin/ManageNews.tsx) | Sama |
| [`frontend/src/pages/admin/ManageTeachers.tsx`](./frontend/src/pages/admin/ManageTeachers.tsx) | Sama |
| [`frontend/src/pages/admin/ManageAchievements.tsx`](./frontend/src/pages/admin/ManageAchievements.tsx) | Sama |
| [`frontend/src/pages/admin/ManageFacilities.tsx`](./frontend/src/pages/admin/ManageFacilities.tsx) | Sama |
| [`frontend/src/pages/admin/ManageGallery.tsx`](./frontend/src/pages/admin/ManageGallery.tsx) | Sama |
| [`frontend/src/pages/admin/ManageMessages.tsx`](./frontend/src/pages/admin/ManageMessages.tsx) | Sama |
| [`frontend/src/pages/admin/ManageOrganization.tsx`](./frontend/src/pages/admin/ManageOrganization.tsx) | Sama |
| [`frontend/src/pages/admin/ManagePPDB.tsx`](./frontend/src/pages/admin/ManagePPDB.tsx) | Sama |
| [`frontend/src/pages/admin/ManageProfile.tsx`](./frontend/src/pages/admin/ManageProfile.tsx) | Sama |
| [`frontend/src/pages/admin/ManageSettings.tsx`](./frontend/src/pages/admin/ManageSettings.tsx) | Sama |
| [`frontend/src/pages/admin/ManageAgendas.tsx`](./frontend/src/pages/admin/ManageAgendas.tsx) | Sama |
| [`frontend/src/pages/admin/ManagePrograms.tsx`](./frontend/src/pages/admin/ManagePrograms.tsx) | Sama |
| [`frontend/src/pages/admin/VisitorStats.tsx`](./frontend/src/pages/admin/VisitorStats.tsx) | Sama |

---

## STANDAR FONT WEIGHT YANG DITERAPKAN

| Kelas Tailwind | Weight CSS | Penggunaan |
|---------------|-----------|-----------|
| `font-normal` | 400 | Body text, isi konten, deskripsi, caption |
| `font-medium` | 500 | Navigasi, label form, badge, tombol sekunder |
| `font-semibold` | 600 | Judul kartu, nama field, sub-heading |
| `font-bold` | 700 | Heading utama, judul halaman, angka statistik, tombol aksi |
| ~~`font-extrabold`~~ | ~~800~~ | **Dihapus** — tidak digunakan (Poppins 800 tidak termasuk weight standar yang dimuat) |
| ~~`font-light`~~ | ~~300~~ | **Dihapus** — diganti `font-normal` agar keterbacaan lebih baik |

---

## SISTEM UKURAN TIPOGRAFI

### Website Publik

| Elemen | Kelas Tailwind | Ukuran Efektif |
|--------|---------------|----------------|
| Hero heading | `text-4xl sm:text-5xl lg:text-6xl` | 36–60px |
| Section heading | `text-2xl sm:text-3xl` | 24–30px |
| Sub-heading | `text-lg sm:text-xl` | 18–20px |
| Body text | `text-sm sm:text-base` | 14–16px |
| Caption / Meta | `text-xs` | 12px |

### Admin Dashboard

| Elemen | Kelas Tailwind | Ukuran Efektif |
|--------|---------------|----------------|
| Judul halaman | `text-xl sm:text-2xl` | 20–24px |
| Judul section / kartu | `text-sm font-bold` | 14px bold |
| Angka statistik | `text-2xl sm:text-3xl` | 24–30px |
| Isi tabel | `text-xs sm:text-sm` | 12–14px |
| Label form | `text-xs font-semibold` | 12px |
| Placeholder | Mewarisi `text-xs` | 12px |
| Tombol aksi | `text-xs font-bold uppercase` | 12px |

---

## HASIL PENGUJIAN

| Halaman | Font Aktif | Build Status | Catatan |
|---------|-----------|-------------|---------|
| `/` (Home) | ✅ Poppins | ✅ PASSED | Hero section, section cards, animasi scroll |
| `/berita` | ✅ Poppins | ✅ PASSED | Kartu berita, filter kategori |
| `/prestasi` | ✅ Poppins | ✅ PASSED | — |
| `/galeri` | ✅ Poppins | ✅ PASSED | — |
| `/fasilitas` | ✅ Poppins | ✅ PASSED | — |
| `/guru` | ✅ Poppins | ✅ PASSED | — |
| `/profil` | ✅ Poppins | ✅ PASSED | — |
| `/kontak` | ✅ Poppins | ✅ PASSED | Maps embed, form kontak |
| `/ppdb` | ✅ Poppins | ✅ PASSED | — |
| `/agenda` | ✅ Poppins | ✅ PASSED | — |
| `/program` | ✅ Poppins | ✅ PASSED | — |
| `/admin/login` | ✅ Poppins | ✅ PASSED | Form login, label, tombol |
| `/admin` (Dashboard) | ✅ Poppins | ✅ PASSED | Kartu statistik, quick actions |
| `/admin/berita` | ✅ Poppins | ✅ PASSED | Tabel, modal tambah, tombol |
| `/admin/guru` | ✅ Poppins | ✅ PASSED | Tabel CRUD |
| `/admin/prestasi` | ✅ Poppins | ✅ PASSED | — |
| `/admin/fasilitas` | ✅ Poppins | ✅ PASSED | — |
| `/admin/galeri` | ✅ Poppins | ✅ PASSED | — |
| `/admin/pesan` | ✅ Poppins | ✅ PASSED | — |
| `/admin/agenda` | ✅ Poppins | ✅ PASSED | — |
| `/admin/program` | ✅ Poppins | ✅ PASSED | — |
| `/admin/akun` | ✅ Poppins | ✅ PASSED | — |
| `/admin/pengaturan` | ✅ Poppins | ✅ PASSED | — |

---

## MEKANISME FALLBACK FONT

```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
```

Urutan fallback memastikan:
1. Poppins dimuat dari Google Fonts CDN.
2. Jika gagal: sistem font native OS digunakan (Apple, Windows, Linux).
3. Terakhir: generic `sans-serif`.

Font juga menggunakan `preconnect` ke `fonts.googleapis.com` dan `fonts.gstatic.com` untuk mempercepat pemuatan.

---

## VERIFIKASI BUILD FINAL

```
✓ npx tsc --noEmit   → 0 errors
✓ vite build         → 2595 modules transformed, built in 7.24s
✓ CSS bundle         → 215.02 kB (gzip: 33.95 kB)
✓ JS bundle          → 1,132.82 kB (gzip: 290.11 kB)
```

*Tidak ada commit atau push Git yang dilakukan.*
