import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Cookie, 
  MessageSquare, 
  FileCheck, 
  Check, 
  AlertCircle, 
  Loader2, 
  Download, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { usePrivacy, PreferenceTab } from '../context/PrivacyContext';
import { submitDataSubjectRequest, DataRequestSubmissionResult } from '../services/leads';
import { STUDIO_CONFIG } from '../config';
import { firebaseConfig } from '../firebase';
import { DataRequestType } from '../types';

interface PrivacyPreferenceCenterProps {
  isPageEmbed?: boolean;
}

export const PrivacyPreferenceCenter: React.FC<PrivacyPreferenceCenterProps> = ({ isPageEmbed = false }) => {
  const { 
    isPreferenceModalOpen, 
    closePreferencesModal, 
    activeTab, 
    setActiveTab, 
    cookiePreferences, 
    updateCookiePreferences, 
    acceptAllCookies, 
    rejectNonEssentialCookies 
  } = usePrivacy();

  // Local state for cookie toggles inside the modal
  const [localAnalytics, setLocalAnalytics] = useState(cookiePreferences.analytics);
  const [localFunctional, setLocalFunctional] = useState(cookiePreferences.functional);
  const [cookieSavedNotice, setCookieSavedNotice] = useState(false);

  // Sync local toggles whenever saved preferences update or modal opens
  useEffect(() => {
    setLocalAnalytics(cookiePreferences.analytics);
    setLocalFunctional(cookiePreferences.functional);
  }, [cookiePreferences.analytics, cookiePreferences.functional, isPreferenceModalOpen]);

  // Allow closing Preference Center modal with Escape key
  useEffect(() => {
    if (isPageEmbed || !isPreferenceModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePreferencesModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPageEmbed, isPreferenceModalOpen, closePreferencesModal]);

  // Communication / WhatsApp Opt-Out Form State
  const [optOutPhone, setOptOutPhone] = useState('');
  const [optOutEmail, setOptOutEmail] = useState('');
  const [optOutReason, setOptOutReason] = useState('Prefer email communication only');
  const [isSubmittingOptOut, setIsSubmittingOptOut] = useState(false);
  const [optOutResult, setOptOutResult] = useState<DataRequestSubmissionResult | null>(null);

  // Data Subject Rights Form State (GDPR Export / Erasure)
  const [rightsName, setRightsName] = useState('');
  const [rightsEmail, setRightsEmail] = useState('');
  const [rightsType, setRightsType] = useState<DataRequestType>('RIGHT_TO_BE_FORGOTTEN');
  const [rightsDetails, setRightsDetails] = useState('');
  const [isSubmittingRights, setIsSubmittingRights] = useState(false);
  const [rightsResult, setRightsResult] = useState<DataRequestSubmissionResult | null>(null);

  if (!isPageEmbed && !isPreferenceModalOpen) return null;

  const handleSaveCookiePreferences = () => {
    updateCookiePreferences({
      analytics: localAnalytics,
      functional: localFunctional
    });
    setCookieSavedNotice(true);
    setTimeout(() => {
      setCookieSavedNotice(false);
      if (!isPageEmbed) {
        closePreferencesModal();
      }
    }, 1200);
  };

  const handleAcceptAll = () => {
    setLocalAnalytics(true);
    setLocalFunctional(true);
    acceptAllCookies();
    setCookieSavedNotice(true);
    setTimeout(() => {
      setCookieSavedNotice(false);
      if (!isPageEmbed) {
        closePreferencesModal();
      }
    }, 1000);
  };

  const handleRejectAll = () => {
    setLocalAnalytics(false);
    setLocalFunctional(false);
    rejectNonEssentialCookies();
    setCookieSavedNotice(true);
    setTimeout(() => {
      setCookieSavedNotice(false);
      if (!isPageEmbed) {
        closePreferencesModal();
      }
    }, 1000);
  };

  const handleOptOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingOptOut) return;
    setIsSubmittingOptOut(true);
    setOptOutResult(null);

    const result = await submitDataSubjectRequest({
      email: optOutEmail,
      whatsapp: optOutPhone,
      requestType: 'WHATSAPP_OPT_OUT',
      details: `Reason: ${optOutReason}. User requested immediate opt-out from WhatsApp notifications and messaging.`,
      source: isPageEmbed ? 'preferences_page_optout' : 'preference_center_modal_optout'
    });

    setIsSubmittingOptOut(false);
    setOptOutResult(result);
  };

  const handleRightsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRights) return;
    setIsSubmittingRights(true);
    setRightsResult(null);

    const result = await submitDataSubjectRequest({
      name: rightsName,
      email: rightsEmail,
      requestType: rightsType,
      details: rightsDetails || `Data subject request under GDPR/CCPA for ${rightsType}.`,
      source: isPageEmbed ? 'preferences_page_rights' : 'preference_center_modal_rights'
    });

    setIsSubmittingRights(false);
    setRightsResult(result);
  };

  const content = (
    <div className={`bg-[#FAF8F5] text-[#111111] rounded-xs shadow-2xl border border-[#242424]/15 overflow-hidden flex flex-col w-full ${isPageEmbed ? 'max-w-4xl' : 'max-h-[92dvh] max-w-3xl'}`}>
      {/* Header */}
      <div className="bg-[#141414] text-[#FBF9F5] px-4 sm:px-6 py-4 sm:py-5 border-b border-[#C5A880]/20 flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C5A880] shrink-0" />
            <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#C5A880] truncate">
              2R CREATIONS &bull; PRIVACY &amp; CONSENT GOVERNANCE
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#FBF9F5] tracking-tight">
            Privacy Preference Center
          </h2>
          <p className="text-xs text-[#FBF9F5]/70 font-light mt-0.5">
            Manage cookie governance, WhatsApp communication channels, and data subject rights.
          </p>
        </div>

        {!isPageEmbed && (
          <button
            type="button"
            onClick={closePreferencesModal}
            className="text-white/50 hover:text-white p-1.5 transition-colors cursor-pointer rounded-xs hover:bg-white/10 shrink-0"
            aria-label="Close Preference Center"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#ECE7DC] border-b border-[#242424]/10 px-4 sm:px-6 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('cookies')}
          className={`py-3 sm:py-3.5 px-2 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'cookies'
              ? 'border-[#111111] text-[#111111] font-semibold'
              : 'border-transparent text-[#242424]/60 hover:text-[#111111]'
          }`}
        >
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookies &amp; Storage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('communications')}
          className={`py-3 sm:py-3.5 px-2 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'communications'
              ? 'border-[#111111] text-[#111111] font-semibold'
              : 'border-transparent text-[#242424]/60 hover:text-[#111111]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp &amp; Channels</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rights')}
          className={`py-3 sm:py-3.5 px-2 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'rights'
              ? 'border-[#111111] text-[#111111] font-semibold'
              : 'border-transparent text-[#242424]/60 hover:text-[#111111]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GDPR / Data Rights</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain space-y-6 flex-1 text-xs sm:text-sm">
        {/* ============================================================== */}
        {/* TAB 1: COOKIES & LOCAL STORAGE */}
        {/* ============================================================== */}
        {activeTab === 'cookies' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#111111] mb-1">
                Cookie Governance &amp; Local Telemetry
              </h3>
              <p className="text-xs text-[#242424]/70 leading-relaxed font-light">
                Under the European ePrivacy Directive and GDPR (General Data Protection Regulation), we provide transparent control over client-side storage tokens. We never sell data or deploy intrusive third-party cross-site trackers.
              </p>
            </div>

            {cookieSavedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Your cookie choices have been applied and saved.</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Category 1: Strictly Necessary (Locked ON) */}
              <div className="p-4 bg-white border border-[#242424]/10 rounded-xs shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111111]">
                        Strictly Necessary &amp; Security Tokens
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-[#111111] text-white rounded-xs uppercase">
                        Always Active
                      </span>
                    </div>
                    <p className="text-xs text-[#242424]/70 mt-1.5 leading-relaxed font-light">
                      Essential for secure session navigation, inquiry recovery drafts (ensuring you do not lose project notes if your connection disconnects), and anti-spam honeypot security. These cannot be disabled.
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-[#C5A880] rounded-xs cursor-not-allowed opacity-75"
                    />
                  </div>
                </div>
              </div>

              {/* Category 2: Performance & Analytics (Google Analytics GA4) */}
              <div className="p-4 bg-white border border-[#242424]/10 rounded-xs shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111111]">
                        Analytics &amp; Performance Telemetry (GA4)
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-[#C5A880]/20 text-[#644622] rounded-xs uppercase font-medium">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-[#242424]/70 mt-1.5 leading-relaxed font-light">
                      Enables Google Analytics 4{firebaseConfig.measurementId ? ` (Measurement ID: ${firebaseConfig.measurementId})` : ''} to record aggregated, anonymous engagement metrics (e.g. which album spreads are viewed, page load times) only after you opt in. IP masking is enabled.
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localAnalytics}
                        onChange={(e) => setLocalAnalytics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111111]" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Category 3: Functional & Viewing State */}
              <div className="p-4 bg-white border border-[#242424]/10 rounded-xs shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111111]">
                        Functional &amp; Viewer State Cache
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-[#C5A880]/20 text-[#644622] rounded-xs uppercase font-medium">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-[#242424]/70 mt-1.5 leading-relaxed font-light">
                      Preserves your digital album spread position and before/after slider preferences so when you return to a portfolio book, your viewing position is saved.
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFunctional}
                        onChange={(e) => setLocalFunctional(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111111]" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#242424]/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-gray-100 border border-[#242424]/20 rounded-xs text-[#111111] transition-colors cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-[#C5A880]/20 hover:bg-[#C5A880]/30 border border-[#C5A880]/40 rounded-xs text-[#644622] font-semibold transition-colors cursor-pointer"
                >
                  Accept All
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveCookiePreferences}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#111111] hover:bg-[#2e2e2e] text-white font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Save My Preferences
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WHATSAPP & COMMUNICATION CHANNELS */}
        {/* ============================================================== */}
        {activeTab === 'communications' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#111111] mb-1">
                WhatsApp Communication Governance &amp; Opt-Out
              </h3>
              <p className="text-xs text-[#242424]/70 leading-relaxed font-light">
                2R Creations upholds the strictest standards of communication etiquette (in full alignment with GDPR Article 7, TCPA § 227, and Meta’s WhatsApp Business Messaging Policy). We never send cold broadcast spam or share numbers with third parties.
              </p>
            </div>

            {/* Studio Communication Principles */}
            <div className="p-4 bg-[#F5F2EB] border border-[#C5A880]/30 rounded-xs space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Our 3-Part Communication Guarantee:
              </h4>
              <ul className="text-xs text-[#242424]/75 space-y-1.5 list-disc pl-4 font-light">
                <li>
                  <strong>1-on-1 Direct Designer Dialogue:</strong> WhatsApp is reserved exclusively for discussing active wedding album layout drafts, color grading revisions, and timeline queries.
                </li>
                <li>
                  <strong>Instant Right to Revoke:</strong> You can opt-out at any time either by replying <code>STOP</code> on WhatsApp or using the instant form below.
                </li>
                <li>
                  <strong>Zero Automated Cold-Calling:</strong> No robotic dialers, third-party lead brokers, or automated broadcast spam.
                </li>
              </ul>
            </div>

            {/* Instant 1-Click WhatsApp Opt-Out Form */}
            <div className="p-5 bg-white border border-[#242424]/15 rounded-xs shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xs bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111111]">
                    Self-Service WhatsApp Opt-Out
                  </h4>
                  <p className="text-[11px] text-[#242424]/60">
                    Submit your number below to be immediately added to our suppression blacklist.
                  </p>
                </div>
              </div>

              {optOutResult ? (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-4 rounded-xs text-xs ${
                    optOutResult.success 
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' 
                      : 'bg-red-50 border border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {optOutResult.success ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {optOutResult.success ? 'WhatsApp Opt-Out Request Confirmed' : 'Submission Note'}
                      </p>
                      <p className="leading-relaxed font-light">{optOutResult.message}</p>
                      {optOutResult.requestId && (
                        <p className="mt-2 font-mono text-[11px] text-[#242424]/70">
                          Audit Reference ID: <code>{optOutResult.requestId}</code>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOptOutSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="optout-phone" className="block text-[11px] font-mono uppercase tracking-wider text-[#111111] mb-1">
                        WhatsApp Number <span className="text-[#C5A880]">*</span>
                      </label>
                      <input
                        id="optout-phone"
                        type="tel"
                        required
                        value={optOutPhone}
                        onChange={(e) => setOptOutPhone(e.target.value)}
                        placeholder="+1 (555) 012-3456"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label htmlFor="optout-email" className="block text-[11px] font-mono uppercase tracking-wider text-[#111111] mb-1">
                        Associated Email <span className="text-[#C5A880]">*</span>
                      </label>
                      <input
                        id="optout-email"
                        type="email"
                        required
                        value={optOutEmail}
                        onChange={(e) => setOptOutEmail(e.target.value)}
                        placeholder="studio@example.com"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="optout-reason" className="block text-[11px] font-mono uppercase tracking-wider text-[#111111] mb-1">
                      Reason for Opting Out
                    </label>
                    <select
                      id="optout-reason"
                      value={optOutReason}
                      onChange={(e) => setOptOutReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#111111]"
                    >
                      <option value="Prefer email communication only">Prefer email communication only</option>
                      <option value="Wedding / Project already completed">Wedding / Project already completed</option>
                      <option value="No longer in need of album design services">No longer in need of album design services</option>
                      <option value="Unsolicited inquiry received">Unsolicited inquiry received</option>
                      <option value="Other preference">Other preference</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingOptOut}
                    className="w-full sm:w-auto px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingOptOut ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Logging Suppression...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Confirm Instant WhatsApp Opt-Out</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: DATA SUBJECT RIGHTS (GDPR / CCPA) */}
        {/* ============================================================== */}
        {activeTab === 'rights' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#111111] mb-1">
                Exercise Your Data Subject Rights (GDPR &amp; CCPA)
              </h3>
              <p className="text-xs text-[#242424]/70 leading-relaxed font-light">
                Under Article 15 (Right of Access) and Article 17 (Right to Erasure / Right to be Forgotten) of the EU General Data Protection Regulation, you hold complete autonomy over your personal information.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#242424]/10 rounded-xs">
                <div className="flex items-center gap-2 mb-2 text-[#111111]">
                  <Download className="w-4 h-4 text-[#C5A880]" />
                  <h4 className="font-semibold text-xs uppercase tracking-wider">
                    Right of Access &amp; Portability
                  </h4>
                </div>
                <p className="text-xs text-[#242424]/70 font-light leading-relaxed">
                  Request a structured machine-readable export (JSON/CSV) of all submitted project scopes, inquiry notes, and communication records associated with your email.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#242424]/10 rounded-xs">
                <div className="flex items-center gap-2 mb-2 text-[#111111]">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <h4 className="font-semibold text-xs uppercase tracking-wider">
                    Right to Erasure (Be Forgotten)
                  </h4>
                </div>
                <p className="text-xs text-[#242424]/70 font-light leading-relaxed">
                  Request irreversible deletion of your lead records, sample photo download links, and contact information from our active databases and backup logs.
                </p>
              </div>
            </div>

            {/* Formal Data Subject Request Form */}
            <div className="p-5 bg-white border border-[#242424]/15 rounded-xs shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#C5A880]" />
                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111111]">
                  Submit Formal Data Subject Request
                </h4>
              </div>

              {rightsResult ? (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-4 rounded-xs text-xs ${
                    rightsResult.success 
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' 
                      : 'bg-red-50 border border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {rightsResult.success ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {rightsResult.success ? 'Data Subject Request Logged' : 'Submission Note'}
                      </p>
                      <p className="leading-relaxed font-light">{rightsResult.message}</p>
                      {rightsResult.requestId && (
                        <p className="mt-2 font-mono text-[11px] text-[#242424]/70">
                          Legal Tracking Reference ID: <code>{rightsResult.requestId}</code>
                        </p>
                      )}
                      <p className="text-[11px] text-[#242424]/60 mt-1 font-light">
                        Our data protection officer will verify your email address and execute this request within 72 business hours.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRightsSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="rights-name" className="block text-[11px] font-mono uppercase tracking-wider text-[#111111] mb-1">
                        Full Name / Studio Name
                      </label>
                      <input
                        id="rights-name"
                        type="text"
                        value={rightsName}
                        onChange={(e) => setRightsName(e.target.value)}
                        placeholder="Elena Rostova"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label htmlFor="rights-email" className="block text-[11px] font-mono uppercase tracking-wider text-[#111111] mb-1">
                        Registered Email Address <span className="text-[#C5A880]">*</span>
                      </label>
                      <input
                        id="rights-email"
                        type="email"
                        required
                        value={rightsEmail}
                        onChange={(e) => setRightsEmail(e.target.value)}
                        placeholder="studio@example.com"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rights-type" className="block text-[11px] font-mono uppercase tracking-wider text-[#111111] mb-1">
                      Action Requested <span className="text-[#C5A880]">*</span>
                    </label>
                    <select
                      id="rights-type"
                      value={rightsType}
                      onChange={(e) => setRightsType(e.target.value as DataRequestType)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#111111]"
                    >
                      <option value="RIGHT_TO_BE_FORGOTTEN">Permanent Data Erasure (Right to be Forgotten)</option>
                      <option value="DATA_EXPORT">Export Copy of All Personal Data Records</option>
                      <option value="COMMUNICATION_PREFERENCE">General Communication Channel Preference Update</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rights-details" className="block text-[11px] font-mono uppercase tracking-wider text-[#111111] mb-1">
                      Additional Notes or Specific Reference (Optional)
                    </label>
                    <textarea
                      id="rights-details"
                      rows={2}
                      value={rightsDetails}
                      onChange={(e) => setRightsDetails(e.target.value)}
                      placeholder="e.g. Please purge the test sample photos link sent on October 14th..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#111111] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRights}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#2b2b2b] text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingRights ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Submit Data Subject Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer info bar */}
      <div className="bg-[#ECE7DC] px-6 py-3 border-t border-[#242424]/10 text-[11px] text-[#242424]/70 flex flex-wrap items-center justify-between gap-3 font-light">
        <span>
          Data Controller: <strong>2R Creations</strong> &bull; {STUDIO_CONFIG.email}
        </span>
        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#111111] underline underline-offset-2 flex items-center gap-1 font-medium"
          >
            Full Privacy Policy
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="/client-image-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#111111] underline underline-offset-2 flex items-center gap-1 font-medium"
          >
            Client Image Policy
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );

  if (isPageEmbed) {
    return content;
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Preference Center"
    >
      {content}
    </div>
  );
};
