import React from 'react';
import { NewsArticle, NewsCategory } from '../../types';
import { X, Upload } from 'lucide-react';

interface NewsEditorModalProps {
  editingId: number | null;
  formData: Partial<NewsArticle>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<NewsArticle>>>;
  categories: NewsCategory[];
  uploading: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NewsEditorModal: React.FC<NewsEditorModalProps> = ({
  editingId, formData, setFormData, categories, uploading, onClose, onSubmit, onTitleChange, onFileUpload
}) => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-stone-900">
                {editingId ? 'Edit Warta Berita' : 'Tulis Berita Baru'}
              </h3>
              <button onClick={() => onClose()} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={onTitleChange}
                  placeholder="Masukkan judul artikel yang menarik..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Slug URL</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Ringkasan Singkat (Lead)</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk preview..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Isi Lengkap Artikel *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan isi berita selengkapnya (gunakan enter untuk paragraf)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-normal leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">URL Gambar Thumbnail</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://... atau upload file"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                    />
                    <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  >
                    <option value="published">Published (Tayang Publik)</option>
                    <option value="draft">Draft (Konsep Sementara)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md transition-all"
                >
                  {editingId ? 'Perbarui Warta' : 'Terbitkan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
);
