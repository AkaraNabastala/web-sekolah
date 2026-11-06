import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolProvider, useSchool } from './context/SchoolContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Public Pages
import { Home } from './pages/public/Home';
import { Profile } from './pages/public/Profile';
import { History } from './pages/public/History';
import { VisionMission } from './pages/public/VisionMission';
import { Organization } from './pages/public/Organization';
import { Teachers } from './pages/public/Teachers';
import { NewsList } from './pages/public/NewsList';
import { NewsDetail } from './pages/public/NewsDetail';
import { Gallery } from './pages/public/Gallery';
import { Achievements } from './pages/public/Achievements';
import { Facilities } from './pages/public/Facilities';
import { PPDB } from './pages/public/PPDB';
import { Contact } from './pages/public/Contact';
import { AgendaList } from './pages/public/AgendaList';
import { Programs } from './pages/public/Programs';
import { DesignPreview } from './pages/public/DesignPreview';
import { DesignPreviewV2 } from './pages/public/DesignPreviewV2';
import { NotFound } from './pages/public/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardHome } from './pages/admin/DashboardHome';
import { DashboardPPDB } from './pages/admin/DashboardPPDB';
import { ManageProfile } from './pages/admin/ManageProfile';
import { ManageWelcome } from './pages/admin/ManageWelcome';
import { ManageHistory } from './pages/admin/ManageHistory';
import { ManageVisionMission } from './pages/admin/ManageVisionMission';
import { ManageNews } from './pages/admin/ManageNews';
import { ManageAgendas } from './pages/admin/ManageAgendas';
import { ManagePrograms } from './pages/admin/ManagePrograms';
import { ManageTeachers } from './pages/admin/ManageTeachers';
import { ManageOrganization } from './pages/admin/ManageOrganization';
import { ManageGallery } from './pages/admin/ManageGallery';
import { ManageAchievements } from './pages/admin/ManageAchievements';
import { ManageFacilities } from './pages/admin/ManageFacilities';
import { ManagePPDB } from './pages/admin/ManagePPDB';
import { ManageMessages } from './pages/admin/ManageMessages';
import { ManageSettings } from './pages/admin/ManageSettings';
import { ManageAccount } from './pages/admin/ManageAccount';
import { VisitorStats } from './pages/admin/VisitorStats';

// Auto-scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Public Website Layout Shell
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="public-shell min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

const FeatureRoute: React.FC<{ feature: string; children: React.ReactNode }> = ({ feature, children }) => {
  const { settings } = useSchool();
  let flags: any = settings?.feature_flags;
  if (typeof flags === 'string') {
    try { flags = JSON.parse(flags); } catch { flags = null; }
  }
  return flags && flags[feature] === false ? <Navigate to="/" replace /> : <>{children}</>;
};

const AdminDashboardRoute: React.FC = () => {
  const { admin } = useAuth();
  return admin?.role === 'admin_ppdb' ? <DashboardPPDB /> : <DashboardHome />;
};

const RoleRoute: React.FC<{ roles: string[]; children: React.ReactNode }> = ({ roles, children }) => {
  const { admin } = useAuth();
  return admin && roles.includes(admin.role) ? <>{children}</> : <Navigate to="/admin" replace />;
};

const CONTENT_ADMIN_ROLES = ['superadmin', 'admin_konten'];
const PPDB_ADMIN_ROLES = ['superadmin', 'admin_ppdb'];
const SUPERADMIN_ROLES = ['superadmin'];

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SchoolProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* PUBLIC WEBSITE ROUTES */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/profil" element={<PublicLayout><Profile /></PublicLayout>} />
            <Route path="/sejarah" element={<PublicLayout><FeatureRoute feature="history"><History /></FeatureRoute></PublicLayout>} />
            <Route path="/visi-misi" element={<PublicLayout><VisionMission /></PublicLayout>} />
            <Route path="/organisasi" element={<PublicLayout><FeatureRoute feature="organization"><Organization /></FeatureRoute></PublicLayout>} />
            <Route path="/guru" element={<PublicLayout><FeatureRoute feature="teachers"><Teachers /></FeatureRoute></PublicLayout>} />
            <Route path="/guru-staf" element={<PublicLayout><FeatureRoute feature="teachers"><Teachers /></FeatureRoute></PublicLayout>} />
            <Route path="/berita" element={<PublicLayout><FeatureRoute feature="news"><NewsList /></FeatureRoute></PublicLayout>} />
            <Route path="/berita/:slug" element={<PublicLayout><FeatureRoute feature="news"><NewsDetail /></FeatureRoute></PublicLayout>} />
            <Route path="/agenda" element={<PublicLayout><FeatureRoute feature="agenda"><AgendaList /></FeatureRoute></PublicLayout>} />
            <Route path="/kegiatan" element={<PublicLayout><FeatureRoute feature="agenda"><AgendaList /></FeatureRoute></PublicLayout>} />
            <Route path="/pengumuman" element={<FeatureRoute feature="news"><Navigate to="/berita?kategori=pengumuman-resmi" replace /></FeatureRoute>} />
            <Route path="/program" element={<PublicLayout><FeatureRoute feature="programs"><Programs /></FeatureRoute></PublicLayout>} />
            <Route path="/kurikulum" element={<PublicLayout><FeatureRoute feature="programs"><Programs /></FeatureRoute></PublicLayout>} />
            <Route path="/ekstrakurikuler" element={<PublicLayout><FeatureRoute feature="programs"><Programs /></FeatureRoute></PublicLayout>} />
            <Route path="/galeri" element={<PublicLayout><FeatureRoute feature="gallery"><Gallery /></FeatureRoute></PublicLayout>} />
            <Route path="/prestasi" element={<PublicLayout><FeatureRoute feature="achievements"><Achievements /></FeatureRoute></PublicLayout>} />
            <Route path="/fasilitas" element={<PublicLayout><FeatureRoute feature="facilities"><Facilities /></FeatureRoute></PublicLayout>} />
            <Route path="/ppdb" element={<PublicLayout><FeatureRoute feature="ppdb"><PPDB /></FeatureRoute></PublicLayout>} />
            <Route path="/kontak" element={<PublicLayout><FeatureRoute feature="contact"><Contact /></FeatureRoute></PublicLayout>} />
            {import.meta.env.DEV && (
              <>
                <Route path="/design-preview" element={<PublicLayout><DesignPreview /></PublicLayout>} />
                <Route path="/design-preview-v2" element={<PublicLayout><DesignPreviewV2 /></PublicLayout>} />
              </>
            )}

            {/* ADMIN LOGIN ROUTE */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* PROTECTED ADMIN DASHBOARD ROUTES */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardRoute />} />
              <Route path="statistik" element={<RoleRoute roles={SUPERADMIN_ROLES}><VisitorStats /></RoleRoute>} />
              <Route path="profil" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageProfile /></RoleRoute>} />
              <Route path="sambutan" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageWelcome /></RoleRoute>} />
              <Route path="sejarah" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageHistory /></RoleRoute>} />
              <Route path="visi-misi" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageVisionMission /></RoleRoute>} />
              <Route path="berita" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageNews /></RoleRoute>} />
              <Route path="agenda" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageAgendas /></RoleRoute>} />
              <Route path="program" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManagePrograms /></RoleRoute>} />
              <Route path="guru-staf" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageTeachers /></RoleRoute>} />
              <Route path="organisasi" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageOrganization /></RoleRoute>} />
              <Route path="galeri" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageGallery /></RoleRoute>} />
              <Route path="prestasi" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageAchievements /></RoleRoute>} />
              <Route path="fasilitas" element={<RoleRoute roles={CONTENT_ADMIN_ROLES}><ManageFacilities /></RoleRoute>} />
              <Route path="ppdb" element={<RoleRoute roles={PPDB_ADMIN_ROLES}><ManagePPDB /></RoleRoute>} />
              <Route path="pesan" element={<RoleRoute roles={SUPERADMIN_ROLES}><ManageMessages /></RoleRoute>} />
              <Route path="pengaturan" element={<RoleRoute roles={SUPERADMIN_ROLES}><ManageSettings /></RoleRoute>} />
              <Route path="akun" element={<RoleRoute roles={SUPERADMIN_ROLES}><ManageAccount /></RoleRoute>} />
            </Route>

            {/* 404 NOT FOUND ROUTE */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </Router>
      </SchoolProvider>
    </AuthProvider>
  );
};

export default App;
