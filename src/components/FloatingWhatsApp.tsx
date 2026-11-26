import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { STUDIO_CONFIG, getWhatsAppUrl, hasWhatsApp } from '../config';
import { analytics } from '../services/analytics';
import { usePrivacy } from '../context/PrivacyContext';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed] = useState(false);
  const { hasAnsweredConsent } = usePrivacy();

  if (!hasWhatsApp()) {
    return null;
  }

  const whatsappUrl = getWhatsAppUrl();
  if (!whatsappUrl) {
    return null;
  }

  const handleOpenWhatsApp = () => {
    analytics.whatsappClick('floating_button');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside 
      aria-label="WhatsApp quick contact"
      className={`fixed right-[max(0.875rem,env(safe-area-inset-right))] sm:right-6 z-40 flex flex-col items-end pointer-events-auto transition-all duration-300 ${
        !hasAnsweredConsent
          ? 'bottom-[calc(14.5rem+env(safe-area-inset-bottom))] sm:bottom-6'
          : 'bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6'
      }`}
    >
      {/* Floating Prompt Card (optional peek) */}
      {!dismissed && isOpen && (
        <div className="mb-3 w-[min(18rem,calc(100vw-1.75rem))] bg-[#1A1512] text-[#FAF8F5] p-4 rounded-lg shadow-2xl border border-[#D7BC97]/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#FAF8F5]/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider text-[#D7BC97] uppercase font-semibold">
                Online for Inquiries
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#FAF8F5]/60 hover:text-[#FAF8F5] p-1 transition-colors"
              aria-label="Close message preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <p className="text-xs text-[#FAF8F5]/90 font-light leading-relaxed mb-3">
            Have a question about our Wedding Album Design or Fine Art Retouching packages?
          </p>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded transition-colors shadow-xs"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </button>
          
          <div className="mt-2 text-center">
            <span className="text-[10px] text-[#FAF8F5]/50 font-mono">
              {STUDIO_CONFIG.whatsappDisplayNumber || '+94 72 638 7340'}
            </span>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          onMouseEnter={() => !dismissed && setIsOpen(true)}
          aria-label="Chat with 2R Creations on WhatsApp"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        >
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
          
          {/* Subtle online pulse indicator */}
          <span className="absolute top-0.5 right-0.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-400 border-2 border-white"></span>
          </span>
        </button>

        {/* Desktop hover badge */}
        {!isOpen && (
          <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div className="bg-[#1A1512] text-[#FAF8F5] text-xs font-medium py-1.5 px-3 rounded shadow-lg border border-[#D7BC97]/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              <span>Chat on WhatsApp</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
