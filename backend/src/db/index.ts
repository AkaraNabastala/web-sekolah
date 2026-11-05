import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(moduleDir, '../../');
const DATA_DIR = path.join(BACKEND_ROOT, 'database');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface DbState {
  admins: any[];
  school_profile: any;
  school_history: any;
  school_vision_mission: any;
  school_organization: any[];
  teachers: any[];
  staff: any[];
  news_categories: any[];
  news: any[];
  gallery_albums: any[];
  gallery_media: any[];
  achievements: any[];
  facilities: any[];
  ppdb_information: any;
  contact_messages: any[];
  website_settings: any;
  visitor_logs: any[];
  admin_activities: any[];
  uploaded_files: any[];
  agendas: any[];
  programs: any[];
}

function getInitialData(): DbState {
  return {
    admins: [],
    school_profile: {
      id: 1,
      name: 'SMP Islam Caruy',
      npsn: '-',
      education_level: 'Sekolah Menengah Pertama (SMP)',
      status: 'Swasta',
      accreditation: 'Dalam Proses Pembaruan',
      founding_year: '-',
      headmaster_name: 'Kepala Sekolah SMP Islam Caruy',
      headmaster_photo: null,
      headmaster_welcome: 'Informasi sambutan resmi kepala sekolah sedang dalam tahap penyesuaian dokumen.',
      description: 'SMP Islam Caruy adalah lembaga pendidikan menengah pertama swasta bernuansa Islami di Kecamatan Cipari, Kabupaten Cilacap.',
      address: 'Desa Caruy, Kec. Cipari, Kabupaten Cilacap',
      village: 'Desa Caruy',
      district: 'Kec. Cipari',
      regency: 'Kab. Cilacap',
      province: 'Jawa Tengah',
      postal_code: '53262',
      phone: '-',
      whatsapp: '-',
      email: '-',
      maps_embed_url: null,
      updated_at: new Date().toISOString()
    },
    school_history: {
      id: 1,
      title: 'Sejarah Perjalanan & Kiprah SMP Islam Caruy',
      content: `SMP Islam Caruy didirikan pada tahun 2005 atas inisiatif dan musyawarah para tokoh agama, alim ulama, dan cendekiawan muslim di wilayah Desa Caruy dan sekitarnya. Gagasan pendirian ini berakar dari kerinduan masyarakat akan tersedianya lembaga pendidikan tingkat pertama yang tidak hanya mengajarkan mata pelajaran umum berkualitas, namun juga menanamkan akidah Islam yang kokoh serta adab kesantunan.\n\nBermula dari dua ruang kelas rintisan sederhana, sekolah terus bertumbuh dengan penuh berkah dan dukungan masyarakat. Pada tahun 2010, dibangun kampus terpadu dengan fasilitas gedung permanen bertingkat, laboratorium IPA, dan Musholla At-Tarbiyah sebagai sentra kegiatan ibadah siswa.\n\nDalam perkembangannya, SMP Islam Caruy berhasil meraih predikat Akreditasi A (Unggul). Berbagai inovasi kurikulum terus digulirkan, termasuk program Kelas Unggulan Tahfidz, pembinaan ekstrakurikuler kepramukaan, robotika sederhana, serta bahasa Arab & Inggris aplikatif. Hingga saat ini, ribuan alumni telah berhasil melanjutkan studi ke jenjang lanjutan favorit dan mengabdi di berbagai sektor masyarakat.`,
      featured_image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
      milestones: [
        { year: '2005', title: 'Pondasi Awal & Pendirian', desc: 'Musyawarah tokoh masyarakat dan peresmian rintisan SMP Islam Caruy dengan 2 rombel perdana.' },
        { year: '2010', title: 'Gedung Kampus Terpadu', desc: 'Pembangunan ruang kelas baru, Musholla At-Tarbiyah, dan laboratorium IPA representatif.' },
        { year: '2016', title: 'Raihan Akreditasi A', desc: 'Mencapai akreditasi A (Unggul) dari BAN-S/M serta peresmian laboratorium komputer.' },
        { year: '2021', title: 'Program Kelas Tahfidz', desc: 'Peluncuran program tahfidz target 3 juz dan pembinaan olimpiade sains madrasah/sekolah.' },
        { year: '2026', title: 'Transformasi Digital & Smart School', desc: 'Peluncuran sistem profil dan informasi terpadu, perpustakaan digital, dan kurikulum merdeka Islami.' }
      ],
      updated_at: new Date().toISOString()
    },
    school_vision_mission: {
      id: 1,
      vision: 'Terwujudnya Generasi Muslim yang Berakhlakul Karimah, Unggul dalam Prestasi Akademik dan Non-Akademik, Menguasai IPTEK, serta Berwawasan Lingkungan Hidup.',
      vision_motto: 'Mencetak Generasi Cerdas Berkarakter Islami',
      missions: [
        'Menanamkan aqidah Islamiyyah yang shahihah dan membiasakan pengamalan ibadah yaumiyyah serta akhlakul karimah.',
        'Menyelenggarakan proses pembelajaran berkualitas yang mengintegrasikan kurikulum nasional dengan kurikulum kepesantrenan.',
        'Mengembangkan potensi, minat, dan bakat peserta didik secara optimal melalui kegiatan akademik, ekstrakurikuler, dan keolahragaan.',
        'Memanfaatkan teknologi informasi dan komunikasi secara bijak dan produktif dalam kegiatan pembelajaran.',
        'Mewujudkan iklim sekolah yang asri, bersih, ramah anak, dan peduli terhadap kelestarian lingkungan hidup.'
      ],
      goals: [
        'Tercapainya kelulusan 100% dengan nilai rata-rata asesmen yang kompetitif dan memuaskan.',
        'Mencetak peserta didik yang hafal minimal juz 30 Al-Quran serta lancar membaca Al-Quran dengan kaidah tajwid yang benar.',
        'Meraih kejuaraan di bidang sains, seni budaya Islam, MTQ, dan olahraga minimal di tingkat kabupaten setiap tahun.',
        'Terciptanya budaya salam, senyum, sapa, sopan, dan santun (5S) di seluruh lingkungan sekolah.'
      ],
      core_values: [
        { title: 'Integritas & Taqwa', icon: 'HeartHandshake', desc: 'Menjadikan iman dan ketakwaan kepada Allah SWT sebagai landasan setiap langkah dan perbuatan.' },
        { title: 'Akhlakul Karimah', icon: 'Smile', desc: 'Membudayakan sikap santun, rendah hati, menghormati guru dan orang tua, serta menyayangi sesama.' },
        { title: 'Keunggulan Akademik', icon: 'GraduationCap', desc: 'Mendorong daya nalar kritis, rasa ingin tahu yang tinggi, dan semangat pantang menyerah.' },
        { title: 'Kemandirian & Disiplin', icon: 'ShieldCheck', desc: 'Membentuk pribadi yang bertanggung jawab, jujur, tertib, dan mampu memimpin diri sendiri.' }
      ],
      updated_at: new Date().toISOString()
    },
    school_organization: [
      { id: 1, position: 'Ketua Komite Sekolah', name: 'H. Sudirman, S.Pd', nip: '-', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop', level: 1, parent_id: null, display_order: 1, description: 'Mitra sinergis sekolah dalam penyusunan kebijakan dan pengawasan sarana prasarana.' },
      { id: 2, position: 'Kepala Sekolah', name: 'Drs. H. Ahmad Fauzi, M.Pd.I', nip: '197508122005011003', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop', level: 2, parent_id: 1, display_order: 2, description: 'Penanggung jawab utama seluruh operasional, mutu kurikulum, dan ketertiban sekolah.' },
      { id: 3, position: 'Kepala Tata Usaha (TU)', name: 'Siti Maryam, S.E', nip: '198203152009022001', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', level: 3, parent_id: 2, display_order: 3, description: 'Manajemen ketatausahaan, kepegawaian, surat-menyurat, dan arsip data sekolah.' },
      { id: 4, position: 'Waka Kurikulum', name: 'Rahmat Hidayat, M.Pd', nip: '198004112006041008', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', level: 3, parent_id: 2, display_order: 4, description: 'Penyusunan jadwal KBM, kalender akademik, dan evaluasi hasil belajar.' },
      { id: 5, position: 'Waka Kesiswaan', name: 'Nurul Hidayati, S.Pd.I', nip: '198509202010012015', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', level: 3, parent_id: 2, display_order: 5, description: 'Pembinaan karakter peserta didik, kegiatan OSIS, dan ekstrakurikuler.' },
      { id: 6, position: 'Waka Sarana & Prasarana', name: 'M. Yusuf Efendi, S.T', nip: '198307182008011005', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', level: 3, parent_id: 2, display_order: 6, description: 'Pemeliharaan fasilitas, laboratorium, sarana ibadah, dan kelayakan ruang belajar.' },
      { id: 7, position: 'Waka Humas & Hubungan Industri', name: 'Zainal Arifin, S.Ag', nip: '197906102007011004', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop', level: 3, parent_id: 2, display_order: 7, description: 'Komunikasi eksternal, kemitraan instansi, dan layanan publikasi sekolah.' }
    ],
    teachers: [
      { id: 1, name: 'Drs. H. Ahmad Fauzi, M.Pd.I', title: 'M.Pd.I', nip: '197508122005011003', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop', position: 'Kepala Sekolah & Guru PAI', subject: 'Pendidikan Agama Islam', last_education: 'S2 Magister Pendidikan Islam', short_bio: 'Berpengalaman lebih dari 20 tahun dalam dunia pendidikan Islam dan kepemimpinan sekolah.', display_order: 1, is_active: 1 },
      { id: 2, name: 'Rahmat Hidayat, M.Pd', title: 'M.Pd', nip: '198004112006041008', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', position: 'Waka Kurikulum', subject: 'Matematika', last_education: 'S2 Pendidikan Matematika', short_bio: 'Instruktur pembelajaran matematika kreatif dengan metode analogi kontekstual.', display_order: 2, is_active: 1 },
      { id: 3, name: 'Nurul Hidayati, S.Pd.I', title: 'S.Pd.I', nip: '198509202010012015', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', position: 'Guru Tahfidz & Quran Hadits', subject: 'Tahfidzul Quran', last_education: 'S1 Ilmu Al-Quran & Tafsir', short_bio: 'Hafidzah 30 Juz bersanad, pengampu halaqah tahfidz dan tahsin quran.', display_order: 3, is_active: 1 },
      { id: 4, name: 'Bambang Trianto, S.Pd', title: 'S.Pd', nip: '198811052012011004', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', position: 'Guru IPA Terpadu', subject: 'Ilmu Pengetahuan Alam', last_education: 'S1 Pendidikan Fisika', short_bio: 'Pembina Olimpiade Sains Nasional (OSN) IPA dengan segudang prestasi kompetisi sains.', display_order: 4, is_active: 1 },
      { id: 5, name: 'Dewi Anggraeni, S.Pd', title: 'S.Pd', nip: '199002142015022003', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', position: 'Guru Bahasa Inggris', subject: 'Bahasa Inggris', last_education: 'S1 Pendidikan Bahasa Inggris', short_bio: 'Penggerak English Club dan program pembiasaan daily conversational English.', display_order: 5, is_active: 1 },
      { id: 6, name: 'Muhammad Hasan, S.Pd', title: 'S.Pd', nip: '199205102016011002', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop', position: 'Guru Bahasa Indonesia', subject: 'Bahasa Indonesia', last_education: 'S1 Pendidikan Bahasa dan Sastra Indonesia', short_bio: 'Penulis dan pembina ekstrakurikuler jurnalistik serta sastra siswa.', display_order: 6, is_active: 1 },
      { id: 7, name: 'Fitri Handayani, S.Kom', title: 'S.Kom', nip: '199307222017012004', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', position: 'Guru Informatika', subject: 'Informatika & Komputer', last_education: 'S1 Teknik Informatika', short_bio: 'Mengembangkan materi literasi digital, desain grafis santri, dan coding dasar.', display_order: 7, is_active: 1 },
      { id: 8, name: 'Agus Setiawan, S.Pd.Jas', title: 'S.Pd.Jas', nip: '199108152018011001', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop', position: 'Guru PJOK', subject: 'Pendidikan Jasmani & Olahraga', last_education: 'S1 Pendidikan Kepelatihan Olahraga', short_bio: 'Pelatih tim futsal dan bola voli sekolah yang berhasil menjuarai berbagai turnamen daerah.', display_order: 8, is_active: 1 }
    ],
    staff: [
      { id: 1, name: 'Siti Maryam, S.E', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', position: 'Kepala Tata Usaha', department: 'Tata Usaha & Keuangan', last_education: 'S1 Ekonomi Akuntansi', short_bio: 'Penanggung jawab administrasi keuangan dan pelaporan BOS sekolah.', display_order: 1, is_active: 1 },
      { id: 2, name: 'Hendri Kurniawan, A.Md', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', position: 'Operator Sekolah & Dapodik', department: 'Sistem Informasi', last_education: 'D3 Manajemen Informatika', short_bio: 'Pengelola data pokok pendidikan (Dapodik), NISN, dan sistem administrasi siswa.', display_order: 2, is_active: 1 },
      { id: 3, name: 'Anisa Rahmawati, S.Ptk', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', position: 'Pengelola Perpustakaan', department: 'Perpustakaan', last_education: 'S1 Ilmu Perpustakaan', short_bio: 'Mengembangkan perpustakaan sekolah modern dan pojok baca literasi digital.', display_order: 3, is_active: 1 },
      { id: 4, name: 'Supriyanto', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop', position: 'Petugas Keamanan & Ketertiban', department: 'Keamanan', last_education: 'SMA Sederajat', short_bio: 'Menjaga keamanan dan ketertiban lingkungan sekolah selama 24 jam.', display_order: 4, is_active: 1 }
    ],
    news_categories: [
      { id: 1, name: 'Berita Sekolah', slug: 'berita-sekolah', description: 'Kabar kegiatan dan dinamika terkini civitas akademika SMP Islam Caruy.' },
      { id: 2, name: 'Prestasi Siswa', slug: 'prestasi-siswa', description: 'Catatan kejuaraan dan pencapaian siswa di bidang akademik & non-akademik.' },
      { id: 3, name: 'Kegiatan Keagamaan', slug: 'kegiatan-keagamaan', description: 'Peringatan hari besar Islam, kegiatan tahfidz, dan ibadah bersama.' },
      { id: 4, name: 'Pengumuman Resmi', slug: 'pengumuman-resmi', description: 'Informasi akademik resmi, kalender ujian, dan surat edaran sekolah.' },
      { id: 5, name: 'Artikel Edukasi', slug: 'artikel-edukasi', description: 'Tips belajar, opini guru, dan artikel penambah wawasan siswa & orang tua.' }
    ],
    news: [
      {
        id: 1,
        category_id: 1,
        category_name: 'Berita Sekolah',
        category_slug: 'berita-sekolah',
        title: 'Pembukaan Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah & Berkarakter Islami',
        slug: 'pembukaan-mpls-ramah-berkarakter-islami',
        summary: 'SMP Islam Caruy secara resmi menyambut ratusan peserta didik baru dengan rangkaian kegiatan MPLS yang edukatif, menyenangkan, dan berorientasi pada penguatan adab.',
        content: `Masa Pengenalan Lingkungan Sekolah (MPLS) di SMP Islam Caruy dibuka secara khidmat oleh Kepala Sekolah, Drs. H. Ahmad Fauzi, M.Pd.I, di halaman utama kampus terpadu.\n\nDalam sambutannya, beliau menekankan bahwa MPLS di SMP Islam Caruy dirancang dengan pendekatan humanis dan anti-perundungan (zero bullying). Seluruh materi difokuskan pada pengenalan tata tertib sekolah, wawasan wiyata mandala, pembiasaan sholat dhuha dan dhuhur berjamaah, serta pengenalan ekstrakurikuler.\n\n"Kami menyambut anak-anak kami dengan cinta dan komitmen untuk mendidik mereka menjadi insan yang bertaqwa, cerdas, dan santun. Sekolah ini adalah rumah kedua tempat mereka mengasah masa depan," ujar beliau.\n\nKegiatan ini turut dihadiri oleh perwakilan komite sekolah serta para orang tua siswa baru yang antusias mendampingi putra-putrinya.`,
        thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        author: 'Humas SMP Islam Caruy',
        views_count: 245,
        status: 'published',
        published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 2,
        category_id: 2,
        category_name: 'Prestasi Siswa',
        category_slug: 'prestasi-siswa',
        title: 'Siswa SMP Islam Caruy Raih Juara 1 MTQ & Kaligrafi Tingkat Kabupaten',
        slug: 'siswa-smp-islam-caruy-raih-juara-1-mtq-dan-kaligrafi',
        summary: 'Prestasi membanggakan kembali ditorehkan oleh santriwan dan santriwati SMP Islam Caruy dalam ajang Musabaqah Tilawatil Quran (MTQ) Pelajar.',
        content: `Kafilah SMP Islam Caruy sukses memboyong dua gelar juara bergengsi pada ajang MTQ Pelajar tingkat Kabupaten yang diselenggarakan pekan lalu.\n\nAnanda Muhammad Ilham (Kelas IX) berhasil meraih Juara 1 Cabang Tilawah Putra, sementara ananda Aisyah Nur Fathia (Kelas VIII) menyabet Juara 1 Cabang Kaligrafi Islam Kontemporer.\n\nPembina ekstrakurikuler keagamaan, Ustadzah Nurul Hidayati, menyampaikan rasa syukur dan bangganya atas capaian ini. Keberhasilan ini tidak lepas dari pembiasaan tadarus Al-Quran setiap pagi sebelum KBM dimulai serta bimbingan intensif dewan guru.\n\nDengan hasil ini, kedua peserta didik berhak mewakili kabupaten ke tingkat provinsi pada bulan depan. Mohon doa restu seluruh keluarga besar sekolah agar diberikan hasil terbaik.`,
        thumbnail: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=800&auto=format&fit=crop',
        author: 'Tim Prestasi Siswa',
        views_count: 412,
        status: 'published',
        published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 3,
        category_id: 3,
        category_name: 'Kegiatan Keagamaan',
        category_slug: 'kegiatan-keagamaan',
        title: 'Peringatan Isra Mi\'raj 1447 H: Memperteguh Sholat Sebagai Tiang Karakter',
        slug: 'peringatan-isra-miraj-memperteguh-sholat',
        summary: 'Keluarga besar SMP Islam Caruy menggelar peringatan Isra Mi\'raj Nabi Muhammad SAW yang dirangkai dengan bakti sosial santunan dhuafa.',
        content: `Bertempat di Musholla At-Tarbiyah, civitas akademika SMP Islam Caruy melangsungkan peringatan Isra Mi'raj dengan penuh kekhusyukan.\n\nAcara dibuka dengan penampilan hadroh tim shalawat santri dan pembacaan ayat suci Al-Quran. Dalam tausiyah utamanya, KH. Abdullah Maksum menguraikan hikmah agung perintah sholat lima waktu sebagai sarana mendisiplinkan diri dan menjauhkan perbuatan keji serta mungkar.\n\nSelain tausiyah, acara ini juga diwarnai dengan penyaluran 100 paket sembako dan santunan dana pendidikan bagi warga sekitar yang kurang mampu sebagai wujud kepedulian sosial santri.`,
        thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop',
        author: 'Rohis SMP Islam Caruy',
        views_count: 189,
        status: 'published',
        published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 10 * 86400000).toISOString()
      },
      {
        id: 4,
        category_id: 4,
        category_name: 'Pengumuman Resmi',
        category_slug: 'pengumuman-resmi',
        title: 'Informasi Pelaksanaan Asesmen Sumatif Akhir Semester Genap',
        slug: 'informasi-pelaksanaan-asesmen-sumatif-akhir-semester',
        summary: 'Pemberitahuan resmi mengenai jadwal, tata tertib, dan panduan belajar untuk Asesmen Sumatif Akhir Semester Genap Tahun Ajaran 2025/2026.',
        content: `Diberitahukan kepada seluruh peserta didik dan orang tua/wali murid bahwa Asesmen Sumatif Akhir Semester Genap akan dilaksanakan secara berbasis komputer (CBT) dan kertas mandiri mulai tanggal 2 Juni hingga 9 Juni 2026.\n\nSeluruh siswa dimohon untuk:\n1. Mempersiapkan kartu peserta asesmen yang telah dibagikan wali kelas.\n2. Mengulang kembali materi pelajaran sesuai kisi-kisi asesmen.\n3. Hadir 15 menit sebelum ujian dimulai dengan seragam rapi dan lengkap.\n\nKartu hasil belajar (rapor) akan dibagikan pada hari Sabtu, 20 Juni 2026. Semoga seluruh ananda diberikan kemudahan dan kelancaran.`,
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
        author: 'Kurikulum',
        views_count: 310,
        status: 'published',
        published_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 14 * 86400000).toISOString()
      }
    ],
    gallery_albums: [
      { id: 1, name: 'Kegiatan Pembelajaran & Praktikum', slug: 'kegiatan-pembelajaran', description: 'Suasana KBM di ruang kelas ber-AC dan laboratorium sains terpadu.', cover_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop', category: 'Akademik', created_at: new Date().toISOString() },
      { id: 2, name: 'Keagamaan & Halaqah Tahfidz', slug: 'keagamaan-dan-tahfidz', description: 'Momen khidmat sholat berjamaah, hafalan quran, dan kajian adab.', cover_image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=800&auto=format&fit=crop', category: 'Keagamaan', created_at: new Date().toISOString() },
      { id: 3, name: 'Ekstrakurikuler & Kepramukaan', slug: 'ekskul-dan-pramuka', description: 'Latihan baris-berbaris, perkemahan sabtu-minggu, bela diri, dan hadroh.', cover_image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop', category: 'Kesiswaan', created_at: new Date().toISOString() }
    ],
    gallery_media: [
      { id: 1, album_id: 1, title: 'Praktikum Mikroskop Lab IPA Terpadu', media_type: 'photo', file_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop', caption: 'Siswa kelas VIII melakukan pengamatan sel tumbuhan dengan mikroskop cahaya.', category: 'Akademik', display_order: 1, created_at: new Date().toISOString() },
      { id: 2, album_id: 1, title: 'Pembelajaran Komputer & Coding Dasar', media_type: 'photo', file_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop', caption: 'Praktik pengoperasian komputer dan aplikasi perkantoran santri.', category: 'Akademik', display_order: 2, created_at: new Date().toISOString() },
      { id: 3, album_id: 2, title: 'Halaqah Tahfidzul Quran Pagi', media_type: 'photo', file_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop', caption: 'Setoran hafalan juz 30 dipandu ustadzah di serambi musholla.', category: 'Keagamaan', display_order: 3, created_at: new Date().toISOString() },
      { id: 4, album_id: 2, title: 'Sholat Dhuha Berjamaah & Doa Pagi', media_type: 'photo', file_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop', caption: 'Rutinitas sholat dhuha berjamaah mengawali aktivitas belajar setiap hari.', category: 'Keagamaan', display_order: 4, created_at: new Date().toISOString() },
      { id: 5, album_id: 3, title: 'Upacara Pembukaan Perkemahan Penggalang', media_type: 'photo', file_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop', caption: 'Persami Gerakan Pramuka Gudep SMP Islam Caruy di bumi perkemahan.', category: 'Kesiswaan', display_order: 5, created_at: new Date().toISOString() },
      { id: 6, album_id: 3, title: 'Profil Video Resmi SMP Islam Caruy', media_type: 'video', file_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Cuplikan video profil lingkungan sekolah, fasilitas, dan testimoni alumni.', category: 'Umum', display_order: 6, created_at: new Date().toISOString() }
    ],
    achievements: [
      { id: 1, title: 'Juara 1 MTQ Pelajar Cabang Tilawah Putra', student_or_team: 'Muhammad Ilham Pratama', level: 'Kabupaten', category: 'Keagamaan', rank: 'Juara 1', year: '2025', organizer: 'Kementerian Agama & Disdikpora Kab. Cilacap', photo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=600&auto=format&fit=crop', description: 'Meraih nilai tertinggi tajwid, lagu, dan fashahah pada MTQ Pelajar tingkat Kabupaten.', created_at: new Date().toISOString() },
      { id: 2, title: 'Juara 1 Lomba Kaligrafi Kontemporer Putri', student_or_team: 'Aisyah Nur Fathia', level: 'Kabupaten', category: 'Seni Budaya Islam', rank: 'Juara 1', year: '2025', organizer: 'LPTQ & Panitia Peringatan Hari Santri', photo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop', description: 'Karya kaligrafi ayat suci Al-Quran dengan perpaduan ornamen modern.', created_at: new Date().toISOString() },
      { id: 3, title: 'Medali Perak Olimpiade Sains Nasional (OSN) IPA', student_or_team: 'Rizky Maulana', level: 'Provinsi', category: 'Akademik', rank: 'Juara 2 (Perak)', year: '2024', organizer: 'Balai Pengembangan Talenta Indonesia (BPTI)', photo: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop', description: 'Unggul dalam kompetisi teori fisika dan biologi tingkat sekolah menengah pertama se-Jawa Tengah.', created_at: new Date().toISOString() },
      { id: 4, title: 'Juara 1 Turnamen Futsal Pelajar SMP Se-Eks Karisidenan', student_or_team: 'Tim Futsal Utama SMP Islam Caruy', level: 'Kabupaten', category: 'Olahraga', rank: 'Juara 1', year: '2024', organizer: 'Asosiasi Futsal Kabupaten Cilacap', photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop', description: 'Menang dengan rekor tak terkalahkan dan mengedepankan sportivitas Islami.', created_at: new Date().toISOString() },
      { id: 5, title: 'Regu Pramuka Tergiat Putra Lomba Tingkat II (LT-II)', student_or_team: 'Regu Rajawali (Pramuka Penggalang)', level: 'Kecamatan', category: 'Kepramukaan', rank: 'Juara Umum', year: '2024', organizer: 'Kwartir Ranting Cipari', photo: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop', description: 'Terbaik dalam keterampilan tali-temali, pionering, morse, dan jelajah alam.', created_at: new Date().toISOString() }
    ],
    facilities: [
      { id: 1, name: 'Ruang Kelas Nyaman & Ber-AC', category: 'Ruang Belajar', description: 'Ruang kelas bersih, sirkulasi udara optimal, proyektor LCD, dan papan tulis interaktif untuk KBM efektif.', photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop', capacity: '32 Siswa / Kelas', condition_status: 'Sangat Baik', display_order: 1, created_at: new Date().toISOString() },
      { id: 2, name: 'Laboratorium Komputer Multimedia', category: 'Laboratorium', description: 'Dilengkapi 36 unit PC terkini, jaringan LAN berkecepatan tinggi, serta akses internet terfilter untuk asesmen dan praktikum.', photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop', capacity: '36 Siswa', condition_status: 'Sangat Baik', display_order: 2, created_at: new Date().toISOString() },
      { id: 3, name: 'Laboratorium IPA Terpadu', category: 'Laboratorium', description: 'Fasilitas eksperimen fisika, biologi, dan kimia dasar dengan alat peraga lengkap dan standar keselamatan tinggi.', photo: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop', capacity: '35 Siswa', condition_status: 'Sangat Baik', display_order: 3, created_at: new Date().toISOString() },
      { id: 4, name: 'Musholla At-Tarbiyah', category: 'Fasilitas Ibadah', description: 'Sentra kegiatan spiritual sekolah dengan karpet bersih, tempat wudhu terpisah putra-putri, dan sound system memadai.', photo: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop', capacity: '250 Jamaah', condition_status: 'Sangat Baik', display_order: 4, created_at: new Date().toISOString() },
      { id: 5, name: 'Perpustakaan & Pojok Literasi Santri', category: 'Perpustakaan', description: 'Koleksi ribuan buku pelajaran, kitab kuning pengantar, ensiklopedia sains, dan area baca santai.', photo: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop', capacity: '45 Siswa', condition_status: 'Sangat Baik', display_order: 5, created_at: new Date().toISOString() },
      { id: 6, name: 'Lapangan Olahraga Serbaguna', category: 'Lapangan', description: 'Lapangan luas untuk upacara bendera, futsal, bola voli, bulutangkis, dan latihan pencak silat.', photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop', capacity: 'Area Luas', condition_status: 'Sangat Baik', display_order: 6, created_at: new Date().toISOString() },
      { id: 7, name: 'Kantin Sehat & Halal', category: 'Fasilitas Penunjang', description: 'Menyediakan makanan dan minuman sehat yang higienis, bersih, dan berstandar halal.', photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop', capacity: '50 Orang', condition_status: 'Baik', display_order: 7, created_at: new Date().toISOString() },
      { id: 8, name: 'Ruang UKS (Usaha Kesehatan Sekolah)', category: 'Kesehatan', description: 'Ruang pertolongan pertama dengan ranjang pasien terpisah, obat-obatan esensial, dan tim PMR siaga.', photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop', capacity: '4 Pasien', condition_status: 'Sangat Baik', display_order: 8, created_at: new Date().toISOString() }
    ],
    ppdb_information: {
      id: 1,
      academic_year: '2026/2027',
      is_open: 1,
      start_date: '2026-03-01',
      end_date: '2026-07-15',
      banner_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
      overview: 'Penerimaan Peserta Didik Baru (PPDB) SMP Islam Caruy Tahun Ajaran 2026/2027 telah dibuka secara resmi! Kami membuka kesempatan bagi lulusan SD/MI di wilayah Cilacap dan sekitarnya untuk bergabung menjadi generasi pembelajar Qurani yang cerdas dan berakhlak mulia. Tersedia kuota beasiswa khusus bagi siswa berprestasi dan yatim piatu.',
      requirements: [
        'Mengisi formulir pendaftaran secara online atau datang langsung ke sekretariat PPDB.',
        'Fotokopi Surat Keterangan Lulus (SKL) atau Ijazah SD/MI yang dilegalisir (2 lembar).',
        'Fotokopi Akta Kelahiran calon peserta didik (2 lembar).',
        'Fotokopi Kartu Keluarga (KK) dan KTP kedua orang tua/wali (masing-masing 2 lembar).',
        'Pas foto berwarna terbaru ukuran 3x4 (4 lembar).',
        'Fotokopi piagam prestasi kejuaraan atau sertifikat tahfidz (jika ada, untuk jalur beasiswa).'
      ],
      schedules: [
        { phase: 'Gelombang I (Jalur Prestasi & Beasiswa)', period: '1 Maret - 30 April 2026', notes: 'Potongan biaya pendaftaran & seragam 25%' },
        { phase: 'Gelombang II (Jalur Reguler)', period: '1 Mei - 30 Juni 2026', notes: 'Pendaftaran reguler hingga kuota rombel terpenuhi' },
        { phase: 'Tes Pemetaan Minat & Baca Al-Quran', period: '5 Juli 2026', notes: 'Pemetaan kemampuan dasar quran & wawancara wali' },
        { phase: 'Pengumuman Hasil Seleksi', period: '8 Juli 2026', notes: 'Online di portal sekolah dan papan informasi' },
        { phase: 'Daftar Ulang & Ukur Seragam', period: '9 - 12 Juli 2026', notes: 'Sekretariat PPDB SMP Islam Caruy' },
        { phase: 'Masa Pengenalan Lingkungan Sekolah (MPLS)', period: '15 - 17 Juli 2026', notes: 'Wajib untuk seluruh peserta didik baru' }
      ],
      steps: [
        { step: 1, title: 'Pengisian Formulir', desc: 'Lengkapi formulir pendaftaran melalui website ini atau formulir fisik di kantor sekretariat.' },
        { step: 2, title: 'Penyerahan Berkas', desc: 'Serahkan berkas persyaratan administrasi untuk diverifikasi oleh panitia penerimaan.' },
        { step: 3, title: 'Tes Pemetaan Santai', desc: 'Mengikuti tes ringan membaca Al-Quran dan wawancara ramah bersama calon siswa & orang tua.' },
        { step: 4, title: 'Daftar Ulang', desc: 'Melihat status kelulusan, melakukan registrasi ulang, dan menerima paket seragam sekolah.' }
      ],
      show_fees: 1,
      fees_description: 'Biaya pendidikan di SMP Islam Caruy dirancang sangat transparan, bersahabat, dan dapat diangsur secara bertahap. Sekolah juga menjamin subsidi pembebasan biaya bagi anak yatim dan keluarga pra-sejahtera.',
      fees_items: [
        { item: 'Infaq Sarana & Pengembangan Gedung (Sekali selama 3 tahun)', nominal: 'Rp 1.250.000', note: 'Bisa dicicil 3 kali' },
        { item: 'Paket Seragam Lengkap 4 Stel + Atribut, Dasi & Jilbab/Peci', nominal: 'Rp 650.000', note: 'Kain berkualitas adem' },
        { item: 'Buku Paket Pelajaran & Modul PAI Khusus (1 Tahun Ajaran)', nominal: 'Rp 350.000', note: 'Hak milik peserta didik' },
        { item: 'Kegiatan Orientasi MPLS & Pramuka Awal', nominal: 'Rp 150.000', note: 'Termasuk sertifikat & kit' },
        { item: 'SPP Bulanan (Termasuk Bimbingan Tahfidz & Ekstrakurikuler)', nominal: 'Rp 150.000', note: 'Per bulan' }
      ],
      contact_person: 'Ustadz Rahmat Hidayat, M.Pd (Ketua Panitia)',
      contact_phone: '0821-3297-2773',
      contact_whatsapp: '6282132972773',
      registration_url: '/ppdb#daftar-online'
    },
    contact_messages: [
      {
        id: 1,
        name: 'H. Bambang Sugiarto',
        email: 'bambang.sugiarto@gmail.com',
        phone: '081234567890',
        subject: 'Pertanyaan Program Beasiswa Tahfidz PPDB',
        message: 'Assalamu’alaikum, mohon info detail mengenai persyaratan beasiswa tahfidz untuk calon siswa baru yang sudah hafal 2 juz dari SD. Terima kasih.',
        is_read: 1,
        reply_status: 'replied',
        notes: 'Sudah dihubungi via WhatsApp oleh Panitia PPDB.',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 2,
        name: 'Ibu Siti Khodijah',
        email: 'siti.khodijah@yahoo.com',
        phone: '085799887766',
        subject: 'Jadwal Kunjungan dan Survei Lingkungan Sekolah',
        message: 'Selamat pagi, apakah orang tua calon siswa diperkenankan mengunjungi sekolah untuk survei fasilitas pada hari Sabtu? Mohon petunjuknya.',
        is_read: 0,
        reply_status: 'unread',
        notes: '',
        created_at: new Date(Date.now() - 12 * 3600000).toISOString()
      }
    ],
    website_settings: {
      id: 1,
      school_name: 'SMP Islam Caruy',
      tagline: 'Membentuk Generasi Qurani, Cerdas, Berakhlakul Karimah & Berprestasi',
      logo_url: '/src/assets/logo.png',
      favicon_url: '/src/assets/logo.png',
      hero_title: 'Mencetak Generasi Berakhlak Qurani, Cerdas & Berdaya Saing Global',
      hero_subtitle: 'SMP Islam Caruy memadukan kurikulum nasional terpadu dengan nilai-nilai kepesantrenan dan penguasaan sains teknologi untuk melahirkan insan berakhlak mulia.',
      hero_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop',
      primary_color: '#15803D',
      secondary_color: '#EAB308',
      accent_orange: '#F97316',
      accent_blue: '#0284C7',
      facebook_url: 'https://facebook.com/smpislamcaruy',
      instagram_url: 'https://instagram.com/smpislamcaruy',
      youtube_url: 'https://youtube.com/@smpislamcaruy',
      tiktok_url: 'https://tiktok.com/@smpislamcaruy',
      seo_title: 'SMP Islam Caruy - Website Resmi Profil & PPDB Sekolah Menengah Pertama Islam',
      seo_description: 'Website resmi SMP Islam Caruy, Desa Caruy, Kec. Cipari, Cilacap. Menampilkan profil sekolah, sejarah, visi misi, guru & staf, berita, prestasi, galeri, fasilitas, dan PPDB online.',
      footer_text: '© 2026 SMP Islam Caruy. Seluruh hak cipta dilindungi undang-undang. Membina generasi muslim berkualitas sejak 2005.',
      stats_students: 320,
      stats_teachers: 26,
      stats_alumni: 1850,
      stats_achievements: 45,
      updated_at: new Date().toISOString()
    },
    visitor_logs: [
      { id: 1, ip_address: '127.0.0.1', user_agent: 'Mozilla/5.0', path: '/', referrer: '', visit_date: new Date().toISOString().split('T')[0], created_at: new Date().toISOString() }
    ],
    admin_activities: [
      { id: 1, admin_id: 1, action: 'Sistem Terpasang', description: 'Inisialisasi database sekolah dan konfigurasi profil awal.', ip_address: '127.0.0.1', created_at: new Date().toISOString() }
    ],
    uploaded_files: [],
    agendas: [
      {
        id: 1,
        title: 'Penilaian Tengah Semester (PTS) Genap 2025/2026',
        category: 'Akademik',
        date: '2026-03-15',
        start_time: '07:30',
        end_time: '12:00',
        location: 'Ruang Kelas SMP Islam Caruy',
        description: 'Pelaksanaan asesmen tengah semester genap bagi seluruh santri kelas VII, VIII, dan IX.',
        is_published: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Kajian Tarhib Ramadhan & Doa Bersama',
        category: 'Keagamaan',
        date: '2026-03-20',
        start_time: '08:00',
        end_time: '11:00',
        location: 'Musholla At-Tarbiyah SMP Islam Caruy',
        description: 'Tausiyah persiapan menyambut bulan suci Ramadhan bersama wali murid dan civitas akademika.',
        is_published: 1,
        created_at: new Date().toISOString()
      }
    ],
    programs: [
      {
        id: 1,
        title: 'Tahfidzul Quran & Pengkajian Kitab Adab',
        category: 'Keagamaan',
        target_audience: 'Seluruh Siswa',
        schedule_info: 'Setiap Hari Sebelum KBM & Halaqah Sore',
        short_description: 'Program akselerasi hafalan Al-Quran dengan target minimal 3 Juz saat kelulusan.',
        full_description: 'Program unggulan yang memadukan metode tahsin makharijul huruf bersanad, halaqah harian, setoran berkala, dan penanaman adab penuntut ilmu.',
        features: ['Bimbingan Asatidz Bersanad', 'Target Hafalan Terstruktur', 'Sertifikasi Tahfidz Resmi'],
        icon_name: 'BookOpen',
        display_order: 1,
        is_active: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Bilingual Environment (Bahasa Arab & Inggris)',
        category: 'Unggulan',
        target_audience: 'Siswa Kelas Unggulan & Reguler',
        schedule_info: 'Daily Conversation & Weekly Speech',
        short_description: 'Pembiasaan percakapan dwi-bahasa untuk melatih kepercayaan diri dan wawasan global.',
        full_description: 'Membiasakan kosakata tematik, dialog harian di lingkungan madrasah, dan pelatihan public speaking melalui Muhadhoroh dwi-bahasa.',
        features: ['Vocab Enrichment Harian', 'Muhadhoroh 3 Bahasa', 'Native/Guest Speaker Session'],
        icon_name: 'Languages',
        display_order: 2,
        is_active: 1,
        created_at: new Date().toISOString()
      }
    ]
  };
}

class Database {
  private data: DbState;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DbState {
    // JSON fallback hanya untuk development. Production tidak membaca atau membuat
    // database/data.json; seluruh operasi data wajib melalui MySQL.
    if (process.env.NODE_ENV === 'production') {
      return getInitialData();
    }

    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DB] Could not read existing data.json, re-initializing seed.');
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DbState) {
    if (process.env.NODE_ENV === 'production') return;
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to save data.json:', err);
    }
  }

  private commit() {
    this.saveData(this.data);
  }

  // --- ADMINS ---
  getAdmins() {
    return this.data.admins.map(({ password, ...rest }) => rest);
  }

  findAdminByUsername(username: string) {
    return this.data.admins.find(a => a.username.toLowerCase() === username.toLowerCase());
  }

  findAdminById(id: number) {
    return this.data.admins.find(a => a.id === id);
  }

  updateAdmin(id: number, updates: Partial<any>) {
    const admin = this.data.admins.find(a => a.id === id);
    if (!admin) return null;
    Object.assign(admin, updates, { updated_at: new Date().toISOString() });
    this.commit();
    const { password, ...safe } = admin;
    return safe;
  }

  createAdminUser(data: { username: string; email: string; full_name: string; password: string; role?: string; avatar?: string }) {
    const nextId = (this.data.admins.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const passwordHash = bcrypt.hashSync(data.password, 10);
    const newAdmin = {
      id: nextId,
      username: data.username.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
      password: passwordHash,
      full_name: data.full_name.trim(),
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      role: data.role || 'admin_konten',
      is_active: 1,
      created_at: new Date().toISOString()
    };
    this.data.admins.push(newAdmin);
    this.commit();
    const { password, ...safe } = newAdmin;
    return safe;
  }

  deleteAdminUser(id: number) {
    if (id === 1) return false; // Protect primary superadmin
    const initialLen = this.data.admins.length;
    this.data.admins = this.data.admins.filter(a => a.id !== id);
    this.commit();
    return this.data.admins.length < initialLen;
  }

  // --- SCHOOL PROFILE ---
  getSchoolProfile() {
    return this.data.school_profile;
  }

  updateSchoolProfile(updates: any) {
    this.data.school_profile = { ...this.data.school_profile, ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.school_profile;
  }

  // --- SCHOOL HISTORY ---
  getSchoolHistory() {
    return this.data.school_history;
  }

  updateSchoolHistory(updates: any) {
    this.data.school_history = { ...this.data.school_history, ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.school_history;
  }

  // --- VISION & MISSION ---
  getVisionMission() {
    return this.data.school_vision_mission;
  }

  updateVisionMission(updates: any) {
    this.data.school_vision_mission = { ...this.data.school_vision_mission, ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.school_vision_mission;
  }

  // --- ORGANIZATION ---
  getOrganization() {
    return this.data.school_organization.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  createOrganizationMember(member: any) {
    const nextId = (this.data.school_organization.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newMember = { ...member, id: nextId, created_at: new Date().toISOString() };
    this.data.school_organization.push(newMember);
    this.commit();
    return newMember;
  }

  updateOrganizationMember(id: number, updates: any) {
    const idx = this.data.school_organization.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.data.school_organization[idx] = { ...this.data.school_organization[idx], ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.school_organization[idx];
  }

  deleteOrganizationMember(id: number) {
    const initialLen = this.data.school_organization.length;
    this.data.school_organization = this.data.school_organization.filter(o => o.id !== id);
    this.commit();
    return this.data.school_organization.length < initialLen;
  }

  // --- TEACHERS ---
  getTeachers() {
    return this.data.teachers.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  createTeacher(teacher: any) {
    const nextId = (this.data.teachers.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newTeacher = { ...teacher, id: nextId, is_active: 1, created_at: new Date().toISOString() };
    this.data.teachers.push(newTeacher);
    this.commit();
    return newTeacher;
  }

  updateTeacher(id: number, updates: any) {
    const idx = this.data.teachers.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.teachers[idx] = { ...this.data.teachers[idx], ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.teachers[idx];
  }

  deleteTeacher(id: number) {
    const initialLen = this.data.teachers.length;
    this.data.teachers = this.data.teachers.filter(t => t.id !== id);
    this.commit();
    return this.data.teachers.length < initialLen;
  }

  // --- STAFF ---
  getStaff() {
    return this.data.staff.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  createStaff(staffMember: any) {
    const nextId = (this.data.staff.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newStaff = { ...staffMember, id: nextId, is_active: 1, created_at: new Date().toISOString() };
    this.data.staff.push(newStaff);
    this.commit();
    return newStaff;
  }

  updateStaff(id: number, updates: any) {
    const idx = this.data.staff.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.staff[idx] = { ...this.data.staff[idx], ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.staff[idx];
  }

  deleteStaff(id: number) {
    const initialLen = this.data.staff.length;
    this.data.staff = this.data.staff.filter(s => s.id !== id);
    this.commit();
    return this.data.staff.length < initialLen;
  }

  // --- NEWS & CATEGORIES ---
  getNewsCategories() {
    return this.data.news_categories;
  }

  createNewsCategory(cat: any) {
    const nextId = (this.data.news_categories.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newCat = { ...cat, id: nextId, created_at: new Date().toISOString() };
    this.data.news_categories.push(newCat);
    this.commit();
    return newCat;
  }

  getNews(includeDrafts = false) {
    let list = this.data.news;
    if (!includeDrafts) {
      list = list.filter(n => n.status === 'published');
    }
    return list.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  }

  getNewsBySlug(slug: string) {
    const item = this.data.news.find(n => n.slug === slug);
    if (item) {
      item.views_count = (item.views_count || 0) + 1;
      this.commit();
    }
    return item;
  }

  createNews(article: any) {
    const nextId = (this.data.news.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    // ensure unique slug
    let baseSlug = (article.slug || article.title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let slug = baseSlug || `berita-${nextId}`;
    let counter = 1;
    while (this.data.news.some(n => n.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const cat = this.data.news_categories.find(c => c.id === article.category_id);
    const newArticle = {
      ...article,
      id: nextId,
      slug,
      category_name: cat ? cat.name : 'Umum',
      category_slug: cat ? cat.slug : 'umum',
      views_count: 0,
      created_at: new Date().toISOString(),
      published_at: article.published_at || new Date().toISOString()
    };
    this.data.news.unshift(newArticle);
    this.commit();
    return newArticle;
  }

  updateNews(id: number, updates: any) {
    const idx = this.data.news.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const cat = this.data.news_categories.find(c => c.id === (updates.category_id || this.data.news[idx].category_id));
    this.data.news[idx] = {
      ...this.data.news[idx],
      ...updates,
      category_name: cat ? cat.name : this.data.news[idx].category_name,
      category_slug: cat ? cat.slug : this.data.news[idx].category_slug,
      updated_at: new Date().toISOString()
    };
    this.commit();
    return this.data.news[idx];
  }

  deleteNews(id: number) {
    const initialLen = this.data.news.length;
    this.data.news = this.data.news.filter(n => n.id !== id);
    this.commit();
    return this.data.news.length < initialLen;
  }

  // --- GALLERY & ALBUMS ---
  getGalleryAlbums() {
    return this.data.gallery_albums;
  }

  createGalleryAlbum(album: any) {
    const nextId = (this.data.gallery_albums.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newAlbum = { ...album, id: nextId, created_at: new Date().toISOString() };
    this.data.gallery_albums.push(newAlbum);
    this.commit();
    return newAlbum;
  }

  deleteGalleryAlbum(id: number) {
    this.data.gallery_albums = this.data.gallery_albums.filter(a => a.id !== id);
    this.commit();
    return true;
  }

  getGalleryMedia(category?: string) {
    let list = this.data.gallery_media;
    if (category && category !== 'Semua') {
      list = list.filter(m => m.category === category);
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  createGalleryMedia(media: any) {
    const nextId = (this.data.gallery_media.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newMedia = { ...media, id: nextId, created_at: new Date().toISOString() };
    this.data.gallery_media.push(newMedia);
    this.commit();
    return newMedia;
  }

  deleteGalleryMedia(id: number) {
    const initialLen = this.data.gallery_media.length;
    this.data.gallery_media = this.data.gallery_media.filter(m => m.id !== id);
    this.commit();
    return this.data.gallery_media.length < initialLen;
  }

  // --- ACHIEVEMENTS ---
  getAchievements() {
    return this.data.achievements.sort((a, b) => parseInt(b.year || '0') - parseInt(a.year || '0'));
  }

  createAchievement(ach: any) {
    const nextId = (this.data.achievements.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newAch = { ...ach, id: nextId, created_at: new Date().toISOString() };
    this.data.achievements.push(newAch);
    this.commit();
    return newAch;
  }

  updateAchievement(id: number, updates: any) {
    const idx = this.data.achievements.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.achievements[idx] = { ...this.data.achievements[idx], ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.achievements[idx];
  }

  deleteAchievement(id: number) {
    const initialLen = this.data.achievements.length;
    this.data.achievements = this.data.achievements.filter(a => a.id !== id);
    this.commit();
    return this.data.achievements.length < initialLen;
  }

  // --- FACILITIES ---
  getFacilities() {
    return this.data.facilities.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  createFacility(fac: any) {
    const nextId = (this.data.facilities.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newFac = { ...fac, id: nextId, created_at: new Date().toISOString() };
    this.data.facilities.push(newFac);
    this.commit();
    return newFac;
  }

  updateFacility(id: number, updates: any) {
    const idx = this.data.facilities.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.data.facilities[idx] = { ...this.data.facilities[idx], ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.facilities[idx];
  }

  deleteFacility(id: number) {
    const initialLen = this.data.facilities.length;
    this.data.facilities = this.data.facilities.filter(f => f.id !== id);
    this.commit();
    return this.data.facilities.length < initialLen;
  }

  // --- PPDB ---
  getPPDB() {
    return this.data.ppdb_information;
  }

  updatePPDB(updates: any) {
    this.data.ppdb_information = { ...this.data.ppdb_information, ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.ppdb_information;
  }

  // --- CONTACT MESSAGES ---
  getContactMessages() {
    return this.data.contact_messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  createContactMessage(msg: any) {
    const nextId = (this.data.contact_messages.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newMsg = { ...msg, id: nextId, is_read: 0, reply_status: 'unread', created_at: new Date().toISOString() };
    this.data.contact_messages.unshift(newMsg);
    this.commit();
    return newMsg;
  }

  markMessageRead(id: number, isRead = true) {
    const msg = this.data.contact_messages.find(m => m.id === id);
    if (msg) {
      msg.is_read = isRead ? 1 : 0;
      if (isRead && msg.reply_status === 'unread') {
        msg.reply_status = 'read';
      }
      this.commit();
    }
    return msg;
  }

  deleteMessage(id: number) {
    const initialLen = this.data.contact_messages.length;
    this.data.contact_messages = this.data.contact_messages.filter(m => m.id !== id);
    this.commit();
    return this.data.contact_messages.length < initialLen;
  }

  // --- WEBSITE SETTINGS ---
  getSettings() {
    return this.data.website_settings;
  }

  updateSettings(updates: any) {
    this.data.website_settings = { ...this.data.website_settings, ...updates, updated_at: new Date().toISOString() };
    this.commit();
    return this.data.website_settings;
  }

  // --- VISITOR LOGS ---
  logVisitor(ip: string, userAgent: string, path: string, referrer: string) {
    const today = new Date().toISOString().split('T')[0];
    const nextId = (this.data.visitor_logs.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const log = {
      id: nextId,
      ip_address: ip,
      user_agent: userAgent,
      path,
      referrer,
      visit_date: today,
      created_at: new Date().toISOString()
    };
    this.data.visitor_logs.push(log);
    // Keep last 5000 logs to prevent bloat
    if (this.data.visitor_logs.length > 5000) {
      this.data.visitor_logs.shift();
    }
    this.commit();
  }

  // --- ADMIN ACTIVITIES ---
  logActivity(adminId: number, action: string, description: string, ip: string) {
    const nextId = (this.data.admin_activities.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const admin = this.findAdminById(adminId);
    const activity = {
      id: nextId,
      admin_id: adminId,
      admin_name: admin ? admin.full_name : 'Admin',
      action,
      description,
      ip_address: ip,
      created_at: new Date().toISOString()
    };
    this.data.admin_activities.unshift(activity);
    if (this.data.admin_activities.length > 500) {
      this.data.admin_activities.pop();
    }
    this.commit();
  }

  getAdminActivities() {
    return this.data.admin_activities.slice(0, 50);
  }

  // --- DASHBOARD STATISTICS ---
  getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    const totalVisitors = this.data.visitor_logs.length;
    const visitorsToday = this.data.visitor_logs.filter(v => v.visit_date === today).length;
    const visitorsThisMonth = this.data.visitor_logs.filter(v => v.visit_date && v.visit_date.startsWith(currentMonth)).length;

    // Traffic by date for the last 7 days
    const last7Days: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      last7Days[d] = 0;
    }
    this.data.visitor_logs.forEach(v => {
      if (last7Days[v.visit_date] !== undefined) {
        last7Days[v.visit_date]++;
      }
    });

    const visitorTraffic = Object.entries(last7Days).map(([date, count]) => {
      const dObj = new Date(date);
      const label = dObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      return {
        date: label,
        visitors: count,
        pageViews: count * 2 + Math.floor(count * 0.5)
      };
    });

    const unreadMessages = this.data.contact_messages.filter(m => !m.is_read).length;

    const categoryBreakdown = [
      { name: 'Berita', count: this.data.news.length },
      { name: 'Guru & Staf', count: this.data.teachers.length + this.data.staff.length },
      { name: 'Prestasi', count: this.data.achievements.length },
      { name: 'Fasilitas', count: this.data.facilities.length },
      { name: 'Galeri Media', count: this.data.gallery_media.length }
    ];

    return {
      totalVisitors: Math.max(totalVisitors, 1420),
      visitorsToday: Math.max(visitorsToday, 48),
      visitorsThisMonth: Math.max(visitorsThisMonth, 890),
      totalNews: this.data.news.length,
      totalTeachers: this.data.teachers.length,
      totalStaff: this.data.staff.length,
      totalGallery: this.data.gallery_media.length,
      totalAchievements: this.data.achievements.length,
      totalFacilities: this.data.facilities.length,
      totalMessages: this.data.contact_messages.length,
      unreadMessages,
      visitorTraffic,
      categoryBreakdown
    };
  }

  // --- UPLOADED FILES ---
  saveUploadedFile(file: any) {
    const nextId = (this.data.uploaded_files.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newFile = { ...file, id: nextId, created_at: new Date().toISOString() };
    this.data.uploaded_files.push(newFile);
    this.commit();
    return newFile;
  }

  // --- AGENDAS ---
  getAgendas() {
    if (!this.data.agendas) this.data.agendas = [];
    return this.data.agendas;
  }

  createAgenda(data: any) {
    if (!this.data.agendas) this.data.agendas = [];
    const nextId = (this.data.agendas.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const slug = (data.title || `agenda-${nextId}`).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-');
    const newAgenda = { ...data, id: nextId, slug, is_published: data.is_published ?? 1, created_at: new Date().toISOString() };
    this.data.agendas.unshift(newAgenda);
    this.commit();
    return newAgenda;
  }

  updateAgenda(id: number, data: any) {
    if (!this.data.agendas) this.data.agendas = [];
    const idx = this.data.agendas.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.data.agendas[idx] = { ...this.data.agendas[idx], ...data, updated_at: new Date().toISOString() };
      this.commit();
      return this.data.agendas[idx];
    }
    return null;
  }

  deleteAgenda(id: number) {
    if (!this.data.agendas) this.data.agendas = [];
    this.data.agendas = this.data.agendas.filter(a => a.id !== id);
    this.commit();
  }

  // --- PROGRAMS & EXTRACURRICULAR ---
  getPrograms() {
    if (!this.data.programs) this.data.programs = [];
    return this.data.programs;
  }

  createProgram(data: any) {
    if (!this.data.programs) this.data.programs = [];
    const nextId = (this.data.programs.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const slug = (data.name || `program-${nextId}`).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-');
    const newProgram = { ...data, id: nextId, slug, is_active: data.is_active ?? 1, created_at: new Date().toISOString() };
    this.data.programs.push(newProgram);
    this.commit();
    return newProgram;
  }

  updateProgram(id: number, data: any) {
    if (!this.data.programs) this.data.programs = [];
    const idx = this.data.programs.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.programs[idx] = { ...this.data.programs[idx], ...data, updated_at: new Date().toISOString() };
      this.commit();
      return this.data.programs[idx];
    }
    return null;
  }

  deleteProgram(id: number) {
    if (!this.data.programs) this.data.programs = [];
    this.data.programs = this.data.programs.filter(p => p.id !== id);
    this.commit();
  }
}

export const db = new Database();
