import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { PPDBInfo } from '../../types';
import { Save, CheckCircle, AlertCircle, Plus, Trash2, Calendar, FileText } from 'lucide-react';
import { toast } from '../../hooks/useToast';
import { ADMISSION_LABEL } from '../../config/admissions';

export const ManagePPDB: React.FC = () => {
  const [ppdb, setPpdb] = useState<PPDBInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    schoolApi.getPPDB().then(res => setPpdb(res));
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppdb) return;
    setSaving(true);
    try {
      const res = await schoolApi.updatePPDB(ppdb);
      if (res.success) {
        toast.success(`Pengaturan ${ADMISSION_LABEL} berhasil disimpan!`);
      }
    } catch (err) {
      toast.error(`Gagal menyimpan pengaturan ${ADMISSION_LABEL}.`);
    } finally {
      setSaving(false);
    }
  };

  if (!ppdb) {
    return <div className="p-8 text-center text-xs text-stone-500 font-poppins">Memuat data {ADMISSION_LABEL}...</div>;
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Pengaturan {ADMISSION_LABEL}</h1>
        </div>
      </div>

      

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: STATUS & TAHUN AJARAN */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Status Pembukaan & Periode</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-700">Status Pendaftaran:</span>
              <button
                type="button"
                onClick={() => setPpdb({ ...ppdb, is_open: ppdb.is_open ? 0 : 1 })}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  ppdb.is_open ? 'bg-emerald-700 text-white shadow-sm' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {ppdb.is_open ? 'DIBUKA' : 'DITUTUP'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Tahun Ajaran *</label>
              <input
                type="text"
                required
                value={ppdb.academic_year}
                onChange={(e) => setPpdb({ ...ppdb, academic_year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Kontak Panitia</label>
              <input
                type="text"
                value={ppdb.contact_person}
                onChange={(e) => setPpdb({ ...ppdb, contact_person: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">WhatsApp Panitia</label>
              <input
                type="text"
                value={ppdb.contact_whatsapp}
                onChange={(e) => setPpdb({ ...ppdb, contact_whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Ringkasan Pendaftaran</label>
            <textarea
              rows={3}
              value={ppdb.overview}
              onChange={(e) => setPpdb({ ...ppdb, overview: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal"
            />
          </div>
        </div>

        {/* SECTION 2: PERSYARATAN BERKAS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Daftar Dokumen Persyaratan</h2>
            <button
              type="button"
              onClick={() => setPpdb({ ...ppdb, requirements: [...ppdb.requirements, ''] })}
              className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Syarat</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {ppdb.requirements.map((req, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-6 text-xs text-stone-400 font-bold">{idx + 1}.</span>
                <input
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const newR = [...ppdb.requirements];
                    newR[idx] = e.target.value;
                    setPpdb({ ...ppdb, requirements: newR });
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newR = ppdb.requirements.filter((_, i) => i !== idx);
                    setPpdb({ ...ppdb, requirements: newR });
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: BIAYA PENDIDIKAN */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Transparansi Biaya Pendidikan</h2>
              <p className="text-xs text-stone-400">Tampilkan rincian pembiayaan pada halaman publik</p>
            </div>
            <button
              type="button"
              onClick={() => setPpdb({ ...ppdb, show_fees: ppdb.show_fees ? 0 : 1 })}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                ppdb.show_fees ? 'bg-emerald-700 text-white shadow-sm' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {ppdb.show_fees ? 'TAMPILKAN BIAYA' : 'SEMBUNYIKAN BIAYA'}
            </button>
          </div>

          {ppdb.show_fees ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Keterangan Biaya & Kebijakan Angsuran</label>
                <textarea
                  rows={2}
                  value={ppdb.fees_description}
                  onChange={(e) => setPpdb({ ...ppdb, fees_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-stone-700">Item Pembiayaan</label>
                  <button
                    type="button"
                    onClick={() => setPpdb({ ...ppdb, fees_items: [...ppdb.fees_items, { item: '', nominal: '', note: '' }] })}
                    className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Komponen Biaya</span>
                  </button>
                </div>

                {ppdb.fees_items.map((fee, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <input
                      type="text"
                      value={fee.item}
                      onChange={(e) => {
                        const newF = [...ppdb.fees_items];
                        newF[idx].item = e.target.value;
                        setPpdb({ ...ppdb, fees_items: newF });
                      }}
                      className="sm:col-span-6 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={fee.nominal}
                      onChange={(e) => {
                        const newF = [...ppdb.fees_items];
                        newF[idx].nominal = e.target.value;
                        setPpdb({ ...ppdb, fees_items: newF });
                      }}
                      className="sm:col-span-3 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold"
                    />
                    <input
                      type="text"
                      value={fee.note || ''}
                      onChange={(e) => {
                        const newF = [...ppdb.fees_items];
                        newF[idx].note = e.target.value;
                        setPpdb({ ...ppdb, fees_items: newF });
                      }}
                      className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newF = ppdb.fees_items.filter((_, i) => i !== idx);
                        setPpdb({ ...ppdb, fees_items: newF });
                      }}
                      className="sm:col-span-1 p-2 text-stone-400 hover:text-red-600 transition-colors flex justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
        </button>
      </form>
    </div>
  );
};
