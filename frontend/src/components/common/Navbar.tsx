import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import {
  Menu,
  X,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  School,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Award,
  Users,
  Building,
  Image,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile } = useSchool();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileAccordion(null);
  }, [location.pathname]);

  // Click outside listener for desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePointerEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handlePointerLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };

  const toggleAccordion = (name: string) => {
    setMobileAccordion(mobileAccordion === name ? null : name);
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#ECE7DD] shadow-sm font-['Poppins',sans-serif]">
      {/* Top Bar Informasi Kontak & Legalitas */}
      <div className="bg-[#132A1E] text-[#D5E0D7] text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-[#1D3B2B] hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E5C178]" />
              {profile?.address || 'Desa Caruy, Kec. Cipari, Cilacap'}
            </span>
            {profile?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E5C178]" />
                {profile.phone}
              </span>
            )}
            {profile?.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E5C178]" />
                {profile.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[#D5E0D7]">
            <span>NPSN: {profile?.npsn || '20301988'}</span>
            <span className="text-[#E5C178] font-semibold">
              {profile?.accreditation ? `Akreditasi ${profile.accreditation}` : 'Status: Swasta'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20" ref={dropdownRef}>
          {/* Logo & Identitas */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#1B3B2B] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <School className="w-6 h-6 text-[#E8CF94]" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-[#1F2621] block leading-tight">
                SMP ISLAM CARUY
              </span>
              <span className="text-[11px] font-semibold text-[#2A5C40] tracking-wide block uppercase">
                Cipari • Cilacap
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isCurrentPath('/') ? 'bg-[#E8EFEA] text-[#1B3B2B]' : 'text-[#3D473F] hover:text-[#1B3B2B] hover:bg-stone-50'
              }`}
            >
              Beranda
            </Link>

            {/* 1. Dropdown: Profil Sekolah */}
            <div
              className="relative py-2"
              onPointerEnter={() => handlePointerEnter('profil')}
              onPointerLeave={handlePointerLeave}
            >
              <button
                type="button"
                aria-expanded={activeDropdown === 'profil'}
                aria-haspopup="true"
                onClick={() => setActiveDropdown(activeDropdown === 'profil' ? null : 'profil')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  location.pathname.startsWith('/profil') || location.pathname === '/sejarah' || location.pathname === '/visi-misi' || location.pathname === '/organisasi' || location.pathname === '/guru' || location.pathname === '/fasilitas'
                    ? 'bg-[#E8EFEA] text-[#1B3B2B]'
                    : 'text-[#3D473F] hover:text-[#1B3B2B] hover:bg-stone-50'
                }`}
              >
                <span>Profil Sekolah</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'profil' ? 'rotate-180 text-[#1B3B2B]' : 'text-stone-400'}`} />
              </button>

              {activeDropdown === 'profil' && (
                <div
                  className="absolute left-0 top-full -mt-1 w-64 bg-white rounded-2xl shadow-xl border border-[#ECE7DD] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onPointerEnter={() => handlePointerEnter('profil')}
                  onPointerLeave={handlePointerLeave}
                >
                  <Link
                    to="/profil"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Tentang Sekolah</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Identitas kelembagaan & legalitas</span>
                  </Link>
                  <Link
                    to="/sejarah"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Sejarah & Kilas Balik</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Perjalanan madrasah sejak berdiri</span>
                  </Link>
                  <Link
                    to="/visi-misi"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Visi, Misi & Tujuan</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Arah panduan pembinaan adab santri</span>
                  </Link>
                  <Link
                    to="/guru"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Guru & Tenaga Kependidikan</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Profil dewan pengajar & wali kelas</span>
                  </Link>
                  <Link
                    to="/fasilitas"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Sarana & Fasilitas</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Ruang belajar, lab & perpustakaan</span>
                  </Link>
                  <Link
                    to="/organisasi"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Struktur Organisasi</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Bagan manajemen & komite</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Dropdown: Akademik */}
            <div
              className="relative py-2"
              onPointerEnter={() => handlePointerEnter('akademik')}
              onPointerLeave={handlePointerLeave}
            >
              <button
                type="button"
                aria-expanded={activeDropdown === 'akademik'}
                aria-haspopup="true"
                onClick={() => setActiveDropdown(activeDropdown === 'akademik' ? null : 'akademik')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  location.pathname === '/program' || location.pathname === '/kurikulum' || location.pathname === '/ekstrakurikuler'
                    ? 'bg-[#E8EFEA] text-[#1B3B2B]'
                    : 'text-[#3D473F] hover:text-[#1B3B2B] hover:bg-stone-50'
                }`}
              >
                <span>Akademik</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'akademik' ? 'rotate-180 text-[#1B3B2B]' : 'text-stone-400'}`} />
              </button>

              {activeDropdown === 'akademik' && (
                <div
                  className="absolute left-0 top-full -mt-1 w-60 bg-white rounded-2xl shadow-xl border border-[#ECE7DD] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onPointerEnter={() => handlePointerEnter('akademik')}
                  onPointerLeave={handlePointerLeave}
                >
                  <Link
                    to="/kurikulum"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Kurikulum Terpadu</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Kurikulum Nasional & Diniyyah</span>
                  </Link>
                  <Link
                    to="/program"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Program Unggulan</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Tahfidzul Quran & Sains Terpadu</span>
                  </Link>
                  <Link
                    to="/ekstrakurikuler"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Ekstrakurikuler</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Pramuka, kaligrafi, dan olahraga</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Dropdown: Informasi */}
            <div
              className="relative py-2"
              onPointerEnter={() => handlePointerEnter('informasi')}
              onPointerLeave={handlePointerLeave}
            >
              <button
                type="button"
                aria-expanded={activeDropdown === 'informasi'}
                aria-haspopup="true"
                onClick={() => setActiveDropdown(activeDropdown === 'informasi' ? null : 'informasi')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  location.pathname.startsWith('/berita') || location.pathname === '/agenda' || location.pathname === '/pengumuman'
                    ? 'bg-[#E8EFEA] text-[#1B3B2B]'
                    : 'text-[#3D473F] hover:text-[#1B3B2B] hover:bg-stone-50'
                }`}
              >
                <span>Informasi</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'informasi' ? 'rotate-180 text-[#1B3B2B]' : 'text-stone-400'}`} />
              </button>

              {activeDropdown === 'informasi' && (
                <div
                  className="absolute left-0 top-full -mt-1 w-60 bg-white rounded-2xl shadow-xl border border-[#ECE7DD] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onPointerEnter={() => handlePointerEnter('informasi')}
                  onPointerLeave={handlePointerLeave}
                >
                  <Link
                    to="/berita"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Berita & Artikel</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Kabar kegiatan civitas akademika</span>
                  </Link>
                  <Link
                    to="/agenda"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Agenda Kegiatan</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Jadwal acara & kalender akademik</span>
                  </Link>
                  <Link
                    to="/pengumuman"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Pengumuman Resmi</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Surat edaran & jadwal ujian</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Dropdown: Prestasi & Kegiatan */}
            <div
              className="relative py-2"
              onPointerEnter={() => handlePointerEnter('prestasi')}
              onPointerLeave={handlePointerLeave}
            >
              <button
                type="button"
                aria-expanded={activeDropdown === 'prestasi'}
                aria-haspopup="true"
                onClick={() => setActiveDropdown(activeDropdown === 'prestasi' ? null : 'prestasi')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  location.pathname === '/prestasi' || location.pathname === '/galeri'
                    ? 'bg-[#E8EFEA] text-[#1B3B2B]'
                    : 'text-[#3D473F] hover:text-[#1B3B2B] hover:bg-stone-50'
                }`}
              >
                <span>Prestasi & Kegiatan</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'prestasi' ? 'rotate-180 text-[#1B3B2B]' : 'text-stone-400'}`} />
              </button>

              {activeDropdown === 'prestasi' && (
                <div
                  className="absolute left-0 top-full -mt-1 w-60 bg-white rounded-2xl shadow-xl border border-[#ECE7DD] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onPointerEnter={() => handlePointerEnter('prestasi')}
                  onPointerLeave={handlePointerLeave}
                >
                  <Link
                    to="/prestasi"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Prestasi Santri</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Kejuaraan sains, seni & tahfidz</span>
                  </Link>
                  <Link
                    to="/kegiatan"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Kegiatan Sekolah</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Catatan kegiatan yang telah berlangsung</span>
                  </Link>
                  <Link
                    to="/galeri"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2C332D] hover:text-[#1B3B2B] transition-colors"
                  >
                    <span className="text-xs font-bold">Dokumentasi & Galeri</span>
                    <span className="text-[11px] text-[#7A827B] font-normal">Foto & video aktivitas santri</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/kontak"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isCurrentPath('/kontak') ? 'bg-[#E8EFEA] text-[#1B3B2B]' : 'text-[#3D473F] hover:text-[#1B3B2B] hover:bg-stone-50'
              }`}
            >
              Kontak
            </Link>

            {/* Tombol PPDB Online Highlight */}
            <Link
              to="/ppdb"
              className="ml-2 px-5 py-2.5 rounded-xl bg-[#E8CF94] hover:bg-[#DEBD7A] text-[#1B3B2B] font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:-translate-y-0.5"
            >
              PPDB 2026/2027
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#1F2621] hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Accordion Submenu) */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-[#ECE7DD] px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <Link to="/" className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1F2621] hover:bg-[#FAF8F5]">
            Beranda
          </Link>

          {/* Accordion Profil */}
          <div>
            <button
              onClick={() => toggleAccordion('profil')}
              className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1F2621] hover:bg-[#FAF8F5]"
            >
              <span>Profil Sekolah</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'profil' ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion === 'profil' && (
              <div className="pl-6 space-y-1 mt-1 border-l-2 border-[#1B3B2B] ml-3">
                <Link to="/profil" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Tentang Sekolah
                </Link>
                <Link to="/sejarah" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Sejarah Sekolah
                </Link>
                <Link to="/visi-misi" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Visi & Misi
                </Link>
                <Link to="/guru" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Guru & Staf
                </Link>
                <Link to="/fasilitas" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Sarana & Fasilitas
                </Link>
                <Link to="/organisasi" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Struktur Organisasi
                </Link>
              </div>
            )}
          </div>

          {/* Accordion Akademik */}
          <div>
            <button
              onClick={() => toggleAccordion('akademik')}
              className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1F2621] hover:bg-[#FAF8F5]"
            >
              <span>Akademik</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'akademik' ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion === 'akademik' && (
              <div className="pl-6 space-y-1 mt-1 border-l-2 border-[#1B3B2B] ml-3">
                <Link to="/kurikulum" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Kurikulum Terpadu
                </Link>
                <Link to="/program" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Program Unggulan
                </Link>
                <Link to="/ekstrakurikuler" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Ekstrakurikuler
                </Link>
              </div>
            )}
          </div>

          {/* Accordion Informasi */}
          <div>
            <button
              onClick={() => toggleAccordion('informasi')}
              className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1F2621] hover:bg-[#FAF8F5]"
            >
              <span>Informasi</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'informasi' ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion === 'informasi' && (
              <div className="pl-6 space-y-1 mt-1 border-l-2 border-[#1B3B2B] ml-3">
                <Link to="/berita" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Berita & Artikel
                </Link>
                <Link to="/agenda" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Agenda Kegiatan
                </Link>
                <Link to="/pengumuman" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Pengumuman Resmi
                </Link>
              </div>
            )}
          </div>

          {/* Accordion Prestasi & Kegiatan */}
          <div>
            <button
              onClick={() => toggleAccordion('prestasi')}
              className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1F2621] hover:bg-[#FAF8F5]"
            >
              <span>Prestasi & Galeri</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'prestasi' ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion === 'prestasi' && (
              <div className="pl-6 space-y-1 mt-1 border-l-2 border-[#1B3B2B] ml-3">
                <Link to="/prestasi" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Prestasi Santri
                </Link>
                <Link to="/kegiatan" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Kegiatan Sekolah
                </Link>
                <Link to="/galeri" className="block py-2 text-xs font-semibold text-[#5C645D] hover:text-[#1B3B2B]">
                  Galeri Foto & Video
                </Link>
              </div>
            )}
          </div>

          <Link to="/kontak" className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1F2621] hover:bg-[#FAF8F5]">
            Kontak & Lokasi
          </Link>

          <div className="pt-2">
            <Link
              to="/ppdb"
              className="block w-full text-center py-3 bg-[#E8CF94] font-bold text-xs uppercase tracking-wider text-[#1B3B2B] rounded-xl shadow-sm"
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
