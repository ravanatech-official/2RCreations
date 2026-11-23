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
      title: 'Selected Work & Client Archive | 2R CREATIONS',
      description: 'A selection of completed wedding album designs, retouching studies, and visual stories created for photographers and studios worldwide.',
      canonicalPath: '/gallery'
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
