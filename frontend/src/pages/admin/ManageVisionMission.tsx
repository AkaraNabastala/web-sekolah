import React, { useEffect, useState } from 'react';
import { toast } from '../../hooks/useToast';
import { schoolApi } from '../../services/api';
import { SchoolProfile, SchoolVisionMission, SchoolHistory } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import {
  Save, CheckCircle, Building, User, Compass, BookOpen, Plus, Trash2,
  AlertCircle, Upload, Calendar, Layers, Sparkles
} from 'lucide-react';

export const ManageVisionMission: React.FC = () => {
  const [visionMission, setVisionMission] = useState<SchoolVisionMission | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { schoolApi.getVisionMission().then(setVisionMission).catch(() => toast.error('Gagal memuat visi dan misi.')); }, []);
  const handleSaveVisionMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionMission) return;
    setSaving(true);
    try { const res = await schoolApi.updateVisionMission(visionMission); if (res.success) toast.success('Visi, misi, dan tujuan berhasil diperbarui!'); }
    catch { toast.error('Gagal menyimpan visi dan misi.'); }
    finally { setSaving(false); }
  };
  return (
    <div className="space-y-6 font-poppins pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Visi, Misi & Tujuan Sekolah</h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">Kelola rumusan visi, misi, dan tujuan pendidikan SMP Islam Caruy.</p>
      </div>
      {visionMission && (<form onSubmit={handleSaveVisionMission} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Visi, Misi, Tujuan & Nilai Utama</h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Rumusan arah haluan pembinaan karakter peserta didik SMP Islam Caruy</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Rumusan Visi Sekolah</label>
            <textarea
              rows={3}
              value={visionMission.vision}
              onChange={(e) => setVisionMission({ ...visionMission, vision: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Motto Singkat Visi</label>
            <input
              type="text"
              value={visionMission.vision_motto}
              onChange={(e) => setVisionMission({ ...visionMission, vision_motto: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          {/* CRUD DAFTAR MISI */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-800">Daftar Misi Sekolah</label>
                <p className="text-[11px] text-stone-400">Langkah strategis perwujudan visi</p>
              </div>
              <button
                type="button"
                onClick={() => setVisionMission({ ...visionMission, missions: [...visionMission.missions, ''] })}
                className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Misi</span>
              </button>
            </div>

            {visionMission.missions.map((m, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-6 text-xs text-stone-400 font-bold">{idx + 1}.</span>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => {
                    const newM = [...visionMission.missions];
                    newM[idx] = e.target.value;
                    setVisionMission({ ...visionMission, missions: newM });
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newM = visionMission.missions.filter((_, i) => i !== idx);
                    setVisionMission({ ...visionMission, missions: newM });
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* CRUD DAFTAR TUJUAN SEKOLAH */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-800">Tujuan Satuan Pendidikan</label>
                <p className="text-[11px] text-stone-400">Target capaian lulusan dan kultur sekolah</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const curGoals = visionMission.goals || [];
                  setVisionMission({ ...visionMission, goals: [...curGoals, ''] });
                }}
                className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tujuan</span>
              </button>
            </div>

            {(visionMission.goals || []).map((goal, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-6 text-xs text-stone-400 font-bold">{idx + 1}.</span>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => {
                    const newGoals = [...(visionMission.goals || [])];
                    newGoals[idx] = e.target.value;
                    setVisionMission({ ...visionMission, goals: newGoals });
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newGoals = (visionMission.goals || []).filter((_, i) => i !== idx);
                    setVisionMission({ ...visionMission, goals: newGoals });
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Visi & Misi'}</span>
          </button>
        </form>)}
    </div>
  );
};
