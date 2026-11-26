import React from 'react';

export const CoreValue: React.FC = () => {
  return (
    <section id="core-value" className="py-16 sm:py-24 lg:py-32 bg-[#161616] text-[#FBF9F5] relative overflow-hidden">
      {/* Subtle editorial warm accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-full h-[300px] bg-[#C5A880]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl 2xl:max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
        <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#C5A880] uppercase block mb-5 font-mono">
          THE 2R APPROACH
        </span>

        <h2 className="type-section-h2 text-[#FBF9F5] mb-6 max-w-3xl mx-auto">
          More Than A Layout. A Story.
        </h2>

        <div className="w-10 h-[1px] bg-[#C5A880]/40 mx-auto mb-7" />

        <p className="type-large-body text-[#FBF9F5]/85 font-normal max-w-2xl mx-auto">
          Every photograph has a place. Every spread has a purpose. I design wedding albums that turn a collection of photographs into a narrative couples can feel, revisit and treasure for generations.
        </p>

        {/* Narrative Flow Sequence Indicators */}
        <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-[#FBF9F5]/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 text-center">
          <div>
            <span className="text-[10.5px] font-mono text-[#C5A880] block mb-1">01</span>
            <span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-[#FBF9F5]/90">Place</span>
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-[#C5A880] block mb-1">02</span>
            <span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-[#FBF9F5]/90">Detail</span>
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-[#C5A880] block mb-1">03</span>
            <span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-[#FBF9F5]/90">Anticipation</span>
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-[#C5A880] block mb-1">04</span>
            <span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-[#FBF9F5]/90">Ceremony</span>
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-[#C5A880] block mb-1">05</span>
            <span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-[#FBF9F5]/90">Intimacy</span>
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-[#C5A880] block mb-1">06</span>
            <span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-[#FBF9F5]/90">Closing</span>
          </div>
        </div>
      </div>
    </section>
  );
};
