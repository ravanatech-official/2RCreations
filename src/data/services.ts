import { ServiceItem } from '../types';

export const SERVICES: ServiceItem[] = [
  // 01 — WEDDING ALBUM DESIGN
  {
    id: 'wedding-album-design',
    slug: 'wedding-album-design',
    title: 'Wedding Album Design',
    shortTitle: 'Album Design',
    tagline: 'Story-Driven Heirloom Layouts for Fine Art Photographers',
    heroImage: '/assets/services/wedding-album-design/hero.webp',
    heroDescription: 'From intimate elopements to grand multi-day celebrations, we transform raw photographic galleries into timeless, narrative-driven heirloom albums. Every spread is balanced with breathing room, intentional pacing, and architectural symmetry.',
    editorialNote: 'All album layouts showcased are signature design studies created by 2R Creations to demonstrate narrative pacing, typography pairing, and spread rhythm.',
    whoItsFor: [
      'Wedding photographers seeking to outsource time-consuming album layouts without sacrificing quality.',
      'Studios wanting consistent, high-end editorial presentation for luxury client deliveries.',
      'Couples seeking bespoke heirloom book design from their wedding gallery.'
    ],
    whatClientProvides: [
      'High-resolution edited photographs (via Google Drive, Dropbox, Pixieset, or WeTransfer).',
      'Optional list of must-have hero images or client favorites.',
      'Your print lab specifications (size, margins, safe zone, spread dimensions).'
    ],
    howItWorks: [
      { step: '01', title: 'Gallery Ingestion & Narrative Curation', description: 'We analyze your complete gallery to establish emotional arcs, chronological flow, and key celebratory moments.' },
      { step: '02', title: 'Bespoke Spread Architecture', description: 'Spreads are crafted with generous negative space, complementary tonality, and editorial hierarchy.' },
      { step: '03', title: 'Collaborative Online Proofing', description: 'Digital proofing links allow swift review and spread-by-spread feedback adjustments.' },
      { step: '04', title: 'Lab-Ready Production Export', description: 'Final high-resolution spreads and cover cut files exported strictly to your lab’s exact color profile and millimeter measurements.' }
    ],
    concepts: [
      {
        id: 'wad-concept-1',
        title: 'The Monolithic Hero Spread',
        tagline: 'Cinematic Stillness',
        description: 'A single panoramic portrait spanning both pages with unbroken horizontal serenity and quiet emotional power.',
        image: '/assets/services/wedding-album-design/concept-01.webp'
      },
      {
        id: 'wad-concept-2',
        title: 'Asymmetrical Editorial Duet',
        tagline: 'Modern Balance',
        description: 'Pairing an expansive documentary environmental wide frame with an intimate macro close-up.',
        image: '/assets/services/wedding-album-design/concept-02.webp'
      },
      {
        id: 'wad-concept-3',
        title: 'Sacred Ritual Rhythm',
        tagline: 'Cultural Reverence',
        description: 'Harmonious multi-frame sequencing that respects cultural ceremonies without visual clutter or crowding.',
        image: '/assets/services/wedding-album-design/concept-03.webp'
      },
      {
        id: 'wad-concept-4',
        title: 'The Heirloom Details Suite',
        tagline: 'Tactile Elegance',
        description: 'Clean typographic spacing showcasing rings, couture embroidery, stationery, and heirloom heirlooms.',
        image: '/assets/services/wedding-album-design/concept-04.webp'
      },
      {
        id: 'wad-concept-5',
        title: 'The Golden Hour Dialogue',
        tagline: 'Warmth & Movement',
        description: 'Capturing kinetic romance and natural light transitions as day moves into celebratory evening.',
        image: '/assets/services/wedding-album-design/concept-05.webp'
      },
      {
        id: 'wad-concept-6',
        title: 'The Starlit Finale',
        tagline: 'The Concluding Note',
        description: 'A deeply atmospheric closing spread designed to leave a lasting impression as the final page turns.',
        image: '/assets/services/wedding-album-design/concept-06.webp'
      }
    ],
    relatedServices: [
      { slug: 'album-layout-cover-design', title: 'Album Layout & Cover Design' },
      { slug: 'photo-retouching', title: 'Photo Retouching & Color Correction' }
    ],
    pricingNote: 'Custom quote provided based on spread count, lab specifications, and timeline requirements.'
  },

  // 02 — PRE-SHOOT & ENGAGEMENT ALBUM DESIGN
  {
    id: 'pre-shoot-engagement',
    slug: 'pre-shoot-engagement',
    title: 'Pre-Shoot & Engagement Album Design',
    shortTitle: 'Pre-Shoot Albums',
    tagline: 'Casual Elegance & Cinematic Storytelling Free of Wedding Day Formality',
    heroImage: '/assets/services/pre-shoot-engagement/hero.webp',
    heroDescription: 'An engagement session is an intimate conversation between landscape, light, and authentic connection. We design pre-shoot albums that feel like high-end art monographs, celebrating movement, golden light, and spontaneous emotion.',
    editorialNote: 'Pre-shoot designs intentionally omit ceremonial structure, focusing exclusively on environment, intimacy, and narrative cadence.',
    whoItsFor: [
      'Couples wanting a dedicated signing book or guest keepsake album for their reception.',
      'Photographers offering premium pre-wedding destination packages.',
      'Studios wanting to upsell engagement sessions into tangible heirloom products.'
    ],
    whatClientProvides: [
      'Selected pre-shoot or engagement photos.',
      'Intended album use (guest signing book with white space, or standalone coffee table book).',
      'Desired print size and cover material style.'
    ],
    howItWorks: [
      { step: '01', title: 'Setting & Mood Mapping', description: 'We map the progression of light, from afternoon ambiance through golden hour to dusk.' },
      { step: '02', title: 'Movement & Connection Layout', description: 'Curating dynamic pairings that emphasize genuine glances, movement, and negative space.' },
      { step: '03', title: 'Optional Guest Signage Margins', description: 'If used as a reception signing book, spreads are engineered with balanced signature white space.' },
      { step: '04', title: 'Print-Ready Delivery', description: 'Full resolution spreads delivered in 300 DPI sRGB/CMYK per printer specifications.' }
    ],
    concepts: [
      {
        id: 'pse-concept-1',
        title: 'The Landscape Immersion',
        tagline: 'Scale & Horizon',
        description: 'Couples framed against dramatic coastal landscapes or rolling countryside with quiet spatial grandeur.',
        image: '/assets/services/pre-shoot-engagement/concept-01.webp'
      },
      {
        id: 'pse-concept-2',
        title: 'Kinetic Movement Study',
        tagline: 'Spontaneity in Motion',
        description: 'Triptych layouts capturing walking, laughing, and unguarded windblown gestures.',
        image: '/assets/services/pre-shoot-engagement/concept-02.webp'
      },
      {
        id: 'pse-concept-3',
        title: 'Golden Hour Harmony',
        tagline: 'Sunlit Intimacy',
        description: 'Deep amber tones and backlighting paired with clean white borders that honor the light quality.',
        image: '/assets/services/pre-shoot-engagement/concept-03.webp'
      },
      {
        id: 'pse-concept-4',
        title: 'The Architectural Dialogue',
        tagline: 'Urban Modernism',
        description: 'Sharp lines, glass reflections, and modern metropolitan backdrops for contemporary city sessions.',
        image: '/assets/services/pre-shoot-engagement/concept-04.webp'
      },
      {
        id: 'pse-concept-5',
        title: 'Intimate Detail Cadence',
        tagline: 'Quiet Touch',
        description: 'Intertwined fingers, shared glances, and close-up portraits creating an emotional heartbeat in the book.',
        image: '/assets/services/pre-shoot-engagement/concept-05.webp'
      },
      {
        id: 'pse-concept-6',
        title: 'The Twilight Conclusion',
        tagline: 'Blue Hour Silence',
        description: 'Soft twilight tones framing warm silhouettes as the final chapter of the couple session.',
        image: '/assets/services/pre-shoot-engagement/concept-06.webp'
      }
    ],
    relatedServices: [
      { slug: 'wedding-album-design', title: 'Wedding Album Design' },
      { slug: 'photo-retouching', title: 'Photo Retouching & Color Correction' }
    ],
    pricingNote: 'Tailored pricing based on spread count and optional guest signing book margins.'
  },

  // 03 — PHOTO RETOUCHING & COLOR CORRECTION
  {
    id: 'photo-retouching',
    slug: 'photo-retouching',
    title: 'Photo Retouching & Color Correction',
    shortTitle: 'Retouching & Color',
    tagline: 'Natural Skin Tones, Film-Inspired Tonal Harmony, and Restrained Polish',
    heroImage: '/assets/services/photo-retouching/hero.webp',
    heroDescription: 'Heirloom albums demand absolute tonal perfection across every facing page. We provide specialized wedding retouching that preserves natural skin texture while harmonizing color temperature and luminosity across changing lighting environments.',
    editorialNote: 'Our retouching philosophy centers on restraint. We enhance authentic beauty without the artificial smoothing or waxen appearance of automated tools.',
    whoItsFor: [
      'Photographers needing hero portraits brought to magazine-cover perfection.',
      'Studios encountering mismatched color temperatures between ceremony, cocktail hour, and ballroom lighting.',
      'Couples desiring gentle, flattering blemish removal, stray hair clean-up, and veil refinements.',
      'Newborn, baby milestone, and family portrait photographers needing ultra-gentle, natural skin cleanup.'
    ],
    whatClientProvides: [
      'RAW or high-resolution JPEG/TIFF files.',
      'Specific notes on areas of attention (skin, wardrobe, lighting balance).',
      'Reference style or preferred preset tonal direction.'
    ],
    howItWorks: [
      { step: '01', title: 'Tonal Assessment', description: 'We evaluate exposure, white balance, and dynamic range across the spread.' },
      { step: '02', title: 'Frequency Separation & Texture Preservation', description: 'Skin tones are gently evened while pore structure and authentic character are preserved.' },
      { step: '03', title: 'Color Matching Across Spreads', description: 'Left and right facing pages are strictly calibrated for visual consistency.' },
      { step: '04', title: 'Hi-Res Delivery', description: 'Delivered in lossless 16-bit TIFF or maximum quality JPEG.' }
    ],
    concepts: [
      {
        id: 'pr-concept-1',
        title: 'Natural Skin Micro-Retouching',
        tagline: 'Authentic Polish',
        description: 'Gentle cleanup of temporary blemishes, redness, and shine while retaining natural facial structure.',
        image: '/assets/services/photo-retouching/concept-01.webp'
      },
      {
        id: 'pr-concept-2',
        title: 'Bridal Gown & Veil Perfection',
        tagline: 'Textile Elegance',
        description: 'Restoring delicate lace detail, softening harsh creasing, and enhancing translucent veil layers.',
        image: '/assets/services/photo-retouching/concept-02.webp'
      },
      {
        id: 'pr-concept-3',
        title: 'Mixed Lighting Neutralization',
        tagline: 'Color Equilibrium',
        description: 'Balancing indoor tungsten reception ambiance with outdoor ambient dusk light seamlessly.',
        image: '/assets/services/photo-retouching/concept-03.webp'
      },
      {
        id: 'pr-concept-4',
        title: 'Monochrome Contrast Sculpting',
        tagline: 'Timeless Black & White',
        description: 'Deep velvety blacks and luminous whites tuned for fine art archival cotton rag papers.',
        image: '/assets/services/photo-retouching/concept-04.webp'
      },
      {
        id: 'pr-concept-5',
        title: 'Background Tone Softening',
        tagline: 'Visual Hierarchy',
        description: 'Subtle vignetting and distraction reduction to draw the eye inexorably to the subjects.',
        image: '/assets/services/photo-retouching/concept-05.webp'
      },
      {
        id: 'pr-concept-6',
        title: 'Heritage Regalia Color Depth',
        tagline: 'Metallic & Jewel Vibrancy',
        description: 'Enhancing rich golds, deep reds, and cultural regalia without oversaturating skin.',
        image: '/assets/services/photo-retouching/concept-06.webp'
      }
    ],
    relatedServices: [
      { slug: 'wedding-photo-editing', title: 'Wedding Photo Editing & Culling' },
      { slug: 'photo-manipulation', title: 'Photo Manipulation & Object Removal' }
    ],
    pricingNote: 'Per-image and full-album package rates available.'
  },

  // 04 — ALBUM LAYOUT & COVER DESIGN
  {
    id: 'album-layout-cover-design',
    slug: 'album-layout-cover-design',
    title: 'Album Layout & Cover Design',
    shortTitle: 'Cover & Foil Typography',
    tagline: 'Heirloom Debossing, Custom Typography & Cover Artistry',
    heroImage: '/assets/services/album-layout-cover/hero.webp',
    heroDescription: 'An heirloom album begins with its cover. We craft bespoke typography for foil stamping, blind debossing, acrylic faceplates, and spine titling that reflects the unique character of the couple’s celebration.',
    editorialNote: 'Custom vector typography files are generated to exact lab mechanical specifications for brass dies and embossing machines.',
    whoItsFor: [
      'Studios wanting distinctive, bespoke cover lettering rather than generic lab fonts.',
      'High-end bookbinders requiring precise vector embossing dies with custom kerning.',
      'Photographers crafting custom luxury box sets and slipcases.'
    ],
    whatClientProvides: [
      'Couple names, wedding date, venue or city, and preferred monogram style.',
      'Cover material swatch (linen, full-grain leather, velvet, buckram).',
      'Lab stamping die dimensions (e.g. 4x6" die area, spine width calculations).'
    ],
    howItWorks: [
      { step: '01', title: 'Typography Exploration', description: 'Curating modern serif, delicate script, or clean geometric type pairings.' },
      { step: '02', title: 'Vector Die Construction', description: 'Constructing production-ready vector artwork with minimum line weights suitable for foil stamping.' },
      { step: '03', title: '3D Studio Mockup', description: 'Rendering realistic material mockups so clients can preview foil against their chosen leather.' },
      { step: '04', title: 'Die & Layout Export', description: 'Supplying 100% vector EPS/PDF files alongside complete album spreads.' }
    ],
    concepts: [
      {
        id: 'cvr-concept-1',
        title: 'Minimalist Blind Deboss Monogram',
        tagline: 'Understated Luxury',
        description: 'Deep, inkless impression on natural linen creating tactile shadow and quiet sophistication.',
        image: '/assets/services/album-layout-cover/concept-01.webp'
      },
      {
        id: 'cvr-concept-2',
        title: 'Warm Gold Foil Serif Titling',
        tagline: 'Timeless Heirloom',
        description: 'Refined metallic foil on cognac European leather with classical Roman proportions.',
        image: '/assets/services/album-layout-cover/concept-02.webp'
      },
      {
        id: 'cvr-concept-3',
        title: 'Bespoke Illustrated Crest & Monogram',
        tagline: 'Heritage Artistry',
        description: 'Custom botanical or architectural motif integrated into the couple’s initials.',
        image: '/assets/services/album-layout-cover/concept-03.webp'
      },
      {
        id: 'cvr-concept-4',
        title: 'Flushmount Acrylic Cameo Window',
        tagline: 'Contemporary Edge',
        description: 'Diamond-polished acrylic photo cutout embedded seamlessly into Japanese bookcloth.',
        image: '/assets/services/album-layout-cover/concept-04.webp'
      },
      {
        id: 'cvr-concept-5',
        title: 'Spine Titling & Edition Numbering',
        tagline: 'Archival Spine Geometry',
        description: 'Carefully measured spine typography engineered to remain crisp across varying album thicknesses.',
        image: '/assets/services/album-layout-cover/concept-05.webp'
      },
      {
        id: 'cvr-concept-6',
        title: 'Custom Slipcase & Presentation Box',
        tagline: 'Complete Presentation',
        description: 'Coordinated outer clamshell box design with matching debossing and ribbon pulls.',
        image: '/assets/services/album-layout-cover/concept-06.webp'
      }
    ],
    relatedServices: [
      { slug: 'wedding-album-design', title: 'Wedding Album Design' },
      { slug: 'pre-shoot-engagement', title: 'Pre-Shoot & Engagement Album Design' }
    ],
    pricingNote: 'Available as a standalone cover service or bundled with complete album design.'
  },

  // 05 — WEDDING PHOTO EDITING & CULLING
  {
    id: 'wedding-photo-editing',
    slug: 'wedding-photo-editing',
    title: 'Wedding Photo Editing & Culling',
    shortTitle: 'Editing & Culling',
    tagline: 'Intelligent Story Selection & Consistent Lightroom Color Grading',
    heroImage: '/assets/services/wedding-photo-editing/hero.webp',
    heroDescription: 'Overcoming the post-production bottleneck. We cull through thousands of wedding day exposures to find the strongest emotional and visual frames, then color balance to match your studio’s signature aesthetic.',
    editorialNote: 'Culling focuses on preserving narrative continuity: story anchors, critical family moments, artistic portraits, and genuine emotion.',
    whoItsFor: [
      'Busy wedding photographers during peak season overwhelmed with raw intake.',
      'Studios wanting to deliver faster previews and final galleries to clients.',
      'Photographers transitioning from shooting to full-time studio scaling.'
    ],
    whatClientProvides: [
      'RAW catalog (Lightroom Smart Previews or Capture One session).',
      'Target final delivery image count.',
      'Your anchor reference images or preferred preset settings.'
    ],
    howItWorks: [
      { step: '01', title: 'Intelligent First Pass', description: 'Removing blinks, out-of-focus frames, test shots, and redundant duplicates.' },
      { step: '02', title: 'Story Arc Selection', description: 'Curating the comprehensive narrative with balanced coverage across both sides of the family.' },
      { step: '03', title: 'Consistent Color Calibration', description: 'Applying your preset and adjusting exposure, temperature, and crop image-by-image.' },
      { step: '04', title: 'Lightroom Catalog Return', description: 'Returning lightweight .lrcat file with all edits ready for instant export.' }
    ],
    concepts: [
      {
        id: 'wpe-concept-1',
        title: 'Critical Emotional Culling',
        tagline: 'Finding the Genuine Moment',
        description: 'Filtering through bursts to locate the single micro-second where a parent’s tear or authentic smile shines.',
        image: '/assets/services/wedding-photo-editing/concept-01.webp'
      },
      {
        id: 'wpe-concept-2',
        title: 'Consecutive Lighting Harmonization',
        tagline: 'Seamless Progression',
        description: 'Smoothing exposure jumps between bright sunlight and shaded courtyard portraits.',
        image: '/assets/services/wedding-photo-editing/concept-02.webp'
      },
      {
        id: 'wpe-concept-3',
        title: 'Reception Flash Calibration',
        tagline: 'Punchy & Controlled',
        description: 'Taming harsh flash reflections while keeping ambient candle warmth intact.',
        image: '/assets/services/wedding-photo-editing/concept-03.webp'
      },
      {
        id: 'wpe-concept-4',
        title: 'Fine Art Grain Integration',
        tagline: 'Analogue Atmosphere',
        description: 'Applying subtle, film-like grain curves that print with painterly richness.',
        image: '/assets/services/wedding-photo-editing/concept-04.webp'
      },
      {
        id: 'wpe-concept-5',
        title: 'Dynamic Range Recovery',
        tagline: 'Shadow & Highlight Preservation',
        description: 'Rescuing cloud detail in skies and tuxedo fabric texture in deep shadows.',
        image: '/assets/services/wedding-photo-editing/concept-05.webp'
      },
      {
        id: 'wpe-concept-6',
        title: 'Album-Ready Shortlist Generation',
        tagline: 'Pre-Selected Flow',
        description: 'Color tagging the top 100 images best suited for immediate album layout construction.',
        image: '/assets/services/wedding-photo-editing/concept-06.webp'
      }
    ],
    relatedServices: [
      { slug: 'wedding-album-design', title: 'Wedding Album Design' },
      { slug: 'photo-retouching', title: 'Photo Retouching & Color Correction' }
    ],
    pricingNote: 'Tiered per-event rates based on raw intake count and final selected image count.'
  },

  // 06 — PHOTO MANIPULATION & OBJECT REMOVAL
  {
    id: 'photo-manipulation',
    slug: 'photo-manipulation',
    title: 'Photo Manipulation & Object Removal',
    shortTitle: 'Object Removal & Clean-up',
    tagline: 'Clean Architectural Lines, Distraction-Free Vistas & Seamless Retouching',
    heroImage: '/assets/services/photo-manipulation/hero.webp',
    heroDescription: 'Real wedding locations are rarely empty. We clean backgrounds, eliminate exit signs, stray microphones, photo-bombers, background tourists, electrical cords, and architectural blemishes so hero portraits stand alone in purity.',
    editorialNote: 'Executed with manual pixel artistry to ensure seamless texture blending that stands up to 100% zoom on 30-inch archival spreads.',
    whoItsFor: [
      'Photographers shooting in crowded public venues, heritage landmarks, or active tourist spots.',
      'Studios wanting pristine ceremony aisle shots free of guest smartphones and stray equipment.',
      'Couples demanding museum-grade wall art and hero album spreads.'
    ],
    whatClientProvides: [
      'Original RAW or high-resolution image.',
      'Clear indication of objects or elements to remove or adjust.',
      'Any alternate angle frames that can provide replacement texture if needed.'
    ],
    howItWorks: [
      { step: '01', title: 'Scene Structure Analysis', description: 'Studying perspective lines, grain patterns, and depth of field.' },
      { step: '02', title: 'Pixel Synthesis & Reconstruction', description: 'Rebuilding covered architecture, foliage, or flooring behind the removed element.' },
      { step: '03', title: 'Lighting & Shadow Integration', description: 'Ensuring cast shadows and reflected light match the reconstructed scene.' },
      { step: '04', title: 'Grain & Texture Matching', description: 'Adding native sensor noise back into modified areas so no digital smoothing is detectable.' }
    ],
    concepts: [
      {
        id: 'pm-concept-1',
        title: 'Historic Venue Distraction Removal',
        tagline: 'Pristine Architecture',
        description: 'Removing modern emergency exit signs, air conditioning vents, and fire extinguishers from historic cathedrals.',
        image: '/assets/services/photo-manipulation/concept-01.webp'
      },
      {
        id: 'pm-concept-2',
        title: 'Ceremony Guest Phone Clean-up',
        tagline: 'Focus on the Vows',
        description: 'Softly removing intrusive smartphones held in the aisle during the bride’s processional.',
        image: '/assets/services/photo-manipulation/concept-02.webp'
      },
      {
        id: 'pm-concept-3',
        title: 'Public Landmark Tourist Clearing',
        tagline: 'Private Horizon',
        description: 'Erasing tourists from background cliff walks, beaches, and monument stairways.',
        image: '/assets/services/photo-manipulation/concept-03.webp'
      },
      {
        id: 'pm-concept-4',
        title: 'Stage & Poruwa Cable Clean-up',
        tagline: 'Sacred Clean Lines',
        description: 'Tucking away visible microphone stands, power strips, and video lighting cables around the altar.',
        image: '/assets/services/photo-manipulation/concept-04.webp'
      },
      {
        id: 'pm-concept-5',
        title: 'Sky & Weather Enhancements',
        tagline: 'Atmospheric Mood',
        description: 'Gently enhancing overcast skies or removing utility lines over outdoor garden receptions.',
        image: '/assets/services/photo-manipulation/concept-05.webp'
      },
      {
        id: 'pm-concept-6',
        title: 'Wardrobe Wrinkle & Strain Relief',
        tagline: 'Bespoke Tailoring',
        description: 'Ironing out digital wrinkles on tuxedos and bridal dresses caused by transit or seated ceremonies.',
        image: '/assets/services/photo-manipulation/concept-06.webp'
      }
    ],
    relatedServices: [
      { slug: 'photo-retouching', title: 'Photo Retouching & Color Correction' },
      { slug: 'wedding-album-design', title: 'Wedding Album Design' }
    ],
    pricingNote: 'Quoted per image complexity, with complimentary evaluation prior to commencing work.'
  }
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES.find(s => s.slug === slug || s.id === slug);
}
