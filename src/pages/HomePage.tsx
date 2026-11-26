import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { WhyChoose } from '../components/WhyChoose';
import { FinalCTA } from '../components/FinalCTA';
import { updateSEO } from '../utils/seo';

interface HomePageProps {
  onOpenAlbum: (albumId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAlbum }) => {
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO({
      title: '2R Creations — Wedding Album Design & Retouching Studio',
      description: 'Bespoke wedding album design and fine art photo retouching for photographers worldwide. Editorial layouts, natural skin polish, and 2–3 day turnaround.',
      canonicalPath: '/',
      structuredData: {
        '@type': 'WebPage',
        name: '2R Creations — Wedding Album Design & Retouching Studio',
        url: 'https://2rcreations.com/',
        description: 'Bespoke wedding album design and fine art photo retouching for photographers worldwide.'
      }
    });
    window.scrollTo(0, 0);
  }, []);

  const handleStartProject = (serviceName?: string) => {
    navigate(serviceName ? `/contact?project=${encodeURIComponent(serviceName)}` : '/contact');
  };

  const handleViewAlbums = () => {
    navigate('/portfolio');
  };

  return (
    <div>
      {/* 01. Hero */}
      <Hero
        onViewAlbums={handleViewAlbums}
        onStartProject={handleStartProject}
        onOpenAlbum={onOpenAlbum}
      />

      {/* 02. Why 2R Creations */}
      <WhyChoose />

      {/* 03. Begin Your Collaboration */}
      <FinalCTA onStartProject={() => navigate('/contact')} />
    </div>
  );
};
