import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryPage } from '../components/gallery/GalleryPage';
import { updateSEO } from '../utils/seo';

interface GalleryRoutePageProps {
  onOpenAlbum?: (albumId: string) => void;
  onOpenRetouching?: (studyId: string) => void;
}

export const GalleryRoutePage: React.FC<GalleryRoutePageProps> = ({
  onOpenAlbum,
  onOpenRetouching,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO({
      title: 'Selected Work & Client Archive | 2R Creations',
      description: 'Curated wedding album designs, retouching case studies, and print-ready spreads crafted for fine art photographers and studios worldwide.',
      canonicalPath: '/gallery',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Gallery', path: '/gallery' }
      ],
      structuredData: {
        '@type': 'CollectionPage',
        name: '2R Creations Selected Work & Client Archive',
        url: 'https://2rcreations.com/gallery'
      }
    });
  }, []);

  return (
    <GalleryPage
      onOpenProject={(slug) => navigate(`/gallery/${slug}`)}
      onStartProject={() => navigate('/contact')}
      onExplorePortfolio={() => navigate('/portfolio')}
      onOpenAlbum={onOpenAlbum}
      onOpenRetouching={onOpenRetouching}
    />
  );
};
