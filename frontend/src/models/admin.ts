// Domain models: admin

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

export interface AdminActivity {
  id: number;
  admin_id?: number;
  admin_name?: string;
  action: string;
  description: string;
  ip_address?: string;
  created_at: string;
}
