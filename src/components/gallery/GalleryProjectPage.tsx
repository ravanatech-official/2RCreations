import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, MapPin, Calendar, Camera, Layers } from 'lucide-react';
import { GalleryProject } from '../../types';
import { getAdjacentPublishedProjects } from '../../data/galleryProjects';
import { analytics } from '../../services/analytics';

interface GalleryProjectPageProps {
  project: GalleryProject;
  onBackToGallery: () => void;
  onOpenProject: (slug: string) => void;
  onOpenFullAlbum?: (albumId: string) => void;
  onStartProject: () => void;
}

export const GalleryProjectPage: React.FC<GalleryProjectPageProps> = ({
  project,
  onBackToGallery,
  onOpenProject,
  onOpenFullAlbum,
  onStartProject,
}) => {
  const { prev, next } = getAdjacentPublishedProjects(project.slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    analytics.galleryProjectOpen(project.id, project.title);
  }, [project.id, project.title]);

  const handleFullAlbumClick = () => {
    if (project.linkedAlbumId && onOpenFullAlbum) {
      analytics.galleryFullAlbumOpen(project.id, project.linkedAlbumId);
      onOpenFullAlbum(project.linkedAlbumId);
    }
  };

  const handleStartProjectClick = () => {
    analytics.galleryStartProjectClick(`project_${project.slug}`);
    onStartProject();
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F5] min-h-screen text-[#242424]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Navigation Breadcrumb / Return */}
        <div className="mb-10">
          <button
            onClick={onBackToGallery}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242424]/70 hover:text-[#111111] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Gallery</span>
          </button>
        </div>

        {/* Editorial Case Study Header */}
        <header className="max-w-4xl mb-14 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase">
              SELECTED PROJECT
            </span>
            <span className="w-6 h-[1px] bg-[#C5A880]/40" />
            <span className="text-[10px] font-mono tracking-widest text-[#242424]/50 uppercase">
              {project.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#111111] leading-[1.1] mb-6">
            {project.title}
          </h1>

          {/* Subtitle & Metadata Line */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-[#242424]/75 font-light pb-6 border-b border-[#242424]/10">
            {project.style && (
              <span className="font-medium text-[#111111]">{project.style}</span>
            )}
            {project.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                {project.location}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                {project.year}
              </span>
            )}
            {project.photographerName && (
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#C5A880]" />
                Photography: {project.photographerName}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
              Album Design by 2R Creations
            </span>
          </div>

          {/* Editorial Summary & Optional Full Album CTA */}
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="text-base sm:text-lg text-[#242424]/85 leading-relaxed font-light max-w-2xl">
              {project.description || project.shortDescription || 'A bespoke wedding album narrative crafted with cinematic pacing, balanced typography, and archival print calibration.'}
            </p>

            {/* Optional Full Album Trigger (Only shown if linkedAlbumId exists) */}
            {project.linkedAlbumId && (
              <button
                onClick={handleFullAlbumClick}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#111111] text-[#FBF9F5] text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-[#242424] hover:border-[#C5A880] transition-all duration-200 cursor-pointer shadow-sm shrink-0 group"
              >
                <BookOpen className="w-4 h-4 text-[#C5A880]" />
                <span>View Full Album &rarr;</span>
              </button>
            )}
          </div>
        </header>

        {/* Primary Cover / Hero Feature */}
        <section className="mb-16 sm:mb-20">
          <div className="w-full aspect-[16/10] sm:aspect-[21/9] max-h-[750px] overflow-hidden bg-[#EAE5DC] rounded-xs shadow-xs">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Dynamic Editorial Visual Story Gallery */}
        {project.images && project.images.length > 0 && (
          <section className="space-y-12 sm:space-y-16 mb-24">
            <div className="flex items-center justify-between border-b border-[#242424]/10 pb-4">
              <h2 className="text-[11px] font-semibold tracking-[0.2em] text-[#C5A880] uppercase">
                Visual Narrative & Spreads
              </h2>
              <span className="text-[10px] font-mono text-[#242424]/50 uppercase">
                {project.images.length} Curated Frames
              </span>
            </div>

            {/* Varied Editorial Pacing Layout */}
            <div className="space-y-10 sm:space-y-14">
              {project.images.map((image, index) => {
                const isWide = image.orientation === 'wide' || image.orientation === 'panoramic';
                const isPortrait = image.orientation === 'portrait';

                return (
                  <figure
                    key={index}
                    className={`group ${
                      isWide ? 'max-w-7xl mx-auto' : isPortrait ? 'max-w-3xl mx-auto' : 'max-w-5xl mx-auto'
                    }`}
                  >
                    <div className="overflow-hidden bg-[#EAE5DC] rounded-xs">
                      <img
                        src={image.src}
                        alt={image.alt || `${project.title} - Frame ${index + 1}`}
                        loading="lazy"
                        className="w-full h-auto object-cover max-h-[90vh]"
                      />
                    </div>
                    {image.caption && (
                      <figcaption className="mt-3 text-center text-xs text-[#242424]/60 font-light italic">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Project Footer & Next Actions */}
        <footer className="border-t border-[#242424]/10 pt-16">
          
          {/* Inspired Action Card */}
          <div className="bg-[#FAF8F5] border border-[#242424]/8 p-8 sm:p-12 rounded-xs flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880] block mb-2">
                CREATE YOUR HEIRLOOM
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#111111]">
                Inspired by this project?
              </h3>
              <p className="text-sm text-[#242424]/75 font-light mt-1">
                Collaborate with 2R Creations to turn your client gallery into a bespoke printed visual story.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {project.linkedAlbumId && (
                <button
                  onClick={handleFullAlbumClick}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-transparent border border-[#242424]/20 hover:border-[#111111] rounded-xs transition-colors cursor-pointer"
                >
                  View Full Album
                </button>
              )}
              <button
                onClick={handleStartProjectClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-[#FBF9F5] text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-[#242424] transition-all cursor-pointer group"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Adjacent Published Projects Navigation */}
          {(prev || next) && (
            <div className="flex items-center justify-between pt-8 border-t border-[#242424]/5">
              {prev ? (
                <button
                  onClick={() => onOpenProject(prev.slug)}
                  className="group flex flex-col items-start text-left cursor-pointer"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#242424]/50 flex items-center gap-1.5 mb-1 group-hover:text-[#C5A880] transition-colors">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                    Previous Project
                  </span>
                  <span className="font-serif text-base sm:text-lg text-[#111111] group-hover:text-[#C5A880] transition-colors font-medium">
                    {prev.title}
                  </span>
                </button>
              ) : <div />}

              {next ? (
                <button
                  onClick={() => onOpenProject(next.slug)}
                  className="group flex flex-col items-end text-right cursor-pointer"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#242424]/50 flex items-center gap-1.5 mb-1 group-hover:text-[#C5A880] transition-colors">
                    Next Project
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="font-serif text-base sm:text-lg text-[#111111] group-hover:text-[#C5A880] transition-colors font-medium">
                    {next.title}
                  </span>
                </button>
              ) : <div />}
            </div>
          )}

        </footer>

      </div>
    </div>
  );
};
