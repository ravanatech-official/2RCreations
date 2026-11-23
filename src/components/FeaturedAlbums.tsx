import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { ALBUMS } from '../data/albums';
import { analytics } from '../services/analytics';
import { Album } from '../types';

interface FeaturedAlbumsProps {
  onOpenAlbum: (albumId: string, spreadNumber?: number) => void;
  onViewAllPortfolio: () => void;
}

export const FeaturedAlbums: React.FC<FeaturedAlbumsProps> = ({
  onOpenAlbum,
  onViewAllPortfolio
}) => {
  const navigate = useNavigate();
  // Exact three signature albums: 01 Traditional, 02 Modern Editorial, 03 Luxury
  const featured = ALBUMS.slice(0, 3);

  const handleOpenViewer = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation();
    analytics.albumOpen(album.id, album.title);
    onOpenAlbum(album.id, 1);
  };

  return (
    <section id="featured-work" className="py-24 bg-[#FBF9F5] border-t border-[#242424]/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#C5A880] uppercase block mb-3 font-mono">
              FEATURED ALBUMS
            </span>
            <h2 className="type-section-h2 text-[#111111] max-w-xl">
              Albums Designed To Be Experienced, Not Just Seen.
            </h2>
          </div>
          <p className="type-normal-body text-[#242424]/75 max-w-md font-normal">
            Every album is a complete narrative sequence. Open an album to experience realistic page-turn pacing, editorial white-space, and emotional rhythm.
          </p>
        </div>

        {/* 3 Featured Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {featured.map((album) => (
            <div
              key={album.id}
              className="group flex flex-col bg-[#FAF8F5] border border-[#242424]/10 rounded-xs overflow-hidden transition-all duration-300 hover:border-[#C5A880]/60 shadow-2xs"
            >
              {/* Image Frame */}
              <div 
                className="relative aspect-[4/5] overflow-hidden bg-[#EAE5DC] cursor-pointer"
                onClick={() => navigate(`/portfolio/${album.slug}`)}
              >
                <img
                  src={album.coverImage}
                  alt={album.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                {/* Top Subtle Label */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[8.5px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                    CONCEPT STUDY
                  </span>
                  <span className="text-[8.5px] font-mono tracking-widest text-white/90 uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                    {album.conceptLabel || album.category}
                  </span>
                </div>

                {/* Bottom Overlay Title & Spread Info */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-[#FBF9F5]">
                  <p className="text-[10px] font-mono tracking-wider uppercase text-[#C5A880] mb-1">
                    {album.totalSpreads} Spreads / {album.totalPages} Pages Concept
                  </p>
                  <h3 className="type-card-title font-serif font-normal text-[#FBF9F5] leading-snug">
                    {album.title}
                  </h3>
                </div>
              </div>

              {/* Card Bottom Meta & Actions */}
              <div className="p-4.5 flex flex-col gap-2.5 border-t border-[#242424]/8 bg-[#FAF8F5]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-wider text-[#111111] bg-[#C5A880]/15 border border-[#C5A880]/30 px-2 py-0.5 rounded-xs uppercase font-medium">
                    <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
                    <span>Fine Art Retouching Included</span>
                  </span>
                </div>

                <p className="text-[12px] text-[#242424]/70 font-light line-clamp-1">
                  {album.subtitle}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#242424]/6">
                  <Link
                    to={`/portfolio/${album.slug}`}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold tracking-wider uppercase text-[#111111] hover:text-[#C5A880] transition-colors"
                  >
                    <span>View Album</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </Link>

                  <button
                    onClick={(e) => handleOpenViewer(e, album)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-[#FBF9F5] hover:bg-[#C5A880] hover:text-[#111111] text-[11px] font-mono tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-[#C5A880] group-hover:text-[#111111]" />
                    <span>Open Full Album</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Portfolio Link */}
        <div className="mt-14 text-center">
          <button
            onClick={onViewAllPortfolio}
            className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.05em] text-[#111111] hover:text-[#C5A880] py-2 border-b border-[#111111]/20 hover:border-[#C5A880] transition-all cursor-pointer"
          >
            <span>View Full Portfolio (6 Signature Concepts) &rarr;</span>
          </button>
        </div>

      </div>
    </section>
  );
};
