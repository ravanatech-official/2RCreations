import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { PrivacyPreferenceCenter } from '../components/PrivacyPreferenceCenter';
import { STUDIO_CONFIG } from '../config';

export const PreferencesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Preferences & WhatsApp Opt-Out | 2R Creations';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#242424] pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#242424]/60 uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-[#111111] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold">Privacy Preferences</span>
        </div>

        {/* Page Editorial Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-xs mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#644622]" />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-[#644622]">
              DATA SOVEREIGNTY &amp; COMMUNICATION GOVERNANCE
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#111111] leading-tight mb-4">
            Privacy Preference Center &amp; WhatsApp Opt-Out
          </h1>

          <p className="text-sm sm:text-base text-[#242424]/75 font-light leading-relaxed max-w-2xl">
            You maintain complete autonomy over how 2R Creations communicates with you and uses local browser tokens. Adjust your cookie governance, submit an instant WhatsApp opt-out, or request data export and erasure below.
          </p>
        </div>

        {/* Embedded Preference Center Component */}
        <div className="mb-16">
          <PrivacyPreferenceCenter isPageEmbed={true} />
        </div>

        {/* Additional Regulatory Trust & FAQ Section */}
        <div className="border-t border-[#242424]/10 pt-12">
          <h2 className="font-serif text-2xl font-normal text-[#111111] mb-6">
            Frequently Asked Questions Regarding Client Privacy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs">
              <h3 className="font-serif text-base font-medium text-[#111111] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                What happens when I opt out of WhatsApp?
              </h3>
              <p className="text-xs text-[#242424]/70 font-light leading-relaxed">
                Your phone number is instantly flagged on our internal suppression registry. You will receive no broadcast announcements, sample notifications, or promotional messages. Ongoing active album reviews will transition exclusively to your registered email address.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs">
              <h3 className="font-serif text-base font-medium text-[#111111] mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C5A880]" />
                How are client wedding photos protected?
              </h3>
              <p className="text-xs text-[#242424]/70 font-light leading-relaxed">
                As detailed in our <Link to="/client-image-policy" className="underline font-medium text-[#111111]">Client Image Terms</Link>, all high-resolution raw wedding files and finished album spreads remain your absolute intellectual property. We never publish couple images to public galleries or social channels without prior written consent.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs">
              <h3 className="font-serif text-base font-medium text-[#111111] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C5A880]" />
                How quickly are Data Erasure requests fulfilled?
              </h3>
              <p className="text-xs text-[#242424]/70 font-light leading-relaxed">
                In strict accordance with GDPR Article 17 ("Right to be Forgotten"), erasure requests submitted through this portal are logged directly to our audit database and executed by our data controller within 72 business hours.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs">
              <h3 className="font-serif text-base font-medium text-[#111111] mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                How can I reach your Data Controller directly?
              </h3>
              <p className="text-xs text-[#242424]/70 font-light leading-relaxed">
                For urgent inquiries or legal notices, you can write directly to our data privacy officer at <a href={`mailto:${STUDIO_CONFIG.email}`} className="underline font-medium text-[#111111]">{STUDIO_CONFIG.email}</a> with the subject line <em>"Privacy Rights Notice"</em>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
