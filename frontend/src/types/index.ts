// ============================================================
// TypeScript Definitions for SMP Islam Caruy
// ============================================================

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar?: string;
  role: 'superadmin' | 'admin_konten' | 'admin_ppdb';
  is_active: boolean | number;
  last_login?: string;
  created_at?: string;
}

export interface SchoolProfile {
  id: number;
  name: string;
  npsn: string;
  education_level: string;
  status: string;
  accreditation: string;
  founding_year: string;
  headmaster_name: string;
  headmaster_photo: string;
  headmaster_welcome: string;
  description: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postal_code: string;
  phone: string;
  whatsapp: string;
  email: string;
  maps_embed_url: string;
  updated_at?: string;
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export interface SchoolHistory {
  id: number;
  title: string;
  content: string;
  featured_image?: string;
  milestones: Milestone[];
  updated_at?: string;
}

export interface CoreValue {
  title: string;
  icon: string;
  desc: string;
}

export interface SchoolVisionMission {
  id: number;
  vision: string;
  vision_motto: string;
  missions: string[];
  goals: string[];
  core_values: CoreValue[];
  updated_at?: string;
}

export interface OrganizationMember {
  id: number;
  position: string;
  name: string;
  nip?: string;
  photo?: string;
  level: number;
  parent_id?: number | null;
  display_order: number;
  description?: string;
  children?: OrganizationMember[];
}

export interface Teacher {
  id: number;
  name: string;
  title?: string;
  nip?: string;
  photo?: string;
  position: string;
  subject: string;
  last_education: string;
  short_bio?: string;
  display_order: number;
  is_active: boolean | number;
}

export interface Staff {
  id: number;
  name: string;
  photo?: string;
  position: string;
  department: string;
  last_education: string;
  short_bio?: string;
  display_order: number;
  is_active: boolean | number;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface NewsArticle {
  id: number;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail?: string;
  author: string;
  views_count: number;
  status: 'draft' | 'published';
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

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

export interface Achievement {
  id: number;
  title: string;
  student_or_team: string;
  level: 'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
  category: string;
  rank: string;
  year: string;
  organizer: string;
  photo?: string;
  description?: string;
  created_at?: string;
}

export interface Facility {
  id: number;
  name: string;
  category: string;
  description: string;
  photo: string;
  capacity?: string;
  condition_status: string;
  display_order: number;
  created_at?: string;
}

export interface PPDBFeeItem {
  item: string;
  nominal: string;
  note?: string;
}

export interface PPDBScheduleItem {
  phase: string;
  period: string;
  notes?: string;
}

export interface PPDBStepItem {
  step: number;
  title: string;
  desc: string;
}

export interface PPDBInfo {
  id: number;
  academic_year: string;
  is_open: boolean | number;
  start_date?: string;
  end_date?: string;
  banner_image?: string;
  overview: string;
  requirements: string[];
  schedules: PPDBScheduleItem[];
  steps: PPDBStepItem[];
  show_fees: boolean | number;
  fees_description: string;
  fees_items: PPDBFeeItem[];
  contact_person: string;
  contact_phone: string;
  contact_whatsapp: string;
  registration_url?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean | number;
  reply_status: 'unread' | 'read' | 'replied';
  notes?: string;
  created_at: string;
}

export interface WebsiteSettings {
  id: number;
  school_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
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

export interface AdminActivity {
  id: number;
  admin_id?: number;
  admin_name?: string;
  action: string;
  description: string;
  ip_address?: string;
  created_at: string;
}

export interface VisitorLog {
  id: number;
  ip_address?: string;
  user_agent?: string;
  path: string;
  referrer?: string;
  visit_date: string;
  created_at: string;
}

export interface DashboardStats {
  totalVisitors: number;
  visitorsToday: number;
  visitorsThisMonth: number;
  totalNews: number;
  totalTeachers: number;
  totalStaff: number;
  totalGallery: number;
  totalAchievements: number;
  totalFacilities: number;
  totalMessages: number;
  unreadMessages: number;
  visitorTraffic: { date: string; visitors: number; pageViews: number }[];
  categoryBreakdown: { name: string; count: number }[];
}
