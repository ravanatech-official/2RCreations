import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Mail, 
  AlertCircle,
  HelpCircle,
  FileText,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { STUDIO_CONFIG, getWhatsAppUrl, hasWhatsApp, getGmailComposeUrl, getMailtoUrl } from '../config';
import { submitLeadInquiry, LeadSubmissionResult } from '../services/leads';
import { analytics } from '../services/analytics';

interface ContactSectionProps {
  initialProjectType?: string;
  headingAs?: 'h1' | 'h2';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialProjectType, headingAs = 'h2' }) => {
  const HeadingTag = headingAs;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [projectType, setProjectType] = useState(initialProjectType || 'Wedding Album Design');
  const [message, setMessage] = useState('');
  const [samplePhotosLink, setSamplePhotosLink] = useState('');
  const [requestFreeSample, setRequestFreeSample] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LeadSubmissionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(STUDIO_CONFIG.email);
      } else {
        // Fallback for environments where clipboard API is restricted
        const textArea = document.createElement('textarea');
        textArea.value = STUDIO_CONFIG.email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedEmail(true);
      analytics.emailClick('copy_button');
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (err) {
      console.warn('Failed to copy email:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    analytics.contactSubmit(projectType);

    try {
      const result = await submitLeadInquiry({
        name,
        email,
        whatsapp,
        projectType,
        message,
        requestFreeSample,
        samplePhotosLink: samplePhotosLink.trim() || undefined,
        whatsappConsent,
        source: 'contact_form'
      }, honeypot);

      setSubmissionResult(result);

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.message || 'We couldn’t submit the enquiry right now.');
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMessage(`We couldn’t submit the enquiry right now. Please email us directly at ${STUDIO_CONFIG.email}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappInquiryUrl = getWhatsAppUrl(
    `Hi 2R Creations, I’m interested in your ${projectType} service. (Name: ${name || 'Prospective Client'})`
  );

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-[#F5F2EB] border-t border-[#242424]/10 scroll-mt-20">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Studio Editorial & Direct Contact */}
          <div className="lg:col-span-5 flex flex-col justify-between min-w-0">
            <div>
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-3 font-semibold">
                START A CONVERSATION
              </span>
              <HeadingTag className="type-section-h2 text-[#111111] mb-5">
                Let’s create something lasting together.
              </HeadingTag>
              <p className="text-sm sm:text-base text-[#242424]/75 font-light leading-relaxed mb-8">
                Whether you’re a wedding photographer looking to outsource album production, or a couple desiring a custom heirloom book, we’d love to review your timeline and gallery scope.
              </p>

              {/* Direct channels */}
              <div className="space-y-3.5 mb-8">
                {/* WhatsApp direct (only if configured) */}
                {hasWhatsApp() && whatsappInquiryUrl && (
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.whatsappClick('contact_direct')}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs hover:border-[#C5A880] hover:shadow-xs transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xs bg-[#25D366]/15 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                        <WhatsAppIcon className="w-5 h-5 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#111111]">
                          WhatsApp Direct
                        </p>
                        <p className="text-xs text-[#242424]/70 font-mono truncate">
                          +94 72 638 7340 &bull; Instant Response
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#111111] group-hover:text-[#C5A880] flex items-center gap-1 whitespace-nowrap ml-auto">
                      Open WhatsApp &rarr;
                    </span>
                  </a>
                )}

                {/* Email Direct Channel with Direct Gmail & Copy options */}
                <div className="p-4 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs hover:border-[#C5A880] hover:shadow-xs transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xs bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#111111]">
                          Direct Email
                        </p>
                        <p className="text-xs text-[#242424]/80 font-mono select-all break-all sm:break-normal">
                          {STUDIO_CONFIG.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      title="Copy email address"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-xs border border-[#242424]/15 hover:border-[#111111] bg-white transition-colors cursor-pointer text-[#111111] shrink-0"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#242424]/60" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action buttons: Open in Gmail & Mail App */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-[#242424]/8">
                    <a
                      href={getGmailComposeUrl('Wedding Album Design Inquiry')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analytics.emailClick('contact_gmail')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#EA4335] hover:bg-[#d93025] text-white text-xs font-semibold rounded-xs transition-colors shadow-xs group"
                    >
                      <span>Open in Gmail</span>
                      <ExternalLink className="w-3 h-3 opacity-80 group-hover:opacity-100" />
                    </a>
                    <a
                      href={getMailtoUrl('Wedding Album Design Inquiry')}
                      onClick={() => analytics.emailClick('contact_mailto')}
                      className="inline-flex items-center justify-center px-3 py-2 bg-white hover:bg-[#F0ECE1] text-[#242424] text-xs font-medium border border-[#242424]/15 rounded-xs transition-colors"
                      title="Open in your computer's default Mail app (Outlook, Apple Mail, etc.)"
                    >
                      <span>Mail App</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Worldwide Collaboration note */}
              <div className="p-4 bg-[#FAF8F5] rounded-xs text-xs text-[#242424]/75 leading-relaxed border border-[#242424]/8">
                <p className="font-semibold text-[#111111] mb-1">Worldwide Collaboration</p>
                <p>{STUDIO_CONFIG.facts.globalReach}</p>
                <p className="text-[11px] text-[#242424]/50 mt-2">
                  {STUDIO_CONFIG.facts.typicalTurnaround} {STUDIO_CONFIG.facts.turnaroundFootnote}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-5 sm:p-8 lg:p-10 rounded-xs border border-[#242424]/10 shadow-xs min-w-0">
            {submitted && submissionResult?.success ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-full bg-[#C5A880]/15 text-[#C5A880] flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-medium text-[#111111] mb-3">
                  Thank You for Reaching Out
                </h3>
                <p className="text-sm sm:text-base text-[#242424]/80 max-w-md mx-auto mb-6 leading-relaxed">
                  {submissionResult.message}
                </p>

                <div className="p-4 bg-[#F5F2EB] rounded-xs max-w-md mx-auto mb-8 text-xs text-[#242424]/70">
                  <p className="font-semibold text-[#111111] mb-1">Direct Follow-up:</p>
                  <p>A designer from 2R Creations will review your project details and reply within 24 hours.</p>
                  {hasWhatsApp() && whatsappInquiryUrl && (
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#111111] hover:text-[#C5A880] mt-2 underline cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      Continue on WhatsApp &rarr;
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmissionResult(null);
                    setName('');
                    setEmail('');
                    setWhatsapp('');
                    setMessage('');
                    setSamplePhotosLink('');
                  }}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] border border-[#242424]/20 hover:border-[#111111] rounded-xs cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-[#111111] mb-1">
                    Project Inquiry Form
                  </h3>
                  <p className="text-xs text-[#242424]/60">
                    Fill out the details below to receive a custom project scope and turnaround timeline.
                  </p>
                </div>

                {/* Honest error alert if submission failed */}
                {errorMessage && (
                  <div role="alert" aria-live="polite" className="p-4 bg-red-50/90 border border-red-200 rounded-xs text-xs text-red-900 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">We couldn’t submit the enquiry right now.</p>
                      <p className="text-red-800 leading-relaxed mb-2">
                        {errorMessage} Your entered details have been preserved below so you won’t lose your notes.
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={`mailto:${STUDIO_CONFIG.email}?subject=Project%20Inquiry%20from%20${encodeURIComponent(name || 'Website')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${whatsapp}\nProject: ${projectType}\nDetails: ${message}\nLink: ${samplePhotosLink}`)}`}
                          className="font-semibold underline hover:text-red-700"
                        >
                          Email your inquiry directly &rarr;
                        </a>
                        {hasWhatsApp() && whatsappInquiryUrl && (
                          <a
                            href={whatsappInquiryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline hover:text-red-700"
                          >
                            Or send via WhatsApp &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Honeypot field (hidden from users, traps automated spambots) */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="company_website_url_check">Do not fill this field</label>
                  <input
                    id="company_website_url_check"
                    type="text"
                    name="company_website_url_check"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                      Your Name / Studio <span className="text-[#C5A880]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={120}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova or Fine Art Photography"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#C5A880] text-[#111111] placeholder:text-[#242424]/30"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                      Email Address <span className="text-[#C5A880]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      maxLength={200}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="studio@example.com"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#C5A880] text-[#111111] placeholder:text-[#242424]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone / WhatsApp */}
                  <div>
                    <label htmlFor="contact-whatsapp" className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                      Phone / WhatsApp <span className="text-[#C5A880]">*</span>
                    </label>
                    <input
                      id="contact-whatsapp"
                      type="tel"
                      required
                      maxLength={50}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+1 (555) 012-3456"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#C5A880] text-[#111111] placeholder:text-[#242424]/30"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label htmlFor="contact-project-type" className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                      Service Requirement <span className="text-[#C5A880]">*</span>
                    </label>
                    <select
                      id="contact-project-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#C5A880] text-[#111111]"
                    >
                      <option value="Wedding Album Design">Wedding Album Design (Full Heirloom)</option>
                      <option value="Pre-Shoot & Engagement Album Design">Pre-Shoot & Engagement Album Design</option>
                      <option value="Photo Retouching & Color Correction">Photo Retouching & Color Correction</option>
                      <option value="Album Layout & Cover Design">Album Layout & Cover Design (Foil/Emboss)</option>
                      <option value="Wedding Photo Editing & Culling">Wedding Photo Editing & Culling</option>
                      <option value="Photo Manipulation & Object Removal">Photo Manipulation & Object Removal</option>
                      <option value="Studio Retainer Partnership">Studio Retainer / Ongoing Volume Partnership</option>
                    </select>
                  </div>
                </div>

                {/* Free Sample Request Checkbox */}
                <div className="p-4 bg-[#F5F2EB] rounded-xs border border-[#C5A880]/30 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestFreeSample}
                      onChange={(e) => setRequestFreeSample(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded-xs border-[#242424]/30 text-[#C5A880] focus:ring-[#C5A880] cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] block">
                        Include Complimentary 2-Spread Sample Design
                      </span>
                      <p className="text-[11px] text-[#242424]/70 leading-relaxed mt-0.5">
                        Send 4–8 photographs to test our editorial narrative pacing risk-free before placing a full album order.
                      </p>
                    </div>
                  </label>

                  {requestFreeSample && (
                    <div className="pt-2 animate-fadeIn">
                      <label htmlFor="contact-sample-link" className="block text-[11px] font-medium text-[#111111] mb-1">
                        Gallery or Cloud Folder Link (Google Drive, Dropbox, Pixieset, WeTransfer)
                      </label>
                      <input
                        id="contact-sample-link"
                        type="url"
                        pattern="https://.*"
                        title="Please enter a secure https:// cloud folder link (Google Drive, Dropbox, Pixieset, WeTransfer)"
                        maxLength={500}
                        value={samplePhotosLink}
                        onChange={(e) => setSamplePhotosLink(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-2 text-xs bg-white border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#C5A880] text-[#111111]"
                      />
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                    Project Details & Timeline
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    maxLength={4000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the celebration, estimated spread count, preferred lab, and delivery deadline..."
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#242424]/20 rounded-xs focus:outline-none focus:border-[#C5A880] text-[#111111] placeholder:text-[#242424]/30 resize-none"
                  />
                </div>

                {/* Communication & WhatsApp Preference Consent */}
                <div className="pt-1 pb-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappConsent}
                      onChange={(e) => setWhatsappConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-xs border-[#242424]/30 text-[#111111] focus:ring-[#C5A880] cursor-pointer"
                    />
                    <span className="text-[11.5px] text-[#242424]/80 leading-relaxed font-light">
                      I explicitly consent to receive direct project updates and proof reviews via WhatsApp (leave unchecked if you prefer email-only replies; you may opt out anytime in our{' '}
                      <a href="/preferences" target="_blank" rel="noopener noreferrer" className="underline font-normal text-[#111111] hover:text-[#C5A880]">
                        Preference Center
                      </a>
                      ).
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#111111] hover:bg-[#C5A880] text-white hover:text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] rounded-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Send Project Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#242424]/50 leading-relaxed font-light">
                  Protected by privacy protocols. Real client photographs are strictly kept confidential and never shared.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
