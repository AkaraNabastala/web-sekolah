import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';

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
import { ManageProfile } from './pages/admin/ManageProfile';
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
    <div className="min-h-screen flex flex-col bg-white">
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
            <Route path="/sejarah" element={<PublicLayout><History /></PublicLayout>} />
            <Route path="/visi-misi" element={<PublicLayout><VisionMission /></PublicLayout>} />
            <Route path="/organisasi" element={<PublicLayout><Organization /></PublicLayout>} />
            <Route path="/guru" element={<PublicLayout><Teachers /></PublicLayout>} />
            <Route path="/guru-staf" element={<PublicLayout><Teachers /></PublicLayout>} />
            <Route path="/berita" element={<PublicLayout><NewsList /></PublicLayout>} />
            <Route path="/berita/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />
            <Route path="/agenda" element={<PublicLayout><AgendaList /></PublicLayout>} />
            <Route path="/kegiatan" element={<PublicLayout><AgendaList /></PublicLayout>} />
            <Route path="/pengumuman" element={<Navigate to="/berita?kategori=pengumuman-resmi" replace />} />
            <Route path="/program" element={<PublicLayout><Programs /></PublicLayout>} />
            <Route path="/kurikulum" element={<PublicLayout><Programs /></PublicLayout>} />
            <Route path="/ekstrakurikuler" element={<PublicLayout><Programs /></PublicLayout>} />
            <Route path="/galeri" element={<PublicLayout><Gallery /></PublicLayout>} />
            <Route path="/prestasi" element={<PublicLayout><Achievements /></PublicLayout>} />
            <Route path="/fasilitas" element={<PublicLayout><Facilities /></PublicLayout>} />
            <Route path="/ppdb" element={<PublicLayout><PPDB /></PublicLayout>} />
            <Route path="/kontak" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/design-preview" element={<PublicLayout><DesignPreview /></PublicLayout>} />
            <Route path="/design-preview-v2" element={<PublicLayout><DesignPreviewV2 /></PublicLayout>} />

            {/* ADMIN LOGIN ROUTE */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* PROTECTED ADMIN DASHBOARD ROUTES */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="statistik" element={<VisitorStats />} />
              <Route path="profil" element={<ManageProfile initialTab="identitas" />} />
              <Route path="sejarah" element={<ManageProfile initialTab="sejarah" />} />
              <Route path="visi-misi" element={<ManageProfile initialTab="visimisi" />} />
              <Route path="berita" element={<ManageNews />} />
              <Route path="agenda" element={<ManageAgendas />} />
              <Route path="program" element={<ManagePrograms />} />
              <Route path="guru-staf" element={<ManageTeachers />} />
              <Route path="organisasi" element={<ManageOrganization />} />
              <Route path="galeri" element={<ManageGallery />} />
              <Route path="prestasi" element={<ManageAchievements />} />
              <Route path="fasilitas" element={<ManageFacilities />} />
              <Route path="ppdb" element={<ManagePPDB />} />
              <Route path="pesan" element={<ManageMessages />} />
              <Route path="pengaturan" element={<ManageSettings />} />
              <Route path="akun" element={<ManageAccount />} />
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
