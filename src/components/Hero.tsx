import React, { useRef, useEffect } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { analytics } from '../services/analytics';
import { ALBUMS } from '../data/albums';

interface HeroProps {
  onViewAlbums: () => void;
  onStartProject: () => void;
  onOpenAlbum: (albumId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onViewAlbums,
  onStartProject,
  onOpenAlbum
}) => {
  const featuredAlbum = ALBUMS[0]; // Timeless Sri Lankan Wedding
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {
        // Handled browser autoplay policy
      });
    }
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-[100dvh] pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 flex items-center overflow-hidden bg-[#111111]"
    >
      {/* 01. Background Cinematic Video Loop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/video/hero-wedding-poster.webp"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.78] contrast-[1.08] scale-[1.01]"
        >
          {/* User's Authentic 2R Creations Wedding Showcase Footage */}
          <source
            src="/assets/video/hero-wedding-loop.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic Scrims: Multi-layer gradient ensures 100% crystal-clear text readability */}
        {/* Dark to transparent horizontal gradient across text zone */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/70 to-black/35 z-10" />
        {/* Top & bottom darkening for header & footer seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/85 z-10" />
        {/* Warm luxury studio tone sheen */}
        <div className="absolute inset-0 bg-[#241c14]/25 mix-blend-multiply z-10" />
      </div>

      {/* 02. Hero Foreground Content (Sitting right on top of background video) */}
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative z-20">
        <div className="max-w-3xl 2xl:max-w-4xl flex flex-col items-start">
          
          {/* Eyebrow: Professional Positioning Tag */}
          <div className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-3 sm:px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-md max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse shrink-0" />
            <span className="text-[9.5px] sm:text-[11.5px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] text-[#FBF9F5] uppercase leading-snug">
              PROFESSIONAL ALBUM DESIGN &amp; FINE ART RETOUCHING
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="type-hero-h1 text-[#FFFFFF] mb-5 sm:mb-6 drop-shadow-md">
            Turning Your Photographs Into Stories Worth Reliving.
          </h1>

          {/* Supporting Copy */}
          <p className="type-large-body text-[#FBF9F5]/90 font-light mb-7 sm:mb-9 max-w-2xl drop-shadow-sm">
            Story-driven album designs for photographers who want their images to feel intentional, cohesive and worth keeping.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-12">
            <button
              id="hero-start-project-btn"
              onClick={() => {
                analytics.projectCtaClick('hero_start_project');
                onStartProject();
              }}
              className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-[13.5px] font-semibold tracking-[0.06em] text-[#111111] bg-[#C5A880] hover:bg-[#d6bc97] transition-all duration-200 rounded-xs shadow-lg cursor-pointer whitespace-nowrap"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#111111] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-view-albums-btn"
              onClick={() => {
                analytics.projectCtaClick('hero_view_albums');
                onViewAlbums();
              }}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-[13.5px] font-semibold tracking-[0.06em] text-[#FFFFFF] bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 rounded-xs cursor-pointer shadow-sm whitespace-nowrap"
            >
              <span>View the Albums &rarr;</span>
            </button>

            {/* Quick album jump button */}
            <button
              onClick={() => onOpenAlbum(featuredAlbum.id)}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-4 text-[12.5px] font-medium tracking-[0.04em] text-[#C5A880] hover:text-[#FFFFFF] hover:bg-white/10 rounded-xs transition-colors cursor-pointer whitespace-nowrap"
              title="Experience live digital spread architecture"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Explore Featured Album &rarr;</span>
            </button>
          </div>

          {/* Micro proof points — responsive 2x2 grid on narrow phones, single row on desktop */}
          <div className="w-full pt-5 sm:pt-6 border-t border-white/20 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-3 text-[11.5px] sm:text-[12px] text-[#FBF9F5]/85 font-medium tracking-wide">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-serif text-[16px] sm:text-[17px] text-[#C5A880] font-normal">2+ Years</span>
              <span>Experience</span>
            </div>
            <span className="hidden sm:inline text-[#C5A880]/60">/</span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-serif text-[16px] sm:text-[17px] text-[#C5A880] font-normal">50+</span>
              <span>Albums Designed</span>
            </div>
            <span className="hidden sm:inline text-[#C5A880]/60">/</span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-serif text-[16px] sm:text-[17px] text-[#C5A880] font-normal">2–3 Days</span>
              <span>Typical Turnaround*</span>
            </div>
            <span className="hidden sm:inline text-[#C5A880]/60">/</span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-serif text-[16px] sm:text-[17px] text-[#C5A880] font-normal">Worldwide</span>
              <span>Collaboration</span>
            </div>
          </div>
          <p className="text-[10.5px] text-[#FBF9F5]/60 mt-2.5 font-mono italic">
            * Depending on project scope, spread count, and custom retouching requirements.
          </p>

        </div>
      </div>
    </section>
  );
};
