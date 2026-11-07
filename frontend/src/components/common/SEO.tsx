import React, { useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';

interface SEOProps {
  title: string;
  description?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Website resmi sekolah. Informasi profil, program, berita, kegiatan, dan layanan pendidikan.',
  ogType = 'website',
  ogImage
}) => {
  const { settings, profile } = useSchool();
  const schoolName = settings?.school_name || profile?.name || 'Nama Sekolah Anda';
  const resolvedOgImage = ogImage || settings?.logo_url || undefined;
  const resolvedFavicon = settings?.favicon_url || settings?.logo_url || '/favicon.svg';

  useEffect(() => {
    const fullTitle = title ? `${title} | ${schoolName}` : schoolName;
    if (document.title !== fullTitle) document.title = fullTitle;

    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const property = selector.match(/property="([^"]+)"/)?.[1];
        const name = selector.match(/name="([^"]+)"/)?.[1];
        if (property) element.setAttribute('property', property);
        if (name) element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[property="og:title"]', 'content', fullTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    if (resolvedOgImage) {
      setMetaTag('meta[property="og:image"]', 'content', resolvedOgImage);
    }

    // The browser favicon always represents the school brand. Article thumbnails
    // belong exclusively to Open Graph and must never replace the tab icon.
    let favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = resolvedFavicon;
  }, [schoolName, title, description, ogType, resolvedOgImage, resolvedFavicon]);

  return null;
};
