import axios from 'axios';
import {
  SchoolProfile,
  SchoolHistory,
  SchoolVisionMission,
  OrganizationMember,
  Teacher,
  Staff,
  NewsArticle,
  NewsCategory,
  GalleryAlbum,
  GalleryMedia,
  Achievement,
  Facility,
  PPDBInfo,
  ContactMessage,
  WebsiteSettings,
  DashboardStats,
  AdminActivity,
  AdminUser
} from '../types';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Session JWT berada di cookie HttpOnly; JavaScript hanya mengirim token CSRF non-HttpOnly.
api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined' && !['get', 'head', 'options'].includes((config.method || 'get').toLowerCase())) {
    const csrfCookie = document.cookie.split('; ').find(part => part.startsWith('school_csrf='));
    const csrfToken = csrfCookie ? decodeURIComponent(csrfCookie.slice('school_csrf='.length)) : '';
    if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Intercept 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('school_admin_token');
      localStorage.removeItem('school_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API Helper Methods
export const schoolApi = {
  // Public
  getProfile: () => api.get<{ success: boolean; data: SchoolProfile }>('/school-profile').then(r => r.data.data),
  getHistory: () => api.get<{ success: boolean; data: SchoolHistory }>('/school-history').then(r => r.data.data),
  getVisionMission: () => api.get<{ success: boolean; data: SchoolVisionMission }>('/vision-mission').then(r => r.data.data),
  getOrganization: () => api.get<{ success: boolean; data: OrganizationMember[] }>('/organization').then(r => r.data.data),
  getTeachers: () => api.get<{ success: boolean; data: Teacher[] }>('/teachers').then(r => r.data.data),
  getStaff: () => api.get<{ success: boolean; data: Staff[] }>('/staff').then(r => r.data.data),
  getNews: (category?: string) => api.get<{ success: boolean; data: NewsArticle[] }>('/news', { params: { category } }).then(r => r.data.data),
  getNewsBySlug: (slug: string) => api.get<{ success: boolean; data: NewsArticle }>(`/news/${slug}`).then(r => r.data.data),
  getNewsCategories: () => api.get<{ success: boolean; data: NewsCategory[] }>('/news/categories').then(r => r.data.data),
  getGallery: (category?: string) => api.get<{ success: boolean; data: GalleryMedia[] }>('/gallery', { params: { category } }).then(r => r.data.data),
  getGalleryAlbums: () => api.get<{ success: boolean; data: GalleryAlbum[] }>('/gallery/albums').then(r => r.data.data),
  getAchievements: () => api.get<{ success: boolean; data: Achievement[] }>('/achievements').then(r => r.data.data),
  getFacilities: () => api.get<{ success: boolean; data: Facility[] }>('/facilities').then(r => r.data.data),
  getPPDB: () => api.get<{ success: boolean; data: PPDBInfo }>('/ppdb').then(r => r.data.data),
  getSettings: () => api.get<{ success: boolean; data: WebsiteSettings }>('/settings').then(r => r.data.data),
  sendContactMessage: (data: Partial<ContactMessage>) => api.post<{ success: boolean; message: string; data: ContactMessage }>('/contact', data).then(r => r.data),
  logVisitor: (path: string) => api.post('/visitor/log', { path, referrer: document.referrer }),

  // Auth
  login: (credentials: { username: string; password: string }) =>
    api.post<{ success: boolean; user: AdminUser; message: string }>('/auth/login', credentials).then(r => r.data),
  logout: () => api.post<{ success: boolean; message: string }>('/auth/logout').then(r => r.data),
  getMe: () => api.get<{ success: boolean; user: AdminUser }>('/auth/me').then(r => r.data.user),
  updateAdminProfile: (data: any) => api.put<{ success: boolean; message: string; user: AdminUser }>('/auth/profile', data).then(r => r.data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.put<{ success: boolean; message: string }>('/auth/password', data).then(r => r.data),

  // Admin Dashboard
  getDashboardStats: () => api.get<{ success: boolean; data: DashboardStats }>('/admin/dashboard/statistics').then(r => r.data.data),
  getAdminActivities: () => api.get<{ success: boolean; data: AdminActivity[] }>('/admin/dashboard/activities').then(r => r.data.data),

  // Admin Profile & Identity
  updateProfile: (data: Partial<SchoolProfile>) => api.put<{ success: boolean; message: string; data: SchoolProfile }>('/admin/school-profile', data).then(r => r.data),
  updateHistory: (data: Partial<SchoolHistory>) => api.put<{ success: boolean; message: string; data: SchoolHistory }>('/admin/school-history', data).then(r => r.data),
  updateVisionMission: (data: Partial<SchoolVisionMission>) => api.put<{ success: boolean; message: string; data: SchoolVisionMission }>('/admin/vision-mission', data).then(r => r.data),

  // Admin Organization
  createOrgMember: (data: Partial<OrganizationMember>) => api.post<{ success: boolean; message: string; data: OrganizationMember }>('/admin/organization', data).then(r => r.data),
  updateOrgMember: (id: number, data: Partial<OrganizationMember>) => api.put<{ success: boolean; message: string; data: OrganizationMember }>(`/admin/organization/${id}`, data).then(r => r.data),
  deleteOrgMember: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/organization/${id}`).then(r => r.data),

  // Admin Teachers & Staff
  createTeacher: (data: Partial<Teacher>) => api.post<{ success: boolean; message: string; data: Teacher }>('/admin/teachers', data).then(r => r.data),
  updateTeacher: (id: number, data: Partial<Teacher>) => api.put<{ success: boolean; message: string; data: Teacher }>(`/admin/teachers/${id}`, data).then(r => r.data),
  deleteTeacher: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/teachers/${id}`).then(r => r.data),
  createStaff: (data: Partial<Staff>) => api.post<{ success: boolean; message: string; data: Staff }>('/admin/staff', data).then(r => r.data),
  updateStaff: (id: number, data: Partial<Staff>) => api.put<{ success: boolean; message: string; data: Staff }>(`/admin/staff/${id}`, data).then(r => r.data),
  deleteStaff: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/staff/${id}`).then(r => r.data),

  // Admin News
  getAdminNews: () => api.get<{ success: boolean; data: NewsArticle[] }>('/admin/news').then(r => r.data.data),
  createNews: (data: Partial<NewsArticle>) => api.post<{ success: boolean; message: string; data: NewsArticle }>('/admin/news', data).then(r => r.data),
  updateNews: (id: number, data: Partial<NewsArticle>) => api.put<{ success: boolean; message: string; data: NewsArticle }>(`/admin/news/${id}`, data).then(r => r.data),
  deleteNews: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/news/${id}`).then(r => r.data),
  createNewsCategory: (data: Partial<NewsCategory>) => api.post<{ success: boolean; message: string; data: NewsCategory }>('/admin/news/categories', data).then(r => r.data),

  // Admin Gallery
  createGalleryMedia: (data: Partial<GalleryMedia>) => api.post<{ success: boolean; message: string; data: GalleryMedia }>('/admin/gallery', data).then(r => r.data),
  deleteGalleryMedia: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/gallery/${id}`).then(r => r.data),
  createGalleryAlbum: (data: Partial<GalleryAlbum>) => api.post<{ success: boolean; message: string; data: GalleryAlbum }>('/admin/gallery/albums', data).then(r => r.data),
  deleteGalleryAlbum: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/gallery/albums/${id}`).then(r => r.data),

  // Admin Achievements
  createAchievement: (data: Partial<Achievement>) => api.post<{ success: boolean; message: string; data: Achievement }>('/admin/achievements', data).then(r => r.data),
  updateAchievement: (id: number, data: Partial<Achievement>) => api.put<{ success: boolean; message: string; data: Achievement }>(`/admin/achievements/${id}`, data).then(r => r.data),
  deleteAchievement: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/achievements/${id}`).then(r => r.data),

  // Admin Facilities
  createFacility: (data: Partial<Facility>) => api.post<{ success: boolean; message: string; data: Facility }>('/admin/facilities', data).then(r => r.data),
  updateFacility: (id: number, data: Partial<Facility>) => api.put<{ success: boolean; message: string; data: Facility }>(`/admin/facilities/${id}`, data).then(r => r.data),
  deleteFacility: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/facilities/${id}`).then(r => r.data),

  // Agendas
  getAgendas: () => api.get<{ success: boolean; data: any[] }>('/agendas').then(r => r.data.data),
  getAdminAgendas: () => api.get<{ success: boolean; data: any[] }>('/admin/agendas').then(r => r.data.data),
  createAgenda: (data: any) => api.post<{ success: boolean; message: string; data: any }>('/admin/agendas', data).then(r => r.data),
  updateAgenda: (id: number, data: any) => api.put<{ success: boolean; message: string; data: any }>(`/admin/agendas/${id}`, data).then(r => r.data),
  deleteAgenda: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/agendas/${id}`).then(r => r.data),

  // Programs & Extracurricular
  getPrograms: (category?: string) => api.get<{ success: boolean; data: any[] }>('/programs', { params: { category } }).then(r => r.data.data),
  getAdminPrograms: () => api.get<{ success: boolean; data: any[] }>('/admin/programs').then(r => r.data.data),
  createProgram: (data: any) => api.post<{ success: boolean; message: string; data: any }>('/admin/programs', data).then(r => r.data),
  updateProgram: (id: number, data: any) => api.put<{ success: boolean; message: string; data: any }>(`/admin/programs/${id}`, data).then(r => r.data),
  deleteProgram: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/programs/${id}`).then(r => r.data),

  // Central content categories
  getContentCategories: (scope: 'news' | 'program' | 'facility') => api.get<{ success:boolean; data:any[] }>('/admin/content-categories',{params:{scope}}).then(r=>r.data.data),
  createContentCategory: (data:{scope:string;name:string;description?:string}) => api.post('/admin/content-categories',data).then(r=>r.data),
  updateContentCategory: (id:number,scope:string,data:{name:string;description?:string}) => api.put(`/admin/content-categories/${scope}/${id}`,data).then(r=>r.data),
  deleteContentCategory: (id:number,scope:string) => api.delete(`/admin/content-categories/${scope}/${id}`).then(r=>r.data),

  // Announcements
  getAnnouncements: () => api.get<{ success: boolean; data: any[] }>('/announcements').then(r => r.data.data),
  getAdminAnnouncements: () => api.get<{ success: boolean; data: any[] }>('/admin/announcements').then(r => r.data.data),
  createAnnouncement: (data: any) => api.post('/admin/announcements', data).then(r => r.data),
  updateAnnouncement: (id: number, data: any) => api.put(`/admin/announcements/${id}`, data).then(r => r.data),
  deleteAnnouncement: (id: number) => api.delete(`/admin/announcements/${id}`).then(r => r.data),

  // SPMB / PPDB application workflow
  submitAdmissionApplication: (data: any) => api.post('/admissions/applications', data).then(r => r.data),
  uploadAdmissionDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admissions/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },
  getAdmissionApplications: () => api.get<{ success: boolean; data: any[] }>('/admin/admission-applications').then(r => r.data.data),
  updateAdmissionApplication: (id: number, data: any) => api.put(`/admin/admission-applications/${id}`, data).then(r => r.data),

  // Admin PPDB
  updatePPDB: (data: Partial<PPDBInfo>) => api.put<{ success: boolean; message: string; data: PPDBInfo }>('/admin/ppdb', data).then(r => r.data),

  // Admin Messages
  getAdminMessages: () => api.get<{ success: boolean; data: ContactMessage[] }>('/admin/messages').then(r => r.data.data),
  markMessageRead: (id: number, is_read: boolean) => api.put<{ success: boolean; message: string; data: ContactMessage }>(`/admin/messages/${id}/read`, { is_read }).then(r => r.data),
  deleteMessage: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/messages/${id}`).then(r => r.data),

  // Admin Settings
  updateSettings: (data: Partial<WebsiteSettings>) => api.put<{ success: boolean; message: string; data: WebsiteSettings }>('/admin/settings', data).then(r => r.data),

  // File Upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{ success: boolean; fileUrl: string; message: string }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Admin Users & Roles
  getAdminUsers: () => api.get<{ success: boolean; data: any[] }>('/admin/users').then(r => r.data.data),
  createAdminUser: (data: { username: string; email: string; full_name: string; password: string; role?: string; avatar?: string }) =>
    api.post<{ success: boolean; message: string; data: any }>('/admin/users', data).then(r => r.data),
  deleteAdminUser: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/admin/users/${id}`).then(r => r.data),

  // System & Database Status
  getDatabaseStatus: () => api.get<{
    success: boolean;
    environment: string;
    mysql: {
      configured: boolean;
      connected: boolean;
      message: string;
      host: string;
      port: number;
      database: string;
    };
    fallback_storage: {
      engine: string;
      status: string;
      file: string;
    };
  }>('/system/database-status').then(r => r.data)
};
