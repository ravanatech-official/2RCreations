import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GalleryProjectPage } from '../components/gallery/GalleryProjectPage';
import { getGalleryProjectBySlug } from '../data/galleryProjects';
import { updateSEO } from '../utils/seo';

interface GalleryProjectRoutePageProps {
  onOpenFullAlbum: (albumId: string) => void;
}

export const GalleryProjectRoutePage: React.FC<GalleryProjectRoutePageProps> = ({ onOpenFullAlbum }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getGalleryProjectBySlug(slug) : undefined;

  useEffect(() => {
    if (project) {
      updateSEO({
        title: `${project.title} — Selected Work | 2R CREATIONS`,
        description: project.description || `${project.title} bespoke wedding album design by 2R Creations.`,
        canonicalPath: `/gallery/${project.slug}`
      });
      window.scrollTo(0, 0);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="pt-36 pb-24 text-center bg-[#FBF9F5] min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl font-medium text-[#111111] mb-3">Project Not Found</h1>
        <p className="text-sm text-[#242424]/70 mb-6">The requested client album project could not be located.</p>
        <button
          onClick={() => navigate('/gallery')}
          className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-[#C5A880] rounded-xs cursor-pointer"
        >
          Return to Gallery Archive
        </button>
      </div>
    );
  }

  return (
    <GalleryProjectPage
      project={project}
      onBackToGallery={() => navigate('/gallery')}
      onOpenProject={(nextSlug) => navigate(`/gallery/${nextSlug}`)}
      onOpenFullAlbum={onOpenFullAlbum}
      onStartProject={() => navigate(`/contact?project=${encodeURIComponent(project.title)}`)}
    />
  );
};
