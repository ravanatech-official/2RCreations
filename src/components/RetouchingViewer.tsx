import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Eye,
  Columns,
  SplitSquareHorizontal
} from 'lucide-react';
import { RetouchingStudy, RetouchingSlide } from '../data/retouchingStudies';
import { analytics } from '../services/analytics';
import { STUDIO_CONFIG } from '../config';

interface RetouchingViewerProps {
  study: RetouchingStudy;
  initialSlideNumber?: number;
  onClose: () => void;
  onStartProject: (serviceName?: string) => void;
  onOpenDifferentStudy: (studyId: string) => void;
  allStudies: RetouchingStudy[];
}

export const RetouchingViewer: React.FC<RetouchingViewerProps> = ({
  study,
  initialSlideNumber,
  onClose,
  onStartProject,
  onOpenDifferentStudy,
  allStudies
}) => {
  // 0: Cover/Overview, 1..N: Slides, N+1: Conversion/Inquiry
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideNumber ?? 1);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100 for before/after split

  useEffect(() => {
    setCurrentSlideIndex(initialSlideNumber ?? 1);
    setSliderPosition(50);
  }, [study.id, initialSlideNumber]);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'press-and-hold'>('slider');
  const [isPressingBefore, setIsPressingBefore] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef(false);

  const totalSlides = study.slides.length;
  const isIntro = currentSlideIndex === 0;
  const isFinal = currentSlideIndex === totalSlides + 1;
  const currentSlide: RetouchingSlide | undefined =
    !isIntro && !isFinal ? study.slides[currentSlideIndex - 1] : undefined;

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
  }, [currentSlideIndex, isFlipping, totalSlides]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleNext = () => {
    if (isFlipping || isFinal) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides + 1));
      setIsFlipping(false);
      setSliderPosition(50); // reset slider to center on each page
    }, 280);
  };

  const handlePrev = () => {
    if (isFlipping || isIntro) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      setIsFlipping(false);
      setSliderPosition(50);
    }, 280);
  };

  // Slider drag controls
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingSlider.current = true;
    handleSliderMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingSlider.current = true;
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingSlider.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider.current) {
        handleSliderMove(e.clientX);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider.current && e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 h-[100dvh] w-full z-50 bg-[#0e0e0e] text-[#FBF9F5] flex flex-col select-none overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      role="dialog"
      aria-modal="true"
      aria-label={`${study.title} Retouching Viewer`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP CONTROL BAR                                                        */}
      {/* ========================================================================= */}
      <div className="h-14 sm:h-16 px-3 sm:px-6 lg:px-8 border-b border-white/10 flex items-center justify-between gap-2 bg-[#141414] shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <span className="hidden xs:inline-block sm:inline-block text-[9.5px] sm:text-[11px] font-mono tracking-widest text-[#C5A880] uppercase px-2 sm:px-2.5 py-1 bg-black/60 rounded-xs border border-[#C5A880]/30 shrink-0 max-w-[110px] sm:max-w-none truncate">
            {study.badge}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-sm sm:text-base text-[#FBF9F5] truncate leading-tight">
              {study.title}
            </h2>
            <p className="text-[10px] sm:text-[11px] text-white/50 font-mono hidden sm:block truncate">
              {isIntro
                ? 'Overview & Methodology'
                : isFinal
                ? 'Final Specifications & Inquiry'
                : `Slide ${currentSlideIndex} of ${totalSlides} • ${currentSlide?.technique}`}
            </p>
          </div>
        </div>

        {/* View Mode Switcher (When viewing a comparison slide) */}
        {!isIntro && !isFinal && (
          <div className="hidden lg:flex items-center gap-1 bg-black/50 p-1 rounded-xs border border-white/10 text-xs shrink-0">
            <button
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'slider' ? 'bg-[#C5A880] text-[#111111] font-semibold' : 'text-white/70 hover:text-white'
              }`}
              title="Interactive Slide Splitter"
            >
              <SplitSquareHorizontal className="w-3.5 h-3.5" />
              <span>Split Slider</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'side-by-side' ? 'bg-[#C5A880] text-[#111111] font-semibold' : 'text-white/70 hover:text-white'
              }`}
              title="Side-by-Side Comparison"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onMouseDown={() => setIsPressingBefore(true)}
              onMouseUp={() => setIsPressingBefore(false)}
              onTouchStart={() => setIsPressingBefore(true)}
              onTouchEnd={() => setIsPressingBefore(false)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              title="Hold to see RAW Before"
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Hold for RAW</span>
            </button>
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => onStartProject(`Photo Retouching (${study.title})`)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-[#C5A880] text-[#111111] text-[11px] font-semibold uppercase tracking-wider rounded-xs hover:bg-[#D4BC96] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Inquire Work</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="hidden sm:block p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xs transition-colors cursor-pointer"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
            aria-label="Close Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN STAGE (Page Turning Animation & Before/After Display)             */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 min-h-0 relative flex justify-center p-2.5 sm:p-5 lg:p-8 ${
          isIntro || isFinal ? 'overflow-y-auto overscroll-contain items-start md:items-center' : 'overflow-hidden items-center'
        }`}
      >
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className={`absolute left-1.5 sm:left-5 z-30 p-2 sm:p-3.5 rounded-full bg-black/80 hover:bg-[#111111] text-white border border-white/15 transition-all shadow-xl cursor-pointer ${
            currentSlideIndex === 0 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'hover:scale-105'
          }`}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-[#C5A880]" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentSlideIndex === totalSlides + 1}
          className={`absolute right-1.5 sm:right-5 z-30 p-2 sm:p-3.5 rounded-full bg-black/80 hover:bg-[#111111] text-white border border-white/15 transition-all shadow-xl cursor-pointer ${
            currentSlideIndex === totalSlides + 1 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'hover:scale-105'
          }`}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#C5A880]" />
        </button>

        {/* Flipping Container */}
        <div
          className={`w-full max-w-6xl 2xl:max-w-[1440px] flex flex-col items-center transition-all duration-300 ${
            isIntro || isFinal ? 'my-auto' : 'h-full min-h-0 justify-center'
          } ${
            isFlipping
              ? flipDirection === 'next'
                ? 'opacity-0 scale-95 translate-x-8'
                : 'opacity-0 scale-95 -translate-x-8'
              : 'opacity-100 scale-100 translate-x-0'
          }`}
        >
          {/* ===================================================================== */}
          {/* SLIDE TYPE A: INTRO / OVERVIEW (Slide 0)                              */}
          {/* ===================================================================== */}
          {isIntro && (
            <div className="w-full max-w-3xl bg-[#141414] border border-white/15 rounded-xs p-4 sm:p-8 lg:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-5 sm:gap-8">
              <div className="w-full max-w-[260px] md:max-w-none md:w-1/2 aspect-[4/5] max-h-[36dvh] md:max-h-[60dvh] rounded-xs overflow-hidden relative bg-black shadow-lg shrink-0">
                <img
                  src={study.thumbnail}
                  alt={study.title}
                  className="w-full h-full object-cover object-[center_12%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                  {study.badge}
                </span>
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-center min-w-0">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase mb-1.5">
                  CASE STUDY OVERVIEW
                </span>
                <h3 className="font-serif text-xl sm:text-3xl text-white mb-1.5 leading-tight">
                  {study.title}
                </h3>
                <p className="text-xs text-[#C5A880] font-mono uppercase tracking-wider mb-3">
                  {study.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-5">
                  {study.description}
                </p>

                <div className="space-y-2 mb-6 border-t border-white/10 pt-3.5 text-xs text-white/70">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                    <span><strong>Objective:</strong> {study.objective}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                    <span><strong>Turnaround:</strong> {study.turnaroundNote}</span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#C5A880] text-[#111111] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#D4BC96] transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <span>Start Before / After Comparison</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SLIDE TYPE B: INTERACTIVE BEFORE / AFTER SLIDE (1..N)                 */}
          {/* ===================================================================== */}
          {currentSlide && (
            <div className="w-full h-full min-h-0 flex flex-col justify-between">
              
              {/* Slide Title Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3 px-1 sm:px-2 shrink-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-widest text-[#C5A880] block truncate">
                    Spread {currentSlide.slideNumber} of {totalSlides} &bull; {currentSlide.technique}
                  </span>
                  <h3 className="font-serif text-sm sm:text-xl text-[#FBF9F5] leading-tight truncate">
                    {currentSlide.title}
                  </h3>
                </div>

                {/* Mobile & Tablet Mode Controls */}
                <div className="flex items-center gap-1.5 lg:hidden shrink-0">
                  <button
                    onClick={() => setViewMode(viewMode === 'slider' ? 'side-by-side' : 'slider')}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-white/10 text-[10.5px] sm:text-[11px] rounded-xs text-[#FBF9F5] border border-white/10 cursor-pointer whitespace-nowrap"
                  >
                    {viewMode === 'slider' ? (
                      <>
                        <Columns className="w-3 h-3 text-[#C5A880]" />
                        <span>Side-by-Side</span>
                      </>
                    ) : (
                      <>
                        <SplitSquareHorizontal className="w-3 h-3 text-[#C5A880]" />
                        <span>Split Slider</span>
                      </>
                    )}
                  </button>
                  <button
                    onMouseDown={() => setIsPressingBefore(true)}
                    onMouseUp={() => setIsPressingBefore(false)}
                    onTouchStart={() => setIsPressingBefore(true)}
                    onTouchEnd={() => setIsPressingBefore(false)}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-white/10 text-[10.5px] sm:text-[11px] rounded-xs text-[#C5A880] border border-[#C5A880]/25 cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-3 h-3" />
                    <span>RAW</span>
                  </button>
                </div>
              </div>

              {/* Main Comparison Canvas */}
              <div className="flex-1 min-h-[180px] relative rounded-xs overflow-hidden border border-white/15 bg-black flex items-center justify-center">
                
                {/* 1. SLIDER VIEW MODE (Default Interactive Split) */}
                {viewMode === 'slider' && (
                  <div
                    ref={sliderContainerRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-ew-resize select-none"
                  >
                    {/* AFTER Image (Full background) */}
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <img
                        src={currentSlide.afterImage}
                        alt={`${currentSlide.title} After Retouching`}
                        style={isPressingBefore ? currentSlide.beforeFilterStyle : currentSlide.afterFilterStyle}
                        draggable={false}
                        className="w-full h-full object-contain pointer-events-none select-none"
                      />
                      <span
                        className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 px-2.5 sm:px-3 py-1 bg-black/80 backdrop-blur-xs text-[10px] sm:text-[11px] font-mono tracking-widest text-[#C5A880] uppercase rounded-xs border border-[#C5A880]/30 transition-opacity duration-150 ${
                          sliderPosition > 85 ? 'opacity-0' : 'opacity-100'
                        }`}
                      >
                        {currentSlide.afterLabel}
                      </span>
                    </div>

                    {/* BEFORE Image (Clipped identically via CSS clip-path for 100% 0px shift) */}
                    {!isPressingBefore && (
                      <div
                        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      >
                        <img
                          src={currentSlide.beforeImage}
                          alt={`${currentSlide.title} Before Retouching`}
                          style={currentSlide.beforeFilterStyle}
                          draggable={false}
                          className="w-full h-full object-contain pointer-events-none select-none"
                        />
                        <span
                          className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 px-2.5 sm:px-3 py-1 bg-black/80 backdrop-blur-xs text-[10px] sm:text-[11px] font-mono tracking-widest text-white/85 uppercase rounded-xs border border-white/20 transition-opacity duration-150 ${
                            sliderPosition < 15 ? 'opacity-0' : 'opacity-100'
                          }`}
                        >
                          {currentSlide.beforeLabel}
                        </span>
                      </div>
                    )}

                    {/* Draggable Divider Line */}
                    {!isPressingBefore && (
                      <div
                        className="absolute inset-y-0 z-20 w-0.5 bg-[#C5A880] pointer-events-none shadow-[0_0_12px_rgba(197,168,128,0.8)]"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111111] border-2 border-[#C5A880] flex items-center justify-center shadow-lg text-[#C5A880]">
                          <SplitSquareHorizontal className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. SIDE BY SIDE MODE */}
                {viewMode === 'side-by-side' && (
                  <div className="w-full h-full min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 divide-y md:divide-y-0 md:divide-x divide-white/15">
                    {/* Before */}
                    <div className="relative w-full h-full min-h-0 flex items-center justify-center p-1.5 sm:p-2 bg-black/40">
                      <img
                        src={currentSlide.beforeImage}
                        alt="Before"
                        style={currentSlide.beforeFilterStyle}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black/80 text-[9.5px] sm:text-[10px] font-mono tracking-wider text-white/70 uppercase rounded-xs border border-white/20">
                        {currentSlide.beforeLabel}
                      </span>
                    </div>

                    {/* After */}
                    <div className="relative w-full h-full min-h-0 flex items-center justify-center p-1.5 sm:p-2 bg-black/40">
                      <img
                        src={currentSlide.afterImage}
                        alt="After"
                        style={currentSlide.afterFilterStyle}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black/80 text-[9.5px] sm:text-[10px] font-mono tracking-wider text-[#C5A880] uppercase rounded-xs border border-[#C5A880]/30">
                        {currentSlide.afterLabel}
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Adjustment Points */}
              <div className="mt-2 sm:mt-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#141414] border border-white/10 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs shrink-0">
                <div className="text-white/80 font-light max-w-xl line-clamp-2 sm:line-clamp-none">
                  <span className="text-[#C5A880] font-semibold font-mono uppercase text-[10px] mr-2">
                    Focal Study:
                  </span>
                  {currentSlide.focalSummary}
                </div>

                <div className="hidden xs:flex sm:flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
                  {currentSlide.keyAdjustments.slice(0, 2).map((adj, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/60 text-[9.5px] sm:text-[10px] font-mono text-white/70 rounded-xs border border-white/5"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#C5A880] shrink-0" />
                      <span className="truncate max-w-[160px] sm:max-w-none">{adj}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SLIDE TYPE C: CONCLUDING INQUIRY SPREAD (Slide totalSlides + 1)      */}
          {/* ===================================================================== */}
          {isFinal && (
            <div className="w-full max-w-2xl bg-[#141414] border border-[#C5A880]/40 rounded-xs p-5 sm:p-10 lg:p-12 text-center shadow-2xl">
              <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-2.5 font-semibold">
                END OF CASE STUDY
              </span>
              <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl text-white mb-3">
                Ready for Flawless Album Retouching?
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto">
                We provide custom retouching and color harmonization for fine art photographers worldwide. Test our craft with 1–2 complimentary RAW frames before booking your complete gallery.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => onStartProject(`Photo Retouching (${study.title})`)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#C5A880] text-[#111111] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#D4BC96] transition-colors cursor-pointer shadow-md"
                >
                  Request Retouching Quote &rarr;
                </button>
                <button
                  onClick={() => setCurrentSlideIndex(1)}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-white/5 text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-white/10 border border-white/15 transition-colors cursor-pointer"
                >
                  Review Spreads Again
                </button>
              </div>

              {/* Other Studies quick jump */}
              <div className="mt-7 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-3">
                  EXPLORE OTHER RETOUCHING STUDIES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {allStudies
                    .filter((s) => s.id !== study.id)
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onOpenDifferentStudy(s.id);
                          setCurrentSlideIndex(1);
                        }}
                        className="px-3 py-1.5 bg-black/60 hover:bg-[#1a1a1a] text-xs text-white/80 hover:text-[#C5A880] border border-white/10 rounded-xs transition-colors cursor-pointer"
                      >
                        {s.title} &rarr;
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM THUMBNAIL / SPREAD STEPPER BAR                                  */}
      {/* ========================================================================= */}
      <div className="h-14 sm:h-16 px-3 sm:px-8 border-t border-white/10 flex items-center justify-between gap-2 sm:gap-4 bg-[#141414] shrink-0 z-30">
        
        {/* Step indicator (scrollable on narrow mobile) */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Overview button */}
          <button
            onClick={() => setCurrentSlideIndex(0)}
            className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono rounded-xs transition-all cursor-pointer shrink-0 ${
              currentSlideIndex === 0
                ? 'bg-[#C5A880] text-[#111111] font-semibold'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Overview
          </button>

          {/* Individual Slide buttons */}
          {study.slides.map((slide, idx) => {
            const pageNum = idx + 1;
            const isActive = currentSlideIndex === pageNum;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(pageNum)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-mono rounded-xs transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#C5A880] text-[#111111] font-bold shadow-xs'
                    : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
                title={slide.title}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Inquire / Final button */}
          <button
            onClick={() => setCurrentSlideIndex(totalSlides + 1)}
            className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono rounded-xs transition-all cursor-pointer shrink-0 ${
              currentSlideIndex === totalSlides + 1
                ? 'bg-[#C5A880] text-[#111111] font-semibold'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Inquire
          </button>
        </div>

        {/* Drag Helper Tooltip */}
        {!isIntro && !isFinal && viewMode === 'slider' && (
          <span className="hidden lg:inline-block text-[11px] font-mono text-white/50 tracking-wider shrink-0">
            &larr; Drag slider to inspect RAW Before vs Retouched After &rarr;
          </span>
        )}

        {/* Spread Navigation shortcuts */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-white/70 hover:text-white disabled:opacity-30 cursor-pointer whitespace-nowrap"
          >
            &larr; Prev
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides + 1}
            className="px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-white/70 hover:text-white disabled:opacity-30 cursor-pointer whitespace-nowrap"
          >
            Next &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
