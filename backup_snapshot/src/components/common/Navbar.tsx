import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  GraduationCap,
  ShieldCheck,
  Award,
  BookOpen,
  Image,
  MapPin,
  LogIn
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { useSchool } from '../../context/SchoolContext';

export const Navbar: React.FC = () => {
  const { profile, settings } = useSchool();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsOpen(false);
    setProfileDropdown(false);
    setMobileProfileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isProfileActive = ['/profil', '/sejarah', '/visi-misi', '/organisasi'].includes(location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full font-['Poppins']">
      {/* Topbar Info Header */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] py-1.5 px-4 hidden md:block border-b border-emerald-800/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {profile?.village || 'Desa Caruy'}, {profile?.district || 'Kec. Cipari'}, {profile?.regency || 'Cilacap'}
            </span>
            <a href={`tel:${profile?.phone || '0821-3297-2773'}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              {profile?.phone || '0821-3297-2773'}
            </a>
            <a href={`mailto:${profile?.email || 'info@smpislamcaruy.sch.id'}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              {profile?.email || 'info@smpislamcaruy.sch.id'}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              NPSN: {profile?.npsn || '20301988'} • Akreditasi {profile?.accreditation || 'A'}
            </span>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-emerald-200 hover:text-amber-300 transition-colors font-medium ml-2"
              title="Portal Administrator"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portal Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-emerald-100 ${isScrolled ? 'shadow-md py-2.5' : 'py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <SchoolLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              Beranda
            </Link>

            {/* Profil Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProfileDropdown(true)}
              onMouseLeave={() => setProfileDropdown(false)}
            >
              <button
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1 transition-all ${
                  isProfileActive ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
              >
                <span>Profil Sekolah</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdown && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-emerald-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/profil" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Identitas Sekolah</span>
                  </Link>
                  <Link to="/sejarah" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>Sejarah Sekolah</span>
                  </Link>
                  <Link to="/visi-misi" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Visi & Misi</span>
                  </Link>
                  <Link to="/organisasi" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                    <GraduationCap className="w-4 h-4 text-sky-600" />
                    <span>Struktur Organisasi</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/guru-staf"
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive('/guru-staf') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              Guru & Staf
            </Link>

            <Link
              to="/berita"
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive('/berita') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              Berita & Artikel
            </Link>

            <Link
              to="/galeri"
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive('/galeri') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              Galeri
            </Link>

            <Link
              to="/prestasi"
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive('/prestasi') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              Prestasi
            </Link>

            <Link
              to="/fasilitas"
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive('/fasilitas') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              Fasilitas
            </Link>

            <Link
              to="/kontak"
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive('/kontak') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              Kontak
            </Link>
          </div>

          {/* Right Action: PPDB Button & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <Link
              to="/ppdb"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>PPDB 2026/2027</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              aria-label="Buka Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-emerald-100 px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-in fade-in duration-200">
            <Link
              to="/"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
              }`}
            >
              Beranda
            </Link>

            {/* Mobile Profil Accordion */}
            <div>
              <button
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isProfileActive ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span>Profil Sekolah</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileProfileOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-emerald-200 ml-3 mt-1">
                  <Link to="/profil" className="block px-3 py-2 text-xs text-stone-600 hover:text-emerald-700 font-medium">
                    Identitas Sekolah
                  </Link>
                  <Link to="/sejarah" className="block px-3 py-2 text-xs text-stone-600 hover:text-emerald-700 font-medium">
                    Sejarah Sekolah
                  </Link>
                  <Link to="/visi-misi" className="block px-3 py-2 text-xs text-stone-600 hover:text-emerald-700 font-medium">
                    Visi & Misi
                  </Link>
                  <Link to="/organisasi" className="block px-3 py-2 text-xs text-stone-600 hover:text-emerald-700 font-medium">
                    Struktur Organisasi
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/guru-staf"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/guru-staf') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
              }`}
            >
              Guru & Staf
            </Link>

            <Link
              to="/berita"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/berita') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
              }`}
            >
              Berita & Artikel
            </Link>

            <Link
              to="/galeri"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/galeri') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
              }`}
            >
              Galeri
            </Link>

            <Link
              to="/prestasi"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/prestasi') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
              }`}
            >
              Prestasi
            </Link>

            <Link
              to="/fasilitas"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/fasilitas') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
              }`}
            >
              Fasilitas
            </Link>

            <Link
              to="/kontak"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/kontak') ? 'text-emerald-700 bg-emerald-50' : 'text-stone-800 hover:bg-stone-50'
              }`}
            >
              Kontak & Lokasi
            </Link>

            <div className="pt-3 border-t border-emerald-100 flex justify-between items-center px-3">
              <Link to="/admin/login" className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold hover:underline">
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Portal Admin</span>
              </Link>
              <span className="text-[10px] text-stone-400 font-medium">NPSN: {profile?.npsn || '20301988'}</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
