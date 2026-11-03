import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { NewsArticle } from '../../types';
import { SEO } from '../../components/common/SEO';
import { motion } from 'framer-motion';
import {
  Calendar,
  Eye,
  User,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      setLoading(true);
      schoolApi.getNewsBySlug(slug)
        .then(res => {
          setArticle(res);
          // Load related news
          schoolApi.getNews().then(all => {
            setRelated(all.filter(a => a.slug !== slug).slice(0, 4));
          });
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWA = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Baca berita SMP Islam Caruy: ${article?.title || ''}`);
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="font-['Poppins'] min-h-screen bg-stone-50 py-32 text-center">
        <p className="text-stone-500 text-sm">Memuat artikel...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="font-['Poppins'] min-h-screen bg-stone-50 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Artikel Tidak Ditemukan</h2>
        <p className="text-stone-500 text-sm">Maaf, artikel yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <Link to="/berita" className="inline-block bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
          Kembali ke Warta Sekolah
        </Link>
      </div>
    );
  }

  return (
    <div className="font-['Poppins'] bg-stone-50 min-h-screen pb-24">
      <SEO
        title={article.title}
        description={article.summary || article.content.substring(0, 160)}
        ogType="article"
        ogImage={article.thumbnail}
      />
      <PageHeader
        title={article.title}
        badge={article.category_name || 'Berita Sekolah'}
        breadcrumbs={[
          { label: 'Berita & Artikel', href: '/berita' },
          { label: article.category_name || 'Kategori', href: `/berita?kategori=${article.category_slug}` },
          { label: 'Detail' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Column (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-stone-100 space-y-8">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4 text-xs text-stone-400 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-stone-700 font-semibold">
                  <User className="w-4 h-4 text-emerald-600" />
                  {article.author || 'Admin'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.published_at || article.created_at || '').toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {article.views_count || 0} dibaca
                </span>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={shareToWA}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Bagikan ke WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={copyUrl}
                  className="bg-stone-100 text-stone-700 hover:bg-stone-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Salin Tautan"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            {article.thumbnail && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm bg-stone-100">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Summary Lead */}
            {article.summary && (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border-l-4 border-emerald-600 text-stone-700 text-sm sm:text-base font-medium italic leading-relaxed">
                {article.summary}
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed space-y-4 font-light">
              {article.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Back Button */}
            <div className="pt-8 border-t border-stone-100 flex items-center justify-between">
              <Link
                to="/berita"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Indeks Berita</span>
              </Link>
            </div>
          </div>

          {/* Sidebar Column: Related News (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-extrabold text-stone-900">Warta Terkait</h3>
              </div>

              <div className="space-y-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/berita/${rel.slug}`}
                    className="flex gap-3 group items-start border-b border-stone-50 pb-3 last:border-0"
                  >
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={rel.thumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=200'}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-emerald-700 uppercase">
                        {rel.category_name}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-[10px] text-stone-400">
                        {new Date(rel.published_at || rel.created_at || '').toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
