import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  initialPosition?: number;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
  alt = 'Retouching Comparison',
  className = 'w-full h-full',
  imageClassName = 'w-full h-full object-cover object-[center_12%]',
  initialPosition = 50,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const nextPos = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setPosition(nextPos);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(2, p - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(98, p + 4));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={`${alt} Before and After Slider`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={`relative overflow-hidden select-none cursor-ew-resize touch-pan-y focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] ${className}`}
    >
      {/* AFTER Layer (Base) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src={afterImage}
          alt={`${alt} - After`}
          draggable={false}
          className={`${imageClassName} select-none pointer-events-none`}
        />
      </div>

      {/* BEFORE Layer (Clipped identically via CSS clip-path for 0px shift) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={`${alt} - Before`}
          draggable={false}
          className={`${imageClassName} select-none pointer-events-none`}
        />
      </div>

      {/* Subtle Bottom Scrim for Legible Labels */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none z-10" />

      {/* Luxury Studio Architectural Labels */}
      <span
        className={`absolute bottom-3 left-3 z-20 px-2.5 py-1 bg-[#111111]/85 backdrop-blur-xs text-[10px] font-mono tracking-[0.18em] text-[#FBF9F5]/90 uppercase rounded-xs border border-white/15 pointer-events-none transition-opacity duration-150 ${
          position < 18 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {beforeLabel}
      </span>

      <span
        className={`absolute bottom-3 right-3 z-20 px-2.5 py-1 bg-[#111111]/85 backdrop-blur-xs text-[10px] font-mono tracking-[0.18em] text-[#C5A880] uppercase rounded-xs border border-[#C5A880]/35 pointer-events-none transition-opacity duration-150 ${
          position > 82 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {afterLabel}
      </span>

      {/* Champagne Gold Vertical Divider & Handle */}
      <div
        className="absolute inset-y-0 z-20 w-[1.5px] bg-[#C5A880] pointer-events-none shadow-[0_0_10px_rgba(197,168,128,0.75)]"
        style={{ left: `${position}%` }}
      >
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111111]/95 border border-[#C5A880] flex items-center justify-center shadow-lg text-[#C5A880] transition-transform duration-150 ${
            isDragging ? 'scale-110' : 'scale-100'
          }`}
        >
          <ChevronLeft className="w-3 h-3 -mr-0.5" />
          <ChevronRight className="w-3 h-3 -ml-0.5" />
        </div>
      </div>
    </div>
  );
};
