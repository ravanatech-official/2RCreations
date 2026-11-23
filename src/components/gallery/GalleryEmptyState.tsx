import React from 'react';
import { ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface GalleryEmptyStateProps {
  onStartProject: () => void;
  onExplorePortfolio: () => void;
}

export const GalleryEmptyState: React.FC<GalleryEmptyStateProps> = ({
  onStartProject,
  onExplorePortfolio,
}) => {
  const handleStartProjectClick = () => {
    analytics.galleryStartProjectClick('empty_state_cta');
    onStartProject();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 sm:py-20 px-4">
      {/* Editorial Empty Container */}
      <div className="relative border border-[#242424]/10 bg-[#FAF8F5] p-8 sm:p-14 md:p-16 rounded-xs text-center shadow-xs overflow-hidden">
        
        {/* Subtle decorative watermark */}
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-[#C5A880]/5 rounded-full pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-[#C5A880]/5 rounded-full pointer-events-none blur-2xl" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          
          {/* Subtle Monogram or Emblem */}
          <div className="w-12 h-12 rounded-full border border-[#C5A880]/30 bg-[#F5F2EB] flex items-center justify-center mb-6">
            <Sparkles className="w-5 h-5 text-[#C5A880]" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880] mb-3 block">
            SELECTED WORK ARCHIVE
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111111] mb-4">
            The gallery is growing.
          </h3>

          <p className="text-sm sm:text-base text-[#242424]/80 font-light leading-relaxed mb-4 max-w-xl">
            New completed album projects will be added here as they are released.
          </p>

          <p className="text-xs sm:text-sm text-[#242424]/60 font-light italic mb-8">
            Selected client work will appear here as projects are completed.
          </p>

          {/* Separation Divider */}
          <div className="w-16 h-[1px] bg-[#C5A880]/40 mb-8" />

          {/* Invitation and Primary Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-xs sm:text-sm font-medium text-[#111111] tracking-wide">
              Have an album you'd like to see here?
            </span>
            <button
              onClick={handleStartProjectClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-[#FBF9F5] text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-[#242424] hover:border-[#C5A880] transition-all duration-200 cursor-pointer shadow-sm group"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Concept Portfolio Cross-Reference */}
          <div className="mt-10 pt-8 border-t border-[#242424]/8 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#242424]/70 gap-4">
            <div className="flex items-center gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span className="font-light">
                Looking to evaluate design styles and layout pacing right now?
              </span>
            </div>
            <button
              onClick={onExplorePortfolio}
              className="font-medium text-[#111111] hover:text-[#C5A880] tracking-wider uppercase underline underline-offset-4 transition-colors cursor-pointer shrink-0"
            >
              Explore Concept Portfolio &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
