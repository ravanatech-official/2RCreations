import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { analytics } from '../services/analytics';
import { getWhatsAppUrl, hasWhatsApp, STUDIO_CONFIG } from '../config';

interface FinalCTAProps {
  onStartProject: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartProject }) => {
  const navigate = useNavigate();
  const whatsappUrl = getWhatsAppUrl('Hi 2R Creations, I’d like to discuss a custom wedding album design project.');

  const handleStartProject = () => {
    analytics.projectCtaClick('final_cta_button');
    onStartProject();
  };

  const handleFreeSample = () => {
    analytics.freeSampleRequest();
    navigate('/contact?sample=true');
  };

  const handleWhatsApp = () => {
    analytics.whatsappClick('final_cta_button');
  };

  return (
    <section id="final-cta-section" className="py-24 sm:py-32 bg-[#111111] text-[#FBF9F5] relative overflow-hidden">
      {/* Editorial ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C5A880]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <span className="text-[10.5px] sm:text-[11.5px] font-mono font-semibold tracking-[0.25em] text-[#C5A880] uppercase block mb-4">
          BEGIN YOUR COLLABORATION
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FBF9F5] leading-tight mb-6">
          Ready to Turn Your Wedding Galleries into Heirloom Albums?
        </h2>

        <p className="text-base sm:text-lg text-[#FBF9F5]/75 font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Send your project details and let's craft an album experience your clients will treasure for a lifetime.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartProject}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#111111] bg-[#FBF9F5] hover:bg-[#C5A880] transition-colors rounded-xs shadow-xl cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4 text-[#111111] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleFreeSample}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#FBF9F5] bg-transparent border border-[#FBF9F5]/30 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors rounded-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Request My Free Sample &rarr;</span>
          </button>

          {hasWhatsApp() && whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#FBF9F5]/80 hover:text-[#C5A880] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#C5A880]" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        <p className="mt-8 text-xs text-[#FBF9F5]/60 font-light tracking-wide font-mono">
          {STUDIO_CONFIG.facts.globalReach} &bull; 2–3 Day Typical Turnaround*
        </p>
      </div>
    </section>
  );
};
