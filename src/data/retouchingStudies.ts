export interface RetouchingStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'SKIN' | 'COLOR' | 'GOWN' | 'LIGHTING' | 'REMOVAL';
  badge: string;
  thumbnail: string;
  description: string;
  objective: string;
  turnaroundNote: string;
  slides: RetouchingSlide[];
}

export interface RetouchingSlide {
  id: string;
  slideNumber: number;
  title: string;
  technique: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  beforeFilterStyle?: React.CSSProperties; // fallback aesthetic raw/unprocessed style if single source image
  afterFilterStyle?: React.CSSProperties;
  focalSummary: string;
  keyAdjustments: string[];
}

export const RETOUCHING_STUDIES: RetouchingStudy[] = [
  {
    id: 'study-natural-skin',
    slug: 'natural-skin-micro-retouching',
    title: 'Natural Skin Micro-Retouching',
    subtitle: 'Authentic Skin Texture & Gentle Blemish Balancing',
    category: 'SKIN',
    badge: 'Skin & Portrait',
    thumbnail: '/assets/services/photo-retouching/portrait-skin-after.webp',
    description: 'Manual frequency separation that smooths erythema and shine while strictly preserving natural skin pore architecture and authentic facial character.',
    objective: 'Achieve magazine-cover elegance without plastic smoothing or AI waxiness.',
    turnaroundNote: '24–48 Hours per gallery hero suite',
    slides: [
      {
        id: 'ns-1',
        slideNumber: 1,
        title: 'Three-Quarter Beauty Profile — Pore Fidelity',
        technique: 'Frequency Separation, Tone Balancing & Hair Luster',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/portrait-skin-before.webp',
        afterImage: '/assets/services/photo-retouching/portrait-skin-after.webp',
        focalSummary: 'Evening cheek redness, blemish texture, and specular shine while strictly preserving authentic skin pores and sculpting warm hair highlights.',
        keyAdjustments: [
          'High-frequency pore texture isolated and preserved',
          'Cheek blemishes and redness gently balanced',
          'Warm rim-lit hair luster & studio backdrop depth'
        ]
      },
      {
        id: 'ns-2',
        slideNumber: 2,
        title: 'Direct Studio Portrait — Session Skin Consistency',
        technique: 'T-Zone Shine Control, Under-Eye Balance & Décolletage Clean-up',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/portrait-skin-02-before.webp',
        afterImage: '/assets/services/photo-retouching/portrait-skin-02-after.webp',
        focalSummary: 'Maintaining 100% identical skin tone warmth and natural pore architecture across multiple angles in the same portrait session.',
        keyAdjustments: [
          'Session-matched skin tone & luminance consistency',
          'T-zone shine & under-eye shadow softening',
          'Subtle neck & collarbone blemish cleanup'
        ]
      },
      {
        id: 'ns-3',
        slideNumber: 3,
        title: 'Seated Beauty Pose — Shoulder Luminance & Tonal Harmony',
        technique: 'Frequency Separation, Hand-to-Face Tone Match & Backdrop Depth',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/portrait-skin-03-before.webp',
        afterImage: '/assets/services/photo-retouching/portrait-skin-03-after.webp',
        focalSummary: 'Harmonizing skin tone between face, hand, and shoulder highlights while keeping natural micro-texture intact across the full three-portrait series.',
        keyAdjustments: [
          'Face, hand & shoulder skin tone harmonization',
          'Soft specular highlight roll-off on shoulder & cheekbone',
          'Delicate stray hair refinement & dimensional backdrop'
        ]
      }
    ]
  },
  {
    id: 'study-bridal-gown',
    slug: 'bridal-gown-veil-perfection',
    title: 'Bridal Regalia & Gown Perfection',
    subtitle: 'Luminous Bridal Skin, Pearl Jewelry & Lace Detail',
    category: 'GOWN',
    badge: 'Bridal Regalia',
    thumbnail: '/assets/services/photo-retouching/bridal-regalia-01-after.webp',
    description: 'Neutralizing warm indoor color casts, calming cheek redness and specular shine while preserving authentic bridal skin micro-texture, and enhancing pearl, gold, and embroidered lace regalia.',
    objective: 'Deliver radiant, pearlescent bridal portraits with crisp heirloom jewelry and couture textile depth.',
    turnaroundNote: 'Calibrated for large-format 12x18 spreads',
    slides: [
      {
        id: 'bg-1',
        slideNumber: 1,
        title: 'Bridal Close-Up — Luminous Skin & Pearl Regalia',
        technique: 'White Balance Calibration, Frequency Separation & Jewelry Clarity',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/bridal-regalia-01-before.webp',
        afterImage: '/assets/services/photo-retouching/bridal-regalia-01-after.webp',
        focalSummary: 'Neutralizing warm yellow-green indoor ambient cast into a clean pearlescent bridal palette while refining cheek blemishes, softening specular shine, and sharpening gold-and-pearl regalia.',
        keyAdjustments: [
          'Warm indoor cast neutralized to luminous bridal tone',
          'Cheek blemishes & specular shine calmed with pores intact',
          'Pearl headpiece, gold filigree & lace shoulder clarity'
        ]
      },
      {
        id: 'bg-2',
        slideNumber: 2,
        title: 'Bridal Attire & Bouquet — Ivory Lace & Gold Zari Detail',
        technique: 'Textile Cast Neutralization, Hand-to-Face Tone Matching & Zari Micro-Contrast',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/bridal-regalia-02-before.webp',
        afterImage: '/assets/services/photo-retouching/bridal-regalia-02-after.webp',
        focalSummary: 'Harmonizing tonal consistency with the close-up portrait while lifting muddy indoor warmth out of the scalloped ivory lace border, champagne gold zari embroidery, and white bridal bouquet.',
        keyAdjustments: [
          'Consistent pearlescent white balance across saree lace & bouquet',
          'Seamless skin tone harmonization between face, neck & raised hand',
          'Crisp separation in gold zari floral motifs & pearl jewelry'
        ]
      },
      {
        id: 'bg-3',
        slideNumber: 3,
        title: 'Bridal Profile — Cheek Micro-Texture, Pearl Chain & Jasmine Detail',
        technique: 'Blemish Cleanup, Profile Luminosity Sculpting & Hair Florals Clarity',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/bridal-regalia-03-before.webp',
        afterImage: '/assets/services/photo-retouching/bridal-regalia-03-after.webp',
        focalSummary: 'Refining profile cheek and collarbone blemishes while keeping natural pore micro-texture and delicate hairline detail intact, paired with pearlescent backdrop harmony across the three-portrait bridal series.',
        keyAdjustments: [
          'Spotless cheek & collarbone cleanup with authentic pore texture',
          'Pearl headchain, jhumka drops & jasmine garland brilliance',
          'Cohesive pearlescent color grading across all three bridal angles'
        ]
      }
    ]
  },
  {
    id: 'study-baby-portrait',
    slug: 'baby-child-portrait-retouching',
    title: 'Baby & Child Portrait Retouching',
    subtitle: 'Delicate Baby Skin Cleanup, Creamy Tone & Catchlight Polish',
    category: 'SKIN',
    badge: 'Baby & Family',
    thumbnail: '/assets/services/photo-retouching/baby-portrait-03-after.webp',
    description: 'Ultra-gentle cleanup of temporary baby skin marks, dry spots, and uneven redness while preserving soft natural dimples, fine curls, and authentic childhood expression.',
    objective: 'Deliver warm, creamy heirloom baby & milestone portraits with zero plastic blur or artificial smoothing.',
    turnaroundNote: '24–48 Hours for newborn, milestone & family sessions',
    slides: [
      {
        id: 'bp-1',
        slideNumber: 1,
        title: 'Milestone Smile Portrait — Gentle Spot Cleanup & Creamy Glow',
        technique: 'Delicate Blemish Removal, Creamy Skin Tone Balance & Catchlight Clarity',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/baby-portrait-01-before.webp',
        afterImage: '/assets/services/photo-retouching/baby-portrait-01-after.webp',
        focalSummary: 'Gently removing temporary spots and marks across the forehead, cheeks, and chin while preserving soft natural baby skin texture, dimples, curly hair detail, and bright eye catchlights.',
        keyAdjustments: [
          'Temporary facial marks & spots cleanly removed',
          'Warm creamy baby skin tone with natural dimples intact',
          'Sparkling eye catchlights & crisp linen/curl detail'
        ]
      },
      {
        id: 'bp-2',
        slideNumber: 2,
        title: 'Seated Candid Laugh — Session Skin Consistency & Linen Detail',
        technique: 'Session Tone Matching, Cheek Spot Cleanup & Fabric Micro-Contrast',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/baby-portrait-02-before.webp',
        afterImage: '/assets/services/photo-retouching/baby-portrait-02-after.webp',
        focalSummary: 'Maintaining identical warm, creamy skin tone consistency with the close-up frame while gently clearing cheek spots and bringing soft tactile clarity to the sage linen romper and leaf embroidery.',
        keyAdjustments: [
          'Cheek & laugh-line blemishes removed with natural folds intact',
          '100% session-matched creamy skin warmth across poses',
          'Crisp sage cotton weave, leaf motif & upward catchlights'
        ]
      },
      {
        id: 'bp-3',
        slideNumber: 3,
        title: 'Seated Studio Portrait — Full-Session Tonal Harmony & Bokeh Glow',
        technique: 'Forehead & Cheek Cleanup, Neutral Studio Catchlights & Rug Texture Balance',
        beforeLabel: 'BEFORE',
        afterLabel: 'AFTER',
        beforeImage: '/assets/services/photo-retouching/baby-portrait-03-before.webp',
        afterImage: '/assets/services/photo-retouching/baby-portrait-03-after.webp',
        focalSummary: 'Completing the three-pose milestone series with spotless forehead and cheek cleanup, pure neutral eye catchlights, and cohesive warm-creamy skin tones against soft studio bokeh.',
        keyAdjustments: [
          'Spotless forehead & cheek cleanup with baby dimples preserved',
          'Pure neutral studio catchlights & natural curl definition',
          'Seamless skin & mint linen color consistency across all 3 poses'
        ]
      }
    ]
  },
  {
    id: 'study-lighting-calibration',
    slug: 'lighting-color-calibration',
    title: 'Mixed Lighting Neutralization',
    subtitle: 'Indoor Reception & Outdoor Twilight Harmonization',
    category: 'LIGHTING',
    badge: 'Lighting Balance',
    thumbnail: '/assets/services/photo-retouching/concept-03.webp',
    description: 'Eliminating jarring temperature jumps between tungsten banquet chandeliers, magenta DJ uplighting, and natural daylight across consecutive album pages.',
    objective: 'Seamless spread-to-spread visual rhythm and cohesive tonal storytelling.',
    turnaroundNote: 'Full gallery batch calibration available',
    slides: [
      {
        id: 'lc-1',
        slideNumber: 1,
        title: 'Ballroom Reception vs Twilight Balance',
        technique: 'Multi-Zone White Balance Calibration',
        beforeLabel: 'Harsh 3200K Yellow Tungsten Cast',
        afterLabel: 'Balanced 4800K Editorial Glow',
        beforeImage: '/assets/services/photo-retouching/concept-03.webp',
        afterImage: '/assets/services/photo-retouching/concept-03.webp',
        beforeFilterStyle: { filter: 'sepia(0.55) hue-rotate(-20deg) contrast(1.1)' },
        afterFilterStyle: { filter: 'none' },
        focalSummary: 'Isolating indoor yellow casts while retaining the ambient celebration warmth.',
        keyAdjustments: [
          'Tungsten spill masked off from faces and white table linens',
          'DJ purple/magenta uplight saturation tamed',
          'Even color temperature on left & right album pages'
        ]
      },
      {
        id: 'lc-2',
        slideNumber: 2,
        title: 'Flash Exposure Falloff Compensation',
        technique: 'Gradient Luminosity Balancing',
        beforeLabel: 'Harsh On-Camera Vignette',
        afterLabel: 'Natural Environmental Light',
        beforeImage: '/assets/services/wedding-photo-editing/concept-03.webp',
        afterImage: '/assets/services/wedding-photo-editing/concept-03.webp',
        beforeFilterStyle: { filter: 'contrast(1.3) brightness(0.85)' },
        afterFilterStyle: { filter: 'none' },
        focalSummary: 'Evening out heavy flash bounce so backgrounds retain depth and venue architecture.',
        keyAdjustments: [
          'Shadow lift with zero digital noise amplification',
          'Specular hot-spot softening on shiny foreheads',
          'Linear gradient exposure balance'
        ]
      }
    ]
  },
  {
    id: 'study-monochrome-archival',
    slug: 'monochrome-archival-contrast',
    title: 'Monochrome Archival Contrast Sculpting',
    subtitle: 'Fine Art Black & White Tonal Depth',
    category: 'COLOR',
    badge: 'Monochrome',
    thumbnail: '/assets/services/photo-retouching/concept-04.webp',
    description: 'Velvety deep blacks, luminous whites, and organic silver-halide grain inspired by historic darkroom master printing.',
    objective: 'Create timeless emotive frames that elevate the quiet poetry of the wedding day.',
    turnaroundNote: 'Print-calibrated for Hahnemühle & Canson fine art cotton rag',
    slides: [
      {
        id: 'mo-1',
        slideNumber: 1,
        title: 'Quiet Portrait in Cathedral Window Light',
        technique: 'Bespoke Channel Mixer Monochrome',
        beforeLabel: 'Flat Digital Color RAW',
        afterLabel: 'Luminous Archival Fine Art Black & White',
        beforeImage: '/assets/services/photo-retouching/concept-04.webp',
        afterImage: '/assets/services/photo-retouching/concept-04.webp',
        beforeFilterStyle: { filter: 'grayscale(0.3) saturate(1.1) brightness(0.95)' },
        afterFilterStyle: { filter: 'none' },
        focalSummary: 'Sculpting window light to draw full emotional attention to downcast eyes and veil edges.',
        keyAdjustments: [
          'Custom red and orange channel weighting for radiant skin',
          'Deep velvety blacks without clipping shadow detail',
          'Fine analogue grain curve added for tactile feel'
        ]
      }
    ]
  },
  {
    id: 'study-object-removal',
    slug: 'object-venue-cleanup',
    title: 'Historic Venue Distraction Clean-up',
    subtitle: 'Pixel Reconstruction & Clean Architectural Lines',
    category: 'REMOVAL',
    badge: 'Object Removal',
    thumbnail: '/assets/services/photo-manipulation/concept-01.webp',
    description: 'Manual pixel synthesis that removes exit signs, HVAC vents, power cables, and tourists without leaving blurry stamp marks or altered grain.',
    objective: 'Give hero wedding portraits museum-worthy compositional purity.',
    turnaroundNote: 'Detailed 100% pixel audit on every spread',
    slides: [
      {
        id: 'or-1',
        slideNumber: 1,
        title: 'Historic Cathedral Altar Clean-up',
        technique: 'Architectural Stone & Texture Synthesis',
        beforeLabel: 'Visible Exit Signs, Cables & Vents',
        afterLabel: 'Seamless Historic Architecture',
        beforeImage: '/assets/services/photo-manipulation/concept-01.webp',
        afterImage: '/assets/services/photo-manipulation/concept-01.webp',
        beforeFilterStyle: { filter: 'contrast(1.15) brightness(0.92)' },
        afterFilterStyle: { filter: 'none' },
        focalSummary: 'Rebuilding ancient stone masonry behind modern electrical installations.',
        keyAdjustments: [
          'Emergency exit signs and lighting hardware removed',
          'Gothic masonry patterns hand-painted and cloned',
          'Camera sensor noise matched identically across patches'
        ]
      },
      {
        id: 'or-2',
        slideNumber: 2,
        title: 'Ceremony Aisle Guest Smartphone Removal',
        technique: 'Background Infill & Silhouette Isolation',
        beforeLabel: 'Guest Phones & Extended Arms in Aisle',
        afterLabel: 'Sacred Clean View of the Processional',
        beforeImage: '/assets/services/photo-manipulation/concept-02.webp',
        afterImage: '/assets/services/photo-manipulation/concept-02.webp',
        beforeFilterStyle: { filter: 'saturate(1.2) contrast(1.1)' },
        afterFilterStyle: { filter: 'none' },
        focalSummary: 'Preserving the bride and father processional without intrusive rectangular screens.',
        keyAdjustments: [
          'Smartphones, iPads, and arms cleanly extracted',
          'Pew wood grain and floral runner filled seamlessly',
          'Natural depth-of-field blur maintained flawlessly'
        ]
      },
      {
        id: 'or-3',
        slideNumber: 3,
        title: 'Destination Landmark Beach & Tourist Erase',
        technique: 'Horizon & Wave Pattern Generation',
        beforeLabel: 'Public Tourists & Safety Markers',
        afterLabel: 'Private Romantic Horizon',
        beforeImage: '/assets/services/photo-manipulation/concept-03.webp',
        afterImage: '/assets/services/photo-manipulation/concept-03.webp',
        beforeFilterStyle: { filter: 'contrast(1.2) brightness(0.95)' },
        afterFilterStyle: { filter: 'none' },
        focalSummary: 'Isolating the couple on a dramatic cliffside sunset with uninterrupted horizons.',
        keyAdjustments: [
          'Distant beach visitors and bright clothing removed',
          'Ocean spray and sea foam lines reconstructed',
          'Even sky graduation with zero banding'
        ]
      }
    ]
  },
  {
    id: 'study-film-grain-color',
    slug: 'film-grain-color-harmony',
    title: 'Atmospheric Film Grain & Tone Matching',
    subtitle: 'Lightroom Color Consistency Across Galleries',
    category: 'COLOR',
    badge: 'Color Grading',
    thumbnail: '/assets/services/wedding-photo-editing/concept-04.webp',
    description: 'Transforming sterile digital sensors into rich, organic imagery reminiscent of medium format Fuji 400H or Kodak Portra film stocks.',
    objective: 'Elevate digital weddings to editorial, print-ready heirloom aesthetics.',
    turnaroundNote: 'Fast catalog sync available (.lrcat)',
    slides: [
      {
        id: 'fg-1',
        slideNumber: 1,
        title: 'Garden Reception Sunset Glow',
        technique: 'Split Toning & Analogue Roll-Off Curves',
        beforeLabel: 'Cold Clinical Digital Capture',
        afterLabel: 'Warm Painterly Film Aesthetic',
        beforeImage: '/assets/services/wedding-photo-editing/concept-04.webp',
        afterImage: '/assets/services/wedding-photo-editing/concept-04.webp',
        beforeFilterStyle: { filter: 'hue-rotate(25deg) saturate(0.85) contrast(1.15)' },
        afterFilterStyle: { filter: 'none' },
        focalSummary: 'Infusing creamy highlights and gentle shadow greens that print with depth.',
        keyAdjustments: [
          'Cyan/green shadow tone integration',
          'Soft warm highlight clipping reduction',
          'Micro-contrast adapted for luxury album printing'
        ]
      }
    ]
  }
];
