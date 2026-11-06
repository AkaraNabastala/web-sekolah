import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { GalleryMedia, GalleryAlbum } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Image as ImageIcon, Play, X, ExternalLink, Filter } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [mediaList, setMediaList] = useState<GalleryMedia[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
  const [category, setCategory] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getGallery(category)
      .then(res => setMediaList(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  const categories = ['Semua', 'Akademik', 'Keagamaan', 'Kesiswaan', 'Umum'];

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
      <SEO
        title="Galeri Foto & Video"
        description="Dokumentasi kegiatan belajar, ekstrakurikuler siswa, dan profil SMP Islam Caruy."
      />
      <PageHeader
        title="Galeri Foto & Video"
        subtitle="Dokumentasi kegiatan belajar dan keseharian siswa."
        badge="Dokumentasi Sekolah"
        breadcrumbs={[{ label: 'Galeri' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Category Filter Pills */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-stone-700">Kategori Album:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  category === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.file_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {item.media_type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {item.category}
                </div>
              </div>

              <div className="p-5 space-y-1">
                <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-stone-500 font-normal line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* LIGHTBOX MODAL */}
        {selectedMedia && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedMedia(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-100 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/80 text-white flex items-center justify-center hover:bg-stone-900 transition-colors"
                aria-label="Tutup Preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[60vh] bg-stone-950 flex items-center justify-center overflow-hidden">
                {selectedMedia.media_type === 'video' && selectedMedia.video_url ? (
                  <div className="w-full aspect-video">
                    {selectedMedia.video_url.includes('youtube.com') || selectedMedia.video_url.includes('youtu.be') ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedMedia.video_url.split('v=')[1] || 'dQw4w9WgXcQ'}`}
                        title={selectedMedia.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={selectedMedia.video_url} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                ) : (
                  <img
                    src={selectedMedia.file_url}
                    alt={selectedMedia.title}
                    className="w-full max-h-[60vh] object-contain"
                  />
                )}
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {selectedMedia.category}
                  </span>
                  <span className="text-xs text-stone-400">• SMP Islam Caruy Documentation</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{selectedMedia.title}</h3>
                {selectedMedia.caption && (
                  <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                    {selectedMedia.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
