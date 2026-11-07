import React, { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, FileText, Search, X } from 'lucide-react';
import { ADMISSION_LABEL } from '../../config/admissions';
import { schoolApi } from '../../services/api';
import { toast } from '../../hooks/useToast';

type Application = {
  id: number;
  application_code: string;
  candidate_name: string;
  national_id?: string;
  birth_place?: string;
  birth_date?: string;
  gender?: string;
  origin_school: string;
  parent_name: string;
  parent_phone: string;
  address?: string;
  program?: string;
  notes?: string;
  status: string;
  submitted_at: string;
  documents?: Record<string, string> | string;
  admin_notes?: string;
};

const statusLabels: Record<string, string> = {
  received: 'Masuk',
  verified: 'Terverifikasi',
  accepted: 'Lulus seleksi',
  rejected: 'Tidak diterima'
};

const statusStyles: Record<string, string> = {
  received: 'bg-blue-50 text-blue-700',
  verified: 'bg-amber-50 text-amber-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700'
};

const parseDocuments = (value: Application['documents']): Record<string, string> => {
  if (!value) return {};
  if (typeof value !== 'string') return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const ManageAdmissionApplications: React.FC = () => {
  const [items, setItems] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setItems(await schoolApi.getAdmissionApplications());
    } catch {
      toast.error('Data pendaftar gagal dimuat.');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => items.filter(item => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [
      item.candidate_name,
      item.application_code,
      item.parent_name,
      item.origin_school,
      item.parent_phone
    ].some(value => String(value || '').toLowerCase().includes(query));
    return matchesSearch && (statusFilter === 'all' || item.status === statusFilter);
  }), [items, search, statusFilter]);

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await schoolApi.updateAdmissionApplication(selected.id, {
        status: selected.status,
        admin_notes: selected.admin_notes || ''
      });
      toast.success('Pemeriksaan pendaftaran diperbarui.');
      setSelected(null);
      await load();
    } catch {
      toast.error('Perubahan gagal disimpan.');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const fields: Array<keyof Application> = [
      'application_code', 'candidate_name', 'national_id', 'birth_place', 'birth_date',
      'gender', 'origin_school', 'parent_name', 'parent_phone', 'address',
      'program', 'status', 'submitted_at', 'admin_notes'
    ];
    const quote = (value: unknown) => {
      let raw = String(value ?? '');
      if (/^[=+\-@]/.test(raw)) raw = `'${raw}`;
      const q = String.fromCharCode(34);
      return q + raw.split(q).join(q + q) + q;
    };
    const csv = [
      fields.join(','),
      ...filtered.map(item => fields.map(field => quote(item[field])).join(','))
    ].join(String.fromCharCode(13, 10));
    const blob = new Blob([String.fromCharCode(0xFEFF) + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-pendaftar.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-900">Pendaftar {ADMISSION_LABEL}</h1>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
          <Download size={15} /> Ekspor CSV
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5">
          <Search size={16} className="text-stone-400" />
          <input aria-label="Cari pendaftar" className="w-full text-sm outline-none" placeholder="Cari nama, nomor, sekolah, atau kontak" value={(search) ?? ''} onChange={event => setSearch(event.target.value)} />
        </label>
        <select aria-label="Filter status pendaftaran" className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm" value={(statusFilter) ?? ''} onChange={event => setStatusFilter(event.target.value)}>
          <option value="all">Semua status</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={(value) ?? ''}>{label}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-100 px-4 py-3 text-xs text-stone-500">{filtered.length} dari {items.length} pendaftar</div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="p-4">Nomor / Calon Siswa</th>
              <th className="p-4">Asal Sekolah</th>
              <th className="p-4">Orang Tua</th>
              <th className="p-4">Tanggal Masuk</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(item => (
              <tr key={item.id}>
                <td className="p-4">
                  <div className="font-semibold text-stone-900">{item.candidate_name}</div>
                  <div className="text-xs text-stone-500">{item.application_code}</div>
                </td>
                <td className="p-4">{item.origin_school || '-'}</td>
                <td className="p-4">
                  <div>{item.parent_name || '-'}</div>
                  <div className="text-xs text-stone-500">{item.parent_phone || '-'}</div>
                </td>
                <td className="p-4 whitespace-nowrap">{formatDate(item.submitted_at)}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status] || 'bg-stone-100 text-stone-600'}`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => setSelected({ ...item })} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">Periksa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <div className="p-10 text-center text-sm text-stone-500">Tidak ada data pendaftaran yang sesuai.</div>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="application-dialog-title" className="my-6 w-full max-w-3xl space-y-5 rounded-2xl bg-white p-5 shadow-xl sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="application-dialog-title" className="text-lg font-bold text-stone-900">Pemeriksaan Pendaftaran</h2>
                <p className="mt-1 text-xs text-stone-500">{selected.application_code}</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Tutup detail pendaftar" className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"><X size={18}/></button>
            </div>

            <div className="grid gap-3 rounded-xl bg-stone-50 p-4 text-sm sm:grid-cols-2">
              <p><b>Nama calon siswa:</b> {selected.candidate_name}</p>
              <p><b>NIK:</b> {selected.national_id || '-'}</p>
              <p><b>Tempat, tanggal lahir:</b> {[selected.birth_place, formatDate(selected.birth_date)].filter(Boolean).join(', ') || '-'}</p>
              <p><b>Jenis kelamin:</b> {selected.gender === 'L' ? 'Laki-laki' : selected.gender === 'P' ? 'Perempuan' : '-'}</p>
              <p><b>Asal sekolah:</b> {selected.origin_school}</p>
              <p><b>Program:</b> {selected.program || 'Reguler'}</p>
              <p><b>Orang tua/wali:</b> {selected.parent_name}</p>
              <p><b>Nomor kontak:</b> {selected.parent_phone}</p>
              <p className="sm:col-span-2"><b>Alamat:</b> {selected.address || '-'}</p>
              <p className="sm:col-span-2"><b>Catatan pendaftar:</b> {selected.notes || '-'}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-stone-900">Dokumen pendukung</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(parseDocuments(selected.documents)).map(([name, filename]) => (
                  <a key={name} href={`/api/admin/admission-applications/${selected.id}/documents/${encodeURIComponent(filename)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-50">
                    <FileText size={14}/>{name}<ExternalLink size={12}/>
                  </a>
                ))}
                {!Object.keys(parseDocuments(selected.documents)).length && <p className="text-xs text-stone-500">Tidak ada dokumen yang diunggah.</p>}
              </div>
            </div>

            <label className="block text-sm font-semibold text-stone-800">
              Status seleksi
              <select className="mt-1.5 w-full rounded-lg border border-stone-200 p-3 font-normal" value={(selected.status) ?? ''} onChange={event => setSelected({ ...selected, status: event.target.value })}>
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={(value) ?? ''}>{label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-stone-800">
              Catatan panitia
              <textarea rows={3} maxLength={5000} className="mt-1.5 w-full rounded-lg border border-stone-200 p-3 font-normal" value={(selected.admin_notes || '') ?? ''} onChange={event => setSelected({ ...selected, admin_notes: event.target.value })}/>
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Batal</button>
              <button disabled={saving} onClick={() => void save()} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Menyimpan…' : 'Simpan Pemeriksaan'}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
