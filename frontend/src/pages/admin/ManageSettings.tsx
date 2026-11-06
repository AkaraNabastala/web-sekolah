import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { WebsiteSettings } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { Save, CheckCircle, AlertCircle, Upload, Globe, Palette, Sliders } from 'lucide-react';
import { toast } from '../../hooks/useToast';
import { ADMISSION_LABEL } from '../../config/admissions';

const FEATURE_OPTIONS = [
  { key: 'history', label: 'Sejarah Sekolah' },
  { key: 'organization', label: 'Struktur Organisasi' },
  { key: 'teachers', label: 'Guru & Tenaga Kependidikan' },
  { key: 'programs', label: 'Program & Ekstrakurikuler' },
  { key: 'news', label: 'Berita & Pengumuman' },
  { key: 'agenda', label: 'Agenda & Kegiatan' },
  { key: 'gallery', label: 'Galeri' },
  { key: 'achievements', label: 'Prestasi' },
  { key: 'facilities', label: 'Fasilitas' },
  { key: 'ppdb', label: ADMISSION_LABEL },
  { key: 'contact', label: 'Kontak' }
] as const;

const DEFAULT_FEATURE_FLAGS: Record<string, boolean> = Object.fromEntries(FEATURE_OPTIONS.map(item => [item.key, true]));

function normalizeFeatureFlags(value: WebsiteSettings['feature_flags']): Record<string, boolean> {
  let parsed: any = value;
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed); } catch { parsed = null; }
  }
  return { ...DEFAULT_FEATURE_FLAGS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
}

export const ManageSettings: React.FC = () => {
  const { updateCachedSettings } = useSchool();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    schoolApi.getSettings().then(res => setSettings({ ...res, feature_flags: normalizeFeatureFlags(res.feature_flags) }));
  }, []);


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        setSettings(prev => (prev ? { ...prev, logo_url: res.fileUrl } : null));
        toast.success('Logo berhasil diunggah!');
      }
    } catch (err) {
      toast.error('Gagal mengunggah logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await schoolApi.updateSettings(settings);
      if (res.success) {
        updateCachedSettings(res.data);
        toast.success('Pengaturan website berhasil disimpan!');
      }
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-stone-500 font-poppins">Memuat konfigurasi website...</div>;
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Pengaturan Website</h1>
        </div>
      </div>

      

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: IDENTITAS & LOGO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Branding & Logo Resmi</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Sekolah</label>
              <input
                type="text"
                required
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Tagline / Slogan Sekolah</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Logo Sekolah (URL atau Unggah Berkas)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
              <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? '...' : 'Upload Logo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: PALET WARNA & FITUR WEBSITE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Tema Warna Website</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Hijau & Emas', primary: '#1B3B2B', secondary: '#E5C178', orange: '#C87941', blue: '#547C91' },
              { name: 'Biru & Perak', primary: '#183B56', secondary: '#B8C7D9', orange: '#D58B52', blue: '#3977A8' },
              { name: 'Marun & Krem', primary: '#642D3D', secondary: '#E8D6B8', orange: '#B87945', blue: '#6F8294' },
              { name: 'Teal & Pasir', primary: '#145B5A', secondary: '#D9C6A5', orange: '#C47B4B', blue: '#477F91' }
            ].map(preset => (
              <button key={preset.name} type="button" onClick={() => setSettings({ ...settings, primary_color: preset.primary, secondary_color: preset.secondary, accent_orange: preset.orange, accent_blue: preset.blue })} className="border border-stone-200 hover:border-stone-400 rounded-xl px-3 py-2 text-left text-xs font-semibold text-stone-700">
                <span className="flex gap-1.5 mb-1.5">{[preset.primary, preset.secondary, preset.orange, preset.blue].map(color => <span key={color} className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: color }} />)}</span>
                {preset.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: 'primary_color', label: 'Warna Utama' },
              { key: 'secondary_color', label: 'Warna Sekunder' },
              { key: 'accent_orange', label: 'Warna Aksen 1' },
              { key: 'accent_blue', label: 'Warna Aksen 2' }
            ].map(item => (
              <label key={item.key} className="space-y-2 block text-xs font-semibold text-stone-700">
                {item.label}
                <div className="flex items-center gap-2">
                  <input type="color" value={(settings as any)[item.key] || '#1B3B2B'} onChange={e => setSettings({ ...settings, [item.key]: e.target.value })} className="w-10 h-10 border border-stone-200 rounded-lg p-1 bg-white" />
                  <input type="text" value={(settings as any)[item.key] || ''} onChange={e => setSettings({ ...settings, [item.key]: e.target.value })} className="min-w-0 w-full px-2 py-2 rounded-lg border border-stone-200 bg-stone-50 font-mono text-[11px]" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-5">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Fitur Website</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FEATURE_OPTIONS.map(feature => (
              <label key={feature.key} className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:border-emerald-300 cursor-pointer">
                <input type="checkbox" checked={normalizeFeatureFlags(settings.feature_flags)[feature.key] !== false} onChange={e => setSettings({ ...settings, feature_flags: { ...normalizeFeatureFlags(settings.feature_flags), [feature.key]: e.target.checked } })} className="mt-0.5 accent-emerald-700" />
                <span><span className="block text-xs font-bold text-stone-800">{feature.label}</span><span className="block text-[11px] text-stone-500 mt-0.5">{feature.description}</span></span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 3: BERANDA & HERO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Konten Hero Beranda</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Headline Hero Beranda</label>
            <input
              type="text"
              value={settings.hero_title}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Sub-Headline / Paragraf Sambutan Hero</label>
            <textarea
              rows={3}
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">URL Gambar Hero Utama</label>
            <input
              type="text"
              value={settings.hero_image}
              onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>
        </div>

        {/* SECTION 3: ANGKA STATISTIK BERANDA */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Angka Statistik Sekolah (Counter Beranda)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Siswa Aktif</label>
              <input
                type="number"
                value={settings.stats_students}
                onChange={(e) => setSettings({ ...settings, stats_students: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Guru & Tenaga Staf</label>
              <input
                type="number"
                value={settings.stats_teachers}
                onChange={(e) => setSettings({ ...settings, stats_teachers: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Prestasi Juara</label>
              <input
                type="number"
                value={settings.stats_achievements}
                onChange={(e) => setSettings({ ...settings, stats_achievements: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Total Alumni</label>
              <input
                type="number"
                value={settings.stats_alumni}
                onChange={(e) => setSettings({ ...settings, stats_alumni: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: MEDIA SOSIAL & SEO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900">Media Sosial & Optimasi SEO</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Instagram URL</label>
              <input
                type="text"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Facebook URL</label>
              <input
                type="text"
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">YouTube Channel URL</label>
              <input
                type="text"
                value={settings.youtube_url}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">TikTok URL</label>
              <input
                type="text"
                value={settings.tiktok_url}
                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Meta Title SEO</label>
            <input
              type="text"
              value={settings.seo_title}
              onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Meta Description SEO</label>
            <textarea
              rows={2}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Teks Copyright Footer</label>
            <input
              type="text"
              value={settings.footer_text}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan Website'}</span>
        </button>
      </form>
    </div>
  );
};
