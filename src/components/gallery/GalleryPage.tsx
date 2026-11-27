import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Sparkles, Sliders, ArrowUpRight, ArrowRight, Layers } from 'lucide-react';
import { GalleryProject } from '../../types';
import { getPublishedGalleryProjects } from '../../data/galleryProjects';
import { ALBUMS } from '../../data/albums';
import { RETOUCHING_STUDIES } from '../../data/retouchingStudies';
import { GalleryProjectCard } from './GalleryProjectCard';
import { analytics } from '../../services/analytics';

interface GalleryPageProps {
  onOpenProject: (slug: string) => void;
  onStartProject: () => void;
  onExplorePortfolio: () => void;
  onOpenAlbum?: (albumId: string) => void;
  onOpenRetouching?: (studyId: string) => void;
}

export type GalleryServiceCategory = 
  | 'ALL'
  | 'ALBUMS'
  | 'RETOUCHING'
  | 'MANIPULATION'
  | 'REAL_WORK';

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onOpenProject,
  onStartProject,
  onOpenAlbum,
  onOpenRetouching,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab')?.toUpperCase() as GalleryServiceCategory) || 'ALL';
  const [activeTab, setActiveTab] = useState<GalleryServiceCategory>(
    ['ALL', 'ALBUMS', 'RETOUCHING', 'MANIPULATION', 'REAL_WORK'].includes(initialTab) ? initialTab : 'ALL'
  );

  // Real published client projects
  const publishedProjects: GalleryProject[] = useMemo(() => {
    return getPublishedGalleryProjects();
  }, []);

  const handleTabChange = (tab: GalleryServiceCategory) => {
    setActiveTab(tab);
    setSearchParams(tab === 'ALL' ? {} : { tab });
    analytics.galleryFilter?.(tab);
  };

  return (
    <div className="pt-32 pb-24 bg-[#FBF9F5] min-h-screen text-[#242424]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Gallery Intro / Hero Header */}
        <header className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A880] uppercase block mb-3 font-mono">
            STUDIO ARCHIVE &bull; ALL DISCIPLINES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#111111] leading-[1.15] mb-4">
            The Complete Works &amp; Gallery Archive
          </h1>
          <p className="text-base sm:text-lg text-[#242424]/80 leading-relaxed font-light">
            Every signature album concept, editorial spread architecture, high-frequency retouching study, and real client story curated across our studio services.
          </p>
        </header>

        {/* Global Reputed Category Navigation Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-12 border-b border-[#242424]/10 no-scrollbar">
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#242424]/40 shrink-0 mr-2">
            Discipline Archive:
          </span>

          <button
            onClick={() => handleTabChange('ALL')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all rounded-xs cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-[#111111] text-[#FBF9F5] shadow-xs'
                : 'text-[#242424]/60 hover:text-[#111111] hover:bg-[#242424]/5'
            }`}
          >
            All Works ({ALBUMS.length + RETOUCHING_STUDIES.length + publishedProjects.length})
          </button>

          <button
            onClick={() => handleTabChange('ALBUMS')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all rounded-xs cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ALBUMS'
                ? 'bg-[#111111] text-[#FBF9F5] shadow-xs'
                : 'text-[#242424]/60 hover:text-[#111111] hover:bg-[#242424]/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Album Concepts ({ALBUMS.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('RETOUCHING')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all rounded-xs cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RETOUCHING'
                ? 'bg-[#111111] text-[#FBF9F5] shadow-xs'
                : 'text-[#242424]/60 hover:text-[#111111] hover:bg-[#242424]/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Retouching Studies ({RETOUCHING_STUDIES.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('REAL_WORK')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all rounded-xs cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REAL_WORK'
                ? 'bg-[#111111] text-[#FBF9F5] shadow-xs'
                : 'text-[#242424]/60 hover:text-[#111111] hover:bg-[#242424]/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Client Real Weddings ({publishedProjects.length})</span>
          </button>
        </div>

        {/* SECTION 1: ALBUM CONCEPTS (All 6 Concepts with Complete Spreads) */}
        {(activeTab === 'ALL' || activeTab === 'ALBUMS') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#242424]/8">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block font-semibold">
                  HEIRLOOM SPREAD DESIGNS
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111111]">
                  Signature Wedding Album Concepts
                </h2>
              </div>
              <span className="text-xs font-mono text-[#242424]/50">
                {ALBUMS.length} Collections Available
              </span>
            </div>

            {/* Compact 4-Column Editorial Archive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {ALBUMS.map((album) => (
                <div
                  key={album.id}
                  className="group flex flex-col bg-[#FAF8F5] border border-[#242424]/10 rounded-xs overflow-hidden transition-all duration-300 hover:border-[#C5A880]/70 shadow-2xs hover:shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE5DC]">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/25 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />
                    
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <span className="text-[8.5px] font-mono tracking-widest text-[#FBF9F5]/90 uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                        {album.category}
                      </span>
                      <span className="text-[8.5px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                        24 SPREADS
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button
                        onClick={() => {
                          if (onOpenAlbum) {
                            onOpenAlbum(album.id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FBF9F5] text-[#111111] text-[10.5px] font-semibold uppercase tracking-wider rounded-xs shadow-md border border-[#C5A880]/30 transform translate-y-1 group-hover:translate-y-0 transition-transform cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3 text-[#C5A880]" />
                        <span>VIEW SPREADS &rarr;</span>
                      </button>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-[#FBF9F5]">
                      <p className="text-[9px] font-mono tracking-wider uppercase text-[#C5A880] mb-0.5">
                        {album.totalSpreads} Spreads &bull; 48 Pages
                      </p>
                      <h3 className="font-serif text-base sm:text-lg font-normal text-[#FBF9F5] leading-snug line-clamp-1">
                        {album.title}
                      </h3>
                      <p className="text-[11px] text-[#FBF9F5]/80 font-light line-clamp-1">
                        {album.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between bg-[#FAF8F5]">
                    <p className="text-xs text-[#242424]/75 line-clamp-2 font-light mb-3 leading-relaxed">
                      {album.description}
                    </p>
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#242424]/5">
                      <Link
                        to={`/portfolio/${album.slug}`}
                        className="text-[10px] font-mono uppercase tracking-wider text-[#111111] hover:text-[#C5A880] underline cursor-pointer"
                      >
                        Details &rarr;
                      </Link>
                      <button
                        onClick={() => onOpenAlbum && onOpenAlbum(album.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#111111] transition-colors cursor-pointer"
                      >
                        <span>Turn Pages</span>
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: RETOUCHING & MANIPULATION STUDIES */}
        {(activeTab === 'ALL' || activeTab === 'RETOUCHING') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#242424]/8">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block font-semibold">
                  FINE ART POST-PRODUCTION LAB
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111111]">
                  Photo Retouching &amp; Color Grading Studies
                </h2>
              </div>
              <span className="text-xs font-mono text-[#242424]/50">
                {RETOUCHING_STUDIES.length} High-Res Studies
              </span>
            </div>

            {/* Compact 4-Column Editorial Archive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {RETOUCHING_STUDIES.map((study) => (
                <div
                  key={study.id}
                  className="group flex flex-col bg-[#FAF8F5] border border-[#242424]/10 rounded-xs overflow-hidden transition-all duration-300 hover:border-[#C5A880]/70 shadow-2xs hover:shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={study.thumbnail}
                      alt={study.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-[center_12%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/25 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <span className="text-[8.5px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs rounded-xs border border-[#C5A880]/20">
                        {study.badge}
                      </span>
                      <span className="text-[8.5px] font-mono tracking-widest text-[#FBF9F5]/80 uppercase px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs rounded-xs">
                        LAB STUDY
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button
                        onClick={() => onOpenRetouching && onOpenRetouching(study.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FBF9F5] text-[#111111] text-[10.5px] font-semibold uppercase tracking-wider rounded-xs shadow-md border border-[#C5A880]/30 transform translate-y-1 group-hover:translate-y-0 transition-transform cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#C5A880]" />
                        <span>BEFORE / AFTER &rarr;</span>
                      </button>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-[#FBF9F5]">
                      <p className="text-[9px] font-mono tracking-wider uppercase text-[#C5A880] mb-0.5">
                        {study.turnaroundNote}
                      </p>
                      <h3 className="font-serif text-base sm:text-lg font-normal text-[#FBF9F5] leading-snug line-clamp-1">
                        {study.title}
                      </h3>
                      <p className="text-[11px] text-[#FBF9F5]/75 font-light line-clamp-1">
                        {study.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between bg-[#FAF8F5]">
                    <p className="text-xs text-[#242424]/75 line-clamp-2 font-light mb-3 leading-relaxed">
                      {study.description}
                    </p>
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#242424]/5">
                      <span className="text-[10px] font-mono text-[#242424]/60">
                        {study.slides.length} Slides
                      </span>
                      <button
                        onClick={() => onOpenRetouching && onOpenRetouching(study.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#111111] transition-colors cursor-pointer"
                      >
                        <span>Compare</span>
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: REAL CLIENT PROJECTS (Client-Authorized Real Weddings) */}
        {(activeTab === 'ALL' || activeTab === 'REAL_WORK') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#242424]/8">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block font-semibold">
                  COMMISSIONED STORIES
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
                  Client-Approved Real Weddings
                </h2>
              </div>
              <span className="text-xs font-mono text-[#242424]/50">
                {publishedProjects.length} Exhibited
              </span>
            </div>

            {publishedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-16">
                {publishedProjects.map((project, index) => (
                  <GalleryProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onOpenProject={onOpenProject}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-[#242424]/10 bg-[#FAF8F5] p-8 sm:p-12 rounded-xs text-center">
                <div className="w-10 h-10 rounded-full border border-[#C5A880]/30 bg-[#F5F2EB] flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-4 h-4 text-[#C5A880]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-2">
                  Client Privacy &amp; Ongoing Commissions
                </h3>
                <p className="text-xs sm:text-sm text-[#242424]/70 max-w-xl mx-auto leading-relaxed font-light mb-6">
                  We maintain strict client image confidentiality. Real commissioned client projects are uploaded to this gallery exclusively with written consent from the wedding couple and photography studio.
                </p>
                <button
                  onClick={onStartProject}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] hover:bg-[#C5A880] hover:text-[#111111] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  <span>Submit Your Wedding For Design</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Ethical Transparency Note */}
        <div className="mt-20 pt-10 border-t border-[#242424]/10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#111111]/70">
              GLOBAL STUDIO ETHICS &amp; STANDARDS
            </span>
          </div>
          <p className="text-xs text-[#242424]/60 leading-relaxed font-light">
            <strong>Portfolio:</strong> Curated highlights of our top 3 master concepts for immediate client review. <br className="hidden sm:inline" />
            <strong>Gallery Archive:</strong> Exhaustive multi-disciplinary repository covering all album concepts, retouching laboratory studies, and authorized client wedding books.
          </p>
        </div>

      </div>
    </div>
  );
};
