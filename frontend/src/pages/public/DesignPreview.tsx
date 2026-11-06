import React, { useState } from 'react';
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
  Layers,
  ChevronRight,
  School
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { ADMISSION_LABEL } from '../../config/admissions';
import { useSchool } from '../../context/SchoolContext';

export const DesignPreview: React.FC = () => {
  const { settings, profile } = useSchool();
  const [activeVariant, setActiveVariant] = useState<'variantA' | 'variantB'>('variantA');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Foto latar cover full width (menggunakan foto yang sudah ada di settings atau placeholder terkurasi)
  const coverImage = settings?.hero_image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop';

  return (
    <div className="font-poppins bg-slate-100 min-h-screen pb-20">
      <SEO
        title="Pratinjau Desain Cover / Hero"
        description="Halaman pratinjau rancangan cover full width website SMP Islam Caruy sebelum diterapkan ke halaman utama."
      />

      {/* Control Panel Sticky Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-300">
              MODE PRATINJAU
            </span>
            <span className="text-xs text-slate-600 hidden sm:inline">
              Desain ini berada di halaman uji coba terpisah dan <strong>belum diterapkan</strong> ke halaman utama.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Pilihan Alternatif Desain */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveVariant('variantA')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeVariant === 'variantA'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alternatif 1: Left-Aligned Editorial
              </button>
              <button
                onClick={() => setActiveVariant('variantB')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeVariant === 'variantB'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alternatif 2: Centered Grandeur
              </button>
            </div>

            {/* Simulator Ukuran Layar */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setDeviceView('desktop')}
                title="Tampilan Desktop (Full Width)"
                className={`p-1.5 rounded-lg transition-all ${
                  deviceView === 'desktop' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                title="Tampilan Tablet (768px)"
                className={`p-1.5 rounded-lg transition-all ${
                  deviceView === 'tablet' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                title="Tampilan HP / Mobile (390px)"
                className={`p-1.5 rounded-lg transition-all ${
                  deviceView === 'mobile' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Container Simulator Viewport */}
      <div className="py-8 px-2 sm:px-4 flex justify-center">
        <div
          className={`transition-all duration-300 w-full overflow-hidden bg-white shadow-2xl rounded-2xl border border-slate-300 ${
            deviceView === 'desktop'
              ? 'max-w-full rounded-none border-x-0'
              : deviceView === 'tablet'
              ? 'max-w-[768px]'
              : 'max-w-[390px]'
          }`}
        >
          {/* Label Ukuran Simulasi */}
          {deviceView !== 'desktop' && (
            <div className="bg-slate-800 text-slate-300 text-[11px] font-mono py-1.5 px-4 text-center border-b border-slate-700 flex justify-between items-center">
              <span>Simulasi Layar: {deviceView === 'tablet' ? 'Tablet (768 x 1024)' : 'Mobile HP (390 x 844)'}</span>
              <span className="text-amber-400 font-bold">100% Responsive</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* ALTERNATIF 1: FULL-WIDTH EDITORIAL LEFT-ALIGNED (RECOMMENDED) */}
          {/* ======================================================== */}
          {activeVariant === 'variantA' && (
            <section className="relative w-full min-h-[640px] md:min-h-[700px] lg:min-h-[760px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
              {/* Background Image Full Bleed (object-fit: cover) */}
              <div className="absolute inset-0 z-0">
                <img
                  src={coverImage}
                  alt="Background Kampus SMP Islam Caruy"
                  className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000"
                />
                {/* Multi-layered cinematic gradient overlay: Gelap di kiri untuk teks, transparan di kanan untuk memperlihatkan foto */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-emerald-950/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-black/30"></div>
              </div>

              {/* Watermark Logo Seni Kaligrafi / Islamic Accent halus di latar */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none hidden lg:block">
                <School className="w-[500px] h-[500px] text-white" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-28">
                <div className="max-w-3xl space-y-6">
                  {/* Badge PPDB & Akreditasi */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      {ADMISSION_LABEL} 2026/2027 DIBUKA
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-900/80 border border-emerald-700/70 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      Akreditasi A • Berkarakter Qurani
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white drop-shadow-md">
                    Mencetak Generasi{' '}
                    <span className="text-amber-400 underline decoration-emerald-400 decoration-wavy decoration-2">
                      Qurani
                    </span>
                    , Berakhlak Mulia & Berprestasi Global.
                  </h1>

                  {/* Subtitle / Deskripsi */}
                  <p className="text-emerald-100/95 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl drop-shadow">
                    SMP Islam Caruy memadukan kurikulum nasional terpadu dengan kedalaman nilai kepesantrenan, tahfidz Al-Quran, serta penguasaan sains dan teknologi dalam lingkungan belajar yang asri dan beradab.
                  </p>

                  {/* Call to Actions (CTAs) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                    <Link
                      to="/ppdb"
                      className="inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl shadow-amber-500/25 transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <span>Pendaftaran PPDB Online</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/profil"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md font-semibold text-sm px-7 py-4 rounded-xl transition-all"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-300" />
                      <span>Profil & Keunggulan</span>
                    </Link>
                  </div>

                  {/* Micro Highlights Pill Bar */}
                  <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-3 gap-4 max-w-lg text-left">
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-amber-300">Akreditasi A</p>
                      <p className="text-[11px] text-emerald-200/90 font-medium">Predikat Unggul</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-white">Tahfidz</p>
                      <p className="text-[11px] text-emerald-200/90 font-medium">Target Minimal 3 Juz</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-amber-300">Islami</p>
                      <p className="text-[11px] text-emerald-200/90 font-medium">Adab & Karakter</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Informasi Foto di Sudut Bawah Kanan */}
              <div className="absolute bottom-4 right-6 hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-emerald-200/80">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Foto: Kampus & Lingkungan Pembelajaran Terpadu</span>
              </div>
            </section>
          )}

          {/* ======================================================== */}
          {/* ALTERNATIF 2: FULL-WIDTH CENTERED GRANDEUR */}
          {/* ======================================================== */}
          {activeVariant === 'variantB' && (
            <section className="relative w-full min-h-[640px] md:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-hidden bg-slate-950 text-white text-center">
              {/* Background Image Full Bleed */}
              <div className="absolute inset-0 z-0">
                <img
                  src={coverImage}
                  alt="Background Kampus SMP Islam Caruy"
                  className="w-full h-full object-cover object-center"
                />
                {/* Radial & Dark Overlay menyeluruh yang simetris */}
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-brightness-75"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-950/60"></div>
              </div>

              {/* Content Container Centered */}
              <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 py-20 lg:py-28 space-y-6">
                {/* Badge Center */}
                <div className="inline-flex items-center gap-2 bg-emerald-900/90 border border-emerald-700/80 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Situs Resmi SMP Islam Caruy • Cipari, Cilacap</span>
                </div>

                {/* Headline Center */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white max-w-3xl mx-auto drop-shadow-lg">
                  Membina Generasi Unggul Berakhlak Qurani & Menguasai IPTEK
                </h1>

                {/* Subtitle Center */}
                <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mx-auto drop-shadow">
                  Mempersiapkan putra-putri Anda menjadi pribadi yang taat beribadah, cerdas bernalar kritis, santun dalam pekerti, dan siap bersaing di jenjang lanjutan.
                </p>

                {/* CTAs Center */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                  <Link
                    to="/ppdb"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <span>Daftar Santri Baru (PPDB)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/profil"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-sm px-7 py-4 rounded-xl transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-300" />
                    <span>Tentang Sekolah</span>
                  </Link>
                </div>

                {/* Counter Badges Center */}
                <div className="pt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-8 border-t border-white/15">
                  <div className="text-center">
                    <p className="text-2xl font-black text-amber-300">Akreditasi A</p>
                    <p className="text-xs text-emerald-200">BAN-S/M</p>
                  </div>
                  <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">Tahfidz Quran</p>
                    <p className="text-xs text-emerald-200">Kelas Unggulan</p>
                  </div>
                  <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-amber-300">Kurikulum Terpadu</p>
                    <p className="text-xs text-emerald-200">Nasional & Pesantren</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Bagian Perbandingan Analisis Desain untuk Review User */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Laporan Evaluasi Desain
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Perbandingan Konsep Desain Hero / Cover
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 rounded-2xl border transition-all ${activeVariant === 'variantA' ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 text-base">Alternatif 1: Left-Aligned Editorial (Disarankan)</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">Rekomendasi</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Full bleed dari tepi ke tepi:</strong> Foto menjadi latar belakang utuh, menghilangkan kesan kartu kecil terkotak-kotak.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Keterbacaan teks maksimal:</strong> Gradasi gelap halus di sisi kiri menjamin teks kontras tanpa menutupi keindahan foto di sebelah kanan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Gaya website institusi modern:</strong> Sangat umum dipakai oleh website perguruan tinggi dan sekolah unggulan internasional.</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveVariant('variantA')}
                className="mt-4 w-full py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors"
              >
                Lihat Alternatif 1 di Simulator Di Atas
              </button>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${activeVariant === 'variantB' ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 text-base">Alternatif 2: Centered Grandeur</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">Simetris</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Fokus Simetris di Tengah:</strong> Sangat kuat untuk menonjolkan satu pesan utama sekolah secara khidmat dan agamis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Overlay Menyeluruh:</strong> Memakai vignette dan tint gelap merata agar seluruh teks di tengah tetap mudah dibaca.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Cocok untuk tampilan mobile:</strong> Layout rata tengah secara natural terlihat seimbang di layar smartphone.</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveVariant('variantB')}
                className="mt-4 w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-colors"
              >
                Lihat Alternatif 2 di Simulator Di Atas
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Status Halaman Utama Website:</p>
              <p className="mt-0.5">
                Halaman utama (<Link to="/" className="text-emerald-700 underline font-semibold">Beranda /</Link>) <strong>tidak diubah sama sekali</strong> dan masih memakai tampilan hero dua kolom lama. Anda dapat memeriksa dan membandingkannya kapan saja sebelum memutuskan untuk menerapkannya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPreview;
