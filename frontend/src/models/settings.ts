// Domain models: settings

export interface WebsiteSettings {
  id: number;
  school_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_slides?: Array<{ id: number; image: string; tag?: string; title: string; subtitle?: string; badge?: string }> | string | null;
  primary_color: string;
  secondary_color: string;
  accent_orange: string;
  accent_blue: string;
  feature_flags: Record<string, boolean> | string | null;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  seo_title: string;
  seo_description: string;
  footer_text: string;
  stats_students: number;
  stats_teachers: number;
  stats_alumni: number;
  stats_achievements: number;
  updated_at?: string;
}
