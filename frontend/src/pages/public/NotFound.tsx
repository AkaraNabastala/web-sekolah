import React from 'react';
import { ADMISSION_LABEL } from '../../config/admissions';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Phone, Search, BookOpen } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SchoolLogo } from '../../components/common/SchoolLogo';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 font-poppins relative bg-stone-50 overflow-hidden">
      <SEO
        title="404 Halaman Tidak Ditemukan"
        description="Halaman yang Anda tuju tidak ditemukan pada portal resmi Nama Sekolah Anda."
      />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-xl w-full text-center relative z-10 space-y-6">
        <div className="flex justify-center mb-2">
          <SchoolLogo size="lg" showText={false} />
        </div>

        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase border border-emerald-200">
          Galat 404 - Halaman Tidak Ditemukan
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold text-emerald-950 tracking-tight">
          4<span className="text-amber-500">0</span>4
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
            Halaman yang Anda Cari Belum Tersedia
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            Tautan yang Anda tuju mungkin sudah dipindahkan, dihapus, atau terjadi kesalahan pengetikan alamat tautan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            to="/ppdb"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            <span>Info {ADMISSION_LABEL}</span>
          </Link>

          <Link
            to="/kontak"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Hubungi Sekretariat</span>
          </Link>
        </div>

        {/* Quick directory links */}
        <div className="pt-8 border-t border-stone-200 text-xs text-stone-500 flex flex-wrap justify-center gap-4">
          <Link to="/profil" className="hover:text-emerald-700 transition-colors">Profil Sekolah</Link>
          <span>•</span>
          <Link to="/berita" className="hover:text-emerald-700 transition-colors">Warta & Berita</Link>
          <span>•</span>
          <Link to="/guru-staf" className="hover:text-emerald-700 transition-colors">Dewan Guru</Link>
          <span>•</span>
          <Link to="/fasilitas" className="hover:text-emerald-700 transition-colors">Sarana Fasilitas</Link>
          <span>•</span>
          <Link to="/prestasi" className="hover:text-emerald-700 transition-colors">Prestasi Siswa</Link>
        </div>
      </div>
    </div>
  );
};
