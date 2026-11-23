import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AlbumViewer } from './components/AlbumViewer';
import { ALBUMS } from './data/albums';
import { Album } from './types';

// Page components
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { AlbumViewRoutePage } from './pages/AlbumViewRoutePage';
import { ServicesIndexPage } from './pages/ServicesIndexPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { GalleryRoutePage } from './pages/GalleryRoutePage';
import { GalleryProjectRoutePage } from './pages/GalleryProjectRoutePage';
import { AboutPage } from './pages/AboutPage';
import { ProcessPage } from './pages/ProcessPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { RetouchingViewer } from './components/RetouchingViewer';
import { RETOUCHING_STUDIES } from './data/retouchingStudies';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { PrivacyPreferenceCenter } from './components/PrivacyPreferenceCenter';
import { PrivacyProvider } from './context/PrivacyContext';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainApp() {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedSpreadNumber, setSelectedSpreadNumber] = useState<number | undefined>(undefined);
  const [selectedRetouchingStudyId, setSelectedRetouchingStudyId] = useState<string | null>(null);
  const [selectedRetouchSlideNumber, setSelectedRetouchSlideNumber] = useState<number | undefined>(undefined);

  const selectedAlbum: Album | undefined = ALBUMS.find(a => a.id === selectedAlbumId);
  const otherAlbums = ALBUMS.filter(a => a.id !== selectedAlbumId);

  const selectedRetouchStudy = RETOUCHING_STUDIES.find(s => s.id === selectedRetouchingStudyId);

  const handleOpenAlbum = (albumId: string, spreadNumber?: number) => {
    setSelectedAlbumId(albumId);
    setSelectedSpreadNumber(spreadNumber);
  };

  const handleCloseAlbum = () => {
    setSelectedAlbumId(null);
    setSelectedSpreadNumber(undefined);
  };

  const handleOpenRetouching = (studyId: string, slideNumber?: number) => {
    setSelectedRetouchingStudyId(studyId);
    setSelectedRetouchSlideNumber(slideNumber);
  };

  const handleCloseRetouching = () => {
    setSelectedRetouchingStudyId(null);
    setSelectedRetouchSlideNumber(undefined);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#242424] flex flex-col selection:bg-[#C5A880]/20 selection:text-[#111111]">
      <ScrollToTop />
      
      {/* Universal Studio Navigation */}
      <Navbar />

      {/* Primary Route Outlet */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenAlbum={handleOpenAlbum} />} />
          <Route path="/portfolio" element={<PortfolioPage onOpenAlbum={handleOpenAlbum} onOpenRetouching={handleOpenRetouching} />} />
          <Route path="/portfolio/:slug" element={<AlbumDetailPage onOpenViewer={handleOpenAlbum} />} />
          <Route path="/portfolio/:slug/view" element={<AlbumViewRoutePage />} />
          <Route path="/services" element={<ServicesIndexPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage onOpenRetouching={handleOpenRetouching} />} />
          <Route path="/gallery" element={<GalleryRoutePage onOpenAlbum={handleOpenAlbum} onOpenRetouching={handleOpenRetouching} />} />
          <Route path="/gallery/:slug" element={<GalleryProjectRoutePage onOpenFullAlbum={handleOpenAlbum} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/client-image-policy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/opt-out" element={<PreferencesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Universal Studio Footer */}
      <Footer />

      {/* Full-Screen Digital Album Viewer Overlay */}
      {selectedAlbum && (
        <AlbumViewer
          album={selectedAlbum}
          initialSpreadNumber={selectedSpreadNumber}
          onClose={handleCloseAlbum}
          onStartProject={() => {
            handleCloseAlbum();
            window.location.href = `/contact?project=${encodeURIComponent(`Wedding Album (${selectedAlbum.title})`)}`;
          }}
          onOpenDifferentAlbum={(id) => handleOpenAlbum(id)}
          otherAlbums={otherAlbums}
        />
      )}

      {/* Full-Screen Interactive Retouching Before/After Viewer */}
      {selectedRetouchStudy && (
        <RetouchingViewer
          study={selectedRetouchStudy}
          initialSlideNumber={selectedRetouchSlideNumber}
          onClose={handleCloseRetouching}
          onStartProject={(serviceName) => {
            handleCloseRetouching();
            window.location.href = `/contact?project=${encodeURIComponent(serviceName || 'Photo Retouching')}`;
          }}
          onOpenDifferentStudy={(id) => handleOpenRetouching(id, 1)}
          allStudies={RETOUCHING_STUDIES}
        />
      )}
      {/* Global Floating WhatsApp Quick Connect */}
      <FloatingWhatsApp />

      {/* GDPR & International Privacy Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Global Luxury Privacy Preference Center Modal */}
      <PrivacyPreferenceCenter />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PrivacyProvider>
        <MainApp />
      </PrivacyProvider>
    </BrowserRouter>
  );
}
