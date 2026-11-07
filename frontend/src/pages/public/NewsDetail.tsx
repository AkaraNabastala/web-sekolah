import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { NewsArticle } from '../../types';
import { SEO } from '../../components/common/SEO';
import { RichTextContent } from '../../components/common/RichTextEditor';
import { motion } from 'framer-motion';
import {
  Calendar,
  Eye,
  User,
  ArrowLeft,
  Share2,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
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

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setShareOpen(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Salin tautan berita ini:', window.location.href);
    }
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article?.title || 'Berita sekolah');
  const shareLinks = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${shareTitle}%20${shareUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}` },
    { label: 'Telegram', href: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}` },
    { label: 'Email', href: `mailto:?subject=${shareTitle}&body=${shareUrl}` }
  ];

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article?.title || 'Berita sekolah', url: window.location.href }); }
      catch { /* User closed the native share sheet. */ }
    } else setShareOpen(value => !value);
  };

  if (loading) {
    return (
      <div className="font-poppins min-h-screen bg-stone-50 py-32 text-center">
        <p className="text-stone-500 text-sm">Memuat artikel...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="font-poppins min-h-screen bg-stone-50 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Artikel Tidak Ditemukan</h2>
        <p className="text-stone-500 text-sm">Maaf, artikel yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <Link to="/berita" className="inline-block bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
          Kembali ke Warta Sekolah
        </Link>
      </div>
    );
  }

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
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

              {/* Share menu */}
              <div className="relative">
                <button type="button" onClick={() => setShareOpen(value => !value)} aria-expanded={shareOpen} className="bg-stone-100 text-stone-700 hover:bg-stone-200 px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors">
                  <Share2 className="w-4 h-4" /><span>Bagikan</span>
                </button>
                {shareOpen && <div className="absolute right-0 top-full mt-2 z-30 w-48 rounded-xl border border-stone-200 bg-white p-2 shadow-xl">
                  <button type="button" onClick={shareNative} className="block w-full rounded-lg px-3 py-2 text-left text-xs text-stone-700 hover:bg-stone-50">Bagikan melalui perangkat</button>
                  {shareLinks.map(item => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" onClick={() => setShareOpen(false)} className="block rounded-lg px-3 py-2 text-xs text-stone-700 hover:bg-stone-50">{item.label}</a>)}
                  <button type="button" onClick={copyUrl} className="w-full text-left rounded-lg px-3 py-2 text-xs text-stone-700 hover:bg-stone-50">{copied ? 'Tautan tersalin' : 'Salin tautan'}</button>
                </div>}
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
            <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
              <RichTextContent value={article.content}/>
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
                <h3 className="text-base font-bold text-stone-900">Warta Terkait</h3>
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
                        src={rel.thumbnail || '/demo/demo-event.svg'}
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
