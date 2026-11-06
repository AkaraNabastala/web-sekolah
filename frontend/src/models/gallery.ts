// Domain models: gallery

export interface GalleryAlbum {
  id: number;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  category: string;
  created_at?: string;
}

export interface GalleryMedia {
  id: number;
  album_id?: number;
  title: string;
  media_type: 'photo' | 'video';
  file_url: string;
  video_url?: string;
  caption?: string;
  category: string;
  display_order: number;
  created_at?: string;
}
