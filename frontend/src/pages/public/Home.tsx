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
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { schoolApi } from '../../services/api';
import { NewsArticle, Teacher, Achievement, Facility, PPDBInfo } from '../../types';
import { motion } from 'framer-motion';
import { SEO } from '../../components/common/SEO';

export const Home: React.FC = () => {
  const { profile, settings } = useSchool();
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [ppdb, setPpdb] = useState<PPDBInfo | null>(null);

  useEffect(() => {
    // Record visit
    schoolApi.logVisitor('/');

    const loadHomeData = async () => {
      try {
        const [newsRes, teachRes, achRes, facRes, ppdbRes] = await Promise.all([
          schoolApi.getNews(),
          schoolApi.getTeachers(),
          schoolApi.getAchievements(),
          schoolApi.getFacilities(),
          schoolApi.getPPDB()
        ]);
        setLatestNews(newsRes.slice(0, 3));
        setTeachers(teachRes.slice(0, 4));
        setAchievements(achRes.slice(0, 3));
        setFacilities(facRes.slice(0, 4));
        setPpdb(ppdbRes);
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="font-['Poppins'] bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <SEO
        title="Beranda Resmi"
        description="Portal Resmi SMP Islam Caruy - Lembaga Pendidikan Menengah Pertama Islam Modern di Desa Caruy, Kec. Cipari, Kab. Cilacap. Memadukan kurikulum terpadu, tahfidz Al-Quran, dan sains teknologi."
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        
        {/* Glowing atmospheric spheres */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-700/80 text-amber-300 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Penerimaan Peserta Didik Baru TA {ppdb?.academic_year || '2026/2027'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Mencetak Generasi{' '}
              <span className="text-amber-400 underline decoration-emerald-500 decoration-wavy decoration-2">
                Qurani
              </span>
              , Cerdas & Berakhlak Mulia.
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              {settings?.hero_subtitle || 'SMP Islam Caruy memadukan kurikulum nasional unggulan dengan pembinaan nilai-nilai kepesantrenan, tahfidz Al-Quran, dan sains teknologi untuk melahirkan insan berakhlakul karimah.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/ppdb"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-emerald-950 font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <span>Daftar PPDB Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/profil"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm px-7 py-4 rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>Jelajahi Profil</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-300">Akreditasi A</p>
                <p className="text-[11px] text-emerald-300 font-medium">Predikat Unggul</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">Tahfidz</p>
                <p className="text-[11px] text-emerald-300 font-medium">Target 3 Juz</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-300">100%</p>
                <p className="text-[11px] text-emerald-300 font-medium">Lulusan Melanjutkan</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 group">
              <img
                src={settings?.hero_image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop'}
                alt="Suasana KBM SMP Islam Caruy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md text-emerald-950 shadow-lg border border-white/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Lingkungan Asri & Islami</p>
                <h3 className="text-sm font-extrabold text-stone-900 mt-0.5">Kampus Terpadu SMP Islam Caruy</h3>
                <p className="text-xs text-stone-600 mt-1">Desa Caruy, Kec. Cipari, Kab. Cilacap, Jawa Tengah</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATISTIK SEKOLAH COUNTER */}
      <section className="bg-emerald-800 text-white py-10 px-4 sm:px-6 lg:px-8 border-y-4 border-amber-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-amber-300 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{settings?.stats_students || 320}+</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Siswa Aktif</p>
          </div>

          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-amber-300 mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{settings?.stats_teachers || 26}+</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Guru & Staf Pengajar</p>
          </div>

          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-amber-300 mb-2">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{settings?.stats_achievements || 45}+</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Prestasi Kejuaraan</p>
          </div>

          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-amber-300 mb-2">
              <Building className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{settings?.stats_alumni || 1850}+</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Alumni Berprestasi</p>
          </div>
        </div>
      </section>

      {/* 3. SAMBUTAN KEPALA SEKOLAH */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-stone-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Foto Kepala Sekolah */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-48 sm:w-56 aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-100">
                <img
                  src={profile?.headmaster_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop'}
                  alt={profile?.headmaster_name || 'Kepala Sekolah'}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-4">
                {profile?.headmaster_name || 'Drs. H. Ahmad Fauzi, M.Pd.I'}
              </h3>
              <p className="text-xs text-emerald-700 font-semibold tracking-wide">
                Kepala Sekolah SMP Islam Caruy
              </p>
            </div>

            {/* Pesan Sambutan */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Sambutan Pimpinan
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Mendidik dengan Hati, Merajut Prestasi Bernafas Qurani
              </h2>
              <div className="w-16 h-1 bg-amber-400 rounded-full"></div>
              
              <div className="text-stone-600 text-sm sm:text-base leading-relaxed space-y-3 font-light pt-2">
                {profile?.headmaster_welcome ? (
                  profile.headmaster_welcome.split('\n\n').map((par, i) => (
                    <p key={i}>{par}</p>
                  ))
                ) : (
                  <p>Selamat datang di portal resmi SMP Islam Caruy. Kami berkomitmen memberikan layanan pendidikan terbaik yang menyeimbangkan ilmu pengetahuan umum dengan kekuatan moral dan spiritual Islam.</p>
                )}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/profil"
                  className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-xs uppercase tracking-wider group"
                >
                  <span>Baca Profil Lengkap Sekolah</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NILAI UTAMA & KEUNGGULAN (4 CARDS) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Kenapa Memilih Kami?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Pilar Keunggulan SMP Islam Caruy
            </h2>
            <p className="text-stone-500 text-sm font-light">
              Pendidikan yang menyeluruh untuk mempersiapkan peserta didik yang unggul intelektual dan matang kepribadian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-50/50 hover:bg-emerald-50 p-6 rounded-2xl border border-emerald-100 transition-all hover:shadow-lg space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Pembiasaan Akhlakul Karimah</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Sholat dhuha & dhuhur berjamaah, kultum santri, serta penanaman adab kesantunan kepada orang tua dan guru.
              </p>
            </div>

            <div className="bg-amber-50/50 hover:bg-amber-50 p-6 rounded-2xl border border-amber-100 transition-all hover:shadow-lg space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Program Kelas Tahfidz</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Bimbingan intensif hafalan Al-Quran dengan target minimal Juz 30 didampingi asatidz hafizh bersanad.
              </p>
            </div>

            <div className="bg-sky-50/50 hover:bg-sky-50 p-6 rounded-2xl border border-sky-100 transition-all hover:shadow-lg space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Kurikulum Merdeka Unggulan</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Pembelajaran berbasis proyek, penguatan sains & informatika, serta pembinaan olimpiade sains berprestasi.
              </p>
            </div>

            <div className="bg-orange-50/50 hover:bg-orange-50 p-6 rounded-2xl border border-orange-100 transition-all hover:shadow-lg space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Sekolah Ramah Anak</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Komitmen zero-bullying, konseling personal yang hangat, serta lingkungan belajar yang asri dan aman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BERITA & ARTIKEL TERBARU */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50/70 border-t border-stone-100">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                Informasi & Aktivitas
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1">
                Kabar Terkini Sekolah
              </h2>
            </div>
            <Link
              to="/berita"
              className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-xs uppercase tracking-wider group"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-700/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {item.category_name || 'Berita'}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.published_at || item.created_at || '').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {item.views_count || 0} views
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                  </h3>

                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 font-light">
                    {item.summary}
                  </p>

                  <div className="pt-2 mt-auto">
                    <Link
                      to={`/berita/${item.slug}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRESTASI SISWA & SEKOLAH */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              Jejak Keberhasilan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Prestasi Membanggakan
            </h2>
            <p className="text-stone-500 text-sm font-light">
              Bukti dedikasi para peserta didik dan pembina dalam mengukir karya di berbagai ajang kejuaraan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-stone-50 hover:bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full">
                      {ach.rank}
                    </span>
                    <span className="text-xs font-semibold text-stone-400">Tahun {ach.year}</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {ach.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Peraih: <span className="font-semibold text-emerald-800">{ach.student_or_team}</span>
                  </p>
                  <p className="text-[11px] text-stone-500 italic">
                    Tingkat: {ach.level} • {ach.organizer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/prestasi"
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border border-emerald-200"
            >
              <span>Lihat Seluruh Galeri Prestasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FASILITAS UNGGULAN */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                Sarana & Prasarana
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Fasilitas Belajar Representatif
              </h2>
            </div>
            <Link
              to="/fasilitas"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider"
            >
              <span>Lihat Semua Fasilitas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-emerald-900/60 rounded-2xl overflow-hidden border border-emerald-800 shadow-md group hover:border-amber-400 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-emerald-950">
                  <img
                    src={fac.photo}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    {fac.category}
                  </span>
                  <h3 className="font-bold text-sm text-white">{fac.name}</h3>
                  <p className="text-xs text-emerald-200/80 font-light line-clamp-2 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. AJAKAN BERGABUNG (PPDB CALL TO ACTION) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-emerald-950">
        <div className="max-w-7xl mx-auto rounded-3xl p-8 sm:p-14 bg-white/10 backdrop-blur-md border border-white/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="bg-emerald-900 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
              Pendaftaran Siswa Baru
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-emerald-950">
              Mari Bergabung Bersama SMP Islam Caruy
            </h2>
            <p className="text-sm sm:text-base text-emerald-900 font-medium leading-relaxed">
              Daftarkan putra-putri Anda sekarang untuk mendapatkan pembinaan akademis dan keagamaan terbaik. Dapatkan beasiswa prestasi dan keringanan biaya bagi yang berhak.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              to="/ppdb"
              className="bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl transition-all text-center"
            >
              Informasi PPDB Lengkap
            </Link>
            <a
              href={`https://wa.me/${profile?.whatsapp || '6282132972773'}?text=Halo%20Panitia%20PPDB%20SMP%20Islam%20Caruy`}
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-stone-50 text-emerald-950 border border-emerald-950/20 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Hubungi Panitia</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
