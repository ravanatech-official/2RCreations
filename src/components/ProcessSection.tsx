import React from 'react';
import { UploadCloud, Palette, Eye, PackageCheck } from 'lucide-react';

interface ProcessSectionProps {
  headingAs?: 'h1' | 'h2';
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ headingAs = 'h2' }) => {
  const HeadingTag = headingAs;
  const steps = [
    {
      step: '01',
      title: 'Send Your Photos',
      description: 'You provide the selected photographs and project details.',
      icon: UploadCloud
    },
    {
      step: '02',
      title: 'Design',
      description: 'I build the album around the story, style and visual direction.',
      icon: Palette
    },
    {
      step: '03',
      title: 'Review',
      description: 'You review the design and share required adjustments.',
      icon: Eye
    },
    {
      step: '04',
      title: 'Final Delivery',
      description: 'Final artwork is prepared for delivery/printing according to project requirements.',
      icon: PackageCheck
    }
  ];

  return (
    <section id="process-section" className="py-16 sm:py-24 bg-[#F8F6F0] border-t border-[#242424]/5">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#C5A880] uppercase block mb-3">
            HOW IT WORKS
          </span>
          <HeadingTag className="type-section-h2 text-[#111111] mb-4">
            A Straightforward Design Workflow
          </HeadingTag>
          <p className="type-large-body text-[#242424]/75">
            Eliminate project friction. Seamless collaboration designed to integrate directly into your studio schedule.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 relative">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="relative bg-[#FAF8F5] p-5 sm:p-7 rounded-sm border border-[#242424]/8 flex flex-col justify-between shadow-2xs hover:border-[#C5A880]/60 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[10.5px] font-semibold tracking-wider text-[#C5A880] bg-[#C5A880]/10 px-2.5 py-0.5 rounded-xs">
                      STEP {st.step}
                    </span>
                    <Icon className="w-4 h-4 text-[#242424]/40" />
                  </div>

                  <h3 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-[#111111] mb-2.5">
                    {st.title}
                  </h3>

                  <p className="text-[13.5px] text-[#242424]/75 leading-relaxed font-normal">
                    {st.description}
                  </p>
                </div>

                <div className="mt-7 pt-4 border-t border-[#242424]/5 flex items-center justify-between text-[11px] text-[#242424]/50 font-mono">
                  <span>PHASE {i + 1} OF 4</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
