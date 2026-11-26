import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, ArrowUpRight, Check, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { getAlbumBySlug, ALBUMS } from '../data/albums';
import { updateSEO } from '../utils/seo';
import { analytics } from '../services/analytics';
import { STUDIO_CONFIG, getWhatsAppUrl, hasWhatsApp } from '../config';

interface AlbumDetailPageProps {
  onOpenViewer: (albumId: string, spreadNumber?: number) => void;
}

export const AlbumDetailPage: React.FC<AlbumDetailPageProps> = ({ onOpenViewer }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const album = slug ? getAlbumBySlug(slug) : undefined;

  useEffect(() => {
    if (album) {
      updateSEO({
        title: `${album.title} Album Design | 2R Creations`,
        description: `${album.description} ${album.totalSpreads} spreads (${album.totalPages} pages) crafted with editorial pacing by 2R Creations.`,
        canonicalPath: `/portfolio/${album.slug}`,
        ogImage: album.coverImage,
        ogImageAlt: `${album.title} — ${album.subtitle} | 2R Creations`,
        type: 'article',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: album.title, path: `/portfolio/${album.slug}` }
        ],
        structuredData: {
          '@type': 'CreativeWork',
          name: album.title,
          headline: album.subtitle,
          description: album.description,
          url: `https://2rcreations.com/portfolio/${album.slug}`,
          image: `https://2rcreations.com${album.coverImage}`,
          keywords: album.tags.join(', '),
          creator: {
            '@id': 'https://2rcreations.com/#organization'
          }
        }
      });
      window.scrollTo(0, 0);
    }
  }, [album]);

  if (!album) {
    return (
      <div className="pt-36 pb-24 text-center bg-[#FBF9F5] min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl font-medium text-[#111111] mb-3">Album Concept Not Found</h1>
        <p className="text-sm text-[#242424]/70 mb-6">The requested album study could not be located.</p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-[#C5A880] rounded-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portfolio</span>
        </Link>
      </div>
    );
  }

  const otherAlbums = ALBUMS.filter(a => a.id !== album.id);
  const whatsappUrl = getWhatsAppUrl(`Hi 2R Creations, I’m interested in an album design similar to ${album.title}.`);
  const is12x24 = (album.dimensions?.includes('12') && album.dimensions?.includes('24')) || album.folderName === '03-luxury-estate';
  const is10x20 = album.dimensions?.includes('10') || album.folderName === '02-modern-editorial';
  const isSquarePage = is10x20 || is12x24;
  const spreadDimensions = album.dimensions || (is12x24 ? '12" × 24"' : (is10x20 ? '10" × 20"' : '17" × 24"'));

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-24 bg-[#FBF9F5]">
      {/* Top Breadcrumb & Return */}
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-8">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]/60 hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Concepts</span>
        </Link>
      </div>

      {/* Hero Album Overview */}
      <section className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Cover Presentation Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className={`relative w-full max-w-md ${isSquarePage ? 'aspect-square' : 'aspect-[12/17]'} rounded-xs overflow-hidden bg-[#111111] shadow-2xl border border-[#242424]/20 group flex items-center justify-center`}>
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-3.5 sm:top-5 left-3.5 sm:left-5 right-3.5 sm:right-5 flex flex-wrap items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono text-white/90">
                <span className="px-2 sm:px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-xs border border-white/10 uppercase tracking-widest">
                  CONCEPT ALBUM {album.id.toUpperCase()}
                </span>
                <span className="px-2 sm:px-2.5 py-1 bg-[#C5A880] text-[#111111] font-semibold rounded-xs uppercase tracking-widest">
                  {album.category}
                </span>
              </div>

              {/* Bottom Card Overlay CTA */}
              <div className="absolute bottom-3.5 sm:bottom-6 left-3.5 sm:left-6 right-3.5 sm:right-6">
                <button
                  onClick={() => {
                    analytics.albumOpen(album.id, album.title);
                    onOpenViewer(album.id, 1);
                  }}
                  className="w-full py-3 sm:py-3.5 px-3 sm:px-6 bg-[#FBF9F5] hover:bg-[#C5A880] text-[#111111] font-semibold text-[10.5px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] rounded-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center leading-snug"
                >
                  <BookOpen className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span>Open Full {spreadDimensions} Spread Viewer &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details & Design Direction */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Header Category and Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#C5A880] uppercase font-semibold">
                SIGNATURE STUDY &bull; {album.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider text-[#111111] bg-[#C5A880]/20 border border-[#C5A880]/40 px-2 py-0.5 rounded-xs uppercase font-medium">
                <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
                <span>Fine Art Retouching Included</span>
              </span>
            </div>

            <h1 className="type-hero-h1 text-[#111111] mb-3">
              {album.title}
            </h1>
            <p className="text-base sm:text-lg text-[#C5A880] font-normal mb-6">
              {album.subtitle}
            </p>

            <p className="text-sm sm:text-base text-[#242424]/80 font-light leading-relaxed mb-6">
              {album.description}
            </p>

            {/* Visual Language Callout */}
            <div className="p-4 bg-[#F5F2EB] rounded-xs border border-[#242424]/8 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-semibold block mb-1">
                VISUAL LANGUAGE & PACING DIRECTION
              </span>
              <p className="text-xs sm:text-[13px] text-[#242424]/80 leading-relaxed font-light">
                {album.visualLanguage}
              </p>
            </div>

            {/* Architecture Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#242424]/10 mb-6 text-center sm:text-left">
              <div>
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#111111]">
                  {album.dimensions || '17" × 24"'}
                </span>
                <p className="text-[10.5px] uppercase font-mono text-[#242424]/60">
                  Spread Size
                </p>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#111111]">
                  {album.totalSpreads}
                </span>
                <p className="text-[10.5px] uppercase font-mono text-[#242424]/60">
                  Curated Spreads
                </p>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#111111]">
                  {album.totalPages}
                </span>
                <p className="text-[10.5px] uppercase font-mono text-[#242424]/60">
                  Story Pages
                </p>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#111111]">
                  {album.photoCount || album.totalPages}
                </span>
                <p className="text-[10.5px] uppercase font-mono text-[#242424]/60">
                  Photo Blueprint
                </p>
              </div>
            </div>

            {/* Professional Retouching & Post-Production Guarantee */}
            <div className="p-4 bg-[#FAF8F5] rounded-xs border border-[#C5A880]/30 mb-8 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#242424]/8">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-widest text-[#111111] font-semibold">
                    POST-PRODUCTION & RETOUCHING STANDARDS
                  </span>
                </div>
                <Link
                  to="/services/photo-retouching"
                  className="text-[9.5px] font-mono uppercase tracking-wider text-[#C5A880] hover:text-[#111111] transition-colors flex items-center gap-1 font-semibold"
                >
                  <span>Specs &rarr;</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div>
                  <p className="text-[11.5px] font-medium text-[#111111] flex items-center gap-1 mb-0.5">
                    <span className="text-[#C5A880]">&bull;</span> Natural Skin Polish
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-[#242424]/70 font-light leading-snug">
                    Gentle frequency separation preserving authentic pores. Zero artificial AI blur.
                  </p>
                </div>

                <div>
                  <p className="text-[11.5px] font-medium text-[#111111] flex items-center gap-1 mb-0.5">
                    <span className="text-[#C5A880]">&bull;</span> Spread Harmonization
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-[#242424]/70 font-light leading-snug">
                    Facing page color temperatures & exposures strictly calibrated together.
                  </p>
                </div>

                <div>
                  <p className="text-[11.5px] font-medium text-[#111111] flex items-center gap-1 mb-0.5">
                    <span className="text-[#C5A880]">&bull;</span> Lab Preflight Check
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-[#242424]/70 font-light leading-snug">
                    Color gamut, bleed zones & CMYK press tolerances checked for archival print.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => {
                  analytics.albumOpen(album.id, album.title);
                  onOpenViewer(album.id, 1);
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#FBF9F5] bg-[#111111] hover:bg-[#C5A880] hover:text-[#111111] transition-all rounded-xs shadow-md cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#C5A880]" />
                <span>Turn Pages Now</span>
              </button>

              <button
                onClick={() => {
                  navigate(`/contact?project=${encodeURIComponent(`Wedding Album Design (${album.title})`)}`);
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#111111] bg-transparent border border-[#242424]/20 hover:border-[#111111] transition-colors rounded-xs cursor-pointer"
              >
                <span>Request Similar Album</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Narrative Storyline Progression & Spread Samples */}
      <section className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-12 border-t border-[#242424]/10">
        <div className="max-w-2xl mb-8">
          <span className="text-[10.5px] font-mono tracking-widest text-[#C5A880] uppercase block mb-2 font-semibold">
            STORYLINE CADENCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111] mb-2">
            The {album.totalSpreads}-Spread Narrative Arc
          </h2>
          <p className="text-xs sm:text-sm text-[#242424]/70 leading-relaxed font-light">
            Every spread in this album serves an intentional storytelling function, from morning arrivals and intimate details to the final starlit departure.
          </p>
        </div>

        {/* Narrative Flow Grid (6 highlighted spreads with real images) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {album.spreads.slice(0, 6).map((spread) => (
            <div
              key={spread.id}
              onClick={() => onOpenViewer(album.id, spread.spreadNumber)}
              className="bg-[#FAF8F5] rounded-xs border border-[#242424]/10 hover:border-[#C5A880] transition-all shadow-xs hover:shadow-md cursor-pointer group overflow-hidden flex flex-col"
            >
              {/* Spread Visual Preview (Aspect ratio dynamically matches spread: 2/1 for 10x20 and 12x24, 24/17 for 17x24) */}
              <div className={`w-full ${isSquarePage ? 'aspect-[2/1]' : 'aspect-[24/17]'} bg-[#0D0D0D] relative overflow-hidden flex items-center justify-center border-b border-[#242424]/10`}>
                {spread.heroImage?.url ? (
                  <img
                    src={spread.heroImage.url}
                    alt={spread.editorialLabel}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-[10px] font-mono uppercase text-[#C5A880]">Spread {spread.spreadNumber}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="px-3 py-1.5 bg-[#FBF9F5] text-[#111111] text-[10px] font-mono font-semibold uppercase tracking-wider rounded-xs shadow-md">
                    Open Spread {spread.spreadNumber} &rarr;
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[9.5px] font-mono text-[#242424]/60 mb-1.5">
                    <span className="uppercase text-[#C5A880] font-semibold">{spread.storyPart}</span>
                    <span>{spreadDimensions} SPREAD {String(spread.spreadNumber).padStart(2, '0')} / {album.totalSpreads}</span>
                  </div>
                  <h3 className="font-serif text-base font-normal text-[#111111] mb-1 group-hover:text-[#C5A880] transition-colors">
                    {spread.editorialLabel?.split('•')[1] || spread.editorialLabel}
                  </h3>
                  <p className="text-xs text-[#242424]/65 leading-relaxed font-light line-clamp-2">
                    {spread.type === 'hero' ? 'Full spread cinematic photograph spanning across both facing pages.' : 'Balanced dual-page asymmetric layout with generous white space.'}
                  </p>
                </div>
                <div className="text-[10.5px] font-mono text-[#C5A880] uppercase tracking-wider flex items-center gap-1 mt-3 pt-2 border-t border-[#242424]/5">
                  <span>View in interactive viewer</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Open full reader banner */}
        <div className="mt-8 p-5 sm:p-6 bg-[#161616] text-[#FBF9F5] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg font-medium text-[#FBF9F5] mb-1">
              Want to review all 24 spreads in sequence?
            </h4>
            <p className="text-xs text-[#FBF9F5]/70 font-light">
              Experience the full story flow, page flips, and editorial pacing in our interactive viewer.
            </p>
          </div>
          <button
            onClick={() => onOpenViewer(album.id)}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-[#C5A880] hover:bg-[#d6bc97] rounded-xs shrink-0 cursor-pointer text-center"
          >
            Launch Full Album Viewer &rarr;
          </button>
        </div>
      </section>

      {/* Explore Other Concepts */}
      <section className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-12 border-t border-[#242424]/10">
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-6">
          Explore Other Signature Concepts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherAlbums.slice(0, 3).map((oth) => (
            <Link
              key={oth.id}
              to={`/portfolio/${oth.slug}`}
              className="group p-4 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs hover:border-[#C5A880] transition-colors flex items-center gap-4"
            >
              <div className="w-16 h-20 rounded-xs overflow-hidden bg-[#EAE5DC] shrink-0">
                <img src={oth.coverImage} alt={oth.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A880] block">
                  {oth.category}
                </span>
                <h4 className="font-serif text-base font-normal text-[#111111] group-hover:text-[#C5A880] transition-colors">
                  {oth.title}
                </h4>
                <p className="text-xs text-[#242424]/60 line-clamp-1">
                  {oth.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
