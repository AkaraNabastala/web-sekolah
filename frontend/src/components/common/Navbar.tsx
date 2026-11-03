import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  School,
  MapPin
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const { profile } = useSchool();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup menu mobile saat rute berganti
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileAccordion(null);
  }, [location.pathname]);

  const toggleAccordion = (name: string) => {
    setMobileAccordion(mobileAccordion === name ? null : name);
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      {/* Top Bar Informasi Ringkas */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-2 px-4 sm:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {profile?.address || 'Jl. Raya Caruy No. 12, Cipari, Cilacap'}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              {profile?.phone || '0821-3297-2773'}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-300" />
              {profile?.email || 'info@smpislamcaruy.sch.id'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <span>NPSN: {profile?.npsn || '20301988'}</span>
            <span className="text-amber-300 font-semibold">Akreditasi A</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20" ref={dropdownRef}>
          {/* Logo & Identitas */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <School className="w-7 h-7" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                SMP ISLAM CARUY
              </span>
              <span className="text-xs font-semibold text-emerald-700 tracking-wide block uppercase">
                Cipari • Cilacap
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isCurrentPath('/') ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>

            {/* Dropdown: Profil Sekolah */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('profil')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname.startsWith('/profil') || location.pathname === '/sejarah' || location.pathname === '/visi-misi' || location.pathname === '/organisasi'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>Profil Sekolah</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform" />
              </button>

              {activeDropdown === 'profil' && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link to="/profil" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium">
                    Identitas & Profil
                  </Link>
                  <Link to="/sejarah" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium">
                    Sejarah Singkat
                  </Link>
                  <Link to="/visi-misi" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium">
                    Visi, Misi & Tujuan
                  </Link>
                  <Link to="/organisasi" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium">
                    Struktur Organisasi
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/guru"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isCurrentPath('/guru') ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Guru & Staf
            </Link>

            {/* Dropdown: Informasi */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('informasi')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname.startsWith('/berita') || location.pathname === '/prestasi' || location.pathname === '/ppdb'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>Informasi</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform" />
              </button>

              {activeDropdown === 'informasi' && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link to="/berita" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium">
                    Berita & Pengumuman
                  </Link>
                  <Link to="/prestasi" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium">
                    Prestasi Sekolah
                  </Link>
                  <Link to="/ppdb" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium">
                    Pendaftaran Santri Baru (PPDB)
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/galeri"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isCurrentPath('/galeri') ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Galeri
            </Link>

            <Link
              to="/fasilitas"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isCurrentPath('/fasilitas') ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Fasilitas
            </Link>

            <Link
              to="/kontak"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isCurrentPath('/kontak') ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Kontak
            </Link>

            {/* Tombol PPDB Online Highlight */}
            <Link
              to="/ppdb"
              className="ml-3 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              PPDB 2026/2027
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Accordion Submenu) */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <Link to="/" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
            Beranda
          </Link>

          {/* Accordion Profil */}
          <div>
            <button
              onClick={() => toggleAccordion('profil')}
              className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              <span>Profil Sekolah</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'profil' ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion === 'profil' && (
              <div className="pl-6 space-y-1 mt-1 border-l-2 border-emerald-600 ml-3">
                <Link to="/profil" className="block py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Identitas Sekolah
                </Link>
                <Link to="/sejarah" className="block py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Sejarah Sekolah
                </Link>
                <Link to="/visi-misi" className="block py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Visi & Misi
                </Link>
                <Link to="/organisasi" className="block py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Struktur Organisasi
                </Link>
              </div>
            )}
          </div>

          <Link to="/guru" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
            Guru & Tenaga Kependidikan
          </Link>

          {/* Accordion Informasi */}
          <div>
            <button
              onClick={() => toggleAccordion('informasi')}
              className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              <span>Informasi</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'informasi' ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion === 'informasi' && (
              <div className="pl-6 space-y-1 mt-1 border-l-2 border-emerald-600 ml-3">
                <Link to="/berita" className="block py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Berita & Pengumuman
                </Link>
                <Link to="/prestasi" className="block py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Prestasi Sekolah
                </Link>
                <Link to="/ppdb" className="block py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Informasi PPDB
                </Link>
              </div>
            )}
          </div>

          <Link to="/galeri" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
            Galeri Foto & Video
          </Link>

          <Link to="/fasilitas" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
            Sarana & Fasilitas
          </Link>

          <Link to="/kontak" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
            Kontak & Lokasi
          </Link>

          <div className="pt-2">
            <Link
              to="/ppdb"
              className="block w-full text-center py-3 bg-amber-500 font-bold text-sm text-slate-950 rounded-xl"
            >
              Daftar Santri Baru (PPDB Online)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
