import React, { useEffect, useState } from 'react';
import { CalendarDays, ClipboardList, GraduationCap, Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { schoolApi } from '../../services/api';
import { PPDBInfo } from '../../types';

export const DashboardPPDB: React.FC = () => {
  const [ppdb, setPpdb] = useState<PPDBInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    schoolApi.getPPDB()
      .then(setPpdb)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const isOpen = Boolean(ppdb?.is_open);

  return (
    <div className="space-y-6 font-poppins pb-10">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard PPDB</h1>
        <p className="text-xs text-stone-500 mt-1">Ringkasan informasi penerimaan peserta didik baru.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">Memuat informasi PPDB...</div>
      ) : loadError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Informasi PPDB belum dapat dimuat. Periksa apakah modul PPDB sedang aktif.
        </div>
      ) : ppdb ? (
        <>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Tahun ajaran</p>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">{ppdb.academic_year || 'Belum ditentukan'}</h2>
              <p className="text-xs text-stone-500 mt-1">Status penerimaan peserta didik baru</p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
              {isOpen ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {isOpen ? 'Pendaftaran dibuka' : 'Pendaftaran ditutup'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <CalendarDays className="w-5 h-5 text-emerald-700 mb-3" />
              <p className="text-xs text-stone-500">Periode pendaftaran</p>
              <p className="text-sm font-bold text-stone-900 mt-1">{ppdb.start_date || 'Belum diatur'} – {ppdb.end_date || 'Belum diatur'}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <ClipboardList className="w-5 h-5 text-emerald-700 mb-3" />
              <p className="text-xs text-stone-500">Tahapan dan persyaratan</p>
              <p className="text-sm font-bold text-stone-900 mt-1">{ppdb.steps?.length || 0} tahapan · {ppdb.requirements?.length || 0} persyaratan</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <Phone className="w-5 h-5 text-emerald-700 mb-3" />
              <p className="text-xs text-stone-500">Narahubung PPDB</p>
              <p className="text-sm font-bold text-stone-900 mt-1">{ppdb.contact_person || 'Belum diatur'}</p>
              <p className="text-xs text-stone-500 mt-1">{ppdb.contact_phone || ppdb.contact_whatsapp || 'Nomor belum diatur'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-800 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Pengelolaan PPDB</h3>
              <p className="text-xs text-emerald-900 mt-1">Gunakan menu Pengaturan PPDB untuk memperbarui tahun ajaran, jadwal, persyaratan, biaya, dan informasi kontak.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">Data PPDB belum tersedia.</div>
      )}
    </div>
  );
};
