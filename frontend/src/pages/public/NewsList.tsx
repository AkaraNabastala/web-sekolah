import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { NewsArticle, NewsCategory } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Calendar, Eye, Search, ChevronRight, User, Tag } from 'lucide-react';

export const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get('kategori') || 'semua';
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([schoolApi.getNews(), schoolApi.getNewsCategories()])
      .then(([nRes, cRes]) => {
        setNews(nRes);
        setCategories(cRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchCat = selectedCat === 'semua' || item.category_slug === selectedCat;
      const matchQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [news, selectedCat, searchQuery]);

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Berita & Artikel"
        description="Kabar terkini, artikel edukatif, liputan prestasi, agenda kegiatan sekolah, dan pengumuman resmi SMP Islam Caruy."
      />
      <PageHeader
        title="Berita, Artikel & Pengumuman"
        subtitle="Seputar informasi terkini, agenda kegiatan, prestasi santri, dan pengumuman resmi SMP Islam Caruy."
        badge="Warta Sekolah"
        breadcrumbs={[{ label: 'Berita & Artikel' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSearchParams({})}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCat === 'semua'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Semua Berita
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ kategori: cat.slug })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCat === cat.slug
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul warta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 transition-colors bg-stone-50/50"
            />
          </div>
        </div>

        {/* News Cards Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={article.thumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-700/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {article.category_name || 'Berita'}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.published_at || article.created_at || '').toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {article.views_count || 0}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    <Link to={`/berita/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 font-normal">
                    {article.summary}
                  </p>

                  <div className="pt-3 mt-auto border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-medium">
                      Oleh: {article.author || 'Admin'}
                    </span>
                    <Link
                      to={`/berita/${article.slug}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Baca</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-stone-100 space-y-3">
            <p className="text-stone-400 text-sm">Tidak ditemukan artikel pada kategori atau pencarian ini.</p>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchQuery('');
              }}
              className="text-xs font-bold text-emerald-700 underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
