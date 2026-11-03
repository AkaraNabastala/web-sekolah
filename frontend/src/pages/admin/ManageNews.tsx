import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { NewsArticle, NewsCategory } from '../../types';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Search,
  Calendar,
  X,
  Upload,
  ExternalLink
} from 'lucide-react';

export const ManageNews: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: '',
    slug: '',
    category_id: 1,
    summary: '',
    content: '',
    thumbnail: '',
    author: 'Humas SMP Islam Caruy',
    status: 'published'
  });

  const loadNews = async () => {
    try {
      const [nRes, cRes] = await Promise.all([
        schoolApi.getAdminNews(),
        schoolApi.getNewsCategories()
      ]);
      setArticles(nRes);
      setCategories(cRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category_id: categories[0]?.id || 1,
      summary: '',
      content: '',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800',
      author: 'Humas SMP Islam Caruy',
      status: 'published'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setFormData({ ...article });
    setModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData({
      ...formData,
      title,
      slug: editingId ? formData.slug : baseSlug
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await schoolApi.uploadFile(file);
      if (res.success) {
        setFormData(prev => ({ ...prev, thumbnail: res.fileUrl }));
        showToast('Thumbnail berhasil diunggah!');
      }
    } catch (err) {
      showToast('Gagal mengunggah thumbnail.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast('Judul dan konten wajib diisi.', 'error');
      return;
    }

    try {
      if (editingId) {
        await schoolApi.updateNews(editingId, formData);
        showToast('Warta berita berhasil diperbarui!');
      } else {
        await schoolApi.createNews(formData);
        showToast('Berita baru berhasil diterbitkan!');
      }
      setModalOpen(false);
      loadNews();
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan berita.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus warta ini?')) {
      try {
        await schoolApi.deleteNews(id);
        showToast('Berita berhasil dihapus.');
        loadNews();
      } catch (err) {
        showToast('Gagal menghapus berita.', 'error');
      }
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Manajemen Berita & Artikel</h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Publikasikan agenda, prestasi siswa, liputan kegiatan, dan pengumuman resmi sekolah.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Warta Baru</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50/50"
            />
          </div>
          <span className="text-xs text-stone-400">Total {filtered.length} artikel</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Thumbnail & Judul</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Penulis</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-light">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 max-w-md">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <img src={item.thumbnail || ''} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-stone-400">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                      {item.category_name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-600">{item.author}</td>
                  <td className="py-3 px-4 font-semibold text-stone-700">{item.views_count || 0}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setPreviewArticle(item);
                        setPreviewModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Preview Warta"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Edit Berita"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-extrabold text-stone-900">
                {editingId ? 'Edit Warta Berita' : 'Tulis Berita Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50 font-light leading-relaxed"
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
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
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
                  onClick={() => setModalOpen(false)}
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
      )}

      {/* ARTICLE PREVIEW MODAL */}
      {previewModalOpen && previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Preview Mode • {previewArticle.category_name}
              </span>
              <button onClick={() => setPreviewModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-extrabold text-stone-900">{previewArticle.title}</h2>
            {previewArticle.thumbnail && (
              <img src={previewArticle.thumbnail} alt={previewArticle.title} className="w-full h-48 object-cover rounded-xl" />
            )}
            <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-lg border-l-4 border-emerald-600">
              {previewArticle.summary}
            </p>
            <div className="text-xs text-stone-700 leading-relaxed space-y-3 font-light">
              {previewArticle.content.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
