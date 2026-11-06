// Domain models: facilities

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
