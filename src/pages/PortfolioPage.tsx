import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowUpRight, Filter, Sparkles, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import { ALBUMS } from '../data/albums';
import { SERVICES } from '../data/services';
import { AlbumCategory } from '../types';
import { updateSEO } from '../utils/seo';
import { analytics } from '../services/analytics';

import { RETOUCHING_STUDIES, RetouchingStudy } from '../data/retouchingStudies';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

interface PortfolioPageProps {
  onOpenAlbum: (albumId: string, spreadNumber?: number) => void;
  onOpenRetouching?: (studyId: string, slideNumber?: number) => void;
}

type PortfolioTab = 'ALBUMS' | 'RETOUCHING';

const CATEGORIES: AlbumCategory[] = [
  'ALL',
  'TRADITIONAL',
  'MODERN',
  'LUXURY',
  'INDIAN',
  'WESTERN',
  'PRE-SHOOT'
];

type RetouchingCategory = 'ALL' | 'SKIN' | 'COLOR' | 'GOWN' | 'LIGHTING' | 'REMOVAL';

const RETOUCHING_CATEGORIES: { id: RetouchingCategory; label: string }[] = [
  { id: 'ALL', label: 'All Retouching' },
  { id: 'SKIN', label: 'Natural Skin & Portraits' },
  { id: 'COLOR', label: 'Color Grading & Film' },
  { id: 'GOWN', label: 'Bridal Gowns & Regalia' },
  { id: 'LIGHTING', label: 'Lighting Calibration' },
  { id: 'REMOVAL', label: 'Object & Venue Clean-up' },
];

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenAlbum, onOpenRetouching }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PortfolioTab>('ALBUMS');
  const [activeCategory, setActiveCategory] = useState<AlbumCategory>('ALL');
  const [activeRetouchCategory, setActiveRetouchCategory] = useState<RetouchingCategory>('ALL');
  const [cardFrameIndices, setCardFrameIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    updateSEO({
      title: activeTab === 'ALBUMS'
        ? 'Wedding Album Design Portfolio | 2R Creations'
        : 'Photo Retouching & Color Grading Portfolio | 2R Creations',
      description: 'Explore bespoke wedding album concepts, editorial spread pacing, natural skin retouching, and before/after color grading crafted by 2R Creations.',
      canonicalPath: '/portfolio',
      ogImage: ALBUMS[0]?.coverImage,
      ogImageAlt: '2R Creations Signature Wedding Album Design Portfolio',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' }
      ],
      structuredData: {
        '@type': 'CollectionPage',
        name: '2R Creations Wedding Album & Retouching Portfolio',
        url: 'https://2rcreations.com/portfolio',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: ALBUMS.length,
          itemListElement: ALBUMS.map((album, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: album.title,
            url: `https://2rcreations.com/portfolio/${album.slug}`
          }))
        }
      }
    });
  }, [activeTab]);

  const filteredAlbums = activeCategory === 'ALL'
    ? ALBUMS
    : ALBUMS.filter(album => {
        if (activeCategory === 'WEDDING') {
          return album.category !== 'PRE-SHOOT';
        }
        return album.category === activeCategory;
      });

  // Photo retouching showcase items
  const retouchingService = SERVICES.find(s => s.id === 'photo-retouching');
  const manipulationService = SERVICES.find(s => s.id === 'photo-manipulation');
  const editingService = SERVICES.find(s => s.id === 'wedding-photo-editing');

  const retouchingItems = [
    {
      id: 'pr-1',
      studyId: 'study-natural-skin',
      title: 'Natural Skin Micro-Retouching',
      subtitle: 'Authentic Skin Texture & Session Consistency',
      category: 'SKIN' as RetouchingCategory,
      badge: 'Skin & Portrait',
      frames: [
        {
          label: 'Pose 1',
          beforeImage: '/assets/services/photo-retouching/portrait-skin-before.webp',
          afterImage: '/assets/services/photo-retouching/portrait-skin-after.webp',
        },
        {
          label: 'Pose 2',
          beforeImage: '/assets/services/photo-retouching/portrait-skin-02-before.webp',
          afterImage: '/assets/services/photo-retouching/portrait-skin-02-after.webp',
        },
        {
          label: 'Pose 3',
          beforeImage: '/assets/services/photo-retouching/portrait-skin-03-before.webp',
          afterImage: '/assets/services/photo-retouching/portrait-skin-03-after.webp',
        },
      ],
      beforeImage: '/assets/services/photo-retouching/portrait-skin-before.webp',
      image: '/assets/services/photo-retouching/portrait-skin-after.webp',
      description: 'Gentle cleanup of temporary blemishes, redness, and shine while preserving authentic pore fidelity and consistent skin tones across a portrait session.',
      highlights: ['Pore Texture Preservation', 'Session Tone Consistency', 'Eye & Hair Clarity']
    },
    {
      id: 'pr-2',
      studyId: 'study-bridal-gown',
      title: 'Bridal Regalia & Gown Perfection',
      subtitle: 'Luminous Bridal Skin, Pearl Jewelry & Lace Detail',
      category: 'GOWN' as RetouchingCategory,
      badge: 'Bridal Regalia',
      frames: [
        {
          label: 'Pose 1',
          beforeImage: '/assets/services/photo-retouching/bridal-regalia-01-before.webp',
          afterImage: '/assets/services/photo-retouching/bridal-regalia-01-after.webp',
        },
        {
          label: 'Pose 2',
          beforeImage: '/assets/services/photo-retouching/bridal-regalia-02-before.webp',
          afterImage: '/assets/services/photo-retouching/bridal-regalia-02-after.webp',
        },
        {
          label: 'Pose 3',
          beforeImage: '/assets/services/photo-retouching/bridal-regalia-03-before.webp',
          afterImage: '/assets/services/photo-retouching/bridal-regalia-03-after.webp',
        },
      ],
      beforeImage: '/assets/services/photo-retouching/bridal-regalia-01-before.webp',
      image: '/assets/services/photo-retouching/bridal-regalia-01-after.webp',
      description: 'Neutralizing warm indoor color casts, calming cheek blemishes and shine while preserving authentic bridal pore fidelity, and bringing crisp brilliance to pearl, gold, and lace regalia.',
      highlights: ['Indoor Cast Neutralization', 'Natural Bridal Pore Fidelity', 'Pearl & Gold Regalia Clarity']
    },
    {
      id: 'pr-3',
      studyId: 'study-baby-portrait',
      title: 'Baby & Child Portrait Retouching',
      subtitle: 'Delicate Baby Skin Cleanup & Creamy Tonal Glow',
      category: 'SKIN' as RetouchingCategory,
      badge: 'Baby & Family',
      imagePosition: 'object-[47%_center]',
      frames: [
        {
          label: 'Pose 1',
          beforeImage: '/assets/services/photo-retouching/baby-portrait-01-before.webp',
          afterImage: '/assets/services/photo-retouching/baby-portrait-01-after.webp',
          imagePosition: 'object-[47%_center]',
        },
        {
          label: 'Pose 2',
          beforeImage: '/assets/services/photo-retouching/baby-portrait-02-before.webp',
          afterImage: '/assets/services/photo-retouching/baby-portrait-02-after.webp',
          imagePosition: 'object-[center_12%]',
        },
        {
          label: 'Pose 3',
          beforeImage: '/assets/services/photo-retouching/baby-portrait-03-before.webp',
          afterImage: '/assets/services/photo-retouching/baby-portrait-03-after.webp',
          imagePosition: 'object-[center_12%]',
        },
      ],
      beforeImage: '/assets/services/photo-retouching/baby-portrait-01-before.webp',
      image: '/assets/services/photo-retouching/baby-portrait-01-after.webp',
      description: 'Ultra-gentle removal of temporary baby skin spots and marks while preserving soft natural dimples, warm creamy tones, and sparkling eye catchlights.',
      highlights: ['Delicate Spot & Mark Cleanup', 'Soft Natural Baby Skin Glow', 'Crisp Eye Catchlight Polish']
    },
    {
      id: 'pr-lighting',
      studyId: 'study-lighting-calibration',
      title: 'Mixed Lighting Neutralization',
      subtitle: 'Color Temperature Harmonization',
      category: 'LIGHTING' as RetouchingCategory,
      badge: 'Lighting Balance',
      image: '/assets/services/photo-retouching/concept-03.webp',
      description: 'Seamlessly balancing warm indoor tungsten banquet ambiance with cool outdoor ambient twilight without unnatural skin shifts.',
      highlights: ['Tungsten & Daylight Balance', 'White Balance Normalization', 'Even Spread Tonality']
    },
    {
      id: 'pr-4',
      studyId: 'study-monochrome-archival',
      title: 'Monochrome Archival Contrast Sculpting',
      subtitle: 'Fine Art Black & White Tonal Depth',
      category: 'COLOR' as RetouchingCategory,
      badge: 'Monochrome',
      image: '/assets/services/photo-retouching/concept-04.webp',
      description: 'Deep velvety blacks, preserved midtones, and luminous highlight curves calibrated specifically for archival cotton rag album papers.',
      highlights: ['Velvety Archival Shadows', 'Highlight Roll-off', 'Timeless Monochrome']
    },
    {
      id: 'pr-5',
      studyId: 'study-bridal-gown',
      title: 'Heritage Regalia Color & Gold Depth',
      subtitle: 'Kandyan & Indian Traditional Attire',
      category: 'GOWN' as RetouchingCategory,
      badge: 'Traditional Attire',
      image: '/assets/services/photo-retouching/concept-06.webp',
      description: 'Elevating rich jewelry reflections, gold thread zari work, and deep crimson fabrics without oversaturating couple skin tones.',
      highlights: ['Pure Metallic Luster', 'Jewel Tone Vibrancy', 'Skin Tonal Protection']
    },
    {
      id: 'pr-6',
      studyId: 'study-object-removal',
      title: 'Historic Venue Distraction Clean-up',
      subtitle: 'Object Removal & Seamless Texture Reconstruction',
      category: 'REMOVAL' as RetouchingCategory,
      badge: 'Object Removal',
      image: '/assets/services/photo-manipulation/concept-01.webp',
      description: 'Painstaking pixel reconstruction removing exit signs, vents, fire extinguishers, and unwanted background elements with 100% grain matching.',
      highlights: ['Pixel Texture Rebuilding', 'Grain Matching', 'Distraction-Free Focus']
    },
    {
      id: 'pr-7',
      studyId: 'study-object-removal',
      title: 'Ceremony Aisle Guest Smartphone Removal',
      subtitle: 'Preserving Sacred Moment Purity',
      category: 'REMOVAL' as RetouchingCategory,
      badge: 'Object Removal',
      image: '/assets/services/photo-manipulation/concept-02.webp',
      description: 'Discreetly removing intrusive phones, iPads, and extended arms from ceremony aisle hero shots so the couple stands alone in timeless elegance.',
      highlights: ['Seamless Background Infill', 'Depth of Field Continuity', 'Editorial Purity']
    },
    {
      id: 'pr-8',
      studyId: 'study-film-grain-color',
      title: 'Atmospheric Film Grain & Tonal Harmony',
      subtitle: 'Lightroom Color Consistency Across Galleries',
      category: 'COLOR' as RetouchingCategory,
      badge: 'Color Grading',
      image: '/assets/services/wedding-photo-editing/concept-04.webp',
      description: 'Applying tailored film curves and gentle organic grain profiles that elevate digital captures to painterly, editorial print standards.',
      highlights: ['Custom Studio Match', 'Organic Film Grain', 'Even Page Flow']
    },
    {
      id: 'pr-9',
      studyId: 'study-object-removal',
      title: 'Public Landmark Tourist Clearing',
      subtitle: 'Scenic Landscape & Architecture Isolation',
      category: 'REMOVAL' as RetouchingCategory,
      badge: 'Venue Clean-up',
      image: '/assets/services/photo-manipulation/concept-03.webp',
      description: 'Erasing tourists, bystanders, and safety barriers from destination portraits and beach sunsets for completely uninterrupted vistas.',
      highlights: ['Horizon Reconstruction', 'Shadow Integration', 'Fine Art Finish']
    }
  ];

  const filteredRetouchingItems = activeRetouchCategory === 'ALL'
    ? retouchingItems
    : retouchingItems.filter(item => item.category === activeRetouchCategory);

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 bg-[#FBF9F5]">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <h1 className="type-hero-h1 text-[#111111] mb-4">
            {activeTab === 'ALBUMS' ? 'Signature Album Concepts' : 'Photo Retouching & Color Grading'}
          </h1>
          <p className="type-large-body text-[#242424]/75 font-light max-w-2xl">
            {activeTab === 'ALBUMS'
              ? 'Explore our signature album design studies and visual styles. Each curated collection demonstrates emotional pacing, bespoke typography pairing, and print-calibrated layout architecture.'
              : 'Discover our fine art post-production and retouching artistry. Natural skin preservation, spread-to-spread color harmony, and museum-grade object removal tailored for fine art photographers.'
            }
          </p>
        </div>

        {/* Primary Portfolio Mode Tabs (Album Designs vs Photo Retouching) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-1.5 bg-[#FAF8F5] border border-[#242424]/12 rounded-sm w-full sm:w-fit mb-8 sm:mb-10 shadow-2xs">
          <button
            onClick={() => {
              setActiveTab('ALBUMS');
              analytics.portfolioCategoryChange?.('ALBUMS');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide rounded-xs transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'ALBUMS'
                ? 'bg-[#111111] text-[#FBF9F5] shadow-xs'
                : 'text-[#242424]/70 hover:text-[#111111] hover:bg-[#242424]/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>Album Designs ({ALBUMS.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('RETOUCHING');
              analytics.portfolioCategoryChange?.('RETOUCHING');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide rounded-xs transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'RETOUCHING'
                ? 'bg-[#111111] text-[#FBF9F5] shadow-xs'
                : 'text-[#242424]/70 hover:text-[#111111] hover:bg-[#242424]/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>Photo Retouching ({retouchingItems.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ALBUM DESIGNS                                                      */}
        {/* ========================================================================= */}
        {activeTab === 'ALBUMS' && (
          <div>
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar border-b border-[#242424]/10">
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

            {/* Grid of Featured Albums (Top 3 Curated Selection) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredAlbums.slice(0, 3).map((album) => (
                <div
                  key={album.id}
                  className="group flex flex-col bg-[#FAF8F5] border border-[#242424]/10 rounded-xs overflow-hidden transition-all duration-300 hover:border-[#C5A880]/60 shadow-2xs hover:shadow-sm"
                >
                  {/* Cover Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE5DC]">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/25 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="text-[9px] font-mono tracking-widest text-[#FBF9F5]/90 uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                        FEATURED MASTERPIECE
                      </span>
                      <span className="text-[9px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/80 backdrop-blur-xs rounded-xs">
                        {album.category}
                      </span>
                    </div>

                    {/* Interactive Action Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button
                        onClick={() => {
                          analytics.albumOpen(album.id, album.title);
                          onOpenAlbum(album.id, 1);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FBF9F5] text-[#111111] text-xs font-semibold uppercase tracking-widest rounded-xs shadow-md border border-[#C5A880]/30 transform translate-y-1 group-hover:translate-y-0 transition-transform cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>OPEN SPREAD VIEWER &rarr;</span>
                      </button>
                    </div>

                    {/* Bottom Overlay Info */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-[#FBF9F5]">
                      <p className="text-[10px] font-mono tracking-wider uppercase text-[#C5A880] mb-1">
                        {album.totalSpreads} Spreads / {album.totalPages} Pages Concept
                      </p>
                      <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FBF9F5] mb-1 line-clamp-1">
                        {album.title}
                      </h3>
                      <p className="text-[12.5px] text-[#FBF9F5]/80 font-light line-clamp-1">
                        {album.subtitle || album.visualLanguage}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Card Summary & Actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between border-t border-[#242424]/8 bg-[#FAF8F5]">
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-mono tracking-wider text-[#111111] bg-[#C5A880]/15 border border-[#C5A880]/30 px-2 py-0.5 rounded-xs uppercase font-medium">
                        <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
                        <span>Fine Art Retouching Included</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#242424]/75 line-clamp-2 font-light mb-4 leading-relaxed">
                      {album.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#242424]/5">
                      <Link
                        to={`/portfolio/${album.slug}`}
                        className="text-[11px] font-mono uppercase tracking-wider text-[#111111] hover:text-[#C5A880] underline cursor-pointer"
                      >
                        View Concept Details &rarr;
                      </Link>

                      <button
                        onClick={() => {
                          analytics.albumOpen(album.id, album.title);
                          onOpenAlbum(album.id, 1);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#111111] transition-colors cursor-pointer"
                      >
                        <span>Turn Spreads</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Standard Redirection Banner to Gallery Archive */}
            <div className="p-5 sm:p-8 lg:p-10 bg-[#161616] text-[#FBF9F5] border border-[#C5A880]/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl mb-12">
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-1 font-semibold">
                  LOOKING FOR MORE CONCEPTS & REAL STORIES?
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FBF9F5] mb-2">
                  Explore Full Album Archive in Our Gallery
                </h3>
                <p className="text-xs sm:text-sm text-[#FBF9F5]/70 max-w-xl font-light leading-relaxed">
                  Browse our complete archive of Indian Heritage, Western Destination, and Pre-Shoot narratives, plus client-authorized real wedding spreads.
                </p>
              </div>

              <Link
                to="/gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-[#C5A880] hover:bg-[#d6bc97] text-[#111111] font-semibold text-xs uppercase tracking-widest rounded-xs shadow-md transition-all shrink-0 cursor-pointer text-center"
              >
                <span>View All In Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PHOTO RETOUCHING                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'RETOUCHING' && (
          <div>
            {/* Category Filter for Retouching */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-[#242424]/10">
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#242424]/40 flex items-center gap-1.5 mr-2 shrink-0">
                <Sliders className="w-3.5 h-3.5 text-[#C5A880]" />
                Discipline:
              </span>
              {RETOUCHING_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveRetouchCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-[12.5px] font-medium tracking-[0.02em] rounded-xs whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeRetouchCategory === cat.id
                      ? 'bg-[#111111] text-[#FBF9F5]'
                      : 'bg-transparent text-[#242424]/70 hover:text-[#111111] hover:bg-[#242424]/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Philosophy Banner */}
            <div className="mb-10 sm:mb-12 p-5 sm:p-7 bg-[#111111] text-[#FBF9F5] rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#242424]">
              <div>
                <div className="flex items-center gap-2 text-[#C5A880] text-xs font-mono tracking-wider uppercase mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The 2R Retouching Standard</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FBF9F5] mb-2">
                  Restrained Polish. Never Plastic.
                </h3>
                <p className="text-xs sm:text-sm text-[#FBF9F5]/75 font-light leading-relaxed max-w-2xl">
                  We believe authentic character should never be smoothed away by automated algorithms. We use frequency separation, manual brushwork, and print-calibrated color grading to preserve authentic skin pore structure while eliminating distractions.
                </p>
              </div>

              <Link
                to="/services/photo-retouching"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#111111] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#D4BC96] transition-colors shrink-0 sm:whitespace-nowrap text-center"
              >
                <span>Full Retouching Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Retouching Showcase Grid (Top 3 Curated Selection) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredRetouchingItems.slice(0, 3).map((item) => {
                const hasFrames = 'frames' in item && Array.isArray(item.frames) && item.frames.length > 0;
                const currentFrameIdx = cardFrameIndices[item.id] ?? 0;
                const activeFrame = hasFrames ? (item.frames![currentFrameIdx] ?? item.frames![0]) : null;
                const hasInteractiveSlider = Boolean(activeFrame) || ('beforeImage' in item && Boolean(item.beforeImage));
                const activeBeforeImg = activeFrame ? activeFrame.beforeImage : ('beforeImage' in item ? item.beforeImage : undefined);
                const activeAfterImg = activeFrame ? activeFrame.afterImage : item.image;
                const targetSlideNum = hasFrames ? currentFrameIdx + 1 : 1;

                return (
                  <div
                    key={item.id}
                    className="group flex flex-col bg-[#FAF8F5] border border-[#242424]/10 rounded-xs overflow-hidden transition-all duration-300 hover:border-[#C5A880]/60 shadow-2xs hover:shadow-sm"
                  >
                    {/* Artwork Showcase Display */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                      {hasInteractiveSlider && activeBeforeImg ? (
                        <>
                          <BeforeAfterSlider
                            beforeImage={activeBeforeImg}
                            afterImage={activeAfterImg}
                            alt={item.title}
                            className="w-full h-full"
                            imageClassName={`w-full h-full object-cover ${
                              activeFrame && 'imagePosition' in activeFrame && activeFrame.imagePosition
                                ? activeFrame.imagePosition
                                : 'imagePosition' in item && item.imagePosition
                                ? item.imagePosition
                                : 'object-[center_12%]'
                            }`}
                          />
                          {/* Top Bar: Kicker + Optional Pose Switcher */}
                          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex flex-wrap items-center justify-between gap-1.5 z-20 pointer-events-none">
                            <span className="text-[8.5px] sm:text-[9px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs rounded-xs border border-[#C5A880]/20">
                              {item.badge}
                            </span>

                            {hasFrames && item.frames!.length > 1 ? (
                              <div
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex items-center gap-0.5 p-0.5 bg-[#111111]/90 backdrop-blur-xs rounded-xs border border-white/15 pointer-events-auto"
                              >
                                {item.frames!.map((frame, fIdx) => (
                                  <button
                                    key={frame.label}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCardFrameIndices((prev) => ({ ...prev, [item.id]: fIdx }));
                                    }}
                                    className={`px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                                      currentFrameIdx === fIdx
                                        ? 'bg-[#C5A880] text-[#111111] font-semibold'
                                        : 'text-[#FBF9F5]/75 hover:text-[#FBF9F5]'
                                    }`}
                                  >
                                    {frame.label}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[8.5px] sm:text-[9px] font-mono tracking-widest text-[#FBF9F5]/85 uppercase px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs rounded-xs">
                                DRAG TO COMPARE
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />

                          {/* Vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/75 via-[#111111]/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                          {/* Top Badge */}
                          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                            <span className="text-[9px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs rounded-xs border border-[#C5A880]/20">
                              {item.badge}
                            </span>
                            <span className="text-[9px] font-mono tracking-widest text-[#FBF9F5]/80 uppercase px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs rounded-xs">
                              FEATURED STUDY
                            </span>
                          </div>

                          {/* Interactive Action Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                              onClick={() => {
                                if (onOpenRetouching && item.studyId) {
                                  onOpenRetouching(item.studyId, 1);
                                } else {
                                  navigate('/services/photo-retouching');
                                }
                              }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FBF9F5] text-[#111111] text-xs font-semibold uppercase tracking-widest rounded-xs shadow-md border border-[#C5A880]/30 transform translate-y-1 group-hover:translate-y-0 transition-transform cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                              <span>OPEN BEFORE / AFTER &rarr;</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Card Content & Features */}
                    <div className="p-5 flex-1 flex flex-col justify-between border-t border-[#242424]/8 bg-[#FAF8F5]">
                      <div>
                        <p className="text-[10px] font-mono tracking-wider uppercase text-[#C5A880] mb-1">
                          {item.subtitle}
                        </p>
                        <h3 className="font-serif text-lg sm:text-xl font-normal text-[#111111] mb-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#242424]/75 line-clamp-3 font-light mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="space-y-1.5 mb-5 pt-3 border-t border-[#242424]/6">
                          {item.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] text-[#242424]/70">
                              <CheckCircle2 className="w-3 h-3 text-[#C5A880] shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#242424]/5">
                        <button
                          onClick={() => {
                            if (onOpenRetouching && item.studyId) {
                              onOpenRetouching(item.studyId, targetSlideNum);
                            } else {
                              navigate('/services/photo-retouching');
                            }
                          }}
                          className="text-[11px] font-mono uppercase tracking-wider text-[#111111] hover:text-[#C5A880] underline cursor-pointer"
                        >
                          Fullscreen Study &rarr;
                        </button>

                        <button
                          onClick={() => {
                            if (onOpenRetouching && item.studyId) {
                              onOpenRetouching(item.studyId, targetSlideNum);
                            } else {
                              navigate('/services/photo-retouching');
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase text-[#C5A880] hover:text-[#111111] transition-colors cursor-pointer"
                        >
                          <span>Before / After</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Redirection to Gallery for All Retouching, Manipulation & Color Grading */}
            <div className="p-5 sm:p-8 lg:p-10 bg-[#161616] text-[#FBF9F5] border border-[#C5A880]/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl mb-12">
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-1 font-semibold">
                  NEED ADVANCED EDITORIAL MANIPULATION & COLOR HARMONY?
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FBF9F5] mb-2">
                  Browse All Retouching & Manipulation in Gallery
                </h3>
                <p className="text-xs sm:text-sm text-[#FBF9F5]/70 max-w-xl font-light leading-relaxed">
                  Discover our complete archive of veil extensions, tourist removals, frequency separation studies, and raw image transformations.
                </p>
              </div>

              <Link
                to="/gallery?tab=RETOUCHING"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-[#C5A880] hover:bg-[#d6bc97] text-[#111111] font-semibold text-xs uppercase tracking-widest rounded-xs shadow-md transition-all shrink-0 cursor-pointer text-center"
              >
                <span>Explore All In Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Retouching Order CTA Bar */}
            <div className="mt-10 sm:mt-14 p-5 sm:p-8 bg-[#FAF8F5] border border-[#C5A880]/40 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880] block mb-1 font-semibold">
                  NEED RETOUCHING FOR AN UPCOMING WEDDING?
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#111111]">
                  Test Our Retouching With a Free Sample Frame
                </h4>
                <p className="text-xs sm:text-sm text-[#242424]/70 mt-1 max-w-xl">
                  Send us 1–2 test RAW files. We’ll perform natural skin retouching and color calibration so you can verify our fine art print standards before booking.
                </p>
              </div>
              <button
                onClick={() => navigate('/contact?project=' + encodeURIComponent('Free Retouching Sample'))}
                className="w-full sm:w-auto px-6 py-3 bg-[#111111] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#C5A880] hover:text-[#111111] transition-colors shrink-0 sm:whitespace-nowrap cursor-pointer shadow-xs text-center"
              >
                Request Free Test Frame &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Ethical Transparency Note */}
        <div className="mt-16 p-6 sm:p-8 bg-[#F5F2EB] border border-[#242424]/8 rounded-xs max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-[13px] text-[#242424]/75 leading-relaxed font-light">
            <strong className="font-semibold text-[#111111]">Studio Integrity Note:</strong> All album layouts and post-production studies presented are signature work crafted by 2R Creations to demonstrate sequencing, typography, color harmony, and print-ready calibration. Client wedding galleries are always held strictly confidential.
          </p>
        </div>

      </div>
    </div>
  );
};
