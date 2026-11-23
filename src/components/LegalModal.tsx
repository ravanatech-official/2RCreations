import React from 'react';
import { X, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { LegalPageType } from '../types';

interface LegalModalProps {
  type: LegalPageType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111111]/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FAF8F5] border border-[#242424]/15 rounded-xs w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
      >
        {/* Header */}
        <div className="p-6 sm:px-8 border-b border-[#242424]/10 flex items-center justify-between bg-[#F5F2EB]">
          <div className="flex items-center gap-3">
            {type === 'privacy' && <Lock className="w-5 h-5 text-[#C5A880]" />}
            {type === 'client-image-policy' && <Shield className="w-5 h-5 text-[#C5A880]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#C5A880]" />}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] block">
                LEGAL & STUDIO POLICIES
              </span>
              <h3 id="legal-title" className="font-serif text-2xl font-medium text-[#111111]">
                {type === 'privacy' && 'Privacy Policy'}
                {type === 'client-image-policy' && 'Client Image Confidentiality Policy'}
                {type === 'terms' && 'Terms of Service & Collaboration'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xs text-[#242424]/60 hover:text-[#111111] hover:bg-[#242424]/5 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#242424]/85 leading-relaxed font-light">
          {type === 'privacy' && (
            <>
              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  1. Information We Collect
                </h4>
                <p>
                  2R Creations collects personal information provided directly by clients and prospective partners when filling out our project inquiry form or contacting us via email or WhatsApp. This includes your name, business or studio name, email address, phone or WhatsApp number, project specifications, and any shared image gallery links.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  2. Use of Information
                </h4>
                <p>
                  Information collected is strictly utilized to communicate project scopes, generate custom quotations, coordinate design proofs, and facilitate album file deliveries. We never sell, rent, lease, or monetize your contact or project information to third parties.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  3. Analytics & Usage Data
                </h4>
                <p>
                  We employ anonymous website analytics to gauge viewer interaction with our sample albums and portfolio layouts. This aggregate technical data helps improve navigation speed and visual layout presentation without identifying individual visitors.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  4. Data Security & Storage
                </h4>
                <p>
                  Inquiries and communications are handled with appropriate administrative and technical safeguards. Project files shared via cloud platforms (such as Google Drive, Dropbox, or WeTransfer) are stored in access-controlled environments strictly for the duration of the contracted design project.
                </p>
              </div>
            </>
          )}

          {type === 'client-image-policy' && (
            <>
              <div className="p-4 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-xs mb-4">
                <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-wider text-[#111111] mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                  <span>Core Confidentiality Guarantee</span>
                </div>
                <p className="text-xs text-[#242424]/80">
                  Client wedding photographs are never published, shared, or showcased publicly without express, prior written consent from the primary photographer or studio.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  1. Copyright & Image Ownership
                </h4>
                <p>
                  All copyrights, moral rights, and intellectual property in photographs provided by photographers or studios remain 100% the property of the originating photographer or their clients. 2R Creations provides design and sequencing services only and claims zero copyright over any client photographic assets.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  2. Demonstration Albums Integrity
                </h4>
                <p>
                  Albums showcased on this website are conceptual editorial design studies specifically prepared for portfolio display to illustrate narrative pacing, typography, spread architecture, and print-ready craftsmanship. Real client wedding galleries remain strictly confidential.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  3. Asset Retention & Deletion
                </h4>
                <p>
                  High-resolution photographic files, raw drafts, and working files provided for an album design engagement are archived for a maximum of 30 days following project completion and final print sign-off, after which they are securely deleted unless an extended archiving arrangement has been formally requested.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  1. Scope & Custom Quotations
                </h4>
                <p>
                  All album design projects are custom quoted according to spread count, deadline requirements, and required retouching depth. Turnaround estimates (typically 2–3 business days for first drafts) commence upon receipt of complete photo assets, album dimensions, and specifications.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  2. Review & Revision Workflow
                </h4>
                <p>
                  Revisions are handled collaboratively according to agreed project scope. Digital proofing links or spread PDF proofs will be provided for review. Adjustments (such as photo replacements, sequence realignment, and cropping adjustments) are carried out in structured review rounds.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  3. Final Deliverables & Print Preparation
                </h4>
                <p>
                  Final designs are exported to strict professional print specifications (300 DPI, specified bleed margins, color profiles: sRGB or Adobe RGB, and spread/page dimensions according to your designated print lab). The photographer or studio is responsible for verifying final print proofs before committing to large print runs.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#111111] mb-2">
                  4. Free Sample Offer Terms
                </h4>
                <p>
                  The complimentary 10-photo sample spread is provided on a promotional basis for new prospective photographer or studio partners (one sample per new studio inquiry). 2R Creations reserves the right to qualify requests based on current scheduling availability.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 bg-[#F5F2EB] border-t border-[#242424]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#111111] text-[#FBF9F5] hover:bg-[#242424] rounded-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
