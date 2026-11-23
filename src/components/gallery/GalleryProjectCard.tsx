import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GalleryProject } from '../../types';

interface GalleryProjectCardProps {
  project: GalleryProject;
  index: number;
  onOpenProject: (slug: string) => void;
}

export const GalleryProjectCard: React.FC<GalleryProjectCardProps> = ({
  project,
  index,
  onOpenProject,
}) => {
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <article
      onClick={() => onOpenProject(project.slug)}
      className="group cursor-pointer flex flex-col bg-transparent text-[#242424]"
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenProject(project.slug);
        }
      }}
    >
      {/* Large Project Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-[#EAE5DC] mb-5">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Subtle tonal gradient on bottom for optical contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Index counter top-left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-mono tracking-widest text-[#FBF9F5] px-2.5 py-1 bg-[#111111]/70 backdrop-blur-xs rounded-xs">
            {formattedIndex}
          </span>
        </div>

        {/* Linked album indicator if full digital album exists */}
        {project.linkedAlbumId && (
          <div className="absolute top-4 right-4 z-10">
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5A880] px-2.5 py-1 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
              DIGITAL SPREADS READY
            </span>
          </div>
        )}
      </div>

      {/* Typography & Metadata */}
      <div className="flex flex-col space-y-1.5 px-0.5">
        
        {/* Project Title */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#111111] group-hover:text-[#C5A880] transition-colors duration-200">
            {project.title}
          </h3>
          <div className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[#111111] group-hover:text-[#C5A880] transition-colors shrink-0">
            <span>View Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Metadata Line 1: Style / Category · Location */}
        <p className="text-xs sm:text-sm text-[#242424]/75 font-light">
          {project.style || project.category}
          {project.location ? ` · ${project.location}` : ''}
        </p>

        {/* Metadata Line 2: Album Type · Year */}
        <p className="text-[11px] font-mono tracking-wider uppercase text-[#242424]/50">
          {project.albumType || 'Album Design'}
          {project.year ? ` · ${project.year}` : ''}
        </p>

      </div>
    </article>
  );
};
