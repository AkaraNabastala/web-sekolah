import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  School,
  Calendar,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useSchool } from '../../context/SchoolContext';

interface Slide {
  id: number;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  badge: string;
}

export const DesignPreviewV2: React.FC = () => {
  const { settings, profile } = useSchool();
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Kumpulan foto bernuansa pendidikan alami & warm lighting
  const slides: Slide[] = [
    {
      id: 1,
      image: '/demo/demo-classroom.svg',
      tag: 'Suasana Belajar Berkarakter',
      title: 'Pendidikan Islami yang Teduh, Mendalam & Beradab',
      subtitle: 'Memadukan Kurikulum Nasional Terpadu dengan penguatan literasi, numerasi, karakter, serta pembiasaan belajar positif dalam ekosistem belajar yang asri.',
      badge: 'Tahun Ajaran 2026/2027'
    },
    {
      id: 2,
      image: '/demo/demo-classroom.svg',
      tag: 'Kolaborasi & Literasi',
      title: 'Menumbuhkan Nalar Kritis & Kecintaan Terhadap Ilmu',
      subtitle: 'Membina generasi pembelajar yang berwawasan luas, adaptif terhadap perkembangan teknologi, dan berpegang teguh pada nilai-nilai keislaman.',
      badge: 'Program Unggulan Terpadu'
    }
  ];

  // Auto-play slider dengan durasi tenang (7 detik)
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FAF8F5] text-[#2C332D] min-h-screen pb-24 selection:bg-[#E2EBE4] selection:text-[#1B3B2B]">
      <SEO
        title="Redesign V2 — Preview Cover & Hero Alami"
        description="Pratinjau konsep desain cover baru yang lebih natural, elegan, warm ivory, dan profesional untuk website Nama Sekolah Anda."
      />

      {/* Top Banner Kontrol Pratinjau V2 */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-[#EBE7DF] px-4 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#E8EFEA] text-[#1D4A32] text-xs font-semibold rounded-md border border-[#D1E0D5]">
              DESIGN PREVIEW V2
            </span>
            <span className="text-xs text-[#5C645D] hidden sm:inline">
              Konsep <em>Warm Editorial</em> — Menghilangkan kesan kaku & template AI.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/design-preview"
              className="text-xs font-medium text-[#4D6053] hover:text-[#1D4A32] underline mr-2"
            >
              ← Kembali ke Preview V1
            </Link>

            {/* Selector Ukuran Layar */}
            <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl">
              <button
                onClick={() => setDeviceView('desktop')}
                title="Desktop Lebar"
                className={`p-1.5 rounded-lg transition-all ${
                  deviceView === 'desktop' ? 'bg-white text-[#1D4A32] shadow-sm' : 'text-[#7A827B] hover:text-[#2C332D]'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                title="Tablet (768px)"
                className={`p-1.5 rounded-lg transition-all ${
                  deviceView === 'tablet' ? 'bg-white text-[#1D4A32] shadow-sm' : 'text-[#7A827B] hover:text-[#2C332D]'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                title="HP / Mobile (390px)"
                className={`p-1.5 rounded-lg transition-all ${
                  deviceView === 'mobile' ? 'bg-white text-[#1D4A32] shadow-sm' : 'text-[#7A827B] hover:text-[#2C332D]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Container Viewport Pratinjau */}
      <div className="py-6 px-0 sm:px-4 flex justify-center">
        <div
          className={`transition-all duration-300 w-full overflow-hidden bg-white shadow-xl ${
            deviceView === 'desktop'
              ? 'max-w-full'
              : deviceView === 'tablet'
              ? 'max-w-[768px] rounded-3xl border border-[#E3DED4]'
              : 'max-w-[390px] rounded-3xl border border-[#E3DED4]'
          }`}
        >
          {deviceView !== 'desktop' && (
            <div className="bg-[#2D3830] text-[#D8E0DA] text-[11px] font-mono py-1 px-4 text-center flex justify-between items-center">
              <span>Simulasi Layar: {deviceView === 'tablet' ? 'Tablet (768px)' : 'Mobile (390px)'}</span>
              <span className="text-[#D6B575]">Responsif Otomatis</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* COVER HERO SECTION V2: WARM EDITORIAL FULL-WIDTH         */}
          {/* ======================================================== */}
          <section className="relative w-full min-h-[580px] md:min-h-[660px] lg:min-h-[720px] flex items-center overflow-hidden bg-[#14231A]">
            {/* Background Slides dengan Efek Zoom Sangat Lambat (Ken Burns effect) & Crossfade */}
            {slides.map((slide, idx) => (
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
                {/* 
                  Lapisan overlay hangat: 
                  Bukan hitam pekat pekat, melainkan perpaduan Deep Forest Green (#132B1E) 
                  dan Warm Espresso (#1A1412) yang lembut, memberi ruang pada foto tetap terlihat hidup.
                */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0E2016]/90 via-[#0E2016]/75 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2016]/90 via-transparent to-[#0E2016]/30"></div>
              </div>
            ))}

            {/* Konten Hero Teks */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-24">
              <div className="max-w-2xl space-y-6">
                {/* Lencana Halus / Badge Kategori */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#E6EFE9] text-xs font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5C178]"></span>
                  <span>{slides[currentSlide].tag}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80">{slides[currentSlide].badge}</span>
                </div>

                {/* Judul Utama dengan Tipografi Editorial yang Berbobot */}
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-[#FAF9F5] leading-[1.18] transition-all duration-700">
                  {slides[currentSlide].title}
                </h1>

                {/* Deskripsi Alami & Nyaman Dibaca */}
                <p className="text-base sm:text-lg text-[#D5E0D7] font-normal leading-relaxed max-w-xl transition-all duration-700">
                  {slides[currentSlide].subtitle}
                </p>

                {/* Tombol Aksi yang Natural & Tidak Mencolok */}
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

            {/* Navigasi Slider Sederhana di Sudut Kanan Bawah */}
            <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 bg-[#0E2016]/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <span className="text-xs text-white/70 font-mono">
                0{currentSlide + 1} / 0{slides.length}
              </span>
              <div className="h-3 w-px bg-white/20"></div>
              <button
                onClick={prevSlide}
                aria-label="Slide sebelumnya"
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Slide berikutnya"
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 2: VALUES STRIP (HANGAT, MINIMALIS, ALAMI)       */}
          {/* ======================================================== */}
          <section className="bg-[#FAF8F5] border-b border-[#EAE5DC] py-12 px-6 sm:px-10 lg:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] text-[#1D4A32] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2621]">Adab & Karakter Islami</h3>
                  <p className="text-xs text-[#5C645D] leading-relaxed mt-1">
                    Pembiasaan membaca, kolaborasi, dan sikap saling menghargai sebagai bagian dari keseharian peserta didik.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#785E2F] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2621]">Kurikulum Terpadu</h3>
                  <p className="text-xs text-[#5C645D] leading-relaxed mt-1">
                    Harmoni penguasaan ilmu pengetahuan umum, sains, bahasa, dan kedalaman materi keagamaan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] text-[#1D4A32] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2621]">Lingkungan Asri & Tenang</h3>
                  <p className="text-xs text-[#5C645D] leading-relaxed mt-1">
                    Kampus bernuansa pedesaan yang sejuk di lingkungan sekitar, mendukung konsentrasi dan kenyamanan belajar.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 3: EDITORIAL INTRO DENGAN RUANG KOSONG ELEGAN    */}
          {/* ======================================================== */}
          <section className="bg-white py-16 px-6 sm:px-10 lg:px-16">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#5C7E69]">
                Tentang Nama Sekolah Anda
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B291F] tracking-tight">
                Mendidik dengan Hati, Membimbing dengan Ilmu
              </h2>
              <p className="text-sm sm:text-base text-[#576159] leading-relaxed font-normal">
                Didirikan atas musyawarah para tokoh masyarakat dan pemerhati pendidikan di wilayah setempat, Nama Sekolah Anda berikhtiar mendampingi generasi muda tumbuh menjadi pribadi yang berkarakter kuat, berwawasan luas, dan bermanfaat bagi sesama.
              </p>
              <div className="pt-2">
                <Link
                  to="/profil"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4A32] hover:text-[#2C6E4A] transition-colors"
                >
                  <span>Baca selengkapnya mengenai profil sekolah</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bagian Catatan Desain & Perubahan V2 untuk Evaluasi Pengguna */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E7E2D8] space-y-6">
          <div className="border-b border-[#EFECE6] pb-4">
            <span className="text-xs font-bold text-[#2A5C40] uppercase tracking-widest">
              Laporan Evaluasi Redesign V2
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#1E2621] mt-1">
              Penyempurnaan Visual & Interaksi yang Telah Diterapkan
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#525B54]">
            <div className="p-4 rounded-2xl bg-[#F9F7F3] border border-[#ECE7DD] space-y-2">
              <p className="font-bold text-[#1D3B2A] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3A7553]" />
                <span>Palet Warna Alami & Hangat</span>
              </p>
              <p className="leading-relaxed">
                Mengganti warna hijau menyala dan gradasi gelap pekat dengan kombinasi <strong>Warm Ivory (#FAF8F5)</strong>, <strong>Deep Forest Green (#0E2016)</strong>, <strong>Soft Sage Green (#E8EFEA)</strong>, dan aksen emas redup <strong>Muted Gold (#E8CF94)</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9F7F3] border border-[#ECE7DD] space-y-2">
              <p className="font-bold text-[#1D3B2A] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3A7553]" />
                <span>Perbaikan Dropdown Profil Sekolah</span>
              </p>
              <p className="leading-relaxed">
                Menghubungkan menu dan panel dropdown dalam satu interaksi dengan penambahan <strong>jeda tutup halus 200ms</strong>, penutup via tombol <strong>Escape</strong>, dan klik di luar area. Dropdown tidak lagi menghilang saat kursor bergeser.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9F7F3] border border-[#ECE7DD] space-y-2">
              <p className="font-bold text-[#1D3B2A] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3A7553]" />
                <span>Cover Full-Width Dinamis & Halus</span>
              </p>
              <p className="leading-relaxed">
                Foto membentang penuh <em>full bleed</em> dengan animasi zoom perlahan (*slow Ken Burns effect*), transisi crossfade halus antar slide, dan tombol kontrol slide manual.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9F7F3] border border-[#ECE7DD] space-y-2">
              <p className="font-bold text-[#1D3B2A] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3A7553]" />
                <span>Integritas Fakta Sekolah Terjaga</span>
              </p>
              <p className="leading-relaxed">
                Menghapus klaim angka atau data yang belum dikonfirmasi secara resmi sehingga terbebas dari data karangan, mempertahankan narasi yang murni edukatif dan bermartabat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPreviewV2;
