import React from 'react';
import { ArrowUpRight, BookOpen, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublishedFeaturedProjects } from '../data/galleryProjects';
import { GalleryProject } from '../types';
import { analytics } from '../services/analytics';

interface GalleryPreviewSectionProps {
  onOpenAlbum?: (albumId: string) => void;
}

export const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({ onOpenAlbum }) => {
  const navigate = useNavigate();
  const featuredProjects = getPublishedFeaturedProjects().slice(0, 3);

  if (featuredProjects.length === 0) return null;

  return (
    <section id="gallery-preview-section" className="py-24 bg-[#FAF8F5] border-t border-[#242424]/8 text-[#242424]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.2em] text-[#C5A880] uppercase block mb-3">
              SELECTED WORK &bull; CLIENT ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111111] leading-[1.15]">
              Real Stories. Thoughtfully Designed.
            </h2>
            <p className="text-sm sm:text-base text-[#242424]/75 font-light mt-3 leading-relaxed">
              Explore completed wedding albums and client stories crafted for leading wedding photographers, fine art studios, and heirloom couples.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/gallery"
              onClick={() => analytics.navClick('homepage_view_all_gallery')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] bg-[#C5A880]/20 hover:bg-[#C5A880] hover:text-[#111111] border border-[#C5A880]/50 transition-all rounded-xs cursor-pointer group shadow-xs"
            >
              <span>Explore Full Gallery ({getPublishedFeaturedProjects().length} Projects)</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Featured 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {featuredProjects.map((project: GalleryProject, idx: number) => {
            const formattedIndex = String(idx + 1).padStart(2, '0');

            return (
              <article
                key={project.id}
                onClick={() => navigate(`/gallery/${project.slug}`)}
                className="group cursor-pointer flex flex-col bg-[#FBF9F5] border border-[#242424]/8 rounded-xs overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300"
              >
                {/* Image Aspect */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE5DC]">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="text-[10px] font-mono tracking-widest text-[#FBF9F5] px-2 py-1 bg-[#111111]/75 backdrop-blur-xs rounded-xs">
                      {formattedIndex}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5A880] px-2 py-1 bg-[#111111]/85 backdrop-blur-xs rounded-xs">
                      {project.category}
                    </span>
                  </div>

                  {project.linkedAlbumId && (
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                      <span className="text-[10px] font-medium tracking-wider uppercase text-[#FBF9F5] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#C5A880]" />
                        24 Spreads Ready
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-[#111111] group-hover:text-[#C5A880] transition-colors leading-snug line-clamp-1 mb-1.5">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#242424]/70 font-light line-clamp-2 leading-relaxed mb-3">
                      {project.shortDescription || project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#242424]/8 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#242424]/60 uppercase tracking-wider line-clamp-1">
                      {project.location?.split(',')[0]}
                    </span>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#111111] group-hover:text-[#C5A880] transition-colors">
                      <span>View Story</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Banner Link to Full Archive */}
        <div className="mt-14 p-6 bg-[#F5F2EB] border border-[#242424]/8 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#C5A880] shrink-0" />
            <p className="text-xs text-[#242424]/80 leading-relaxed font-normal">
              Looking for our complete client archive? Browse traditional Kandyan, black-tie modern, and intimate destination galleries.
            </p>
          </div>
          <Link
            to="/gallery"
            className="shrink-0 text-xs font-semibold uppercase tracking-widest text-[#111111] hover:text-[#C5A880] transition-colors underline underline-offset-4 cursor-pointer"
          >
            Open Client Gallery &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
};
