import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  isCompact?: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ isCompact = false }) => {
  const allFaqs: FAQItem[] = [
    {
      question: 'How long does an album usually take?',
      answer: 'Typical projects are completed in around 2–3 days depending on scope and spread requirements.'
    },
    {
      question: 'Can you work with different wedding styles?',
      answer: 'Yes—traditional, modern, luxury, Indian, Sri Lankan, Western, editorial and other visual directions.'
    },
    {
      question: 'Do I select the photographs?',
      answer: 'You provide the selected photographs. If you need assistance narrowing down an extensive gallery into a coherent story arc, curation guidance is also available upon request.'
    },
    {
      question: 'Do you accept urgent projects?',
      answer: 'Urgent requests may be accommodated depending on current workload and project requirements.'
    },
    {
      question: 'How do revisions work?',
      answer: 'Handled according to the agreed project scope, with clear, transparent communication throughout the design process.'
    },
    {
      question: 'Do you work with international photographers?',
      answer: 'Yes, the service is positioned for photographers and studios worldwide. Digital proofing, feedback rounds, and file transfers are managed smoothly via cloud channels, email, and WhatsApp.'
    }
  ];

  const faqs = isCompact ? allFaqs.slice(0, 4) : allFaqs;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 sm:py-24 bg-[#F8F6F0] border-t border-[#242424]/5">
      <div className="max-w-4xl 2xl:max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#C5A880] uppercase block mb-3">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="type-section-h2 text-[#111111] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="type-large-body text-[#242424]/75">
            Direct answers to common questions about collaboration, turnaround times, and album design scope.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-[#FAF8F5] border border-[#242424]/8 rounded-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between gap-3 sm:gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] sm:text-[18px] font-semibold tracking-tight text-[#111111]">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-full bg-[#F5F2EB] text-[#C5A880] shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1.5 type-normal-body text-[#242424]/80 border-t border-[#242424]/5 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isCompact && (
          <div className="mt-10 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#C5A880] transition-colors border-b border-[#111111]/20 hover:border-[#C5A880] pb-1"
            >
              <span>View All Frequently Asked Questions</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};
