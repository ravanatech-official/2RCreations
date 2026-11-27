import React from 'react';
import { Compass, Sparkles, Clock, Users } from 'lucide-react';

export const WhyChoose: React.FC = () => {
  const points = [
    {
      num: '01',
      title: 'Pacing & Breathing Room',
      description: 'Not overcrowded collage grids. Spreads designed with editorial rhythm, intentional hierarchy, and white-space tranquility.',
      icon: Compass
    },
    {
      num: '02',
      title: 'Cultural & Ceremonial Fluency',
      description: 'Deep understanding of wedding traditions, sacred rituals, family hierarchy, and ceremonial solemnity across diverse heritages.',
      icon: Sparkles
    },
    {
      num: '03',
      title: 'Fast & Predictable Turnaround',
      description: 'Typical projects completed in 2–3 days* without compromising alignment, color consistency, or print lab safe margins.',
      icon: Clock
    },
    {
      num: '04',
      title: 'Stress-Free Outsourcing',
      description: 'Shoot more, deliver faster, and protect your client experience. A reliable post-production partner who works to your studio standards.',
      icon: Users
    }
  ];

  return (
    <section id="why-section" className="py-24 bg-[#F8F6F0] border-t border-[#242424]/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="max-w-3xl mb-14">
          <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#C5A880] uppercase block mb-3 font-mono">
            WHY 2R CREATIONS
          </span>
          <h2 className="type-section-h2 text-[#111111] mb-4">
            A Specialist Album Designer, Not an Automated Editing Factory.
          </h2>
          <p className="type-large-body text-[#242424]/80">
            A dedicated design partnership built to help photographers and studios deliver timeless, print-ready heirloom albums without losing weeks at the editing desk.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.num}
                className="bg-[#FAF8F5] p-7 rounded-sm border border-[#242424]/8 flex flex-col justify-between hover:border-[#C5A880]/50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[11.5px] font-semibold tracking-wider text-[#C5A880]">
                      {pt.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#242424]/40" />
                  </div>
                  <h3 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-[#111111] mb-2.5">
                    {pt.title}
                  </h3>
                  <p className="text-[13.5px] sm:text-[14px] text-[#242424]/75 leading-relaxed font-light">
                    {pt.description}
                  </p>
                </div>

                <div className="w-8 h-[1px] bg-[#C5A880]/30 mt-7" />
              </div>
            );
          })}
        </div>

        {/* Revisions & Scope Note */}
        <div className="mt-12 pt-6 border-t border-[#242424]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-[#242424]/65">
          <p>
            * Turnaround times vary based on album spread count, seasonal peak periods, and custom retouching needs.
          </p>
          <p className="italic">
            Revisions are handled according to the scope of each project, with clear communication throughout the design process.
          </p>
        </div>

      </div>
    </section>
  );
};
