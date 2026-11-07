import React, { useEffect, useState } from 'react';
import { toast } from '../../hooks/useToast';
import { schoolApi } from '../../services/api';
import { SchoolProfile, SchoolVisionMission, SchoolHistory } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import {
  Save, CheckCircle, Building, User, Compass, BookOpen, Plus, Trash2,
  AlertCircle, Upload, Calendar, Layers, Sparkles
} from 'lucide-react';

export const ManageHistory: React.FC = () => {
  const [history, setHistory] = useState<SchoolHistory | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { schoolApi.getHistory().then(setHistory).catch(() => toast.error('Gagal memuat sejarah sekolah.')); }, []);
  const handleFileUpload = async (file: File, _target?: 'headmaster' | 'history') => {
    setUploading(true);
    try { const res = await schoolApi.uploadFile(file); if (res.success && history) { setHistory({ ...history, featured_image: res.fileUrl }); toast.success('Foto berhasil diunggah!'); } }
    catch { toast.error('Gagal mengunggah foto.'); }
    finally { setUploading(false); }
  };
  const handleSaveHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!history) return;
    setSaving(true);
    try { const res = await schoolApi.updateHistory(history); if (res.success) toast.success('Sejarah dan linimasa berhasil disimpan!'); }
    catch { toast.error('Gagal menyimpan sejarah sekolah.'); }
    finally { setSaving(false); }
  };
  return (
    <div className="space-y-6 font-poppins pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Sejarah & Linimasa Sekolah</h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">Kelola artikel sejarah dan tonggak perjalanan sekolah.</p>
      </div>
      {history && (<form onSubmit={handleSaveHistory} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Sejarah & Linimasa Pendirian Sekolah</h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Kelola artikel sejarah lengkap dan milestone perjalanan sekolah dari masa ke masa</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Judul Artikel Sejarah</label>
            <input
              type="text"
              value={(history.title) ?? ''}
              onChange={(e) => setHistory({ ...history, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700">Foto Utama Dokumentasi Sejarah</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={history.featured_image || '/demo/demo-classroom.svg'}
                alt="Sejarah"
                className="w-32 h-20 rounded-xl object-cover border border-stone-200 shadow-xs"
              />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={(history.featured_image || '') ?? ''}
                  onChange={(e) => setHistory({ ...history, featured_image: e.target.value })}
                  placeholder="URL Foto Sejarah"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <label className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Mengunggah...' : 'Unggah File Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'history')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Uraian Artikel Sejarah</label>
            <textarea
              rows={8}
              value={(history.content) ?? ''}
              onChange={(e) => setHistory({ ...history, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal leading-relaxed"
            />
          </div>

          {/* CRUD LINIMASA (MILESTONES) */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Linimasa Tonggak Sejarah (Milestones)</h3>
                <p className="text-[11px] text-stone-400">Tahun-tahun penting dan pencapaian bersejarah sekolah</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = history.milestones || [];
                  setHistory({
                    ...history,
                    milestones: [...current, { year: `${new Date().getFullYear()}`, title: '', desc: '' }]
                  });
                }}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {(history.milestones || []).map((ms, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs text-stone-400 font-bold">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder="Tahun (e.g. 2005)"
                      value={(ms.year) ?? ''}
                      onChange={(e) => {
                        const newMs = [...(history.milestones || [])];
                        newMs[idx] = { ...newMs[idx], year: e.target.value };
                        setHistory({ ...history, milestones: newMs });
                      }}
                      className="w-24 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-emerald-800 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Judul Peristiwa Penting"
                      value={(ms.title) ?? ''}
                      onChange={(e) => {
                        const newMs = [...(history.milestones || [])];
                        newMs[idx] = { ...newMs[idx], title: e.target.value };
                        setHistory({ ...history, milestones: newMs });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newMs = (history.milestones || []).filter((_, i) => i !== idx);
                        setHistory({ ...history, milestones: newMs });
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      title="Hapus Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi singkat peristiwa..."
                    value={(ms.desc) ?? ''}
                    onChange={(e) => {
                      const newMs = [...(history.milestones || [])];
                      newMs[idx] = { ...newMs[idx], desc: e.target.value };
                      setHistory({ ...history, milestones: newMs });
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-normal text-stone-600 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Sejarah & Linimasa'}</span>
          </button>
        </form>)}
    </div>
  );
};
