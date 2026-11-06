// Domain models: people

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
