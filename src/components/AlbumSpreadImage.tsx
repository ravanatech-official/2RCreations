import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface AlbumSpreadImageProps {
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  pageNumber: number;
  totalPages?: number;
  photoFilename: string;
  folderPath?: string;
  className?: string;
  editorialLabel?: string;
  storyPart?: string;
  isHero?: boolean;
}

export const AlbumSpreadImage: React.FC<AlbumSpreadImageProps> = ({
  src,
  fallbackSrc,
  alt,
  pageNumber,
  totalPages = 48,
  photoFilename,
  className = '',
  editorialLabel,
  storyPart
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync if src prop changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasTriedFallback(false);
    setLoadFailed(false);
    setIsLoaded(false);
  }, [src]);

  // If the image is not yet uploaded or failed to load:
  // Render an editorial placeholder with clean typography, NO developer file paths.
  if (loadFailed || !src) {
    return (
      <div className={`w-full h-full min-h-[220px] bg-[#F5F2EB] border border-[#242424]/8 rounded-xs flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden select-none ${className}`}>
        {/* Subtle background grain / tone */}
        <div className="absolute inset-0 bg-[#EFECE4]/40 pointer-events-none" />
        
        {/* Top meta */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-wider text-[#242424]/50">
          <span className="uppercase text-[#C5A880] font-semibold">{storyPart || 'SPREAD'}</span>
          <span>PAGE {String(pageNumber).padStart(2, '0')} / {totalPages}</span>
        </div>

        {/* Center Editorial Card */}
        <div className="relative z-10 my-auto text-center max-w-xs mx-auto py-6">
          <div className="w-9 h-9 mx-auto mb-3 rounded-full bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          
          <span className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#C5A880] uppercase block mb-1">
            EDITORIAL SPREAD ARCHITECTURE
          </span>
          
          <h4 className="font-serif text-base sm:text-lg font-medium text-[#111111] mb-1.5">
            {editorialLabel || 'Story Narrative Layout'}
          </h4>

          <p className="text-xs text-[#242424]/60 leading-relaxed font-light">
            Designed for narrative pacing, balanced negative space, and heirloom presentation.
          </p>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10 flex items-center justify-between text-[9.5px] font-mono text-[#242424]/40 pt-2 border-t border-[#242424]/5">
          <span>2R CREATIONS &bull; SIGNATURE LAYOUT</span>
          <span className="text-[#C5A880]/90 uppercase tracking-wider">Concept Study</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0A0A0A] rounded-xs flex items-center justify-center ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#141414] animate-pulse flex items-center justify-center">
          <span className="text-[9px] font-mono tracking-widest text-[#FBF9F5]/50 uppercase">
            Loading Spread...
          </span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt || `Page ${pageNumber}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasTriedFallback && fallbackSrc && fallbackSrc !== currentSrc) {
            setHasTriedFallback(true);
            setCurrentSrc(fallbackSrc);
          } else {
            setLoadFailed(true);
          }
        }}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
