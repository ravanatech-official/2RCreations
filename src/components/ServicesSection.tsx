import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/services';
import { analytics } from '../services/analytics';

interface ServicesSectionProps {
  onStartProject?: (serviceName?: string) => void;
  isCompact?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ isCompact = false }) => {
  const navigate = useNavigate();

  return (
    <section id="services-section" className="py-24 bg-[#FBF9F5] border-t border-[#242424]/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#C5A880] uppercase block mb-3 font-mono">
              STUDIO SERVICES
            </span>
            <h2 className="type-section-h2 text-[#111111] mb-3">
              Specialized Wedding Post-Production & Album Design
            </h2>
            <p className="type-normal-body text-[#242424]/75">
              Every deliverable is crafted to elevated print-ready standards with bespoke typography, negative space balance, and reliable turnaround.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#C5A880] transition-colors shrink-0 pb-1 border-b border-[#111111]/20 hover:border-[#C5A880]"
          >
            <span>View All Service Specifications</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
          </Link>
        </div>

        {/* 6 Services Grid — Home service card format */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-[#FAF8F5] border border-[#242424]/10 rounded-xs overflow-hidden flex flex-col justify-between hover:border-[#C5A880]/60 transition-all duration-300 group shadow-2xs"
            >
              <div>
                {/* Dedicated Conceptual Visual */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE5DC]">
                  <img
                    src={service.concepts[0]?.image || service.heroImage}
                    alt={`${service.title} Conceptual Visual`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Conceptual Artwork tag */}
                  <span className="absolute top-3 left-3 text-[8px] font-mono tracking-widest text-[#C5A880] uppercase px-2 py-0.5 bg-black/80 rounded-xs">
                    CONCEPTUAL EXAMPLE
                  </span>
                  
                  <span className="absolute bottom-3 left-3 text-[9px] font-mono tracking-widest text-white/90 uppercase px-2 py-0.5 bg-black/70 rounded-xs">
                    {service.shortTitle}
                  </span>
                </div>

                <div className="p-6">
                  {/* H3 */}
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-2 group-hover:text-[#C5A880] transition-colors">
                    {service.title}
                  </h3>

                  {/* One concise sentence */}
                  <p className="text-xs sm:text-[13px] text-[#242424]/75 font-light leading-relaxed mb-4">
                    {service.tagline}
                  </p>
                </div>
              </div>

              {/* Explore Service CTA */}
              <div className="px-6 pb-6 pt-2 border-t border-[#242424]/6 flex items-center justify-between">
                <Link
                  to={`/services/${service.slug}`}
                  onClick={() => analytics.projectCtaClick(`service_explore_${service.slug}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] group-hover:text-[#C5A880] transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => navigate(`/contact?project=${encodeURIComponent(service.title)}`)}
                  className="text-[11px] font-mono text-[#242424]/50 hover:text-[#111111] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Inquire &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
