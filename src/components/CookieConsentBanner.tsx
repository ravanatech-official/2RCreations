import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, SlidersHorizontal } from 'lucide-react';
import { usePrivacy } from '../context/PrivacyContext';

export const CookieConsentBanner: React.FC = () => {
  const { 
    hasAnsweredConsent, 
    acceptAllCookies, 
    rejectNonEssentialCookies, 
    openPreferencesModal 
  } = usePrivacy();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasAnsweredConsent) {
      // Show banner smoothly after brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [hasAnsweredConsent]);

  const handleAccept = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleDecline = () => {
    rejectNonEssentialCookies();
    setIsVisible(false);
  };

  const handleOpenPreferences = () => {
    openPreferencesModal('cookies');
    setIsVisible(false);
  };

  if (!isVisible || hasAnsweredConsent) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="bg-[#141414]/95 text-[#FBF9F5] backdrop-blur-md p-5 rounded-xs border border-white/15 shadow-2xl">
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-8 h-8 rounded-xs bg-[#C5A880]/15 text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-serif text-sm font-normal text-[#FBF9F5] mb-1">
              Privacy &amp; Viewing Experience
            </h4>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              We use privacy-friendly cookies and local storage to preserve your album view preferences, inquiry recovery drafts, and anonymous traffic telemetry.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Dismiss cookie notice"
            className="text-white/40 hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/10 text-xs">
          <button
            type="button"
            onClick={handleOpenPreferences}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#C5A880] hover:text-[#e4cfb4] underline underline-offset-4 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Preferences</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecline}
              className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-white/75 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xs transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold bg-[#C5A880] hover:bg-[#d6bc97] text-[#111111] rounded-xs shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3 text-[#111111]" />
              <span>Accept All</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
