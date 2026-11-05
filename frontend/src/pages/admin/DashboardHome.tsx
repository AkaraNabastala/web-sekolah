import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolApi } from '../../services/api';
import { DashboardStats, AdminActivity, ContactMessage, NewsArticle } from '../../types';
import {
  Users,
  Eye,
  Calendar,
  Newspaper,
  Award,
  Landmark,
  Mail,
  GraduationCap,
  Activity,
  ArrowUpRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  Database,
  Server,
  Image,
  BookOpen,
  Edit,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      const results = await Promise.allSettled([
        schoolApi.getDashboardStats(),
        schoolApi.getAdminActivities(),
        schoolApi.getAdminMessages(),
        schoolApi.getAdminNews(),
        schoolApi.getDatabaseStatus()
      ]);

      if (!mounted) return;

      const [statsResult, activitiesResult, messagesResult, newsResult, databaseResult] = results;

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      } else {
        console.error('Dashboard statistics failed:', statsResult.reason);
        setStatsError('Statistik belum dapat dimuat. Periksa koneksi MySQL dan endpoint dashboard.');
      }

      if (activitiesResult.status === 'fulfilled') {
        setActivities(activitiesResult.value.slice(0, 8));
      } else {
        console.error('Dashboard activities failed:', activitiesResult.reason);
      }

      if (messagesResult.status === 'fulfilled') {
        setRecentMessages(messagesResult.value.slice(0, 5));
      } else {
        console.error('Dashboard messages failed:', messagesResult.reason);
      }

      if (newsResult.status === 'fulfilled') {
        setRecentNews(newsResult.value.slice(0, 5));
      } else {
        console.error('Dashboard news failed:', newsResult.reason);
      }

      if (databaseResult.status === 'fulfilled') {
        setDbStatus(databaseResult.value);
      } else {
        console.error('Dashboard database status failed:', databaseResult.reason);
      }

      setLoading(false);
    };

    loadDashboard().catch(error => {
      console.error('Unexpected dashboard loading error:', error);
      if (mounted) {
        setStatsError('Dashboard mengalami kendala saat memuat data.');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // 8 Specific Metric Counters required by user specification:
  // Ringkasan jumlah berita, artikel/kategori, guru, galeri, prestasi, fasilitas, dan pesan masuk + pengunjung
  const statCards = [
    {
      label: 'Berita & Artikel',
      value: stats?.totalNews ?? null,
      sub: 'Publikasi aktif & draft',
      icon: Newspaper,
      color: 'emerald',
      link: '/admin/berita'
    },
    {
      label: 'Guru & Tenaga Staf',
      value: stats ? stats.totalTeachers + stats.totalStaff : null,
      sub: stats ? `${stats.totalTeachers} Guru, ${stats.totalStaff} Tenaga Kependidikan` : 'Data belum tersedia',
      icon: Users,
      color: 'sky',
      link: '/admin/guru-staf'
    },
    {
      label: 'Galeri & Media',
      value: stats?.totalGallery ?? null,
      sub: 'Foto kegiatan & dokumentasi',
      icon: Image,
      color: 'indigo',
      link: '/admin/galeri'
    },
    {
      label: 'Prestasi Siswa',
      value: stats?.totalAchievements ?? null,
      sub: 'Akademik & non-akademik',
      icon: Award,
      color: 'amber',
      link: '/admin/prestasi'
    },
    {
      label: 'Sarana & Fasilitas',
      value: stats?.totalFacilities ?? null,
      sub: 'Ruang belajar & penunjang',
      icon: Landmark,
      color: 'teal',
      link: '/admin/fasilitas'
    },
    {
      label: 'Pesan Masuk',
      value: stats?.totalMessages ?? null,
      sub: stats ? `${stats.unreadMessages} belum dibaca` : 'Data belum tersedia',
      icon: Mail,
      color: stats?.unreadMessages ? 'rose' : 'stone',
      link: '/admin/pesan',
      alert: (stats?.unreadMessages || 0) > 0
    },
    {
      label: 'Pengunjung Hari Ini',
      value: stats?.visitorsToday ?? null,
      sub: 'Pengunjung unik hari ini',
      icon: Calendar,
      color: 'emerald',
      link: '/admin/statistik'
    },
    {
      label: 'Total Pengunjung',
      value: stats?.totalVisitors ?? null,
      sub: 'Akumulasi seluruh kunjungan',
      icon: Eye,
      color: 'sky',
      link: '/admin/statistik'
    }
  ];

  const quickActions = [
    { label: 'Tulis Berita Baru', icon: Newspaper, path: '/admin/berita', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    { label: 'Tambah Guru / Staf', icon: Users, path: '/admin/guru-staf', color: 'bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold' },
    { label: 'Atur Struktur Organisasi', icon: GraduationCap, path: '/admin/organisasi', color: 'bg-sky-600 hover:bg-sky-700 text-white' },
    { label: 'Perbarui Visi, Misi & Profil', icon: BookOpen, path: '/admin/profil', color: 'bg-emerald-800 hover:bg-emerald-900 text-white' },
    { label: 'Catat Prestasi Siswa', icon: Award, path: '/admin/prestasi', color: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: 'Unggah Foto Galeri', icon: Image, path: '/admin/galeri', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' }
  ];

  return (
    <div className="space-y-8 font-poppins pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800/60">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-amber-300 text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Manajemen Konten (CMS) SMP Islam Caruy</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Selamat Datang di Dashboard Administrator
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-normal leading-relaxed">
              Pusat kendali konten sekolah, statistik kunjungan, publikasi berita, profil pendidik, sarana pembelajaran, dan interaksi masyarakat secara terintegrasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/berita"
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Berita</span>
            </Link>
            <Link
              to="/"
              target="_blank"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm"
            >
              <span>Buka Website Publik</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {statsError && (
        <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {statsError}
        </div>
      )}

      {/* Database Engine Architecture Indicator */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            dbStatus?.mysql?.connected
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-800'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">
                Penyimpanan Data: MySQL Relasional
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                dbStatus?.mysql?.connected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border border-amber-300'
              }`}>
                {dbStatus?.mysql?.connected ? 'MySQL Aktif' : dbStatus ? 'MySQL Tidak Terhubung' : 'Status Belum Diketahui'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {dbStatus?.mysql?.connected
                ? `Terhubung ke MySQL host ${dbStatus.mysql.host}:${dbStatus.mysql.port} (${dbStatus.mysql.database})`
                : 'Status koneksi database belum tersedia. Statistik tidak akan diasumsikan atau dibuat-buat.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-stone-600 self-end sm:self-center font-medium">
          <Server className="w-4 h-4 text-emerald-600" />
          <span>Express Backend + React 19 Frontend</span>
        </div>
      </div>

      {/* Akses Cepat Tombol Tambah Konten */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Aksi Cepat Pengelolaan Konten</h2>
            <p className="text-[11px] text-stone-400 font-normal">Pintasan sekali klik untuk memperbarui data sekolah</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Quick Actions
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className={`${action.color} p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-xs font-semibold`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[11px] leading-tight">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 8 Metric Summary Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900">Ringkasan Entitas & Trafik</h2>
          <span className="text-[11px] text-stone-500 font-medium">{loading ? "Memuat data..." : "Data terbaru"}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between space-y-3 hover:shadow-md transition-all hover:border-emerald-300 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                    {card.label}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    card.alert
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    {card.value === null ? '—' : card.value.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-stone-400 font-normal mt-1 truncate">
                    {card.sub}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Charts Section: Traffic & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visitor Traffic AreaChart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Statistik Pengunjung 30 Hari Terakhir</h3>
              <p className="text-xs text-stone-400 font-normal">Jumlah kunjungan unik dan tayangan halaman website</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Realtime Logs
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.visitorTraffic || []}>
                <defs>
                  <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="visitors" name="Pengunjung" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#visitorGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Breakdown BarChart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Distribusi Kategori Berita</h3>
            <p className="text-xs text-stone-400 font-normal">Jumlah berita per kategori</p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryBreakdown || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis dataKey="name" type="category" width={95} tick={{ fontSize: 10, fill: '#374151' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Jumlah" fill="#10B981" radius={[0, 6, 6, 0]}>
                  {stats?.categoryBreakdown?.map((_, i) => (
                    <Cell key={i} fill={['#059669', '#EAB308', '#0284C7', '#F97316', '#6366F1'][i % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-between text-xs text-stone-500">
            <span>Sinkronisasi database</span>
            <span className={`font-bold ${dbStatus?.mysql?.connected ? 'text-emerald-700' : 'text-amber-700'}`}>
              {dbStatus?.mysql?.connected ? 'Terhubung' : dbStatus ? 'Tidak terhubung' : 'Belum diketahui'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Widget: Berita Terbaru & Pesan Masuk Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Berita Terbaru Widget (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-stone-900">Daftar Berita & Warta Terbaru</h3>
            </div>
            <Link to="/admin/berita" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              <span>Kelola Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentNews.length > 0 ? (
              recentNews.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-stone-100 hover:border-emerald-200 transition-all flex items-center gap-3.5 bg-stone-50/50 hover:bg-emerald-50/30"
                >
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=200'}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.category_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status === 'published' ? 'Terbit' : 'Draft'}
                      </span>
                      <span className="text-[10px] text-stone-400 ml-auto hidden sm:inline">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-stone-500 font-normal truncate mt-0.5">{item.summary}</p>
                  </div>
                  <Link
                    to="/admin/berita"
                    className="p-2 rounded-xl text-stone-400 hover:text-emerald-700 hover:bg-white transition-colors shrink-0"
                    title="Ubah Berita"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 text-center py-8">Belum ada berita yang diterbitkan.</p>
            )}
          </div>
        </div>

        {/* Pesan Masuk Terbaru Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-stone-900">Pesan Pengunjung Terbaru</h3>
            </div>
            <Link to="/admin/pesan" className="text-xs font-bold text-emerald-700 hover:underline">
              Semua Pesan
            </Link>
          </div>

          <div className="space-y-3">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    !msg.is_read ? 'bg-amber-50/70 border-amber-200 shadow-xs' : 'bg-stone-50/60 border-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{msg.name}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5 truncate">{msg.subject}</p>
                  <p className="text-xs text-stone-500 line-clamp-1 font-normal mt-1">{msg.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 text-center py-8">Belum ada pesan pengunjung.</p>
            )}
          </div>
        </div>
      </div>

      {/* Log Aktivitas Sistem */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">Aktivitas Audit Log Pengelola</h3>
          </div>
          <span className="text-[10px] bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-mono">
            Keamanan & Audit Terverifikasi
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          {activities.length > 0 ? (
            activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <span className="font-bold text-stone-900 mr-2">{act.action}</span>
                  <span className="text-stone-500 font-normal">{act.description}</span>
                </div>
                <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                  {new Date(act.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400 text-center py-6">Belum ada catatan aktivitas.</p>
          )}
        </div>
      </div>
    </div>
  );
};
