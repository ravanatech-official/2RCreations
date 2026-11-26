import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Mail, Award, Clock, BookCheck, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { STUDIO_CONFIG, getWhatsAppUrl, hasWhatsApp, getGmailComposeUrl } from '../config';

interface AboutSectionProps {
  isPreview?: boolean;
  headingAs?: 'h1' | 'h2';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isPreview = false, headingAs = 'h2' }) => {
  const HeadingTag = headingAs;
  const whatsappUrl = getWhatsAppUrl();

  return (
    <section id="about-section" className="py-16 sm:py-24 lg:py-32 bg-[#FBF9F5] border-t border-[#242424]/5 overflow-x-clip">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative max-w-md mx-auto">
              
              {/* Editorial Frame with 4:5 aspect ratio */}
              <div className="relative aspect-[4/5] rounded-xs overflow-hidden bg-[#EAE5DC] border border-[#242424]/10 shadow-md group">
                <img
                  src={STUDIO_CONFIG.aboutImage}
                  alt="2R Creations Designer & Founder"
                  className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[1.01] transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                
                {/* Subtle bottom gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Caption overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-[#FBF9F5] pointer-events-none">
                  <p className="font-serif text-2xl font-normal tracking-tight leading-tight">
                    Sachini Fernando
                  </p>
                  <p className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase mt-1">
                    DESIGNER & FOUNDER · 2R CREATIONS
                  </p>
                </div>
              </div>

              {/* Restrained accent offset border */}
              <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-full h-full border border-[#C5A880]/30 rounded-xs -z-10 pointer-events-none" />

            </div>
          </div>

          {/* Biography & Philosophy Column */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.2em] text-[#C5A880] uppercase block mb-3 font-mono">
              ABOUT ME
            </span>
            
            <div className="mb-1">
              <HeadingTag className="type-section-h2 text-[#111111] mb-1 font-serif tracking-tight">
                SACHINI FERNANDO
              </HeadingTag>
              <p className="text-[13px] sm:text-[14px] uppercase tracking-[0.15em] text-[#C5A880] font-medium font-mono">
                Professional Album Designer | High End Retoucher
              </p>
            </div>

            <div className="w-10 h-[1px] bg-[#C5A880] my-5" />

            {/* Approved Core Credo Quote */}
            <blockquote className="font-serif text-[19px] sm:text-[22px] text-[#111111]/90 italic font-normal leading-relaxed mb-6">
              &ldquo;I believe a wedding album should be more than a collection of photographs. It should bring the day back &mdash; the people, the emotions, the details and the moments that made it unforgettable.&rdquo;
            </blockquote>

            {/* Positioning Summary */}
            <p className="type-normal-body text-[#242424]/80 mb-8 leading-relaxed">
              2R Creations is a specialized studio dedicated to crafting narrative wedding albums for fine art photographers and studios worldwide. Every spread is engineered with architectural balance, intentional negative space, and deep cultural reverence.
            </p>

            {/* Factual Proof Points Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-[#242424]/10 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
                    {STUDIO_CONFIG.facts.experienceYears}
                  </span>
                </div>
                <p className="text-[11.5px] uppercase tracking-[0.06em] text-[#242424]/70 font-medium">
                  Years Experience
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookCheck className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
                    {STUDIO_CONFIG.facts.albumsDesigned}
                  </span>
                </div>
                <p className="text-[11.5px] uppercase tracking-[0.06em] text-[#242424]/70 font-medium">
                  Albums Designed
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
                    2–3
                  </span>
                </div>
                <p className="text-[11.5px] uppercase tracking-[0.06em] text-[#242424]/70 font-medium">
                  Day Typical Turnaround*
                </p>
              </div>
            </div>

            {/* Global Communication & Availability */}
            <div className="p-4 bg-[#F5F2EB] rounded-xs border border-[#242424]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12.5px] text-[#242424]/80">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span><strong>Worldwide Collaboration:</strong> {STUDIO_CONFIG.facts.globalReach}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium uppercase tracking-wide shrink-0 text-[#111111]">
                <a
                  href={getGmailComposeUrl('Studio Inquiry')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#C5A880] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Email Studio</span>
                </a>
                {hasWhatsApp() && whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors text-[#111111]"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            <p className="type-caption text-[#242424]/50 mt-3 italic">
              {STUDIO_CONFIG.facts.turnaroundFootnote}
            </p>

            {isPreview && (
              <div className="mt-8 pt-6 border-t border-[#242424]/10">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#C5A880] transition-colors border-b border-[#111111]/20 hover:border-[#C5A880] pb-1"
                >
                  <span>Read Full Studio Philosophy & Background</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </Link>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
