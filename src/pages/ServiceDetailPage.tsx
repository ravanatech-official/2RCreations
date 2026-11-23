import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, ArrowRight, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { getServiceBySlug, SERVICES } from '../data/services';
import { updateSEO } from '../utils/seo';
import { STUDIO_CONFIG, getWhatsAppUrl, hasWhatsApp, getGmailComposeUrl } from '../config';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

interface ServiceDetailPageProps {
  onOpenRetouching?: (studyId: string, slideNumber?: number) => void;
}

const RETOUCHING_LAB_STUDIES = [
  {
    id: 'study-natural-skin',
    tabLabel: '01. Skin & Portrait',
    kicker: 'INTERACTIVE LAB STUDY · 3-FRAME SESSION CONSISTENCY',
    heading: 'Restrained Polish. Authentic Pore Architecture.',
    description:
      'Automated smoothing destroys the fine micro-texture that makes printed wedding portraits feel alive. Inspect all three angles from the same studio session to see how our manual frequency separation calms blemishes, redness, and T-zone shine while maintaining identical skin warmth and natural pore fidelity across every frame.',
    bullets: [
      '100% natural skin pore structure preserved for large-format prints',
      'Consistent skin tone warmth & luminance across multiple poses',
      'Dimensional hair luster, under-eye balance & collarbone clean-up',
      'Zero plastic blur or artificial AI facial alteration',
    ],
    frames: [
      {
        id: 'pose-1',
        label: '01. Profile',
        beforeImage: '/assets/services/photo-retouching/portrait-skin-before.webp',
        afterImage: '/assets/services/photo-retouching/portrait-skin-after.webp',
      },
      {
        id: 'pose-2',
        label: '02. Direct',
        beforeImage: '/assets/services/photo-retouching/portrait-skin-02-before.webp',
        afterImage: '/assets/services/photo-retouching/portrait-skin-02-after.webp',
      },
      {
        id: 'pose-3',
        label: '03. Seated',
        beforeImage: '/assets/services/photo-retouching/portrait-skin-03-before.webp',
        afterImage: '/assets/services/photo-retouching/portrait-skin-03-after.webp',
      },
    ],
  },
  {
    id: 'study-bridal-gown',
    tabLabel: '02. Bridal Regalia',
    kicker: 'INTERACTIVE LAB STUDY · BRIDAL BEAUTY & REGALIA',
    heading: 'Luminous Bridal Tone. Crisp Heirloom Regalia.',
    description:
      'Bridal getting-ready suites often mix warm indoor lighting with delicate ivory lace, pearls, and gold filigree. Drag the divider to inspect how we neutralize muddy yellow-green casts into a pearlescent bridal palette while calming cheek blemishes and sharpening heirloom jewelry.',
    bullets: [
      'Muddy indoor yellow-green cast neutralized to pearlescent bridal tone',
      'Cheek blemishes & specular shine calmed while keeping natural pores',
      'Crisp luster across pearl headpieces, gold jhumkas & choker filigree',
      'Clean ivory embroidery & delicate floral hair detail',
    ],
    frames: [
      {
        id: 'bridal-1',
        label: '01. Close-Up',
        beforeImage: '/assets/services/photo-retouching/bridal-regalia-01-before.webp',
        afterImage: '/assets/services/photo-retouching/bridal-regalia-01-after.webp',
      },
      {
        id: 'bridal-2',
        label: '02. Waist-Up',
        beforeImage: '/assets/services/photo-retouching/bridal-regalia-02-before.webp',
        afterImage: '/assets/services/photo-retouching/bridal-regalia-02-after.webp',
      },
      {
        id: 'bridal-3',
        label: '03. Profile',
        beforeImage: '/assets/services/photo-retouching/bridal-regalia-03-before.webp',
        afterImage: '/assets/services/photo-retouching/bridal-regalia-03-after.webp',
      },
    ],
    aspectClass: 'aspect-[2/3]',
    imagePositionClass: 'object-cover object-top',
  },
  {
    id: 'study-baby-portrait',
    tabLabel: '03. Baby & Child',
    kicker: 'INTERACTIVE LAB STUDY · 3-POSE BABY & MILESTONE SESSION',
    heading: 'Creamy Baby Skin. Pure Childhood Expression.',
    description:
      'Newborn and toddler skin requires the lightest possible retouching touch—heavy smoothing immediately makes children look artificial. Drag the divider to inspect how we gently lift temporary facial spots and marks while preserving soft natural dimples, warm creamy tones, and bright eye catchlights.',
    bullets: [
      'Gentle removal of temporary baby spots, scratches & dry marks',
      'Warm creamy skin tone with soft natural dimples preserved',
      'Sparkling eye catchlights & natural curl micro-contrast',
      'Zero plastic blur—100% authentic childhood expression',
    ],
    frames: [
      {
        id: 'baby-1',
        label: '01. Close-Up',
        beforeImage: '/assets/services/photo-retouching/baby-portrait-01-before.webp',
        afterImage: '/assets/services/photo-retouching/baby-portrait-01-after.webp',
        aspectClass: 'aspect-square',
        imagePositionClass: 'object-cover object-center',
      },
      {
        id: 'baby-2',
        label: '02. Candid Laugh',
        beforeImage: '/assets/services/photo-retouching/baby-portrait-02-before.webp',
        afterImage: '/assets/services/photo-retouching/baby-portrait-02-after.webp',
        aspectClass: 'aspect-[2/3]',
        imagePositionClass: 'object-cover object-top',
      },
      {
        id: 'baby-3',
        label: '03. Seated',
        beforeImage: '/assets/services/photo-retouching/baby-portrait-03-before.webp',
        afterImage: '/assets/services/photo-retouching/baby-portrait-03-after.webp',
        aspectClass: 'aspect-[2/3]',
        imagePositionClass: 'object-cover object-top',
      },
    ],
    aspectClass: 'aspect-square',
    imagePositionClass: 'object-cover object-center',
  },
];

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ onOpenRetouching }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = slug ? getServiceBySlug(slug) : undefined;
  const [activeLabStudyIdx, setActiveLabStudyIdx] = useState<number>(0);
  const [activePortraitFrame, setActivePortraitFrame] = useState<number>(0);

  useEffect(() => {
    if (service) {
      updateSEO({
        title: `${service.title} | 2R CREATIONS`,
        description: service.heroDescription,
        canonicalPath: `/services/${service.slug}`
      });
      window.scrollTo(0, 0);
    }
  }, [service]);

  if (!service) {
    return (
      <div className="pt-36 pb-24 text-center bg-[#FBF9F5] min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl font-medium text-[#111111] mb-3">Service Not Found</h1>
        <p className="text-sm text-[#242424]/70 mb-6">The requested service page could not be located.</p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-[#C5A880] rounded-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Services</span>
        </Link>
      </div>
    );
  }

  const whatsappUrl = getWhatsAppUrl(`Hi 2R Creations, I’d like to inquire about your ${service.title} service.`);

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F5]">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#242424]/60 hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Services</span>
        </Link>
      </div>

      {/* Hero Service Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16">
        <div className="max-w-3xl">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-3 font-semibold">
            SERVICE SPECIFICATIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#111111] leading-tight mb-3">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg text-[#C5A880] font-normal mb-6">
            {service.tagline}
          </p>
          <p className="text-sm sm:text-base text-[#242424]/80 font-light leading-relaxed mb-6">
            {service.heroDescription}
          </p>

          <div className="p-4 bg-[#F5F2EB] rounded-xs border border-[#242424]/8 text-xs text-[#242424]/75 mb-8">
            <span className="font-semibold text-[#111111] block mb-1">Editorial Disclosure:</span>
            <p>{service.editorialNote}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate(`/contact?project=${encodeURIComponent(service.title)}`)}
              className="px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#FBF9F5] bg-[#111111] hover:bg-[#C5A880] hover:text-[#111111] transition-all rounded-xs shadow-md cursor-pointer"
            >
              Start {service.shortTitle} Project &rarr;
            </button>

            {hasWhatsApp() && whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#111111] bg-[#FAF8F5] border border-[#242424]/20 hover:border-[#C5A880] transition-colors rounded-xs inline-flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Who It's For & What Client Provides */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 border-t border-[#242424]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Who It's For */}
          <div className="bg-[#FAF8F5] p-8 rounded-xs border border-[#242424]/10 shadow-2xs">
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase block mb-3 font-semibold">
              IDEAL APPLICATION
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#111111] mb-5">
              Who This Service Is For
            </h3>
            <ul className="space-y-3.5">
              {service.whoItsFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-[#242424]/80 leading-relaxed">
                  <Check className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You Provide */}
          <div className="bg-[#FAF8F5] p-8 rounded-xs border border-[#242424]/10 shadow-2xs">
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase block mb-3 font-semibold">
              PROJECT INTAKE
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#111111] mb-5">
              What You Provide
            </h3>
            <ul className="space-y-3.5">
              {service.whatClientProvides.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-[#242424]/80 leading-relaxed">
                  <div className="w-4 h-4 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 4-Step How It Works */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 border-t border-[#242424]/10">
        <span className="text-[10.5px] font-mono tracking-widest text-[#C5A880] uppercase block mb-2 font-semibold">
          WORKFLOW DISCIPLINE
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111] mb-8">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.howItWorks.map((step) => (
            <div key={step.step} className="bg-[#FAF8F5] p-6 rounded-xs border border-[#242424]/8">
              <span className="font-serif text-2xl text-[#C5A880] block mb-2 font-light">
                {step.step}
              </span>
              <h4 className="font-serif text-base font-normal text-[#111111] mb-2">
                {step.title}
              </h4>
              <p className="text-xs text-[#242424]/70 leading-relaxed font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Before / After Portrait Study (Exclusive to Photo Retouching) */}
      {service.id === 'photo-retouching' && (() => {
        const activeStudy = RETOUCHING_LAB_STUDIES[activeLabStudyIdx] ?? RETOUCHING_LAB_STUDIES[0];
        const safeFrameIdx = activeStudy.frames[activePortraitFrame] ? activePortraitFrame : 0;
        const activeFrame = activeStudy.frames[safeFrameIdx];

        return (
          <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 border-t border-[#242424]/10">
            {/* Study Discipline Selector */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {RETOUCHING_LAB_STUDIES.map((lab, idx) => (
                <button
                  key={lab.id}
                  type="button"
                  onClick={() => {
                    setActiveLabStudyIdx(idx);
                    setActivePortraitFrame(0);
                  }}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs border transition-colors cursor-pointer ${
                    activeLabStudyIdx === idx
                      ? 'bg-[#111111] text-[#C5A880] border-[#111111] font-semibold'
                      : 'bg-[#FAF8F5] text-[#242424]/70 border-[#242424]/12 hover:text-[#111111] hover:border-[#C5A880]/50'
                  }`}
                >
                  {lab.tabLabel}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Native 2:3 Uncropped Interactive Before/After Portrait */}
              <div className="lg:col-span-5">
                {/* Frame Selector Tabs (shown when multiple poses exist in the active study) */}
                {activeStudy.frames.length > 1 && (
                  <div className="max-w-[420px] mx-auto lg:mx-0 flex items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#242424]/12 rounded-xs mb-3">
                    {activeStudy.frames.map((frame, idx) => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => setActivePortraitFrame(idx)}
                        className={`flex-1 py-2 px-3 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                          safeFrameIdx === idx
                            ? 'bg-[#111111] text-[#C5A880] font-semibold shadow-2xs'
                            : 'text-[#242424]/65 hover:text-[#111111]'
                        }`}
                      >
                        {frame.label}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`max-w-[420px] mx-auto lg:mx-0 ${
                    'aspectClass' in activeFrame && activeFrame.aspectClass
                      ? activeFrame.aspectClass
                      : 'aspectClass' in activeStudy && activeStudy.aspectClass
                      ? activeStudy.aspectClass
                      : 'aspect-[2/3]'
                  } rounded-xs overflow-hidden border border-[#242424]/15 shadow-md bg-[#161616]`}
                >
                  <BeforeAfterSlider
                    beforeImage={activeFrame.beforeImage}
                    afterImage={activeFrame.afterImage}
                    beforeLabel="BEFORE"
                    afterLabel="AFTER"
                    alt={`${activeStudy.tabLabel} - ${activeFrame.label}`}
                    className="w-full h-full"
                    imageClassName={`w-full h-full ${
                      'imagePositionClass' in activeFrame && activeFrame.imagePositionClass
                        ? activeFrame.imagePositionClass
                        : 'imagePositionClass' in activeStudy && activeStudy.imagePositionClass
                        ? activeStudy.imagePositionClass
                        : 'object-cover object-top'
                    }`}
                  />
                </div>
                <p className="text-[11px] font-mono text-[#242424]/55 mt-3 text-center lg:text-left tracking-wide">
                  {activeStudy.frames.length > 1
                    ? 'Switch between poses above, then drag the Champagne Gold divider to inspect session consistency.'
                    : 'Drag the Champagne Gold divider to compare RAW capture vs retouched studio polish.'}
                </p>
              </div>

              {/* Technical Breakdown & Actions */}
              <div className="lg:col-span-7">
                <span className="text-[10.5px] font-mono tracking-[0.22em] text-[#C5A880] uppercase block mb-2.5 font-semibold">
                  {activeStudy.kicker}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#111111] leading-tight mb-4">
                  {activeStudy.heading}
                </h2>
                <p className="text-sm sm:text-base text-[#242424]/80 font-light leading-relaxed mb-6 max-w-2xl">
                  {activeStudy.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-6 border-t border-[#242424]/10">
                  {activeStudy.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#242424]/80">
                      <Check className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {onOpenRetouching && (
                    <button
                      onClick={() => onOpenRetouching(activeStudy.id, safeFrameIdx + 1)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-[#FBF9F5] hover:bg-[#C5A880] hover:text-[#111111] text-xs font-semibold uppercase tracking-widest rounded-xs transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A880] group-hover:text-[#111111]" />
                      <span>Open Fullscreen Split &amp; Side-by-Side</span>
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/contact?project=' + encodeURIComponent('Free Retouching Sample'))}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF8F5] text-[#111111] border border-[#242424]/20 hover:border-[#C5A880] text-xs font-semibold uppercase tracking-widest rounded-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Request Free Sample Frame</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 6 Visual Concept Studies */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 border-t border-[#242424]/10">
        <div className="max-w-2xl mb-10">
          <span className="text-[10.5px] font-mono tracking-widest text-[#C5A880] uppercase block mb-2 font-semibold">
            DESIGN STUDIES & SAMPLES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111] mb-2">
            Signature Design Concepts
          </h2>
          <p className="text-xs sm:text-sm text-[#242424]/70 leading-relaxed font-light">
            Visual demonstration of layout balance, typography integration, and tonal discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.concepts.map((concept) => (
            <div
              key={concept.id}
              className="bg-[#FAF8F5] rounded-xs border border-[#242424]/10 overflow-hidden shadow-2xs group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#EAE5DC] relative">
                <img
                  src={concept.image}
                  alt={concept.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[9px] font-mono tracking-widest text-white/90 uppercase px-2 py-0.5 bg-black/70 rounded-xs">
                  {concept.tagline}
                </span>
              </div>
              <div className="p-5">
                <h4 className="font-serif text-lg font-normal text-[#111111] mb-1">
                  {concept.title}
                </h4>
                <p className="text-xs text-[#242424]/70 leading-relaxed font-light">
                  {concept.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing & Project Inquiry Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 border-t border-[#242424]/10">
        <div className="p-8 sm:p-12 bg-[#161616] text-[#FBF9F5] rounded-xs border border-[#242424]/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase block mb-2 font-semibold">
              TRANSPARENT TAILORED ESTIMATE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FBF9F5] mb-2">
              Ready to start your {service.shortTitle} project?
            </h3>
            <p className="text-xs sm:text-sm text-[#FBF9F5]/75 font-light leading-relaxed mb-3">
              {service.pricingNote} We provide clear turnaround commitments and iterative review.
            </p>
            <p className="text-[11px] font-mono text-[#C5A880]">
              {STUDIO_CONFIG.facts.typicalTurnaround} &bull; Worldwide Delivery
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => navigate(`/contact?project=${encodeURIComponent(service.title)}`)}
              className="px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#111111] bg-[#C5A880] hover:bg-[#d6bc97] rounded-xs shadow-md transition-colors cursor-pointer text-center"
            >
              Request Scope & Quote &rarr;
            </button>
            <a
              href={getGmailComposeUrl(`Inquiry: ${service.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#FBF9F5] bg-[#242424] hover:border-[#C5A880] border border-[#FBF9F5]/15 rounded-xs transition-colors text-center inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Direct Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {service.relatedServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
          <h4 className="text-xs uppercase tracking-wider text-[#242424]/60 font-semibold mb-4">
            Related Capabilities:
          </h4>
          <div className="flex flex-wrap gap-3">
            {service.relatedServices.map((rel) => (
              <Link
                key={rel.slug}
                to={`/services/${rel.slug}`}
                className="px-4 py-2 bg-[#FAF8F5] border border-[#242424]/10 rounded-xs text-xs font-medium text-[#111111] hover:border-[#C5A880] hover:text-[#C5A880] transition-colors inline-flex items-center gap-1.5"
              >
                <span>{rel.title}</span>
                <ArrowRight className="w-3 h-3 text-[#C5A880]" />
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
