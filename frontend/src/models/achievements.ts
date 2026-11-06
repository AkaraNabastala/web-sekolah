// Domain models: achievements

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
