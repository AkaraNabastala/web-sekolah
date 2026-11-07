import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Users,
  Eye,
  Activity,
  Calendar,
  Download,
  Smartphone,
  Globe,
  FileText,
  TrendingUp,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const VisitorStats: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [days, setDays] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    loadStatistics();
  }, [days]);

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const [sumRes, anaRes] = await Promise.all([
        api.get('/admin/statistics/summary'),
        api.get('/admin/statistics/analytics', { params: { days } })
      ]);
      setSummary(sumRes.data.data);
      setAnalytics(anaRes.data.data);
    } catch (err) {
      console.error('Gagal mengambil data statistik:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadXlsx = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/admin/statistics/export/xlsx', {
        params: { days },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `statistik_website_sekolah_${days}hari.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Gagal mengunduh laporan XLSX.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCsv = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/admin/statistics/export/csv', {
        params: { days },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `statistik_website_sekolah_${days}hari.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Gagal mengunduh laporan CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Statistik Pengunjung Website</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau jumlah tayangan, pengunjung unik, dan sesi interaksi secara akurat & menjaga privasi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Range */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  days === d
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d === 7 ? '7 Hari' : d === 30 ? '30 Hari' : '3 Bulan'}
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <button
            onClick={handleDownloadXlsx}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Excel</span>
          </button>
          <button
            onClick={handleDownloadCsv}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hari Ini</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {summary?.today?.unique_visitors_today ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pengunjung Unik ({summary?.today?.pageviews_today ?? 0} Views)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">7 Hari Terakhir</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {summary?.last_7_days?.unique_visitors_7d ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.last_7_days?.pageviews_7d ?? 0} Total Tayangan Halaman
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">30 Hari Terakhir</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {summary?.last_30_days?.unique_visitors_30d ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.last_30_days?.pageviews_30d ?? 0} Total Tayangan Halaman
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sepanjang Waktu</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Eye className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {summary?.all_time?.total_pageviews ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.all_time?.total_unique_visitors ?? 0} Pengunjung Unik Akumulasi
            </p>
          </div>
        </div>
      </div>

      {/* Main Chart: Tren Kunjungan Harian */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Grafik Kunjungan & Page Views Harian</h2>
        <div className="h-72 w-full">
          {analytics?.trends && analytics.trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="pageviews" name="Page Views" stroke="#15803D" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="unique_visitors" name="Unique Visitors" stroke="#0284C7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#EAB308" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Belum ada riwayat kunjungan pada periode ini.
            </div>
          )}
        </div>
      </div>

      {/* Two Column: Halaman Populer & Distribusi Perangkat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Halaman Paling Populer</span>
          </h2>
          <div className="space-y-3">
            {analytics?.popular_pages && analytics.popular_pages.length > 0 ? (
              analytics.popular_pages.map((p: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
                  <span className="font-mono text-slate-700 truncate max-w-[280px]">{p.path}</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full text-xs">
                    {p.views} views
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs py-4 text-center">Belum ada data tayangan halaman.</p>
            )}
          </div>
        </div>

        {/* Perangkat & Browser */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Perangkat & Browser Pengunjung</span>
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tipe Perangkat</p>
              <div className="grid grid-cols-3 gap-2">
                {analytics?.devices && analytics.devices.length > 0 ? (
                  analytics.devices.map((d: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl text-center">
                      <span className="text-xs text-slate-500 capitalize">{d.device_type}</span>
                      <div className="text-lg font-bold text-slate-800">{d.count}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs col-span-3 text-center py-2">Tidak ada data</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Browser Terbanyak</p>
              <div className="space-y-1.5">
                {analytics?.browsers && analytics.browsers.length > 0 ? (
                  analytics.browsers.map((b: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">{b.browser}</span>
                      <span className="font-semibold text-slate-900">{b.count} sesi</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs text-center py-2">Tidak ada data</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
