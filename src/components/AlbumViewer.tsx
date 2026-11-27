import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  ArrowUpRight, 
  MessageSquare, 
  BookOpen,
  Maximize2, 
  Minimize2,
  Mail,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Album, AlbumPageSpread } from '../types';
import { analytics } from '../services/analytics';
import { STUDIO_CONFIG, getWhatsAppUrl, hasWhatsApp, getGmailComposeUrl } from '../config';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AlbumSpreadImage } from './AlbumSpreadImage';
import { albumSound } from '../utils/albumSound';

interface AlbumViewerProps {
  album: Album;
  initialSpreadNumber?: number;
  onClose: () => void;
  onStartProject: () => void;
  onOpenDifferentAlbum: (albumId: string) => void;
  otherAlbums: Album[];
}

export const AlbumViewer: React.FC<AlbumViewerProps> = ({
  album,
  initialSpreadNumber,
  onClose,
  onStartProject,
  onOpenDifferentAlbum,
  otherAlbums
}) => {
  // Flow:
  // index 0: Cover (01 Cover.jpg)
  // index 1: 1st Page (02 1st page.jpg) - if available
  // index 2..(totalSpreads + 1): Spreads 1..24 (spread-01..spread-24)
  // index (totalSpreads + 2): Last Page (27 Last Page.jpg) - if available
  // index (totalSpreads + 3): Finale Conversion CTA

  const hasPage01 = Boolean(album.page01Image);
  const hasPageLast = Boolean(album.pageLastImage);
  const totalSpreads = album.spreads.length || 24;

  // Calculate dynamic steps
  // 0: Cover
  // 1: Page 01 (if exists)
  // spread offset = hasPage01 ? 2 : 1
  const spreadOffset = hasPage01 ? 2 : 1;
  const lastSpreadStep = spreadOffset + totalSpreads - 1;
  const pageLastStep = hasPageLast ? lastSpreadStep + 1 : -1;
  const finaleStep = hasPageLast ? pageLastStep + 1 : lastSpreadStep + 1;
  const maxStep = finaleStep;

  const initialStepCalculated = initialSpreadNumber && initialSpreadNumber > 0
    ? spreadOffset + (initialSpreadNumber - 1)
    : 0;

  const [currentStep, setCurrentStep] = useState(initialStepCalculated);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => albumSound.getMuted());

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const isCover = currentStep === 0;
  const isPage01 = hasPage01 && currentStep === 1;
  const isSpread = currentStep >= spreadOffset && currentStep <= lastSpreadStep;
  const activeSpreadNumber = isSpread ? (currentStep - spreadOffset + 1) : 0;
  const currentSpread: AlbumPageSpread | undefined = isSpread ? album.spreads[activeSpreadNumber - 1] : undefined;
  const isPageLast = hasPageLast && currentStep === pageLastStep;
  const isFinalSpread = currentStep === finaleStep;

  const is12x24 = (album.dimensions?.includes('12') && album.dimensions?.includes('24')) || album.folderName === '03-luxury-estate';
  const is10x20 = album.dimensions?.includes('10') || album.folderName === '02-modern-editorial';
  const isSquarePage = is10x20 || is12x24;
  const spreadDimLabel = album.dimensions || (is12x24 ? '12" × 24"' : (is10x20 ? '10" × 20"' : '17" × 24"'));
  const singlePageDimLabel = is12x24 ? '12" × 12"' : (is10x20 ? '10" × 10"' : '12" × 17"');

  // Track page progression milestones
  useEffect(() => {
    if (maxStep > 0) {
      const progressPercent = (currentStep / maxStep) * 100;
      if (progressPercent >= 25 && progressPercent < 35) {
        analytics.albumPage25(album.id, currentStep);
      } else if (progressPercent >= 50 && progressPercent < 60) {
        analytics.albumPage50(album.id, currentStep);
      } else if (isFinalSpread) {
        analytics.albumComplete(album.id, album.title);
      }
    }
  }, [currentStep, maxStep, album.id, album.title, isFinalSpread]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isFlipping, maxStep]);

  // Lock body scroll while viewer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Intelligent Preload: Cache the next 2 spreads ahead so navigation feels instant
  useEffect(() => {
    const urlsToPreload: (string | undefined)[] = [];

    for (let stepAhead = 1; stepAhead <= 2; stepAhead++) {
      const targetStep = currentStep + stepAhead;
      if (targetStep === 1 && hasPage01) {
        urlsToPreload.push(album.page01Image);
      } else if (targetStep >= spreadOffset && targetStep <= lastSpreadStep) {
        const sprIdx = targetStep - spreadOffset;
        const spread = album.spreads[sprIdx];
        if (spread?.heroImage?.url) urlsToPreload.push(spread.heroImage.url);
      } else if (targetStep === pageLastStep && hasPageLast) {
        urlsToPreload.push(album.pageLastImage);
      }
    }

    urlsToPreload.filter(Boolean).forEach((url) => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [currentStep, album, hasPage01, hasPageLast, spreadOffset, lastSpreadStep, pageLastStep]);

  const handleNext = () => {
    if (isFlipping || isFinalSpread) return;
    setFlipDirection('next');
    setIsFlipping(true);
    // Tactile fine-art cotton paper page-turning swoosh
    albumSound.playPageTurn('next');
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, maxStep));
      setIsFlipping(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isFlipping || isCover) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    // Tactile fine-art cotton paper page-turning swoosh
    albumSound.playPageTurn('prev');
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      setIsFlipping(false);
    }, 300);
  };

  const toggleSound = () => {
    const newMuted = albumSound.toggleMute();
    setIsSoundMuted(newMuted);
    if (!newMuted) {
      albumSound.playPageTurn('next');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn(`Exit fullscreen error: ${err.message}`);
      });
      setIsFullscreen(false);
    }
  };

  // Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const whatsappUrl = getWhatsAppUrl(`Hi 2R Creations, I’ve viewed the ${album.title} album and I’d like to inquire about your ALBUM DESIGN & FINE ART RETOUCHING SERVICE.`);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${album.title} — Digital Album Experience`}
      className="fixed inset-0 z-50 bg-[#0F0F0F] text-[#FBF9F5] flex flex-col select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 01 VIEWER HEADER */}
      <header className="h-16 px-6 sm:px-8 border-b border-[#FBF9F5]/10 flex items-center justify-between bg-[#141414]/90 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-xs text-[#FBF9F5]/70 hover:text-[#FBF9F5] hover:bg-[#FBF9F5]/10 transition-colors cursor-pointer"
            aria-label="Close album viewer (Esc)"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="border-l border-[#FBF9F5]/15 pl-3">
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase block">
              {album.category} &bull; SIGNATURE STUDY
            </span>
            <h2 className="font-serif text-sm sm:text-base font-medium tracking-tight text-[#FBF9F5] truncate max-w-[200px] sm:max-w-md">
              {album.title}
            </h2>
          </div>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Spread indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#FBF9F5]/70 bg-[#242424]/60 px-3 py-1.5 rounded-xs border border-[#FBF9F5]/10">
            <BookOpen className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>
              {isCover && `COVER (${isSquarePage ? singlePageDimLabel : 'CLOSED'})`}
              {isPage01 && `PAGE 01 (INTRO • ${singlePageDimLabel})`}
              {isSpread && `${spreadDimLabel} SPREAD ${activeSpreadNumber} OF ${totalSpreads}`}
              {isPageLast && `FINAL PAGE (${singlePageDimLabel})`}
              {isFinalSpread && 'FINALE'}
            </span>
          </div>

          {/* Tactile Page Turn Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              !isSoundMuted
                ? 'text-[#C5A880] hover:text-[#FBF9F5] hover:bg-[#FBF9F5]/10'
                : 'text-[#FBF9F5]/40 hover:text-[#FBF9F5] hover:bg-[#FBF9F5]/10'
            }`}
            title={!isSoundMuted ? 'Mute page turning sound' : 'Unmute tactile page turning sound'}
            aria-label={!isSoundMuted ? 'Mute page turning sound' : 'Unmute tactile page turning sound'}
          >
            {!isSoundMuted ? (
              <Volume2 className="w-4 h-4 text-[#C5A880]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden lg:inline text-[11px] font-mono tracking-wider uppercase opacity-75">
              {!isSoundMuted ? 'Sound On' : 'Muted'}
            </span>
          </button>

          {/* Browse spreads drawer button */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-xs transition-colors cursor-pointer ${
              showThumbnails 
                ? 'bg-[#C5A880] text-[#111111]' 
                : 'text-[#FBF9F5]/70 hover:text-[#FBF9F5] hover:bg-[#FBF9F5]/10'
            }`}
            title="Browse all spreads"
            aria-label="Browse all spreads"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:block p-2 rounded-xs text-[#FBF9F5]/70 hover:text-[#FBF9F5] hover:bg-[#FBF9F5]/10 transition-colors cursor-pointer"
            title="Toggle fullscreen"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Direct CTA */}
          <button
            onClick={() => {
              analytics.projectCtaClick('album_viewer_header');
              onStartProject();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-[#FBF9F5] hover:bg-[#C5A880] transition-colors rounded-xs shadow-sm cursor-pointer ml-1"
          >
            <span>Start Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 02 MAIN SPREAD STAGE */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
        
        {/* Navigation arrows (Floating) */}
        {!isCover && (
          <button
            onClick={handlePrev}
            disabled={isFlipping}
            aria-label="Previous spread (Left arrow)"
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-[#181818]/80 hover:bg-[#C5A880] text-[#FBF9F5] hover:text-[#111111] border border-[#FBF9F5]/15 backdrop-blur-md flex items-center justify-center transition-all shadow-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {!isFinalSpread && (
          <button
            onClick={handleNext}
            disabled={isFlipping}
            aria-label="Next spread (Right arrow)"
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-[#181818]/80 hover:bg-[#C5A880] text-[#FBF9F5] hover:text-[#111111] border border-[#FBF9F5]/15 backdrop-blur-md flex items-center justify-center transition-all shadow-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* 03 ACTIVE PAGE CONTAINER */}
        <div className={`w-full max-h-[84vh] relative flex items-center justify-center transition-all ${
          isCover 
            ? (isSquarePage ? 'max-w-xl aspect-square' : 'max-w-xl aspect-[1/1] sm:aspect-[4/3]')
            : isPage01 || isPageLast 
            ? (isSquarePage ? 'max-w-xl aspect-square' : 'max-w-2xl aspect-[12/17]')
            : isFinalSpread
            ? 'max-w-2xl'
            : (isSquarePage ? 'max-w-[min(1360px,calc(82vh*2))] aspect-[2/1]' : 'max-w-[min(1200px,calc(82vh*24/17))] aspect-[24/17]')
        }`}>
          
          {/* VIEW A: FRONT COVER PRESENTATION */}
          {isCover && (
            <div className={`w-full ${isSquarePage ? 'max-w-md aspect-square' : 'max-w-lg aspect-[1/1] sm:aspect-[4/3]'} bg-[#161616] rounded-xs shadow-2xl border border-[#FBF9F5]/20 relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 group`}>
              {/* Actual physical cover photo (e.g. 01 Cover.jpg) */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xs bg-[#111111]">
                <img
                  src={album.physicalCoverImage || album.coverImage}
                  alt={`${album.title} Cover`}
                  className="w-full h-full object-contain filter contrast-[1.02] shadow-2xl"
                />

                {/* Open Cover Action Buttons */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                  {hasPage01 && (
                    <button
                      onClick={() => {
                        albumSound.playPageTurn('next');
                        setCurrentStep(1);
                      }}
                      className="py-2.5 px-3.5 bg-black/80 hover:bg-[#C5A880] text-white hover:text-[#111111] font-mono text-[10.5px] uppercase tracking-wider rounded-xs backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
                    >
                      <span>Dedication (P.01)</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      albumSound.playPageTurn('next');
                      setCurrentStep(spreadOffset);
                    }}
                    className="py-2.5 px-5 bg-[#FAF8F5] hover:bg-[#C5A880] text-[#111111] font-semibold text-xs uppercase tracking-[0.16em] rounded-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-[#C5A880]/30"
                  >
                    <span>Open {spreadDimLabel} Spreads &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Cover Meta Footer */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#FBF9F5]/60 px-1">
                <span className="text-[#C5A880] uppercase tracking-wider">{album.category} &bull; HEIRLOOM ALBUM</span>
                <span>{totalSpreads} SPREADS &bull; {album.totalPages || totalSpreads * 2} PAGES ({spreadDimLabel})</span>
              </div>
            </div>
          )}

          {/* VIEW B1: 1ST PAGE (02 1st page.jpg) - Dedicated Single Page */}
          {isPage01 && album.page01Image && (
            <div 
              className={`w-full h-full bg-[#141414] text-[#FBF9F5] shadow-2xl rounded-xs flex flex-col justify-between overflow-hidden border border-[#FBF9F5]/10 transition-opacity duration-300 ${
                isFlipping ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
              }`}
            >
              {/* Single Page Image Centered in Aspect */}
              <div className="flex-1 w-full h-full flex items-center justify-center p-3 sm:p-5 relative bg-[#0D0D0D]">
                <div className={`h-full max-h-[75vh] ${isSquarePage ? 'aspect-square' : 'aspect-[12/17]'} relative rounded-xs overflow-hidden shadow-2xl bg-[#111111] border border-[#FBF9F5]/15 flex items-center justify-center`}>
                  <img
                    src={album.page01Image}
                    alt={`${album.title} - Page 01`}
                    className="w-full h-full object-contain filter contrast-[1.02]"
                  />
                </div>
              </div>

              {/* Bottom Running Header */}
              <div className="px-5 py-2.5 bg-[#141414] border-t border-[#FBF9F5]/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#FBF9F5]/80 shrink-0">
                <span className="uppercase tracking-wider text-[#C5A880]">
                  PAGE 01 &bull; DEDICATION & INTRO (SINGLE PAGE &bull; {singlePageDimLabel})
                </span>
                <button
                  onClick={() => {
                    albumSound.playPageTurn('next');
                    setCurrentStep(spreadOffset);
                  }}
                  className="px-3 py-1 bg-[#C5A880] hover:bg-[#d6bc97] text-[#111111] font-semibold uppercase tracking-wider rounded-xs text-[10px] cursor-pointer"
                >
                  View Full {spreadDimLabel} Spreads &rarr;
                </button>
              </div>
            </div>
          )}

          {/* VIEW B2: INSIDE SPREADS (Spreads 1..24 - Full Spread View) */}
          {isSpread && currentSpread && (
            <div 
              className={`w-full h-full bg-[#0D0D0D] text-[#FBF9F5] shadow-2xl rounded-xs flex flex-col justify-between overflow-hidden border border-[#FBF9F5]/15 transition-opacity duration-300 ${
                isFlipping ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
              }`}
            >
              {/* Spread Content Stage - full bleed uncropped continuous view */}
              <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
                <AlbumSpreadImage
                  src={currentSpread.heroImage?.url}
                  fallbackSrc={currentSpread.leftImage?.url}
                  alt={currentSpread.heroImage?.alt || `${album.title} - Spread ${currentSpread.spreadNumber}`}
                  pageNumber={currentSpread.spreadNumber * 2 - 1}
                  totalPages={album.totalPages || totalSpreads * 2}
                  photoFilename={`spread-${String(currentSpread.spreadNumber).padStart(2, '0')}.jpg`}
                  folderPath={album.folderPath}
                  editorialLabel={currentSpread.editorialLabel}
                  storyPart={currentSpread.storyPart}
                  isHero={true}
                  className="w-full h-full"
                />
              </div>

              {/* Spread Bottom Running Header */}
              <div className="px-5 py-2 bg-[#141414] border-t border-[#FBF9F5]/10 flex items-center justify-between text-[10px] font-mono text-[#FBF9F5]/80 shrink-0">
                <span className="uppercase tracking-wider text-[#C5A880] truncate max-w-[240px] sm:max-w-md">
                  {currentSpread.editorialLabel}
                </span>
                <span className="text-[#FBF9F5]/90 font-semibold shrink-0">
                  {spreadDimLabel} FULL SPREAD {currentSpread.spreadNumber} OF {totalSpreads}
                </span>
              </div>
            </div>
          )}

          {/* VIEW B3: LAST PAGE (27 Last Page.jpg) */}
          {isPageLast && album.pageLastImage && (
            <div 
              className={`w-full h-full bg-[#141414] text-[#FBF9F5] shadow-2xl rounded-xs flex flex-col justify-between overflow-hidden border border-[#FBF9F5]/10 transition-opacity duration-300 ${
                isFlipping ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex-1 w-full h-full flex items-center justify-center p-3 sm:p-5 relative bg-[#0D0D0D]">
                <div className={`h-full max-h-[75vh] ${isSquarePage ? 'aspect-square' : 'aspect-[12/17]'} relative rounded-xs overflow-hidden shadow-2xl bg-[#111111] border border-[#FBF9F5]/15 flex items-center justify-center`}>
                  <img
                    src={album.pageLastImage}
                    alt={`${album.title} - Last Page`}
                    className="w-full h-full object-contain filter contrast-[1.02]"
                  />
                </div>
              </div>

              <div className="px-5 py-2.5 bg-[#141414] border-t border-[#FBF9F5]/10 flex items-center justify-between text-[10px] font-mono text-[#FBF9F5]/80 shrink-0">
                <span className="uppercase tracking-wider text-[#C5A880]">
                  FINAL PAGE &bull; HEIRLOOM EPILOGUE (SINGLE PAGE &bull; {singlePageDimLabel})
                </span>
                <button
                  onClick={() => {
                    albumSound.playPageTurn('next');
                    setCurrentStep(finaleStep);
                  }}
                  className="px-3 py-1 bg-[#C5A880] hover:bg-[#d6bc97] text-[#111111] font-semibold uppercase tracking-wider rounded-xs text-[10px] cursor-pointer"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* VIEW C: FINALE CONVERSION SPREAD */}
          {isFinalSpread && (
            <div className="w-full max-w-2xl bg-[#181818] border border-[#FBF9F5]/15 rounded-xs p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              <div className="absolute inset-0 bg-radial from-[#C5A880]/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-lg mx-auto my-auto">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-3 font-semibold">
                  LIKE WHAT YOU SEE?
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[#FBF9F5] leading-tight mb-3">
                  Let’s create an album your clients will want to keep forever.
                </h3>
                <p className="text-xs sm:text-sm text-[#FBF9F5]/75 font-light leading-relaxed mb-6">
                  Every 2R Creations album is custom designed with cinematic pacing, refined white space, and cultural elegance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  <button
                    onClick={() => {
                      analytics.projectCtaClick('album_viewer_final_spread');
                      onStartProject();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#111111] bg-[#FBF9F5] hover:bg-[#C5A880] transition-colors rounded-xs shadow-lg cursor-pointer"
                  >
                    <span>Start a Project &rarr;</span>
                  </button>

                  {hasWhatsApp() && whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analytics.whatsappClick('album_viewer_final_spread')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#FBF9F5] bg-[#242424] hover:border-[#25D366] hover:text-[#25D366] border border-[#FBF9F5]/15 rounded-xs transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp Studio</span>
                    </a>
                  ) : (
                    <a
                      href={getGmailComposeUrl(`Inquiry regarding ${album.title}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#FBF9F5] bg-[#242424] hover:border-[#C5A880] hover:text-[#C5A880] border border-[#FBF9F5]/15 rounded-xs transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Email Studio</span>
                    </a>
                  )}
                </div>

                {/* Explore another album */}
                <div className="pt-4 border-t border-[#FBF9F5]/10">
                  <p className="text-[10px] uppercase tracking-wider text-[#FBF9F5]/50 mb-2">
                    Explore another story:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {otherAlbums.slice(0, 3).map((oth) => (
                      <button
                        key={oth.id}
                        onClick={() => onOpenDifferentAlbum(oth.id)}
                        className="px-2.5 py-1 text-[11px] text-[#FBF9F5]/75 hover:text-[#111111] hover:bg-[#C5A880] border border-[#FBF9F5]/15 rounded-xs transition-colors cursor-pointer"
                      >
                        {oth.title} &rarr;
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="relative z-10 text-center text-[9px] text-[#FBF9F5]/40 font-mono pt-3">
                2R CREATIONS &bull; PROFESSIONAL WEDDING ALBUM DESIGNER
              </div>
            </div>
          )}

        </div>
      </main>

      {/* THUMBNAIL DRAWER ("Browse Spreads") */}
      {showThumbnails && (
        <div className="bg-[#141414] border-t border-[#FBF9F5]/10 px-6 py-3.5 overflow-x-auto z-30 animate-fadeIn flex items-center gap-3 shrink-0">
          <div className="text-[9.5px] font-mono tracking-widest text-[#C5A880] uppercase shrink-0">
            SPREADS:
          </div>

          {/* Cover thumbnail */}
          <button
            onClick={() => {
              albumSound.playPageTurn('prev');
              setCurrentStep(0);
              setShowThumbnails(false);
            }}
            className={`relative shrink-0 ${isSquarePage ? 'w-12 aspect-square' : 'w-14 aspect-[12/17]'} overflow-hidden rounded-xs border transition-all cursor-pointer bg-[#0D0D0D] ${
              currentStep === 0 ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-[#FBF9F5]/20 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={album.coverImage} alt="Cover" className="w-full h-full object-contain" />
            <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-white text-center py-0.5 font-mono">
              COVER
            </span>
          </button>

          {/* 1st Page thumbnail if exists */}
          {hasPage01 && (
            <button
              onClick={() => {
                albumSound.playPageTurn(currentStep < 1 ? 'next' : 'prev');
                setCurrentStep(1);
                setShowThumbnails(false);
              }}
              className={`relative shrink-0 ${isSquarePage ? 'w-12 aspect-square' : 'w-14 aspect-[12/17]'} overflow-hidden rounded-xs border transition-all cursor-pointer bg-[#0D0D0D] ${
                currentStep === 1 ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-[#FBF9F5]/15 opacity-60 hover:opacity-100'
              }`}
            >
              {album.page01Image ? (
                <img src={album.page01Image} alt="Page 01" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-[#202020] flex flex-col justify-between p-1">
                  <div className="text-[7px] font-mono text-[#C5A880] text-center">PAGE 01</div>
                  <div className="text-[7.5px] font-mono text-center text-white/80">INTRO</div>
                </div>
              )}
              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[6.5px] text-white text-center py-0.5 font-mono">
                PAGE 01
              </span>
            </button>
          )}

          {/* 24 Spreads Thumbnails (spread format) */}
          {album.spreads.map((spread, i) => {
            const spreadStep = spreadOffset + i;
            const spreadIdx = i + 1;
            const isSelected = currentStep === spreadStep;
            return (
              <button
                key={spread.id}
                onClick={() => {
                  albumSound.playPageTurn(spreadStep > currentStep ? 'next' : 'prev');
                  setCurrentStep(spreadStep);
                  setShowThumbnails(false);
                }}
                className={`relative shrink-0 ${isSquarePage ? 'w-24 aspect-[2/1]' : 'w-22 aspect-[24/17]'} overflow-hidden rounded-xs border transition-all cursor-pointer bg-[#0D0D0D] ${
                  isSelected ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-[#FBF9F5]/15 opacity-60 hover:opacity-100'
                }`}
              >
                {spread.heroImage?.url ? (
                  <img src={spread.heroImage.url} alt={`Spread ${spreadIdx}`} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-[#202020] flex flex-col justify-between p-1">
                    <div className="text-[7px] font-mono text-[#C5A880] text-center">SP {String(spreadIdx).padStart(2, '0')}</div>
                    <div className="text-[7.5px] font-mono text-center text-white/80">P.{spreadIdx * 2 - 1}&ndash;{spreadIdx * 2}</div>
                  </div>
                )}
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[6.5px] text-white text-center py-0.5 font-mono">
                  SP {String(spreadIdx).padStart(2, '0')}
                </span>
              </button>
            );
          })}

          {/* Last Page thumbnail if exists */}
          {hasPageLast && pageLastStep > 0 && (
            <button
              onClick={() => {
                albumSound.playPageTurn(currentStep < pageLastStep ? 'next' : 'prev');
                setCurrentStep(pageLastStep);
                setShowThumbnails(false);
              }}
              className={`relative shrink-0 ${isSquarePage ? 'w-12 aspect-square' : 'w-16 aspect-[16/10]'} overflow-hidden rounded-xs border transition-all cursor-pointer ${
                currentStep === pageLastStep ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-[#FBF9F5]/15 opacity-60 hover:opacity-100'
              }`}
            >
              {album.pageLastImage ? (
                <img src={album.pageLastImage} alt="Last Page" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#202020] flex flex-col justify-between p-1">
                  <div className="text-[7px] font-mono text-[#C5A880] text-center">LAST</div>
                  <div className="text-[7.5px] font-mono text-center text-white/80">EPILOGUE</div>
                </div>
              )}
              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[6.5px] text-white text-center py-0.5">
                LAST PAGE
              </span>
            </button>
          )}

          {/* Finale thumbnail */}
          <button
            onClick={() => {
              albumSound.playPageTurn('next');
              setCurrentStep(finaleStep);
              setShowThumbnails(false);
            }}
            className={`relative shrink-0 w-16 aspect-[16/10] overflow-hidden rounded-xs border bg-[#1A1A1A] flex items-center justify-center transition-all cursor-pointer ${
              currentStep === finaleStep ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-[#FBF9F5]/20 opacity-60 hover:opacity-100'
            }`}
          >
            <span className="text-[7.5px] font-mono text-[#C5A880] text-center uppercase">
              FINALE
            </span>
          </button>
        </div>
      )}

    </div>
  );
};
