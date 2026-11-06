import React from 'react';
import { NewsArticle } from '../../types';
import { X } from 'lucide-react';

interface NewsPreviewModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export const NewsPreviewModal: React.FC<NewsPreviewModalProps> = ({ article, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Preview Mode • {article.category_name}
              </span>
              <button onClick={() => onClose()} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-stone-900">{article.title}</h2>
            {article.thumbnail && (
              <img src={article.thumbnail} alt={article.title} className="w-full h-48 object-cover rounded-xl" />
            )}
            <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-lg border-l-4 border-emerald-600">
              {article.summary}
            </p>
            <div className="text-xs text-stone-700 leading-relaxed space-y-3 font-normal">
              {article.content.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
);
