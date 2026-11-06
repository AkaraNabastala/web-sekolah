import { toast } from '../../hooks/useToast';
import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { NewsArticle, NewsCategory } from '../../types';
import { NewsEditorModal } from '../../modals/news/NewsEditorModal';
import { NewsPreviewModal } from '../../modals/news/NewsPreviewModal';
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
        toast.success('Thumbnail berhasil diunggah!');
      }
    } catch (err) {
      toast.error('Gagal mengunggah thumbnail.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Judul dan konten wajib diisi.');
      return;
    }

    try {
      if (editingId) {
        await schoolApi.updateNews(editingId, formData);
        toast.success('Warta berita berhasil diperbarui!');
      } else {
        await schoolApi.createNews(formData);
        toast.success('Berita baru berhasil diterbitkan!');
      }
      setModalOpen(false);
      loadNews();
    } catch (err) {
      toast.error('Terjadi kesalahan saat menyimpan berita.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus warta ini?')) {
      try {
        await schoolApi.deleteNews(id);
        toast.success('Berita berhasil dihapus.');
        loadNews();
      } catch (err) {
        toast.error('Gagal menghapus berita.');
      }
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Berita & Artikel</h1>
          <p className="text-xs text-stone-500 font-normal mt-0.5">
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
            <tbody className="divide-y divide-stone-100 font-normal">
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
                    </b      {modalOpen && (
        <NewsEditorModal
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          uploading={uploading}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          onTitleChange={handleTitleChange}
          onFileUpload={handleFileUpload}
        />
      )}

      {previewModalOpen && previewArticle && (
        <NewsPreviewModal article={previewArticle} onClose={() => setPreviewModalOpen(false)} />
      )}
it('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
