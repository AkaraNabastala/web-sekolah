-- ============================================================
-- SEED DATA: SMP ISLAM CARUY (MySQL 8.0+)
-- ============================================================

USE `smp_islam_caruy`;

-- 1. Initial Superadmin (Default demo password: adminCaruy2026!)
INSERT INTO `admins` (`id`, `username`, `email`, `password`, `full_name`, `avatar`, `role`, `is_active`)
VALUES (
  1,
  'admin',
  'admin@smpislamcaruy.sch.id',
  '$2a$10$p0b3P2VlC3Zf7U0v0W2U1u2cK6f0O9z.4u.6l7I1B0j/Vb1x3qHnO',
  'Administrator SMP Islam Caruy',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  'superadmin',
  1
) ON DUPLICATE KEY UPDATE `username`=`username`;

-- 2. School Profile
INSERT INTO `school_profile` (
  `id`, `name`, `npsn`, `education_level`, `status`, `accreditation`, `founding_year`,
  `headmaster_name`, `headmaster_photo`, `headmaster_welcome`, `description`,
  `address`, `village`, `district`, `regency`, `province`, `postal_code`,
  `phone`, `whatsapp`, `email`, `maps_embed_url`
) VALUES (
  1,
  'SMP Islam Caruy',
  '20301988',
  'Sekolah Menengah Pertama (SMP)',
  'Swasta',
  'A (Unggul)',
  '2005',
  'Drs. H. Ahmad Fauzi, M.Pd.I',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
  'Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nPuji syukur senantiasa kita panjatkan ke hadirat Allah SWT atas limpahan rahmat, taufik, serta hidayah-Nya. Selamat datang di portal resmi SMP Islam Caruy.\n\nSebagai lembaga pendidikan Islam yang berkomitmen mencetak generasi berkarakter Qurani, cerdas intelektual, dan berakhlakul karimah, kami terus berinovasi dalam mengintegrasikan kurikulum nasional terpadu dengan nilai-nilai kepesantrenan. Didukung oleh tenaga pendidik yang berdedikasi, fasilitas belajar representatif, serta iklim sekolah yang asri dan agamis, kami siap mendampingi putra-putri Anda meraih masa depan gemilang.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.',
  'SMP Islam Caruy adalah lembaga pendidikan menengah pertama swasta bernuansa Islami yang berlokasi di Desa Caruy, Kecamatan Cipari, Kabupaten Cilacap. Didirikan dengan visi mewujudkan generasi yang teguh dalam aqidah, unggul dalam ilmu pengetahuan dan teknologi (IPTEK), serta santun dalam budi pekerti.',
  'Jl. Raya Caruy No. 12, Desa Caruy, Kec. Cipari, Kabupaten Cilacap',
  'Desa Caruy',
  'Kec. Cipari',
  'Kab. Cilacap',
  'Jawa Tengah',
  '53262',
  '0821-3297-2773',
  '6282132972773',
  'info@smpislamcaruy.sch.id',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5118991443423!2d108.7885!3d-7.4206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjUnMTQuMiJTIDEwOMKwNDcnMTguNiJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid'
) ON DUPLICATE KEY UPDATE `name`=`name`;

-- 3. School History
INSERT INTO `school_history` (`id`, `title`, `content`, `featured_image`, `milestones`)
VALUES (
  1,
  'Langkah Panjang Mengabdi: Sejarah Berdirinya SMP Islam Caruy',
  'SMP Islam Caruy didirikan atas prakarsa tokoh agama, tokoh masyarakat, dan cendekiawan muslim di wilayah Desa Caruy dan sekitarnya pada tahun 2005. Kala itu, masyarakat mendambakan lembaga pendidikan tingkat menengah pertama yang mampu memadukan kecakapan akademis umum dengan pembinaan keagamaan Islam secara mendalam.\n\nBerawal dari gedung sederhana dengan sarana yang terbatas namun berlimpah semangat ikhlas beramal, para pendiri meletakkan pondasi tarbiyah Islamiyyah yang kokoh. Dari tahun ke tahun, kepercayaan masyarakat terus tumbuh pesat seiring dengan prestasi siswa baik di bidang akademik maupun keagamaan seperti Tahfidzul Quran, pidato bahasa Arab dan Inggris, serta sains madrasah/sekolah.\n\nHingga saat ini, SMP Islam Caruy telah meluluskan ribuan alumni yang tersebar di berbagai SMA/SMK/MA unggulan dan perguruan tinggi, mengabdi di berbagai bidang kehidupan dengan tetap memegang teguh identitas muslim yang berakhlak mulia.',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
  JSON_ARRAY(
    JSON_OBJECT('year', '2005', 'title', 'Pendirian Sekolah', 'desc', 'Prakarsa tokoh masyarakat dan ulama setempat mendirikan SMP Islam Caruy dengan 2 rombongan belajar perdana.'),
    JSON_OBJECT('year', '2010', 'title', 'Pembangunan Kampus Terpadu', 'desc', 'Peresmian gedung ruang kelas baru bertingkat, laboratorium IPA, dan Musholla At-Tarbiyah.'),
    JSON_OBJECT('year', '2016', 'title', 'Akreditasi A & Lab Komputer', 'desc', 'Meraih predikat Akreditasi A serta peluncuran Laboratorium Komputer untuk pembelajaran digital.'),
    JSON_OBJECT('year', '2021', 'title', 'Program Unggulan Tahfidz & Robotik', 'desc', 'Pengembangan program kelas unggulan Tahfidz Quran 3 Juz dan ekstrakurikuler sains modern.'),
    JSON_OBJECT('year', '2026', 'title', 'Era Smart Islamic School', 'desc', 'Implementasi sistem informasi sekolah terintegrasi, perpustakaan digital, dan kurikulum merdeka berbasis karakter Islami.')
  )
) ON DUPLICATE KEY UPDATE `title`=`title`;

-- 4. Vision & Mission
INSERT INTO `school_vision_mission` (`id`, `vision`, `vision_motto`, `missions`, `goals`, `core_values`)
VALUES (
  1,
  'Terwujudnya Generasi Muslim yang Berakhlakul Karimah, Unggul dalam Prestasi Akademik dan Non-Akademik, Menguasai IPTEK, serta Berwawasan Lingkungan.',
  'Cerdas, Berkarakter, Berakhlak Mulia',
  JSON_ARRAY(
    'Menyelenggarakan pendidikan Islam yang berlandaskan Al-Quran dan As-Sunnah secara komprehensif.',
    'Membimbing dan melatih siswa agar memiliki hafalan Al-Quran dan mengamalkan adab Islami sehari-hari.',
    'Mengembangkan pembelajaran aktif, kreatif, efektif, dan menyenangkan berbasis teknologi informasi.',
    'Menumbuhkembangkan bakat, minat, dan potensi peserta didik melalui kegiatan ekstrakurikuler yang terarah.',
    'Membina kepekaan sosial dan kepedulian terhadap kelestarian lingkungan hidup di lingkungan sekolah dan masyarakat.'
  ),
  JSON_ARRAY(
    'Mencapai kelulusan 100% dengan nilai rata-rata asesmen yang kompetitif dan bermutu tinggi.',
    'Mencetak lulusan yang hafal minimal juz 30 Al-Quran serta tertib melaksanakan ibadah wajib dan sunnah.',
    'Meraih prestasi kejuaraan minimal tingkat kabupaten di bidang akademik, olahraga, seni, dan keagamaan setiap tahun.',
    'Terwujudnya lingkungan sekolah yang asri, bersih, ramah anak, dan bebas perundungan (anti-bullying).'
  ),
  JSON_ARRAY(
    JSON_OBJECT('title', 'Iman & Taqwa', 'icon', 'HeartHandshake', 'desc', 'Menjadikan nilai tauhid dan syariat Islam sebagai pondasi utama seluruh aspek kehidupan.'),
    JSON_OBJECT('title', 'Akhlakul Karimah', 'icon', 'Smile', 'desc', 'Menjunjung tinggi adab kesantunan kepada orang tua, guru, teman, dan lingkungan sekitar.'),
    JSON_OBJECT('title', 'Keunggulan Intelektual', 'icon', 'GraduationCap', 'desc', 'Semangat belajar tanpa henti, kritis, bernalar analitis, dan adaptif terhadap kemajuan zaman.'),
    JSON_OBJECT('title', 'Kemandirian & Disiplin', 'icon', 'ShieldCheck', 'desc', 'Membiasakan tanggung jawab, kejujuran, dan ketepatan waktu dalam setiap aktivitas.')
  )
) ON DUPLICATE KEY UPDATE `vision`=`vision`;

-- 8. News Categories
INSERT INTO `news_categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Berita Sekolah', 'berita-sekolah', 'Informasi terkini kegiatan dan peristiwa di lingkungan SMP Islam Caruy'),
(2, 'Prestasi Siswa', 'prestasi-siswa', 'Kabar kejuaraan dan pencapaian membanggakan para peserta didik'),
(3, 'Kegiatan Keagamaan', 'kegiatan-keagamaan', 'Dokumentasi peringatan PHBI, Tahfidz, dan kajian Islam'),
(4, 'Pengumuman Resmi', 'pengumuman-resmi', 'Surat edaran, kalender akademik, dan instruksi resmi sekolah'),
(5, 'Artikel Edukasi', 'artikel-edukasi', 'Karya tulis, opini guru, dan tips belajar untuk siswa dan orang tua')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- 14. PPDB Information
INSERT INTO `ppdb_information` (
  `id`, `academic_year`, `is_open`, `start_date`, `end_date`, `banner_image`,
  `overview`, `requirements`, `schedules`, `steps`, `show_fees`, `fees_description`,
  `fees_items`, `contact_person`, `contact_phone`, `contact_whatsapp`, `registration_url`
) VALUES (
  1,
  '2026/2027',
  1,
  '2026-03-01',
  '2026-07-15',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
  'Penerimaan Peserta Didik Baru (PPDB) SMP Islam Caruy Tahun Ajaran 2026/2027 telah dibuka! Kami mengajak putra-putri terbaik lulusan SD/MI untuk bergabung bersama keluarga besar SMP Islam Caruy. Tersedia beasiswa prestasi bagi siswa berprestasi akademik, tahfidz Al-Quran, dan yatim/dhuafa.',
  JSON_ARRAY(
    'Mengisi formulir pendaftaran online atau offline di sekretariat PPDB.',
    'Pas foto terbaru ukuran 3x4 berwarna (4 lembar).',
    'Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SD/MI yang telah dilegalisir (2 lembar).',
    'Fotokopi Akta Kelahiran peserta didik (2 lembar).',
    'Fotokopi Kartu Keluarga (KK) orang tua/wali (2 lembar).',
    'Fotokopi KTP kedua orang tua (masing-masing 2 lembar).',
    'Fotokopi piagam prestasi / sertifikat kejuaraan atau tahfidz (jika ada, untuk jalur beasiswa).'
  ),
  JSON_ARRAY(
    JSON_OBJECT('phase', 'Gelombang 1 (Jalur Prestasi & Minat Khusus)', 'period', '1 Maret 2026 - 30 April 2026', 'notes', 'Bebas biaya pendaftaran dan potongan biaya seragam 25%'),
    JSON_OBJECT('phase', 'Gelombang 2 (Jalur Reguler)', 'period', '1 Mei 2026 - 30 Juni 2026', 'notes', 'Pendaftaran dibuka selama kuota rombel masih tersedia'),
    JSON_OBJECT('phase', 'Tes Pemetaan & Wawancara Keagamaan', 'period', '5 Juli 2026', 'notes', 'Pemetaan baca Al-Quran, minat bakat, dan wawancara orang tua'),
    JSON_OBJECT('phase', 'Pengumuman Hasil Seleksi', 'period', '8 Juli 2026', 'notes', 'Diumumkan melalui website resmi dan papan pengumuman sekolah'),
    JSON_OBJECT('phase', 'Daftar Ulang & Pengambilan Seragam', 'period', '9 - 12 Juli 2026', 'notes', 'Sekretariat PPDB SMP Islam Caruy'),
    JSON_OBJECT('phase', 'Masa Pengenalan Lingkungan Sekolah (MPLS)', 'period', '15 - 17 Juli 2026', 'notes', 'Wajib diikuti oleh seluruh peserta didik baru')
  ),
  JSON_ARRAY(
    JSON_OBJECT('step', 1, 'title', 'Pendaftaran', 'desc', 'Isi data formulir pendaftaran melalui website ini atau hadir langsung ke sekretariat PPDB.'),
    JSON_OBJECT('step', 2, 'title', 'Verifikasi Berkas', 'desc', 'Panitia memverifikasi kelengkapan dokumen persyaratan dan menerbitkan nomor peserta.'),
    JSON_OBJECT('step', 3, 'title', 'Uji Penempatan', 'desc', 'Mengikuti tes ringan pemetaan baca Al-Quran dan wawancara minat bakat secara ramah.'),
    JSON_OBJECT('step', 4, 'title', 'Pengumuman & Daftar Ulang', 'desc', 'Melihat hasil pengumuman dan melakukan daftar ulang sesuai jadwal yang ditentukan.')
  ),
  1,
  'Biaya pendidikan di SMP Islam Caruy sangat transparan, terjangkau, dan dapat diangsur. Sekolah juga menyediakan skema beasiswa penuh bagi santri berprestasi dan yatim piatu.',
  JSON_ARRAY(
    JSON_OBJECT('item', 'Infaq Gedung & Sarana Pendidikan (1 kali selama studi)', 'nominal', 'Rp 1.250.000', 'note', 'Dapat diangsur 3x'),
    JSON_OBJECT('item', 'Paket Seragam Lengkap 4 Stel + Atribut & Jilbab/Peci', 'nominal', 'Rp 650.000', 'note', 'Putra / Putri'),
    JSON_OBJECT('item', 'Buku Paket Pembelajaran & Modul PAI (1 Tahun)', 'nominal', 'Rp 350.000', 'note', 'Milik siswa'),
    JSON_OBJECT('item', 'Kegiatan MPLS & Orientasi Pramuka', 'nominal', 'Rp 150.000', 'note', 'Termasuk konsumsi & ID card'),
    JSON_OBJECT('item', 'SPP Bulanan (Termasuk Ekstrakurikuler & Bimbingan Tahfidz)', 'nominal', 'Rp 150.000', 'note', 'Per bulan')
  ),
  'Ustadz Rahmat Hidayat, S.Pd.I',
  '0821-3297-2773',
  '6282132972773',
  '/ppdb#daftar'
) ON DUPLICATE KEY UPDATE `academic_year`=`academic_year`;

-- 16. Website Settings
INSERT INTO `website_settings` (
  `id`, `school_name`, `tagline`, `logo_url`, `favicon_url`,
  `hero_title`, `hero_subtitle`, `hero_image`,
  `primary_color`, `secondary_color`, `accent_orange`, `accent_blue`,
  `facebook_url`, `instagram_url`, `youtube_url`, `tiktok_url`,
  `seo_title`, `seo_description`, `footer_text`,
  `stats_students`, `stats_teachers`, `stats_alumni`, `stats_achievements`
) VALUES (
  1,
  'SMP Islam Caruy',
  'Membentuk Generasi Qurani, Cerdas, Berakhlakul Karimah & Berprestasi',
  '/src/assets/logo.png',
  '/src/assets/logo.png',
  'Mencetak Generasi Berakhlak Qurani, Cerdas & Berdaya Saing',
  'SMP Islam Caruy memadukan kurikulum nasional unggulan dengan pendidikan nilai-nilai kepesantrenan dan penguasaan sains modern untuk melahirkan pemimpin masa depan.',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop',
  '#15803D',
  '#EAB308',
  '#F97316',
  '#0284C7',
  'https://facebook.com/smpislamcaruy',
  'https://instagram.com/smpislamcaruy',
  'https://youtube.com/@smpislamcaruy',
  'https://tiktok.com/@smpislamcaruy',
  'SMP Islam Caruy - Website Resmi Profil & PPDB Sekolah Menengah Pertama Islam Cipari Cilacap',
  'Website resmi SMP Islam Caruy, Desa Caruy, Kecamatan Cipari, Cilacap. Menyajikan profil sekolah, informasi PPDB, visi misi, guru staf, prestasi, berita kegiatan, dan fasilitas.',
  '© 2026 SMP Islam Caruy. Seluruh hak cipta dilindungi undang-undang. Membina generasi muslim unggul sejak tahun 2005.',
  320,
  26,
  1850,
  45
) ON DUPLICATE KEY UPDATE `school_name`=`school_name`;
