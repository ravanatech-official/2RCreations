import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowUpRight,
  Copy,
  Check
} from 'lucide-react';
import { analytics } from '../services/analytics';
import { STUDIO_CONFIG, getGmailComposeUrl } from '../config';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(STUDIO_CONFIG.email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = STUDIO_CONFIG.email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedEmail(true);
      analytics.emailClick('footer_copy');
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <footer id="main-footer" className="bg-[#D7BC97] text-[#1A1512] border-t border-[#C2A57E] pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#C2A57E]">
          
          {/* Col 1: Wordmark & Positioning */}
          <div className="lg:col-span-6">
            <Link to="/" className="inline-flex items-center gap-3.5 group focus:outline-none mb-6">
              <img
                src="/assets/images/2r-black-logo.jpg"
                alt="2R Creations Emblem"
                className="h-14 w-auto object-contain rounded-xs border border-[#1A1512]/20 shadow-xs group-hover:scale-[1.02] transition-transform duration-200"
              />
              <span 
                className="text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#1A1512] group-hover:text-[#644622] transition-colors leading-none"
                style={{ fontFamily: "'Cinzel', 'Bodoni Moda', serif" }}
              >
                2R CREATIONS
              </span>
            </Link>

            <p className="text-sm text-[#1A1512]/80 font-light leading-relaxed max-w-sm mb-6">
              Story-driven wedding album design crafted for photographers and studios worldwide. Every photograph has a place. Every spread has a purpose.
            </p>

            <div className="flex items-center gap-2.5 text-xs text-[#1A1512]/90 font-mono">
              <Mail className="w-3.5 h-3.5 text-[#1A1512] shrink-0" />
              <a
                href={getGmailComposeUrl('Wedding Album Design Inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.emailClick('footer_gmail')}
                className="hover:text-[#644622] transition-colors font-medium underline underline-offset-2"
                title="Click to compose directly in Gmail"
              >
                {STUDIO_CONFIG.email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-[#1A1512]/10 hover:bg-[#1A1512]/15 text-[#1A1512] transition-colors cursor-pointer text-[10px]"
                title="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span className="text-emerald-800 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#1A1512]/70" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A1512] mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5 text-xs tracking-wider uppercase font-semibold text-[#1A1512]/85">
              <li>
                <Link to="/portfolio" className="hover:text-[#644622] transition-colors">
                  Portfolio (Concepts)
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#644622] transition-colors">
                  Gallery (Selected Work)
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#644622] transition-colors">
                  Services & Capabilities
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#644622] transition-colors">
                  About 2R Creations
                </Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-[#644622] transition-colors">
                  Design Process
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#644622] transition-colors">
                  FAQ & Lab Sizing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#644622] transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Social Channels (only active/configured channels shown) */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A1512] mb-4">
              Connect & Channels
            </p>
            <ul className="space-y-2.5 text-xs font-medium text-[#1A1512]/85">
              {[
                { label: 'Instagram', url: STUDIO_CONFIG.socialLinks.instagram },
                { label: 'TikTok', url: STUDIO_CONFIG.socialLinks.tiktok },
                { label: 'Behance', url: STUDIO_CONFIG.socialLinks.behance },
                { label: 'Pinterest', url: STUDIO_CONFIG.socialLinks.pinterest },
                { label: 'Facebook', url: STUDIO_CONFIG.socialLinks.facebook },
                { label: 'LinkedIn', url: STUDIO_CONFIG.socialLinks.linkedin },
                { label: 'Fiverr Pro', url: STUDIO_CONFIG.socialLinks.fiverr },
                { label: 'YouTube', url: STUDIO_CONFIG.socialLinks.youtube },
              ]
                .filter((channel) => Boolean(channel.url && channel.url.trim()))
                .map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#644622] transition-colors flex items-center justify-between group max-w-[180px]"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {channel.label}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Privacy & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#1A1512]/70 font-normal">
          <div>
            <p className="text-[#1A1512]/85 font-medium">
              &copy; 2026 2R Creations. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] uppercase tracking-wider font-semibold">
            <Link 
              to="/privacy"
              className="hover:text-[#644622] transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/client-image-policy"
              className="hover:text-[#644622] transition-colors cursor-pointer"
            >
              Client Image Terms
            </Link>
            <Link 
              to="/terms"
              className="hover:text-[#644622] transition-colors cursor-pointer"
            >
              Terms of Service
            </Link>
            <Link
              to="/preferences"
              className="text-[#644622] hover:text-[#1A1512] transition-colors underline underline-offset-4 cursor-pointer"
            >
              Privacy Preferences &amp; Opt-Out
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
