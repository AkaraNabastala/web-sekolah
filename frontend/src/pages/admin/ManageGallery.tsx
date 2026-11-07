import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { GalleryMedia } from '../../types';
import { Plus, Trash2, Upload, Play, CheckCircle, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export const ManageGallery: React.FC = () => {
  const [mediaList, setMediaList] = useState<GalleryMedia[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<Partial<GalleryMedia>>({
    title: '',
    media_type: 'photo',
    file_url: '/demo/demo-event.svg',
    video_url: '',
    caption: '',
    category: 'Akademik'
  });

  const loadGallery = async () => {
    try {
      const res = await schoolApi.getGallery();
      setMediaList(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        setForm(prev => ({ ...prev, file_url: res.fileUrl }));
        toast.success('Foto berhasil diunggah!');
      }
    } catch (err) {
      toast.error('Gagal mengunggah berkas.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.file_url) {
      toast.error('Judul dan file URL wajib diisi.');
      return;
    }

    try {
      await schoolApi.createGalleryMedia(form);
      toast.success('Media berhasil disimpan ke galeri!');
      setModalOpen(false);
      setForm({
        title: '',
        media_type: 'photo',
        file_url: '/demo/demo-event.svg',
        video_url: '',
        caption: '',
        category: 'Akademik'
      });
      loadGallery();
    } catch (err) {
      toast.error('Gagal menambahkan media.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus media ini dari galeri?')) {
      try {
        await schoolApi.deleteGalleryMedia(id);
        toast.success('Media berhasil dihapus.');
        loadGallery();
      } catch (err) {
        toast.error('Gagal menghapus media.');
      }
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Galeri Media</h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto / Video</span>
        </button>
      </div>

      

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 flex flex-col group relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img src={item.file_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {item.media_type === 'video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-current opacity-80" />
                </div>
              )}
              <span className="absolute top-2 left-2 bg-emerald-950/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
              <div>
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{item.title}</h4>
                {item.caption && (
                  <p className="text-[11px] text-stone-500 line-clamp-2 font-normal mt-0.5">{item.caption}</p>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px]">
                <span className="text-stone-400 font-medium capitalize">{item.media_type}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-1 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Upload Media Galeri Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Judul Media *</label>
                <input
                  type="text"
                  required
                  value={form.title ?? ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Jenis Media</label>
                  <select
                    value={form.media_type ?? ''}
                    onChange={(e) => setForm({ ...form, media_type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  >
                    <option value="photo">Foto Dokumentasi</option>
                    <option value="video">Tautan Video</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Kategori Album</label>
                  <select
                    value={form.category ?? ''}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Foto Thumbnail / Gambar (URL atau Upload) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.file_url ?? ''}
                    onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                  <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {form.media_type === 'video' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">URL Tautan Video (YouTube)</label>
                  <input
                    type="text"
                    value={form.video_url ?? ''}
                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Keterangan / Caption</label>
                <textarea
                  rows={2}
                  value={form.caption ?? ''}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Simpan ke Galeri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
