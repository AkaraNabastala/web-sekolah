import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Portal Resmi SMP Islam Caruy - Lembaga Pendidikan Menengah Pertama Islam Modern, Unggul dalam IPTEK dan Berakhlakul Karimah di Desa Caruy, Kec. Cipari, Cilacap.',
  ogType = 'website',
  ogImage = '/src/assets/logo.png'
}) => {
  useEffect(() => {
    // Set document title
    const fullTitle = `${title} | SMP Islam Caruy`;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1];
          if (propName) element.setAttribute('property', propName);
        } else if (selector.includes('name=')) {
          const nameValue = selector.match(/name="([^"]+)"/)?.[1];
          if (nameValue) element.setAttribute('name', nameValue);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // Update Meta Description
    setMetaTag('meta[name="description"]', 'content', description);

    // Update OpenGraph
    setMetaTag('meta[property="og:title"]', 'content', fullTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'content', ogImage);
    }
  }, [title, description, ogType, ogImage]);

  return null;
};
