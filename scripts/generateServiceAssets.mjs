import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const servicesBase = path.join(rootDir, 'public', 'assets', 'services');

const servicesConfig = [
  {
    folder: 'wedding-album-design',
    serviceTitle: 'WEDDING ALBUM DESIGN',
    colorScheme: { bg: '#181818', text: '#FBF9F5', accent: '#C5A880', subtle: '#2D2D2D' },
    concepts: [
      { id: 'concept-01', title: 'The Monolithic Hero Spread', tag: 'PANORAMIC SYMMETRY' },
      { id: 'concept-02', title: 'Asymmetrical Editorial Duet', tag: 'NEGATIVE SPACE & FOCUS' },
      { id: 'concept-03', title: 'Sacred Ritual Rhythm', tag: 'CULTURAL CEREMONY PACING' },
      { id: 'concept-04', title: 'The Heirloom Details Suite', tag: 'TEXTURE & COUTURE' },
      { id: 'concept-05', title: 'The Golden Hour Dialogue', tag: 'WARMTH & KINETIC MOVEMENT' },
      { id: 'concept-06', title: 'The Starlit Finale', tag: 'THE CONCLUDING SPREAD' }
    ]
  },
  {
    folder: 'pre-shoot-engagement',
    serviceTitle: 'PRE-SHOOT & ENGAGEMENT ALBUMS',
    colorScheme: { bg: '#1C1B19', text: '#F7F4EE', accent: '#D4B996', subtle: '#2B2925' },
    concepts: [
      { id: 'concept-01', title: 'Golden Hour Coastline Narrative', tag: 'OCEAN HORIZON & BREEZE' },
      { id: 'concept-02', title: 'Architectural Heritage Session', tag: 'COLONIAL STONE & SHADOW' },
      { id: 'concept-03', title: 'Candid Documentary Motion', tag: 'UNPOSED AUTHENTIC CONNECTION' },
      { id: 'concept-04', title: 'Intimate Indoor Morning Quiet', tag: 'SOFT AMBIENT NATURAL LIGHT' },
      { id: 'concept-05', title: 'Minimalist Studio Study', tag: 'HIGH CONTRAST & FORM' },
      { id: 'concept-06', title: 'Twilight Blue Hour Reflection', tag: 'ATMOSPHERIC EVENING ROMANCE' }
    ]
  },
  {
    folder: 'photo-retouching',
    serviceTitle: 'PHOTO RETOUCHING & ENHANCEMENT',
    colorScheme: { bg: '#151718', text: '#F0F3F4', accent: '#9EB3C2', subtle: '#24282B' },
    concepts: [
      { id: 'concept-01', title: 'Frequency Separation & Skin Retouch', tag: 'NATURAL TEXTURE PRESERVATION' },
      { id: 'concept-02', title: 'High-Key Light Sculpting', tag: 'LUMINANCE BALANCING' },
      { id: 'concept-03', title: 'Complex Veil & Fabric Restoration', tag: 'INTRICATE DETAIL RECOVERY' },
      { id: 'concept-04', title: 'Distraction & Stray Hair Removal', tag: 'CLEAN ARCHIVAL POLISH' },
      { id: 'concept-05', title: 'Editorial Jewelry & Regalia Sparkle', tag: 'GOLD METALLIC ENHANCEMENT' },
      { id: 'concept-06', title: 'Dusk Tone & Sky Harmonization', tag: 'BALANCED DYNAMIC RANGE' }
    ]
  },
  {
    folder: 'album-layout-cover',
    serviceTitle: 'ALBUM LAYOUT & COVER DESIGN',
    colorScheme: { bg: '#1A1816', text: '#FAF7F2', accent: '#C8A27A', subtle: '#2E2822' },
    concepts: [
      { id: 'concept-01', title: 'Blind Deboss & Foil Stamping', tag: 'TACTILE COVER EMBOSSING' },
      { id: 'concept-02', title: 'Full-Grain Leather Heirloom Spine', tag: 'ARTISANAL BOOKBINDING' },
      { id: 'concept-03', title: 'Japanese Bookcloth Linen Wrap', tag: 'TEXTURED FABRIC FINISH' },
      { id: 'concept-04', title: 'Acrylic Facemount & Metal Inlay', tag: 'MODERN CONTEMPORARY COVER' },
      { id: 'concept-05', title: 'Custom Monogram Typographic Suite', tag: 'BESPOKE BESPOKE INITIALS' },
      { id: 'concept-06', title: 'Clamshell Archival Presentation Box', tag: 'LUXURY ENCLOSURE' }
    ]
  },
  {
    folder: 'wedding-photo-editing',
    serviceTitle: 'WEDDING PHOTO EDITING',
    colorScheme: { bg: '#171819', text: '#F5F5F7', accent: '#B8C0C8', subtle: '#26292D' },
    concepts: [
      { id: 'concept-01', title: 'Full Gallery Signature Tone Matching', tag: 'CONSISTENT COLOR GRADING' },
      { id: 'concept-02', title: 'Mixed Lighting & White Balance Fix', tag: 'CHURCH & RECEPTION CORRECTION' },
      { id: 'concept-03', title: 'Timeless Monochrome B&W Conversion', tag: 'DEEP CONTRAST & TONALITY' },
      { id: 'concept-04', title: 'Highlight Recovery on White Gowns', tag: 'DETAIL-SAFE DYNAMIC RANGE' },
      { id: 'concept-05', title: 'Ceremonial Vibrant Hue Grading', tag: 'RICH SATURATION CONTROL' },
      { id: 'concept-06', title: 'Atmospheric Film Grain Calibration', tag: 'FINE ART ANALOG MOOD' }
    ]
  },
  {
    folder: 'photo-manipulation',
    serviceTitle: 'PHOTO MANIPULATION',
    colorScheme: { bg: '#161617', text: '#F4F4F6', accent: '#C5A880', subtle: '#28282B' },
    concepts: [
      { id: 'concept-01', title: 'Seamless Guest & Object Removal', tag: 'CLEAN BACKGROUND RESTORATION' },
      { id: 'concept-02', title: 'Editorial Head & Expression Swap', tag: 'PERFECT FAMILY GROUP MOMENTS' },
      { id: 'concept-03', title: 'Dramatic Sunset & Sky Replacement', tag: 'NATURALISTIC BLENDING' },
      { id: 'concept-04', title: 'Canopy & Floral Volume Extension', tag: 'LUXURY VENUE ELEVATION' },
      { id: 'concept-05', title: 'Cinematic Lens Flare & Fog Atmosphere', tag: 'CREATIVE LIGHT ILLUSION' },
      { id: 'concept-06', title: 'Architectural Perspective Correction', tag: 'PERFECT VERTICAL ALIGNMENT' }
    ]
  }
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateSvg({ width, height, title, subtitle, serviceTitle, colors, isHero = false }) {
  const rectW = width - 80;
  const rectH = height - 80;

  const escTitle = escapeXml(title);
  const escSub = escapeXml(subtitle);
  const escService = escapeXml(serviceTitle);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="${colors.subtle}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${colors.bg}" stop-opacity="1"/>
        </radialGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.accent}" stroke-opacity="0.05" stroke-width="1"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#grad)" />
      <rect width="${width}" height="${height}" fill="url(#grid)" />

      <!-- Outer Minimal Frame -->
      <rect x="40" y="40" width="${rectW}" height="${rectH}" fill="none" stroke="${colors.accent}" stroke-opacity="0.25" stroke-width="1.5" />
      
      <!-- Corner Accents -->
      <path d="M 35 55 L 35 35 L 55 35" fill="none" stroke="${colors.accent}" stroke-width="2" />
      <path d="M ${width - 55} 35 L ${width - 35} 35 L ${width - 35} 55" fill="none" stroke="${colors.accent}" stroke-width="2" />
      <path d="M 35 ${height - 55} L 35 ${height - 35} L 55 ${height - 35}" fill="none" stroke="${colors.accent}" stroke-width="2" />
      <path d="M ${width - 55} ${height - 35} L ${width - 35} ${height - 35} L ${width - 35} ${height - 55}" fill="none" stroke="${colors.accent}" stroke-width="2" />

      <!-- Center Conceptual Spread Representation -->
      <g transform="translate(${width / 2 - 200}, ${height / 2 - 120})">
        <!-- Spread Mock Left -->
        <rect x="0" y="0" width="195" height="150" fill="${colors.subtle}" fill-opacity="0.6" stroke="${colors.accent}" stroke-opacity="0.3" stroke-width="1" />
        <line x1="20" y1="30" x2="175" y2="30" stroke="${colors.accent}" stroke-opacity="0.2" stroke-width="1" />
        <line x1="20" y1="45" x2="140" y2="45" stroke="${colors.accent}" stroke-opacity="0.2" stroke-width="1" />
        <rect x="20" y="60" width="155" height="70" fill="${colors.bg}" fill-opacity="0.5" />
        
        <!-- Spread Mock Right -->
        <rect x="205" y="0" width="195" height="150" fill="${colors.subtle}" fill-opacity="0.6" stroke="${colors.accent}" stroke-opacity="0.3" stroke-width="1" />
        <rect x="225" y="20" width="155" height="110" fill="${colors.bg}" fill-opacity="0.5" stroke="${colors.accent}" stroke-opacity="0.2" stroke-width="1" />
        <circle cx="302" cy="75" r="16" fill="none" stroke="${colors.accent}" stroke-opacity="0.4" stroke-width="1" />
      </g>

      <!-- Badges and Typography -->
      <text x="${width / 2}" y="95" font-family="'Manrope', -apple-system, sans-serif" font-size="11" font-weight="600" letter-spacing="4" fill="${colors.accent}" text-anchor="middle">
        2R CREATIONS &#8226; ${escService}
      </text>

      <text x="${width / 2}" y="${height / 2 + 85}" font-family="'DM Serif Display', Georgia, serif" font-size="${isHero ? 34 : 26}" font-weight="400" letter-spacing="1" fill="${colors.text}" text-anchor="middle">
        ${escTitle}
      </text>

      <text x="${width / 2}" y="${height / 2 + 120}" font-family="'Manrope', -apple-system, sans-serif" font-size="12" font-weight="500" letter-spacing="2" fill="${colors.accent}" text-anchor="middle">
        ${escSub}
      </text>

      <!-- Bottom Compliance Disclaimer -->
      <rect x="${width / 2 - 160}" y="${height - 85}" width="320" height="26" fill="${colors.bg}" rx="3" stroke="${colors.accent}" stroke-opacity="0.2" />
      <text x="${width / 2}" y="${height - 68}" font-family="'Manrope', -apple-system, sans-serif" font-size="9" font-weight="600" letter-spacing="1.5" fill="${colors.accent}" text-anchor="middle">
        CONCEPTUAL ARTWORK &#8226; SERVICE EXAMPLE
      </text>
    </svg>
  `;
}

async function run() {
  console.log('[Service Assets] Generating dedicated WebP assets with Sharp...');

  for (const s of servicesConfig) {
    const dir = path.join(servicesBase, s.folder);
    fs.mkdirSync(dir, { recursive: true });

    // 1. Generate Hero (1600x900)
    const heroSvg = generateSvg({
      width: 1600,
      height: 900,
      title: s.serviceTitle,
      subtitle: 'FINE ART STUDIO ARCHITECTURE & EXECUTION',
      serviceTitle: 'SIGNATURE SERVICE STUDY',
      colors: s.colorScheme,
      isHero: true
    });
    await sharp(Buffer.from(heroSvg))
      .webp({ quality: 90 })
      .toFile(path.join(dir, 'hero.webp'));

    // 2. Generate 6 Concepts (1200x800)
    for (let i = 0; i < s.concepts.length; i++) {
      const c = s.concepts[i];
      const filename = `${c.id}.webp`;
      const conceptSvg = generateSvg({
        width: 1200,
        height: 800,
        title: c.title,
        subtitle: c.tag,
        serviceTitle: s.serviceTitle,
        colors: s.colorScheme,
        isHero: false
      });
      await sharp(Buffer.from(conceptSvg))
        .webp({ quality: 90 })
        .toFile(path.join(dir, filename));
    }

    console.log(`[Service Assets] Generated assets for ${s.folder}`);
  }

  console.log('[Service Assets] All service concepts successfully generated in WebP format!');
}

run().catch(err => {
  console.error('[Service Assets] Error:', err);
  process.exit(1);
});
