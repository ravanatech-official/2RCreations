import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, Filter } from 'lucide-react';
import { ALBUMS } from '../data/albums';
import { Album, AlbumCategory } from '../types';
import { analytics } from '../services/analytics';

interface PortfolioGridProps {
  onOpenAlbum: (albumId: string) => void;
  onStartProject: () => void;
}

const CATEGORIES: AlbumCategory[] = [
  'ALL',
  'TRADITIONAL',
  'MODERN',
  'CHURCH WEDDING',
  'INDIAN',
  'WESTERN',
  'PRE-SHOOT'
];

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  onOpenAlbum
}) => {
  const [activeCategory, setActiveCategory] = useState<AlbumCategory>('ALL');

  const filteredAlbums = activeCategory === 'ALL'
    ? ALBUMS
    : ALBUMS.filter(album => {
        if (activeCategory === 'WEDDING') {
          return album.category !== 'PRE-SHOOT';
        }
        return album.category === activeCategory;
      });

  const handleAlbumClick = (album: Album) => {
    analytics.albumOpen(album.id, album.title);
    onOpenAlbum(album.id);
  };

  return (
    <section id="portfolio-section" className="py-16 sm:py-24 bg-[#FBF9F5] border-t border-[#242424]/5">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#C5A880] uppercase block mb-3">
            SIGNATURE CONCEPTS · THE PORTFOLIO
          </span>
          <h2 className="type-section-h2 text-[#111111] mb-4">
            Signature Album Concepts
          </h2>
          <p className="type-large-body text-[#242424]/80">
            Explore our signature album design concepts and visual styles. Each curated study demonstrates emotional pacing, bespoke typography pairing, and print-calibrated album architecture.
          </p>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#242424]/70">Looking for our real completed client work archive?</span>
            <Link
              to="/gallery"
              className="text-xs font-semibold text-[#111111] hover:text-[#C5A880] transition-colors underline underline-offset-4 flex items-center gap-1"
            >
              <span>Explore Client Gallery</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar border-b border-[#242424]/10">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#242424]/40 flex items-center gap-1.5 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#C5A880]" />
            Category:
          </span>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 text-[12.5px] font-medium tracking-[0.02em] rounded-xs whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === category
                  ? 'bg-[#111111] text-[#FBF9F5]'
                  : 'bg-transparent text-[#242424]/70 hover:text-[#111111] hover:bg-[#242424]/5'
              }`}
            >
              {category === 'ALL' ? 'All Stories' : category}
            </button>
          ))}
        </div>

        {/* Uniform 3x2 Portfolio Grid (All 6 cards equal size) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              className="group cursor-pointer flex flex-col bg-[#FAF8F5] border border-[#242424]/10 rounded-xs overflow-hidden transition-all duration-300 hover:border-[#C5A880]/60"
              role="button"
              tabIndex={0}
              aria-label={`Open ${album.title}`}
            >
              {/* Image Container with identical aspect ratio for all 6 cards */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE5DC]">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/25 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="text-[9px] font-mono tracking-widest text-[#FBF9F5]/90 uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                    CONCEPT ALBUM
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                    {album.category}
                  </span>
                </div>

                {/* Hover Center Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FBF9F5] text-[#111111] text-xs font-semibold uppercase tracking-widest rounded-xs shadow-md border border-[#C5A880]/30 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>OPEN ALBUM &rarr;</span>
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-[#FBF9F5]">
                  <p className="text-[10px] font-mono tracking-wider uppercase text-[#C5A880] mb-1">
                    {album.totalSpreads} Spreads &bull; {album.totalPages} Pages
                  </p>
                  <h3 className="type-card-title font-serif font-normal text-[#FBF9F5] mb-1 line-clamp-1">
                    {album.title}
                  </h3>
                  <p className="text-[12.5px] text-[#FBF9F5]/80 font-normal line-clamp-1">
                    {album.subtitle || album.visualLanguage}
                  </p>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#242424]/8 bg-[#FAF8F5]">
                <p className="text-[12.5px] text-[#242424]/75 line-clamp-2 font-normal mb-3 leading-relaxed">
                  {album.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#242424]/5">
                  <span className="text-[10.5px] font-mono text-[#242424]/60 uppercase tracking-wider">
                    {album.totalSpreads} Spreads &bull; {album.totalPages} Pages
                  </span>
                  <div className="inline-flex items-center gap-1 text-[12px] font-medium tracking-wide uppercase text-[#111111] group-hover:text-[#C5A880] transition-colors shrink-0">
                    <span>View Album</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Transparency Note */}
        <div className="mt-14 p-6 bg-[#F5F2EB] border border-[#242424]/8 rounded-xs max-w-3xl mx-auto text-center">
          <p className="type-caption text-[#242424]/75 leading-relaxed">
            <strong className="font-semibold text-[#111111]">Design Integrity Note:</strong> The albums presented above are editorial design studies crafted to demonstrate layout sequencing, typography pairing, emotional pacing, and print-ready album architecture. Real client wedding photographs are always kept strictly confidential unless explicit written permission is granted.
          </p>
        </div>

      </div>
    </section>
  );
};
