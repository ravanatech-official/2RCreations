import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Check, BookMarked, Sparkles, Layers, Sliders, Scissors, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/services';
import { updateSEO } from '../utils/seo';

const SERVICE_ICONS: Record<string, any> = {
  'wedding-album-design': BookMarked,
  'pre-shoot-engagement': BookMarked,
  'photo-retouching': Sparkles,
  'album-layout-cover-design': Layers,
  'wedding-photo-editing': Sliders,
  'photo-manipulation': Scissors
};

export const ServicesIndexPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO({
      title: 'Album Design & Retouching Services | 2R Creations',
      description: 'Wedding album layout design, cover typography, pre-shoot monographs, photo retouching, culling, and object removal for photographers worldwide.',
      canonicalPath: '/services',
      ogImage: SERVICES[0]?.heroImage,
      ogImageAlt: '2R Creations Wedding Album Design & Fine Art Retouching Services',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' }
      ],
      structuredData: {
        '@type': 'CollectionPage',
        name: '2R Creations Services & Capabilities',
        url: 'https://2rcreations.com/services',
        mainEntity: {
          '@type': 'OfferCatalog',
          name: 'Studio Services',
          itemListElement: SERVICES.map((svc, idx) => ({
            '@type': 'Offer',
            position: idx + 1,
            itemOffered: {
              '@type': 'Service',
              name: svc.title,
              description: svc.tagline,
              url: `https://2rcreations.com/services/${svc.slug}`
            }
          }))
        }
      }
    });
  }, []);

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 bg-[#FBF9F5]">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-3 font-semibold">
            CAPABILITIES & EXPERTISE
          </span>
          <h1 className="type-hero-h1 text-[#111111] mb-4">
            Services Tailored for Photographers & Studios
          </h1>
          <p className="type-large-body text-[#242424]/75 font-light">
            From complete narrative wedding albums to fine-art photo retouching, every deliverable is crafted to elevated print-ready standards with 2–3 day typical turnaround.
          </p>
        </div>

        {/* 6 Services Grid — High-End Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 sm:mb-16">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.id] || BookMarked;
            const isPrimary = index === 0 || service.id === 'photo-retouching';

            return (
              <div
                key={service.id}
                className="group bg-[#FAF8F5] rounded-xs border border-[#242424]/10 hover:border-[#C5A880]/60 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Editorial Visual Frame */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={service.concepts[0]?.image || service.heroImage}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/30 to-transparent" />

                    {/* Top Status & Service Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="text-[8.5px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs rounded-xs border border-[#C5A880]/30 font-semibold">
                        {service.shortTitle}
                      </span>
                      {isPrimary && (
                        <span className="text-[8.5px] font-mono tracking-widest text-[#111111] uppercase px-2 py-0.5 bg-[#C5A880] rounded-xs font-semibold shadow-xs">
                          CORE SPECIALIZATION
                        </span>
                      )}
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
                      <span className="text-[9.5px] font-mono tracking-wider uppercase text-[#C5A880] block mb-0.5">
                        SERVICE SPECIFICATION
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-normal text-[#FBF9F5] leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content & Value Proposition */}
                  <div className="p-6">
                    <p className="text-[11px] font-mono text-[#C5A880] uppercase tracking-wider mb-2 font-medium">
                      {service.tagline}
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#242424]/75 font-light leading-relaxed mb-5">
                      {service.heroDescription}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2 pt-4 border-t border-[#242424]/8">
                      {service.whoItsFor.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#242424]/80">
                          <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                          <span className="font-light">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 border-t border-[#242424]/8 bg-[#F5F2EB]/50 flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-[#111111] group-hover:text-[#C5A880] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </Link>

                  <button
                    onClick={() => navigate(`/contact?project=${encodeURIComponent(service.title)}`)}
                    className="text-[11px] font-mono text-[#242424]/60 hover:text-[#111111] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Inquire &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Sample Callout */}
        <div className="p-5 sm:p-8 lg:p-10 bg-[#161616] text-[#FBF9F5] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#242424]/20 shadow-xl">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase block mb-2 font-semibold">
              COMPLIMENTARY TRIAL FOR PHOTOGRAPHERS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#FBF9F5] mb-2">
              Experience our narrative pacing risk-free.
            </h2>
            <p className="text-xs sm:text-sm text-[#FBF9F5]/75 font-light leading-relaxed">
              Send us 4–8 photographs from your recent wedding or engagement gallery. We’ll design a custom 2-spread layout with zero upfront commitment.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact?sample=true')}
            className="w-full md:w-auto px-6 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#111111] bg-[#FBF9F5] hover:bg-[#C5A880] rounded-xs shrink-0 shadow-md cursor-pointer transition-colors text-center"
          >
            Claim Free Sample Design &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
