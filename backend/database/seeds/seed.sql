-- ==============================================================================
-- SEED DATA STRUKTUR AWAL: SMP ISLAM CARUY (MySQL 8.0+)
-- Catatan Keamanan: Tidak menyertakan akun admin default atau kredensial bawaan.
-- Pembuatan akun administrator pertama dilakukan secara aman via CLI / Setup Web.
-- ==============================================================================

-- 1. Profil Sekolah (Data Standar / Placeholder Resmi)
INSERT INTO `school_profile` (
  `id`, `name`, `npsn`, `education_level`, `status`, `accreditation`, `founding_year`,
  `headmaster_name`, `headmaster_photo`, `headmaster_welcome`, `description`,
  `address`, `village`, `district`, `regency`, `province`, `postal_code`,
  `phone`, `whatsapp`, `email`, `maps_embed_url`
) VALUES (
  1,
  'SMP Islam Caruy',
  '-',
  'Sekolah Menengah Pertama (SMP)',
  'Swasta',
  'Dalam Proses Pembaruan',
  '-',
  'Kepala Sekolah SMP Islam Caruy',
  NULL,
  'Sambutan kepala sekolah sedang dalam tahap penyesuaian dokumen resmi.',
  'SMP Islam Caruy adalah lembaga pendidikan menengah pertama swasta bernuansa Islami di Kecamatan Cipari, Kabupaten Cilacap.',
  'Desa Caruy, Kec. Cipari, Kabupaten Cilacap',
  'Desa Caruy',
  'Kec. Cipari',
  'Kab. Cilacap',
  'Jawa Tengah',
  '53262',
  '-',
  '-',
  '-',
  NULL
) ON DUPLICATE KEY UPDATE `name`=`name`;

-- 2. Kategori Berita Awal
INSERT INTO `news_categories` (`id`, `name`, `slug`, `description`)
VALUES
  (1, 'Berita Sekolah', 'berita-sekolah', 'Kabar kegiatan dan dinamika civitas akademika SMP Islam Caruy.'),
  (2, 'Prestasi Santri', 'prestasi-santri', 'Pencapaian siswa di bidang keagamaan, akademik, dan ekstrakurikuler.'),
  (3, 'Pengumuman Resmi', 'pengumuman-resmi', 'Informasi resmi akademik, kalender kegiatan, dan edaran sekolah.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Pengaturan Dasar Website
INSERT INTO `website_settings` (
  `id`, `school_name`, `tagline`, `logo_url`, `favicon_url`,
  `hero_title`, `hero_subtitle`, `primary_color`, `secondary_color`,
  `seo_title`, `seo_description`, `footer_text`
) VALUES (
  1,
  'SMP Islam Caruy',
  'Membentuk Generasi Berkarakter Qurani, Cerdas & Berakhlakul Karimah',
  '/src/assets/logo.png',
  '/src/assets/logo.png',
  'Selamat Datang di Portal Resmi SMP Islam Caruy',
  'Lembaga pendidikan tingkat pertama terpadu yang memadukan keunggulan akademik dengan kedalaman nilai akhlakul karimah dan tahfidz Al-Quran.',
  '#15803D',
  '#EAB308',
  'SMP Islam Caruy - Website Resmi Profil & Informasi Pendidikan',
  'Portal resmi informasi, profil, akademik, dan pendaftaran peserta didik baru (PPDB) SMP Islam Caruy, Cipari, Cilacap.',
  '© SMP Islam Caruy. Seluruh hak cipta dilindungi undang-undang.'
) ON DUPLICATE KEY UPDATE `school_name`=VALUES(`school_name`);
