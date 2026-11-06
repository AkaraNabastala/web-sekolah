import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  GraduationCap,
  Users,
  Award,
  Building,
  Calendar,
  BookOpen,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Eye,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  HeartHandshake,
  Compass,
  ArrowUpRight,
  MapPin,
  Clock,
  Layers,
  Check,
  Smile,
  Target,
  FileText
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { schoolApi } from '../../services/api';
import {
  NewsArticle,
  Teacher,
  Achievement,
  Facility,
  PPDBInfo,
  SchoolVisionMission,
  GalleryAlbum
} from '../../types';
import { SEO } from '../../components/common/SEO';
import { SchoolLogo } from '../../components/common/SchoolLogo';
import { ScrollReveal } from '../../components/common/ScrollReveal';

interface HeroSlide {
  id: number;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  badge: string;
}

export const Home: React.FC = () => {
  const { profile, settings } = useSchool();
  let featureFlags: any = settings?.feature_flags;
  if (typeof featureFlags === 'string') {
    try { featureFlags = JSON.parse(featureFlags); } catch { featureFlags = null; }
  }
  const isFeatureEnabled = (feature: string) => featureFlags?.[feature] !== false;
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>([]);
  const [agendas, setAgendas] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [visionMission, setVisionMission] = useState<SchoolVisionMission | null>(null);
  const [ppdb, setPpdb] = useState<PPDBInfo | null>(null);

  // Hero Slider State (V2 Concept)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      image: settings?.hero_image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop',
      tag: 'Suasana Belajar Berkarakter',
      title: 'Pendidikan Islami yang Teduh, Mendalam & Beradab',
      subtitle: settings?.hero_subtitle || 'Memadukan kurikulum nasional dengan pendidikan agama Islam dan pembentukan karakter.',
      badge: `Tahun Ajaran ${ppdb?.academic_year || '2026/2027'}`
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop',
      tag: 'Kolaborasi & Nalar Kritis',
      title: 'Menumbuhkan Kecintaan Terhadap Ilmu & Al-Quran',
      subtitle: 'Membina generasi pembelajar yang berwawasan luas, adaptif terhadap perkembangan teknologi, dan berpegang teguh pada nilai-nilai keislaman.',
      badge: 'Program Unggulan Terpadu'
    }
  ];

  // Auto-slide tenang dengan interval 7 detik
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoPlay, heroSlides.length]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    // Record visit
    schoolApi.logVisitor('/').catch(() => {});

    const loadHomeData = async () => {
      try {
        const [newsRes, teachRes, achRes, facRes, albumsRes, agRes, progRes, vmRes, ppdbRes] = await Promise.all([
          schoolApi.getNews().catch(() => []),
          schoolApi.getTeachers().catch(() => []),
          schoolApi.getAchievements().catch(() => []),
          schoolApi.getFacilities().catch(() => []),
          schoolApi.getGalleryAlbums().catch(() => []),
          schoolApi.getAgendas().catch(() => []),
          schoolApi.getPrograms().catch(() => []),
          schoolApi.getVisionMission().catch(() => null),
          schoolApi.getPPDB().catch(() => null)
        ]);

        setLatestNews(newsRes.slice(0, 3));
        setTeachers(teachRes.slice(0, 4));
        setAchievements(achRes.slice(0, 4));
        setFacilities(facRes.slice(0, 4));
        setGalleryAlbums(albumsRes.slice(0, 3));
        setAgendas(agRes.slice(0, 3));
        setPrograms(progRes.slice(0, 3));
        setVisionMission(vmRes);
        setPpdb(ppdbRes);
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FAF8F5] text-[#2C332D] selection:bg-[#E2EBE4] selection:text-[#1B3B2B] overflow-x-hidden">
      <SEO
        title="Beranda Resmi"
        description="Portal resmi SMP Islam Caruy, sekolah menengah pertama di Desa Caruy, Kecamatan Cipari, Kabupaten Cilacap."
      />

      {/* 1. HERO / COVER FULL-WIDTH (DESAIN V2) */}
      <section className="relative w-full min-h-[580px] md:min-h-[660px] lg:min-h-[720px] flex items-center overflow-hidden bg-[#14231A]">
        {/* Background Slides dengan Slow Zoom & Crossfade */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transform transition-transform duration-[10000ms] ease-out ${
                idx === currentSlide ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Overlay gradasi hangat: Deep Forest Green (#0E2016) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E2016]/92 via-[#0E2016]/75 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E2016]/90 via-transparent to-[#0E2016]/30"></div>
          </div>
        ))}

        {/* Konten Hero Teks */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-24">
          <div className="max-w-2xl space-y-6">
            {/* Lencana Halus Kategori */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#E6EFE9] text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C178]"></span>
              <span>{heroSlides[currentSlide].tag}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80">{heroSlides[currentSlide].badge}</span>
            </div>

            {/* Judul Utama dengan Tipografi Editorial yang Berbobot */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-[#FAF9F5] leading-[1.18] transition-all duration-700">
              {heroSlides[currentSlide].title}
            </h1>

            {/* Deskripsi Alami & Nyaman Dibaca */}
            <p className="text-base sm:text-lg text-[#D5E0D7] font-normal leading-relaxed max-w-xl transition-all duration-700">
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* Tombol Aksi yang Natural */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/ppdb"
                className="inline-flex items-center justify-center gap-2.5 bg-[#E8CF94] hover:bg-[#DEBD7A] text-[#1B3B2B] font-bold text-sm px-7 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <span>Informasi Pendaftaran Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/profil"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-[#F3F7F4] border border-white/20 backdrop-blur-sm font-medium text-sm px-6 py-3.5 rounded-xl transition-all"
              >
                <span>Mengenal Sekolah</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigasi Slider di Sudut Kanan Bawah */}
        <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 bg-[#0E2016]/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
          <span className="text-xs text-white/70 font-mono">
            0{currentSlide + 1} / 0{heroSlides.length}
          </span>
          <div className="h-3 w-px bg-white/20"></div>
          <button
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. SEKILAS TENTANG SMP ISLAM CARUY (DUA KOLOM EDITORIAL) */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Kolom Kiri: Teks Pengenalan */}
            <ScrollReveal animation="fade-up" className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#2A5C40] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#2A5C40]"></span>
                Sekilas Sekolah
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#1F2621] tracking-tight leading-tight">
                Membangun Pondasi Generasi Berkarakter di Pedesaan yang Asri
              </h2>
              <div className="w-16 h-1 bg-[#DEBD7A] rounded-full"></div>
              
              <div className="text-[#5C645D] text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                <p>
                  {profile?.description || 'SMP Islam Caruy adalah lembaga pendidikan menengah pertama swasta bernuansa Islami yang berlokasi di Kecamatan Cipari, Kabupaten Cilacap.'}
                </p>
                <p>
                  SMP Islam Caruy mengutamakan pembelajaran akademik, pendidikan agama, dan pembentukan karakter. Lingkungan belajar yang nyaman mendukung siswa untuk berkembang, mandiri, dan berprestasi.
                </p>
              </div>

              {/* Data Kunci Resmi (Hanya yang Terkonfirmasi) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EAE5DC]">
                <div className="p-3 bg-white rounded-xl border border-[#ECE7DD]">
                  <span className="text-[11px] text-[#7A827B] uppercase block">NPSN Resmi</span>
                  <span className="text-sm font-bold text-[#1F2621] font-mono">{profile?.npsn || '20301988'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#ECE7DD]">
                  <span className="text-[11px] text-[#7A827B] uppercase block">Status Akreditasi</span>
                  <span className="text-sm font-bold text-[#2A5C40]">{profile?.accreditation || 'A (Unggul)'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#ECE7DD] col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-[#7A827B] uppercase block">Jenjang Sekolah</span>
                  <span className="text-sm font-bold text-[#1F2621]">SMP Swasta Islam</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/profil"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider group"
                >
                  <span>Baca Profil Lengkap Sekolah</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Kolom Kanan: Komposisi Foto Pendukung */}
            <ScrollReveal animation="fade-up" delay={200} className="lg:col-span-5">
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-[#EAE5DC]">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
                    alt="Lingkungan Kampus SMP Islam Caruy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#132A1E] text-white p-5 rounded-2xl shadow-xl border border-white/15 max-w-xs hidden sm:block">
                  <div className="flex items-center gap-3">
                    <SchoolLogo size="sm" showText={false} />
                    <div>
                      <p className="text-xs font-bold text-[#FAF9F5]">Pendidikan Holistik</p>
                      <p className="text-[11px] text-[#D5E0D7] leading-tight mt-0.5">Berakar pada adab & sains modern</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. SAMBUTAN KEPALA SEKOLAH */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white border-b border-[#EAE5DC]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#ECE7DD] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Foto Kepala Sekolah */}
            <ScrollReveal animation="fade-up" className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-48 sm:w-56 aspect-[4/5] rounded-2xl overflow-hidden shadow-md border-4 border-white bg-[#EAE5DC]">
                <img
                  src={profile?.headmaster_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop'}
                  alt={profile?.headmaster_name || 'Kepala Sekolah SMP Islam Caruy'}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F2621] mt-4">
                {profile?.headmaster_name || 'Kepala Sekolah SMP Islam Caruy'}
              </h3>
              <p className="text-xs text-[#2A5C40] font-semibold tracking-wide">
                Kepala Sekolah SMP Islam Caruy
              </p>
            </ScrollReveal>

            {/* Pesan Sambutan */}
            <ScrollReveal animation="fade-up" delay={150} className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-[#2A5C40] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#2A5C40]"></span>
                Sambutan Pimpinan
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-[#1F2621] tracking-tight">
                Mendidik dengan Hati, Merajut Generasi Beradab
              </h2>
              <div className="w-12 h-1 bg-[#DEBD7A] rounded-full"></div>
              
              <div className="text-[#5C645D] text-sm sm:text-base leading-relaxed space-y-3 font-normal pt-2">
                {profile?.headmaster_welcome ? (
                  profile.headmaster_welcome.split('\n\n').slice(0, 3).map((par, i) => (
                    <p key={i}>{par}</p>
                  ))
                ) : (
                  <p>Selamat datang di portal resmi SMP Islam Caruy. Kami berkomitmen mendampingi setiap peserta didik agar berkembang secara intelektual, emosional, dan spiritual dalam iklim belajar yang hangat dan berkarakter.</p>
                )}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/profil"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider group"
                >
                  <span>Mengenal Profil Lengkap</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. VISI DAN MISI (LAYOUT EDITORIAL ELEGAN) */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal animation="fade-up" className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
              Arah dan Cita-Cita
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#1F2621] tracking-tight mt-1">
              Visi & Misi Pendidikan Sekolah
            </h2>
            <div className="w-16 h-1 bg-[#DEBD7A] rounded-full mt-3"></div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Box Visi Utama */}
            <ScrollReveal animation="fade-up" className="lg:col-span-5 bg-[#132A1E] text-white p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E5C178] text-xs font-semibold">
                  <Target className="w-3.5 h-3.5" />
                  <span>Visi Utama Sekolah</span>
                </div>
                <blockquote className="text-lg sm:text-xl font-medium leading-snug text-[#FAF9F5] italic pt-2">
                  "{visionMission?.vision || 'Terwujudnya Generasi Muslim yang Berakhlakul Karimah, Unggul dalam Prestasi Akademik dan Non-Akademik, Menguasai IPTEK, serta Berwawasan Lingkungan Hidup.'}"
                </blockquote>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <span className="text-xs text-[#D5E0D7] font-normal">Motto: {visionMission?.vision_motto || 'Mencetak Generasi Cerdas Berkarakter Islami'}</span>
                <Link to="/visi-misi" className="text-xs text-[#E8CF94] hover:underline font-bold inline-flex items-center gap-1">
                  Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            {/* List Misi */}
            <ScrollReveal animation="fade-up" delay={200} className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#ECE7DD] flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40] block">
                  Misi Penyelenggaraan Pendidikan
                </span>
                <ul className="space-y-3.5">
                  {(visionMission?.missions && visionMission.missions.length > 0 ? visionMission.missions : [
                    'Menanamkan aqidah Islamiyyah yang shahihah dan membiasakan pengamalan ibadah yaumiyyah serta akhlakul karimah.',
                    'Menyelenggarakan pembelajaran berkualitas sesuai kurikulum nasional dengan penguatan pendidikan agama dan karakter.',
                    'Mengembangkan potensi, minat, dan bakat peserta didik secara optimal melalui kegiatan akademik, ekstrakurikuler, dan keolahragaan.',
                    'Memanfaatkan teknologi informasi dan komunikasi secara bijak dan produktif dalam kegiatan pembelajaran.'
                  ]).slice(0, 4).map((mission, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#E8EFEA] text-[#1D4A32] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-[#4E564F] leading-relaxed">
                        {mission}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 mt-6 border-t border-[#F2EFE9]">
                <Link to="/visi-misi" className="text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider inline-flex items-center gap-1.5">
                  <span>Lihat Seluruh Rincian Misi & Tujuan</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. NILAI DAN KARAKTER PENDIDIKAN */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
              Pondasi Karakter
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight">
              Nilai Utama Pendidikan SMP Islam Caruy
            </h2>
            <p className="text-xs sm:text-sm text-[#5C645D] leading-relaxed">
              Nilai-nilai utama yang diterapkan dalam kegiatan belajar dan keseharian warga sekolah.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(visionMission?.core_values && visionMission.core_values.length > 0 ? visionMission.core_values : [
              { title: 'Integritas & Taqwa', desc: 'Menjadikan iman dan ketakwaan kepada Allah SWT sebagai landasan setiap langkah dan perbuatan.' },
              { title: 'Akhlakul Karimah', desc: 'Membudayakan sikap santun, rendah hati, menghormati guru dan orang tua, serta menyayangi sesama.' },
              { title: 'Keunggulan Akademik', desc: 'Mendorong daya nalar kritis, rasa ingin tahu yang tinggi, dan semangat pantang menyerah.' },
              { title: 'Kemandirian & Disiplin', desc: 'Membentuk pribadi yang bertanggung jawab, jujur, tertib, dan mampu memimpin diri sendiri.' }
            ]).map((val, idx) => (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 100}
                className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#ECE7DD] space-y-3 hover:border-[#2A5C40] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] text-[#1D4A32] flex items-center justify-center font-bold">
                  {idx === 0 ? <HeartHandshake className="w-5 h-5" /> :
                   idx === 1 ? <Smile className="w-5 h-5" /> :
                   idx === 2 ? <GraduationCap className="w-5 h-5" /> :
                   <ShieldCheck className="w-5 h-5" />}
                </div>
                <h3 className="font-bold text-base text-[#1F2621]">{val.title}</h3>
                <p className="text-xs text-[#5C645D] leading-relaxed font-normal">
                  {val.desc}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {isFeatureEnabled('programs') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE5DC] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
                Program Pembinaan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight mt-1">
                Program Pendidikan Terpadu
              </h2>
            </div>
            <Link
              to="/profil"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider"
            >
              <span>Pelajari Kurikulum</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(programs && programs.length > 0 ? programs : [
              {
                id: 1,
                name: 'Pendidikan Agama & Karakter',
                description: 'Pembelajaran pendidikan agama Islam dan pembiasaan karakter positif.',
                schedule_info: 'Setiap Hari Kerja ba’da Sholat Dhuha & Ashar',
                instructor: 'Guru Pendidikan Agama'
              },
              {
                id: 2,
                name: 'Kurikulum Nasional Terpadu',
                description: 'Penguasaan sains, matematika, bahasa Inggris, dan teknologi informasi melalui pembelajaran interaktif di laboratorium.',
                schedule_info: 'Praktikum IPA & Komputer Terstruktur',
                instructor: 'Guru Mata Pelajaran'
              },
              {
                id: 3,
                name: 'Pengembangan Bakat & Kepanduan',
                description: 'Wadah pembinaan minat melalui kepanduan Pramuka, olahraga futsal, seni kaligrafi Islam, dan rebana untuk membentuk jiwa pemimpin.',
                schedule_info: 'Setiap Jumat & Sabtu',
                instructor: 'Pembina Ekstrakurikuler'
              }
            ]).slice(0, 3).map((prog, idx) => (
              <ScrollReveal key={prog.id || idx} animation="fade-up" delay={idx * 150} className="bg-white rounded-2xl p-6 border border-[#ECE7DD] shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E8EFEA] text-[#1D4A32] flex items-center justify-center">
                    {idx === 0 ? <BookOpen className="w-6 h-6" /> : idx === 1 ? <GraduationCap className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-lg text-[#1F2621]">{prog.name}</h3>
                  <p className="text-xs sm:text-sm text-[#5C645D] leading-relaxed font-normal">
                    {prog.description}
                  </p>
                </div>
                {prog.schedule_info && (
                  <div className="pt-3 border-t border-[#F2EFE9] text-xs text-[#2A5C40] flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{prog.schedule_info}</span>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
        )}

      {isFeatureEnabled('facilities') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE5DC] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
                Sarana & Prasarana
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight mt-1">
                Fasilitas Belajar yang Memadai
              </h2>
            </div>
            <Link
              to="/fasilitas"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider"
            >
              <span>Lihat Seluruh Fasilitas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => (
              <ScrollReveal
                key={fac.id}
                animation="fade-up"
                delay={idx * 100}
                className="group bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#ECE7DD] shadow-sm flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#EAE5DC]">
                  <img
                    src={fac.photo || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600'}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#1F2621] group-hover:text-[#1D4A32] transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-[#5C645D] leading-relaxed line-clamp-2 mt-1 font-normal">
                      {fac.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2A5C40] uppercase tracking-wider pt-2 block border-t border-[#F0EBE1]">
                    {fac.condition_status || 'Kondisi Baik'}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
        )}

      {isFeatureEnabled('teachers') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE5DC] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
                Tenaga Pendidik
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight mt-1">
                Dewan Guru Berdedikasi
              </h2>
            </div>
            <Link
              to="/guru"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider"
            >
              <span>Lihat Semua Guru & Staf</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, idx) => (
              <ScrollReveal
                key={teacher.id}
                animation="fade-up"
                delay={idx * 100}
                className="bg-white rounded-2xl p-5 border border-[#ECE7DD] text-center space-y-3 group hover:border-[#2A5C40] transition-colors shadow-sm"
              >
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-white shadow-sm bg-[#EAE5DC]">
                  <img
                    src={teacher.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400'}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1F2621]">{teacher.name}</h3>
                  <p className="text-xs text-[#2A5C40] font-medium mt-0.5">{teacher.subject}</p>
                </div>
                <p className="text-[11px] text-[#5C645D] leading-relaxed line-clamp-2 font-normal">
                  {teacher.short_bio || 'Pengajar berpengalaman yang mendampingi siswa dalam belajar.'}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
        )}

      {isFeatureEnabled('gallery') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE5DC] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
                Dokumentasi Kegiatan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight mt-1">
                Kegiatan Siswa
              </h2>
            </div>
            <Link
              to="/galeri"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider"
            >
              <span>Buka Galeri Foto</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryAlbums.map((album, idx) => (
              <ScrollReveal
                key={album.id}
                animation="fade-up"
                delay={idx * 150}
                className="bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#ECE7DD] group shadow-sm flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#EAE5DC] relative">
                  <img
                    src={album.cover_image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800'}
                    alt={album.name || 'Galeri SMP Islam Caruy'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#132A1E]/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {album.category || 'Dokumentasi'}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#1F2621] group-hover:text-[#1D4A32] transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-xs text-[#5C645D] leading-relaxed line-clamp-2 mt-1 font-normal">
                      {album.description}
                    </p>
                  </div>
                  <Link
                    to="/galeri"
                    className="text-xs font-bold text-[#1D4A32] hover:underline inline-flex items-center gap-1 pt-2"
                  >
                    Lihat Koleksi <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
        )}

      {isFeatureEnabled('achievements') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE5DC] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
                Jejak Keberhasilan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight mt-1">
                Prestasi Siswa
              </h2>
            </div>
            <Link
              to="/prestasi"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider"
            >
              <span>Semua Prestasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach, idx) => (
              <ScrollReveal
                key={ach.id}
                animation="fade-up"
                delay={idx * 100}
                className="bg-white rounded-2xl p-6 border border-[#ECE7DD] space-y-4 shadow-sm hover:border-[#DEBD7A] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#785E2F] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#2A5C40] uppercase tracking-wider">
                      {ach.level || 'Tingkat Kabupaten'} • {ach.year}
                    </span>
                    <h3 className="font-bold text-sm text-[#1F2621] mt-1 line-clamp-2">
                      {ach.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#5C645D] leading-relaxed line-clamp-2 font-normal">
                    {ach.student_or_team ? `Oleh: ${ach.student_or_team}` : ach.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#F2EFE9] text-[11px] text-[#7A827B]">
                  Penyelenggara: {ach.organizer || 'Kemenag / Dinas Pendidikan'}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
        )}

      {isFeatureEnabled('news') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE5DC] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
                Informasi & Pengumuman
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight mt-1">
                Kabar Terkini Civitas Akademika
              </h2>
            </div>
            <Link
              to="/berita"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider"
            >
              <span>Semua Berita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((item, idx) => (
              <ScrollReveal
                key={item.id}
                animation="fade-up"
                delay={idx * 150}
                className="bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#ECE7DD] shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#EAE5DC]">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-[#2A5C40] bg-[#E8EFEA] px-2.5 py-0.5 rounded-full inline-block">
                      {item.category_name || 'Berita'}
                    </span>
                    <h3 className="font-bold text-base text-[#1F2621] group-hover:text-[#1D4A32] transition-colors line-clamp-2">
                      <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-[#5C645D] leading-relaxed line-clamp-2 font-normal">
                      {item.summary}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#ECE7DD] flex items-center justify-between text-[11px] text-[#7A827B]">
                    <span>{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <Link to={`/berita/${item.slug}`} className="font-bold text-[#1D4A32] hover:underline flex items-center gap-1">
                      Baca <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
        )}

      {isFeatureEnabled('agenda') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE5DC] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C40]">
                Kalender Pendidikan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight mt-1">
                Agenda & Acara Terjadwal
              </h2>
            </div>
            <Link
              to="/agenda"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2A5C40] uppercase tracking-wider"
            >
              <span>Lihat Semua Agenda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(agendas && agendas.length > 0 ? agendas : [
              {
                id: 1,
                title: 'Masa Pengenalan Lingkungan Sekolah (MPLS) 2026',
                event_date: '2026-07-15',
                start_time: '07:30',
                end_time: '12:00',
                location: 'Aula & Lapangan Kampus',
                organizer: 'Kesiswaan'
              },
              {
                id: 2,
                title: 'Kegiatan Pendidikan Agama',
                event_date: '2026-08-10',
                start_time: '08:00',
                end_time: '11:30',
                location: 'Musholla At-Tarbiyah',
                organizer: 'Bidang Keagamaan'
              }
            ]).slice(0, 3).map((ag, idx) => (
              <ScrollReveal key={ag.id || idx} animation="fade-up" delay={idx * 150} className="bg-white rounded-2xl p-6 border border-[#ECE7DD] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EFEA] text-[#1D4A32]">
                      {new Date(ag.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-[#7A827B]">{ag.organizer || 'Panitia Sekolah'}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1F2621] line-clamp-2">{ag.title}</h3>
                  {ag.description && (
                    <p className="text-xs text-[#5C645D] font-normal line-clamp-2">{ag.description}</p>
                  )}
                </div>
                <div className="pt-3 border-t border-[#F2EFE9] space-y-1 text-xs text-[#5C645D]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#2A5C40]" />
                    <span>{ag.start_time} - {ag.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#2A5C40]" />
                    <span className="truncate">{ag.location}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
        )}

      {isFeatureEnabled('ppdb') && (
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#ECE7DD] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <ScrollReveal animation="fade-up" className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1D4A32] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#1D4A32]"></span>
                PPDB Tahun Ajaran {ppdb?.academic_year || '2026/2027'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2621] tracking-tight">
                Penerimaan Peserta Didik Baru Resmi Dibuka
              </h2>
              <p className="text-xs sm:text-sm text-[#5C645D] leading-relaxed font-normal">
                {ppdb?.overview || 'Mari bergabung membina generasi Qurani yang cerdas dan mandiri. Tersedia kuota beasiswa prestasi, pembebasan biaya bagi anak yatim, dan keringanan khusus bagi keluarga prasejahtera.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#2C332D]">
                  <CheckCircle2 className="w-4 h-4 text-[#2A5C40] shrink-0" />
                  <span>Jalur Prestasi dan Beasiswa</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2C332D]">
                  <CheckCircle2 className="w-4 h-4 text-[#2A5C40] shrink-0" />
                  <span>Bantuan pendidikan sesuai ketentuan sekolah</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2C332D]">
                  <CheckCircle2 className="w-4 h-4 text-[#2A5C40] shrink-0" />
                  <span>Kurikulum Terpadu & Laboratorium Lengkap</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2C332D]">
                  <CheckCircle2 className="w-4 h-4 text-[#2A5C40] shrink-0" />
                  <span>Proses Pendaftaran Cepat & Transparan</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200} className="lg:col-span-4 flex flex-col gap-3">
              <Link
                to="/ppdb"
                className="inline-flex items-center justify-center gap-2 bg-[#1B3B2B] hover:bg-[#254F3A] text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md transition-all text-center"
              >
                <span>Informasi PPDB Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/kontak"
                className="inline-flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#1F2621] border border-[#ECE7DD] font-medium text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all text-center"
              >
                <PhoneCall className="w-4 h-4 text-[#2A5C40]" />
                <span>Konsultasi Panitia</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
        )}

      {/* 13. CALL TO ACTION / HUBUNGI SEKOLAH (RESMI & HANGAT) */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#132A1E] text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal animation="fade-up" className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E5C178]">
              Layanan Informasi & Silaturahmi
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#FAF9F5] tracking-tight">
              Kunjungi Kampus Kami atau Hubungi Sekretariat
            </h2>
            <p className="text-xs sm:text-sm text-[#D5E0D7] font-normal leading-relaxed max-w-xl">
              Pintu silaturahmi SMP Islam Caruy senantiasa terbuka bagi calon orang tua/wali siswa, alumni, dan masyarakat luas yang ingin berkonsultasi mengenai pendidikan putra-putrinya.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs text-[#E6EFE9]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#E5C178] shrink-0 mt-0.5" />
                <span>{profile?.address || 'Desa Caruy, Kec. Cipari, Kabupaten Cilacap, Jawa Tengah 53262'}</span>
              </div>
              <div className="flex items-start gap-3">
                <PhoneCall className="w-4 h-4 text-[#E5C178] shrink-0 mt-0.5" />
                <span>WhatsApp / Telp: {profile?.phone || '0821-3297-2773'}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/bXeheSRzzDqizqT6A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#E8CF94] hover:underline"
              >
                <span>Buka di Google Maps (Navigasi Rute)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200} className="lg:col-span-4 flex flex-col gap-3.5">
            <Link
              to="/kontak"
              className="inline-flex items-center justify-center gap-2 bg-[#E8CF94] hover:bg-[#DEBD7A] text-[#1B3B2B] font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-xl shadow-md transition-all text-center"
            >
              <span>Kirim Pesan ke Sekolah</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${(profile?.whatsapp || '6282132972773').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all text-center"
            >
              <span>Chat WhatsApp Resmi</span>
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
