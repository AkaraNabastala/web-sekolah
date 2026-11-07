// Domain models: analytics

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
