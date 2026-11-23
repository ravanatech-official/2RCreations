import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { updateSEO } from '../utils/seo';
import { STUDIO_CONFIG } from '../config';

interface LegalPageProps {
  policy?: 'privacy' | 'client-image-policy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ policy }) => {
  const { policyType: paramPolicy } = useParams<{ policyType: string }>();
  const location = useLocation();

  // Normalize policy type from prop, param, or route path
  let activePolicy = policy || paramPolicy;
  if (!activePolicy) {
    if (location.pathname.includes('client-image-policy')) {
      activePolicy = 'client-image-policy';
    } else if (location.pathname.includes('terms')) {
      activePolicy = 'terms';
    } else {
      activePolicy = 'privacy';
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePolicy]);

  const renderContent = () => {
    switch (activePolicy) {
      case 'client-image-policy':
        updateSEO({
          title: 'Client Image Protection Policy | 2R CREATIONS',
          description: 'Our strict confidentiality standards for client wedding photographs and non-disclosure commitments.',
          canonicalPath: '/client-image-policy'
        });
        return (
          <article className="prose prose-neutral max-w-none text-[#242424]/85 leading-relaxed space-y-6">
            <div className="p-4 bg-[#F5F2EB] rounded-xs border border-[#C5A880]/30 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                <Shield className="w-4 h-4 text-[#C5A880]" />
                <span>Confidentiality Guarantee</span>
              </div>
              <p className="text-xs text-[#242424]/80 leading-relaxed font-light">
                2R Creations treats every client gallery with absolute privacy. We do not publish, license, or publicly display private client photographs without explicit, written studio authorization.
              </p>
            </div>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              1. Non-Disclosure & Private Storage
            </h2>
            <p>
              When photographers or couples share wedding galleries with 2R Creations via cloud services (Google Drive, Dropbox, Pixieset, WeTransfer), all files are used exclusively to design, proof, and export your ordered album spreads. Files are stored on encrypted local workstations and secure project servers.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              2. Conceptual Portfolio Separation
            </h2>
            <p>
              To respect client boundaries, the signature album concepts displayed on this website are conceptual studies created to demonstrate visual pacing, typography pairing, and narrative sequencing. Real client albums are delivered directly to the purchasing photographer or couple and remain private by default.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              3. Archival Retention & Deletion
            </h2>
            <p>
              We retain high-resolution project design files for up to 90 days after delivery to facilitate client re-orders, lab size adaptations, or cover adjustments. Upon client request, all raw image assets and project backups will be permanently purged from our systems.
            </p>
          </article>
        );

      case 'terms':
        updateSEO({
          title: 'Terms of Service | 2R CREATIONS',
          description: 'Terms and conditions governing album design orders, turnaround estimates, proofing revisions, and lab print exports.',
          canonicalPath: '/terms'
        });
        return (
          <article className="prose prose-neutral max-w-none text-[#242424]/85 leading-relaxed space-y-6">
            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              1. Scope of Design Services
            </h2>
            <p>
              2R Creations provides bespoke wedding album layout, cover typography, photo retouching, and production export services for digital print labs. We do not operate an in-house physical printing plant; final high-resolution files are formatted to your chosen print laboratory’s exact specifications.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              2. Turnaround Times
            </h2>
            <p>
              Our typical initial draft turnaround is 2–3 business days for standard albums (up to 30 spreads). Larger volume orders, peak season queues, or extensive frequency-separation retouching requests may require extended schedules, which will always be confirmed in your project scope before commencement.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              3. Proofing & Revision Protocol
            </h2>
            <p>
              Revisions are handled according to the scope of each project. We provide digital proofing links where clients can request image swaps, layout shifts, or caption tweaks. Once final print files are approved and delivered, additional modifications may be subject to minor revision fees.
            </p>
          </article>
        );

      case 'privacy':
      default:
        updateSEO({
          title: 'Privacy Policy | 2R CREATIONS',
          description: 'How 2R Creations collects, protects, and handles contact form submissions and inquiry details.',
          canonicalPath: '/privacy'
        });
        return (
          <article className="prose prose-neutral max-w-none text-[#242424]/85 leading-relaxed space-y-6">
            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p>
              When you submit a project inquiry or contact us via our website, we collect your name, email address, phone/WhatsApp number, project requirements, and optional sample links. This information is used solely to respond to your inquiry and deliver project estimates.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              2. No Data Selling or Unsolicited Marketing
            </h2>
            <p>
              We do not sell, rent, or lease your personal information to third parties. We do not send unsolicited marketing email blasts. Communication is strictly one-on-one regarding your specific design projects.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              3. Analytics &amp; Cookies
            </h2>
            <p>
              We utilize privacy-friendly analytics (Google Analytics 4) to understand aggregate visitor traffic, album viewer engagement, and device performance. IP anonymization is applied, and you can freely disable non-essential cookies at any time via our Privacy Preference Center.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              4. WhatsApp Communication Policy &amp; Opt-Out
            </h2>
            <p>
              Under our zero-spam commitment and in compliance with GDPR Article 7, TCPA § 227, and Meta’s WhatsApp Business Policy, we only contact clients via WhatsApp when requested for project scope discussions or proof revisions. You have the unconditional right to withdraw consent at any time. Simply reply <code>STOP</code> to any WhatsApp chat or visit our <Link to="/preferences" className="underline font-semibold text-[#111111] hover:text-[#C5A880]">Privacy Preference Center</Link> to log an instant 1-click opt-out.
            </p>

            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-8 mb-4">
              5. Your Data Subject Rights (GDPR &amp; CCPA)
            </h2>
            <p>
              You maintain full legal rights under the EU GDPR and California CCPA, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#242424]/80">
              <li><strong>Right of Access &amp; Portability:</strong> Request a copy of all data and project notes linked to your email.</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request permanent purging of all inquiries, contact numbers, and cloud links from our database.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate contact records.</li>
            </ul>
            <div className="pt-4">
              <Link
                to="/preferences"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#C5A880] text-white hover:text-[#111111] text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors"
              >
                <span>Launch Privacy Preference Center &rarr;</span>
              </Link>
            </div>
          </article>
        );
    }
  };

  const getTitle = () => {
    switch (activePolicy) {
      case 'client-image-policy': return 'Client Image Protection Policy';
      case 'terms': return 'Terms of Service & Collaboration';
      case 'privacy':
      default: return 'Privacy Policy';
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#FBF9F5]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Navigation back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]/60 hover:text-[#111111] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Policy Selector Tabs */}
        <div className="flex flex-wrap items-center gap-3 pb-4 mb-8 border-b border-[#242424]/10 text-xs font-mono uppercase tracking-wider">
          <Link
            to="/privacy"
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activePolicy === 'privacy' 
                ? 'bg-[#111111] text-[#FBF9F5]' 
                : 'text-[#242424]/60 hover:text-[#111111]'
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/client-image-policy"
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activePolicy === 'client-image-policy' 
                ? 'bg-[#111111] text-[#FBF9F5]' 
                : 'text-[#242424]/60 hover:text-[#111111]'
            }`}
          >
            Client Image Protection
          </Link>
          <Link
            to="/terms"
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activePolicy === 'terms' 
                ? 'bg-[#111111] text-[#FBF9F5]' 
                : 'text-[#242424]/60 hover:text-[#111111]'
            }`}
          >
            Terms of Service
          </Link>
          <Link
            to="/preferences"
            className="px-3 py-1.5 rounded-xs text-[#644622] hover:text-[#111111] transition-colors border border-[#C5A880]/30 hover:border-[#C5A880] ml-auto font-semibold"
          >
            Preferences &amp; Opt-Out &rarr;
          </Link>
        </div>

        {/* Main Document Body */}
        <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-xs border border-[#242424]/10 shadow-2xs">
          <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase block mb-2 font-semibold">
            LEGAL & STUDIO PROTOCOLS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] mb-6">
            {getTitle()}
          </h1>
          <p className="text-xs font-mono text-[#242424]/50 mb-8 pb-4 border-b border-[#242424]/10">
            Last Updated: March 2026 &bull; 2R CREATIONS
          </p>

          {renderContent()}
        </div>

      </div>
    </div>
  );
};
