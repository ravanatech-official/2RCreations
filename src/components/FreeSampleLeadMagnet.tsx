import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { submitLeadInquiry, LeadSubmissionResult } from '../services/leads';
import { STUDIO_CONFIG, getWhatsAppUrl, hasWhatsApp } from '../config';
import { analytics } from '../services/analytics';

interface FreeSampleLeadMagnetProps {
  onRequestFreeSample?: () => void;
}

export const FreeSampleLeadMagnet: React.FC<FreeSampleLeadMagnetProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cloudLink, setCloudLink] = useState('');
  const [notes, setNotes] = useState('');
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LeadSubmissionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    analytics.freeSampleRequest();

    const result = await submitLeadInquiry(
      {
        name: name.trim(),
        email: email.trim(),
        whatsapp: 'Via Free Sample Form',
        projectType: 'Free Sample (2 Spreads)',
        samplePhotosLink: cloudLink.trim(),
        message: notes.trim() || 'Complimentary 2-spread sample trial request.',
        requestFreeSample: true,
        whatsappConsent,
        source: 'home_free_sample_magnet'
      },
      honeypot
    );

    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  const whatsappFallback = getWhatsAppUrl(
    `Hi 2R Creations, I tried to submit a free sample request on your site for studio "${name}". Here is my cloud link: ${cloudLink}`
  );

  return (
    <section id="free-sample-section" className="py-16 sm:py-24 bg-[#FBF9F5] border-t border-[#242424]/5">
      <div className="max-w-5xl 2xl:max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative bg-[#161616] text-[#FBF9F5] rounded-xs p-5 sm:p-10 lg:p-14 overflow-hidden shadow-2xl border border-[#C5A880]/20">
          
          {/* Subtle background warm glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-xs mb-5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#C5A880] uppercase">
                COMPLIMENTARY TRIAL FOR PHOTOGRAPHERS
              </span>
            </div>

            {/* H2 */}
            <h2 className="type-section-h2 text-[#FBF9F5] mb-4">
              Test My Pacing On 2 Real Spreads
            </h2>

            {/* Body */}
            <p className="text-sm sm:text-base text-[#FBF9F5]/85 font-light leading-relaxed mb-8 max-w-2xl">
              Send 4–8 photographs from a recent wedding or couple session. I will design two complete editorial spreads so you can evaluate the rhythm, negative space, and story structure for yourself.
            </p>

            {/* Submission State UI */}
            {submissionResult?.success ? (
              <div className="p-6 sm:p-8 bg-[#222222] rounded-xs border border-[#C5A880]/40 text-[#FBF9F5]">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FBF9F5] mb-2">
                      Sample Request Received
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#FBF9F5]/80 font-light leading-relaxed mb-4">
                      Thank you, {name}. Your sample photos link has been received. I will review the lighting and narrative flow of your frames and design 2 sample spreads for your review within 2–3 business days.
                    </p>
                    <p className="text-[11px] font-mono text-[#C5A880]">
                      Confirmation email will be sent to {email}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="website_url_check"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#FBF9F5]/80 mb-1.5">
                      Photographer / Studio Name <span className="text-[#C5A880]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Vance Photography"
                      className="w-full px-4 py-3 bg-[#242424] border border-[#FBF9F5]/15 focus:border-[#C5A880] rounded-xs text-xs sm:text-sm text-[#FBF9F5] placeholder-[#FBF9F5]/30 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#FBF9F5]/80 mb-1.5">
                      Email Address <span className="text-[#C5A880]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="studio@example.com"
                      className="w-full px-4 py-3 bg-[#242424] border border-[#FBF9F5]/15 focus:border-[#C5A880] rounded-xs text-xs sm:text-sm text-[#FBF9F5] placeholder-[#FBF9F5]/30 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#FBF9F5]/80 mb-1.5">
                    Gallery / Cloud Link (Google Drive, Dropbox, Pixieset, WeTransfer) <span className="text-[#C5A880]">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={cloudLink}
                    onChange={(e) => setCloudLink(e.target.value)}
                    placeholder="https://drive.google.com/... or https://pixieset.com/..."
                    className="w-full px-4 py-3 bg-[#242424] border border-[#FBF9F5]/15 focus:border-[#C5A880] rounded-xs text-xs sm:text-sm text-[#FBF9F5] placeholder-[#FBF9F5]/30 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#FBF9F5]/80 mb-1.5">
                    Notes / Specific Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Outdoor sunset light, modern serif typography, preferred print lab if known..."
                    className="w-full px-4 py-2.5 bg-[#242424] border border-[#FBF9F5]/15 focus:border-[#C5A880] rounded-xs text-xs sm:text-sm text-[#FBF9F5] placeholder-[#FBF9F5]/30 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Error Banner with Direct Fallback */}
                {submissionResult && !submissionResult.success && (
                  <div role="alert" aria-live="polite" className="p-4 bg-red-950/40 border border-red-500/30 rounded-xs text-xs text-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="font-semibold">{submissionResult.message}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-red-500/20">
                      <a
                        href={`mailto:${STUDIO_CONFIG.email}?subject=Free Sample Request from ${encodeURIComponent(name)}&body=Cloud Link: ${encodeURIComponent(cloudLink)}`}
                        className="inline-flex items-center gap-1.5 text-[#C5A880] hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email photos directly</span>
                      </a>
                      {hasWhatsApp() && whatsappFallback && (
                        <a
                          href={whatsappFallback}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#C5A880] hover:underline"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send via WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Communication & Privacy Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappConsent}
                      onChange={(e) => setWhatsappConsent(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded-xs border-white/20 bg-[#242424] text-[#C5A880] focus:ring-[#C5A880] cursor-pointer"
                    />
                    <span className="text-[11px] text-[#FBF9F5]/70 leading-relaxed font-light">
                      I explicitly consent to receive sample design proofs via WhatsApp in addition to email (leave unchecked for email-only replies; adjust anytime in our{' '}
                      <a href="/preferences" target="_blank" rel="noopener noreferrer" className="underline text-[#C5A880] hover:text-white">
                        Preference Center
                      </a>
                      ).
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#111111] bg-[#FBF9F5] hover:bg-[#C5A880] transition-colors rounded-xs shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Request My Free Sample</span>
                        <ArrowRight className="w-4 h-4 text-[#111111] group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <span className="text-[11.5px] text-[#FBF9F5]/60 font-light italic">
                    No credit card required. No obligation.
                  </span>
                </div>
              </form>
            )}

            {/* Crucial Ethical Policy Caveats */}
            <div className="mt-8 pt-6 border-t border-[#FBF9F5]/10 flex flex-wrap items-center gap-4 text-[11px] text-[#FBF9F5]/60 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>One complimentary sample spread trial per new photography studio.</span>
              </div>
              <span className="text-[#C5A880]">&bull;</span>
              <span>Direct personal review by 2R Creations.</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
