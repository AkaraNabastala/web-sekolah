-- ============================================================
-- DATABASE SCHEMA: SMP ISLAM CARUY (MySQL 8.0+)
-- Profil Sekolah, Sistem Informasi & Dashboard Terintegrasi
-- ============================================================

CREATE DATABASE IF NOT EXISTS `smp_islam_caruy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smp_islam_caruy`;

-- 1. Table: admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(20) DEFAULT 'superadmin',
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: school_profile
CREATE TABLE IF NOT EXISTS `school_profile` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL DEFAULT 'SMP Islam Caruy',
  `npsn` VARCHAR(20) DEFAULT '20300000',
  `education_level` VARCHAR(50) DEFAULT 'Sekolah Menengah Pertama (SMP)',
  `status` VARCHAR(20) DEFAULT 'Swasta',
  `accreditation` VARCHAR(10) DEFAULT 'A',
  `founding_year` VARCHAR(10) DEFAULT '2005',
  `headmaster_name` VARCHAR(100) DEFAULT 'Drs. H. Ahmad Fauzi, M.Pd.I',
  `headmaster_photo` VARCHAR(255) DEFAULT '/uploads/headmaster.jpg',
  `headmaster_welcome` TEXT,
  `description` TEXT,
  `address` TEXT,
  `village` VARCHAR(100) DEFAULT 'Desa Caruy',
  `district` VARCHAR(100) DEFAULT 'Kec. Cipari',
  `regency` VARCHAR(100) DEFAULT 'Kab. Cilacap',
  `province` VARCHAR(100) DEFAULT 'Jawa Tengah',
  `postal_code` VARCHAR(10) DEFAULT '53262',
  `phone` VARCHAR(30) DEFAULT '0821-3297-2773',
  `whatsapp` VARCHAR(30) DEFAULT '6282132972773',
  `email` VARCHAR(100) DEFAULT 'info@smpislamcaruy.sch.id',
  `maps_embed_url` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: school_history
CREATE TABLE IF NOT EXISTS `school_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL DEFAULT 'Sejarah Berdirinya SMP Islam Caruy',
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(255) DEFAULT NULL,
  `milestones` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: school_vision_mission
CREATE TABLE IF NOT EXISTS `school_vision_mission` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vision` TEXT NOT NULL,
  `vision_motto` VARCHAR(255) DEFAULT NULL,
  `missions` JSON NOT NULL,
  `goals` JSON NOT NULL,
  `core_values` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: school_organization
CREATE TABLE IF NOT EXISTS `school_organization` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `position` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `nip` VARCHAR(50) DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `level` INT DEFAULT 1,
  `parent_id` INT DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `school_organization`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: teachers
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `title` VARCHAR(50) DEFAULT 'S.Pd.',
  `nip` VARCHAR(50) DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `position` VARCHAR(100) DEFAULT 'Guru Mata Pelajaran',
  `subject` VARCHAR(100) NOT NULL,
  `last_education` VARCHAR(100) DEFAULT 'S1 Pendidikan',
  `short_bio` TEXT,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: staff
CREATE TABLE IF NOT EXISTS `staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `position` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) DEFAULT 'Tata Usaha',
  `last_education` VARCHAR(100) DEFAULT 'S1 / D3',
  `short_bio` TEXT,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: news_categories
CREATE TABLE IF NOT EXISTS `news_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(80) NOT NULL UNIQUE,
  `slug` VARCHAR(80) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: news
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `summary` TEXT,
  `content` LONGTEXT NOT NULL,
  `thumbnail` VARCHAR(255) DEFAULT NULL,
  `author` VARCHAR(100) DEFAULT 'Humas SMP Islam Caruy',
  `views_count` INT DEFAULT 0,
  `status` ENUM('draft', 'published') DEFAULT 'published',
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_news_slug` (`slug`),
  INDEX `idx_news_status` (`status`),
  FOREIGN KEY (`category_id`) REFERENCES `news_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: gallery_albums
CREATE TABLE IF NOT EXISTS `gallery_albums` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT 'Kegiatan',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: gallery_media
CREATE TABLE IF NOT EXISTS `gallery_media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `album_id` INT DEFAULT NULL,
  `title` VARCHAR(150) NOT NULL,
  `media_type` ENUM('photo', 'video') DEFAULT 'photo',
  `file_url` VARCHAR(255) NOT NULL,
  `video_url` VARCHAR(255) DEFAULT NULL,
  `caption` TEXT,
  `category` VARCHAR(50) DEFAULT 'Umum',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Table: achievements
CREATE TABLE IF NOT EXISTS `achievements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `student_or_team` VARCHAR(150) NOT NULL,
  `level` ENUM('Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional') DEFAULT 'Kabupaten',
  `category` VARCHAR(50) DEFAULT 'Akademik',
  `rank` VARCHAR(50) DEFAULT 'Juara 1',
  `year` VARCHAR(10) NOT NULL,
  `organizer` VARCHAR(150) NOT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Table: facilities
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `category` VARCHAR(80) DEFAULT 'Ruang Belajar',
  `description` TEXT,
  `photo` VARCHAR(255) NOT NULL,
  `capacity` VARCHAR(50) DEFAULT NULL,
  `condition_status` VARCHAR(50) DEFAULT 'Sangat Baik',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Table: ppdb_information
CREATE TABLE IF NOT EXISTS `ppdb_information` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2026/2027',
  `is_open` TINYINT(1) DEFAULT 1,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `banner_image` VARCHAR(255) DEFAULT NULL,
  `overview` TEXT,
  `requirements` JSON NOT NULL,
  `schedules` JSON NOT NULL,
  `steps` JSON NOT NULL,
  `show_fees` TINYINT(1) DEFAULT 1,
  `fees_description` TEXT,
  `fees_items` JSON DEFAULT NULL,
  `contact_person` VARCHAR(100) DEFAULT 'Panitia PPDB',
  `contact_phone` VARCHAR(30) DEFAULT '0821-3297-2773',
  `contact_whatsapp` VARCHAR(30) DEFAULT '6282132972773',
  `registration_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Table: contact_messages
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `reply_status` ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Table: website_settings
CREATE TABLE IF NOT EXISTS `website_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `school_name` VARCHAR(150) DEFAULT 'SMP Islam Caruy',
  `tagline` VARCHAR(255) DEFAULT 'Membentuk Generasi Qurani, Cerdas, Berakhlakul Karimah & Berprestasi',
  `logo_url` VARCHAR(255) DEFAULT '/src/assets/logo.png',
  `favicon_url` VARCHAR(255) DEFAULT '/src/assets/logo.png',
  `hero_title` VARCHAR(255) DEFAULT 'Selamat Datang di SMP Islam Caruy',
  `hero_subtitle` TEXT,
  `hero_image` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop',
  `primary_color` VARCHAR(20) DEFAULT '#15803D',
  `secondary_color` VARCHAR(20) DEFAULT '#EAB308',
  `accent_orange` VARCHAR(20) DEFAULT '#F97316',
  `accent_blue` VARCHAR(20) DEFAULT '#0284C7',
  `facebook_url` VARCHAR(255) DEFAULT 'https://facebook.com/smpislamcaruy',
  `instagram_url` VARCHAR(255) DEFAULT 'https://instagram.com/smpislamcaruy',
  `youtube_url` VARCHAR(255) DEFAULT 'https://youtube.com/@smpislamcaruy',
  `tiktok_url` VARCHAR(255) DEFAULT 'https://tiktok.com/@smpislamcaruy',
  `seo_title` VARCHAR(200) DEFAULT 'SMP Islam Caruy - Sekolah Menengah Pertama Islam Modern & Berkarakter',
  `seo_description` TEXT,
  `footer_text` TEXT,
  `stats_students` INT DEFAULT 320,
  `stats_teachers` INT DEFAULT 26,
  `stats_alumni` INT DEFAULT 1850,
  `stats_achievements` INT DEFAULT 45,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Table: visitor_logs
CREATE TABLE IF NOT EXISTS `visitor_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(60) DEFAULT NULL,
  `user_agent` TEXT,
  `path` VARCHAR(255) DEFAULT '/',
  `referrer` VARCHAR(255) DEFAULT NULL,
  `visit_date` DATE DEFAULT (CURRENT_DATE),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_visit_date` (`visit_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Table: admin_activities
CREATE TABLE IF NOT EXISTS `admin_activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `ip_address` VARCHAR(60) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Table: uploaded_files
CREATE TABLE IF NOT EXISTS `uploaded_files` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `original_name` VARCHAR(255) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `file_size` INT NOT NULL,
  `uploaded_by` VARCHAR(100) DEFAULT 'Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
