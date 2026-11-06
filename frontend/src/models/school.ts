// Domain models: school

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

export interface SchoolHistory {
  id: number;
  title: string;
  content: string;
  featured_image?: string;
  milestones: Milestone[];
  updated_at?: string;
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
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
