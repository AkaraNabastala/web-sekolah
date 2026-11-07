import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SchoolLogo } from '../../components/common/SchoolLogo';
import { SEO } from '../../components/common/SEO';
import { Toaster } from '../../components/common/Toaster';
import { toast } from '../../hooks/useToast';
import {
  LayoutDashboard,
  Building2,
  UserRound,
  BookOpen,
  Compass,
  Newspaper,
  Users,
  GraduationCap,
  Image,
  Trophy,
  Landmark,
  FileText,
  Mail,
  Settings,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Eye,
  Award,
  Calendar,
  Tags
} from 'lucide-react';
import { schoolApi } from '../../services/api';
import { ADMISSION_LABEL } from '../../config/admissions';

export const AdminLayout: React.FC = () => {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && admin?.role === 'superadmin') {
      schoolApi.getAdminMessages()
        .then(res => {
          setUnreadCount(res.filter(m => !m.is_read).length);
        })
        .catch(error => {
          console.error('Gagal memuat jumlah pesan belum dibaca:', error);
        });
    }
  }, [isAuthenticated, admin?.role, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center font-poppins">
        <p className="text-stone-500 text-sm">Memeriksa sesi administrator...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { label: 'Dashboard Utama', path: '/admin', icon: LayoutDashboard },
    { label: 'Statistik Pengunjung', path: '/admin/statistik', icon: Eye },
    { label: 'Profil Sekolah', path: '/admin/profil', icon: Building2 },
    { label: 'Sambutan Kepala Sekolah', path: '/admin/sambutan', icon: UserRound },
    { label: 'Sejarah Sekolah', path: '/admin/sejarah', icon: BookOpen },
    { label: 'Visi & Misi', path: '/admin/visi-misi', icon: Compass },
    { label: 'Struktur Organisasi', path: '/admin/organisasi', icon: GraduationCap },
    { label: 'Guru & Tenaga Staf', path: '/admin/guru-staf', icon: Users },
    { label: 'Program & Ekstrakurikuler', path: '/admin/program', icon: Award },
    { label: 'Manajemen Berita', path: '/admin/berita', icon: Newspaper },
    { label: 'Agenda Kegiatan', path: '/admin/agenda', icon: Calendar },
    { label: 'Pengumuman', path: '/admin/pengumuman', icon: Bell },
    { label: 'Kategori Konten', path: '/admin/kategori', icon: Tags },
    { label: 'Galeri & Dokumentasi', path: '/admin/galeri', icon: Image },
    { label: 'Prestasi Sekolah', path: '/admin/prestasi', icon: Trophy },
    { label: 'Fasilitas Belajar', path: '/admin/fasilitas', icon: Landmark },
    { label: `Pengaturan ${ADMISSION_LABEL}`, path: '/admin/ppdb', icon: FileText },
    { label: 'Data Pendaftar', path: '/admin/penerimaan', icon: UserCheck },
    { label: 'Pesan Masuk', path: '/admin/pesan', icon: Mail, badge: unreadCount },
    { label: 'Pengaturan Website', path: '/admin/pengaturan', icon: Settings },
  ];

  const currentPageTitle = menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard Admin';

  const visibleMenuItems = menuItems.filter(item => {
    if (admin?.role === 'superadmin') return true;
    if (admin?.role === 'admin_ppdb') return ['/admin', '/admin/ppdb', '/admin/penerimaan'].includes(item.path);
    if (admin?.role === 'admin_konten') {
      return [
        '/admin', '/admin/profil', '/admin/sambutan', '/admin/sejarah', '/admin/visi-misi',
        '/admin/organisasi', '/admin/guru-staf', '/admin/program', '/admin/berita',
        '/admin/agenda', '/admin/pengumuman', '/admin/kategori', '/admin/galeri', '/admin/prestasi', '/admin/fasilitas'
      ].includes(item.path);
    }
    return false;
  });

  // Semua modul tetap tersedia di dashboard admin, termasuk modul yang disembunyikan dari publik.

  const handleLogout = () => {
    logout();
    toast.info('Anda telah keluar dari sesi admin.');
    navigate('/admin/login');
  };

  return (
    <>
      <SEO title={`${currentPageTitle} — Admin`} />
      <div className="admin-shell min-h-screen bg-[#F4F6F8] flex font-poppins text-stone-800">
      {/* Global Toaster — mounted once at layout level */}
      <Toaster />
      {/* SIDEBAR FOR DESKTOP */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-950 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-emerald-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-emerald-900 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <SchoolLogo size="sm" lightText />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-emerald-300 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
            Menu Manajemen
          </p>

          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-amber-400 text-emerald-950 shadow-md font-bold'
                    : 'text-emerald-100/90 hover:bg-emerald-900/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-950' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Bottom Quick Links */}
        <div className="p-4 border-t border-emerald-900 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 transition-colors px-3 py-2 rounded-xl hover:bg-emerald-900/60"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Website Publik</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-300 hover:text-red-200 transition-colors px-3 py-2 rounded-xl hover:bg-red-950/40 text-left font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 hidden sm:inline-block">
              Panel Pengelola
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Unread Message Notification */}
            <Link
              to="/admin/pesan"
              className="relative p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-stone-50 transition-colors"
              title="Pesan Pengunjung"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </Link>

            {/* Admin Avatar Profile */}
            <Link
              to="/admin/akun"
              aria-label="Buka profil dan pengaturan akun"
              title="Profil dan pengaturan akun"
              className="flex items-center gap-3 pl-3 border-l border-stone-200 rounded-xl py-1 pr-2 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
                <span>{(admin?.full_name || 'A').trim().charAt(0).toUpperCase()}</span>
                {admin?.avatar && (
                  <img
                    src={admin.avatar}
                    alt={admin?.full_name || 'Admin'}
                    onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-stone-900">{admin?.full_name || 'Administrator'}</p>
                <p className="text-[10px] text-stone-500 font-medium">Profil & akun</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      </div>
    </>
  );
};
