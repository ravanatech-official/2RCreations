import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

const baseUrl = (process.env.VITE_APP_URL || 'https://2rcreations.com').trim().replace(/\/+$/, '');
const todayIso = new Date().toISOString().split('T')[0];

const manifestPath = path.join(rootDir, 'src', 'data', 'albumManifest.json');
const albumManifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : {};

const DEFAULT_OG_IMAGE = '/assets/og/default-og.jpg';
const DEFAULT_OG_ALT = '2R Creations — Specialist Wedding Album Designer & Editions of Timeless Memories';

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceOrInsertMeta(html, attr, key, content) {
  const escaped = escapeHtmlAttr(content);
  const regex = new RegExp(`<meta\\s+${attr}=["']${key}["']\\s+content=["'][^"']*["']\\s*\\/?>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${escaped}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function removeMeta(html, attr, key) {
  const regex = new RegExp(`\\s*<meta\\s+${attr}=["']${key}["']\\s+content=["'][^"']*["']\\s*\\/?>`, 'gi');
  return html.replace(regex, '');
}

const ALBUMS_SEO = [
  {
    slug: 'traditional-sri-lankan-wedding',
    folderName: '01-traditional-sri-lankan',
    title: 'Timeless Sri Lankan Wedding',
    subtitle: 'Traditional Cultural Ceremony & Heritage Celebration',
    description: 'An intimate narrative celebrating Sri Lankan wedding traditions—sacred Poruwa rituals, Kandyan regalia, heirloom jewelry, and genuine family warmth.',
    keywords: 'Traditional, Sri Lankan, Kandyan, Poruwa, Cultural Heritage, Wedding Album'
  },
  {
    slug: 'modern-editorial-wedding',
    folderName: '02-modern-editorial',
    title: 'Modern Editorial Wedding',
    subtitle: 'Minimalist Elegance, Restraint & Architectural Balance',
    description: 'Clean lines, effortless symmetry, and refined visual restraint. Crafted for modern weddings embracing timeless architectural composition.',
    keywords: 'Modern, Editorial, Minimalist, Contemporary, Wedding Album'
  },
  {
    slug: 'luxury-wedding',
    folderName: '03-luxury-estate',
    title: 'Luxury Church Wedding',
    subtitle: 'Cathedral Splendor, Sacred Vows & Candlelit Grandeur',
    description: 'Sacred elegance inside vaulted stone cathedrals—honoring grand bridal veils, solemn altar vows, and romantic candlelit receptions.',
    keywords: 'Luxury, Church Wedding, Cathedral, Grand Estate, Wedding Album'
  },
  {
    slug: 'indian-wedding',
    folderName: '04-indian-heritage',
    title: 'Indian Wedding Story',
    subtitle: 'Sacred Rituals & Royal North Indian Hindu Celebration',
    description: 'An elegant North Indian Hindu wedding celebration honoring sacred rituals, intricate henna art, Baraat joy, and heartfelt pheras.',
    keywords: 'Indian, Hindu Wedding, Heritage, Royal Wedding, Pheras, Wedding Album'
  },
  {
    slug: 'western-wedding',
    folderName: '05-western-destination',
    title: 'Western Destination Wedding',
    subtitle: 'Coastal Intimacy & Sun-Drenched Naturalism',
    description: 'An intimate coastal destination celebration set against sun-washed cliffs and ocean horizons with candid documentary luxury.',
    keywords: 'Destination, Coastal, Western Wedding, Sunset Vows, Wedding Album'
  },
  {
    slug: 'pre-shoot-engagement',
    folderName: '06-preshoot-engagement',
    title: 'Pre-Shoot / Engagement Story',
    subtitle: 'Cinematic Narrative of Romance, Connection & Movement',
    description: 'A cinematic couple story focusing on intimacy, natural movement, quiet gestures, and golden hour light.',
    keywords: 'Pre-Shoot, Engagement, Couple Session, Signing Book, Photo Book'
  }
];

const SERVICES_SEO = [
  {
    slug: 'wedding-album-design',
    title: 'Wedding Album Design',
    shortTitle: 'Album Design',
    tagline: 'Story-Driven Heirloom Layouts for Fine Art Photographers',
    description: 'From intimate elopements to grand multi-day celebrations, we transform raw photographic galleries into timeless, narrative-driven heirloom wedding albums.',
    heroImage: '/assets/services/wedding-album-design/hero.webp',
    steps: [
      { name: 'Gallery Ingestion & Narrative Curation', text: 'Analyze your complete wedding gallery to establish emotional arcs and chronological flow.' },
      { name: 'Bespoke Spread Architecture', text: 'Craft spreads with generous negative space, complementary tonality, and editorial hierarchy.' },
      { name: 'Collaborative Online Proofing', text: 'Digital proofing links allow swift review and spread-by-spread revision adjustments.' },
      { name: 'Lab-Ready Production Export', text: 'Final high-resolution spreads exported strictly to your print lab profile and millimeter bleed.' }
    ]
  },
  {
    slug: 'pre-shoot-engagement',
    title: 'Pre-Shoot & Engagement Album Design',
    shortTitle: 'Pre-Shoot Albums',
    tagline: 'Casual Elegance & Cinematic Storytelling Free of Wedding Day Formality',
    description: 'We design pre-shoot and engagement albums that feel like fine art monographs, celebrating movement, golden hour light, and spontaneous emotion.',
    heroImage: '/assets/services/pre-shoot-engagement/hero.webp',
    steps: [
      { name: 'Setting & Mood Mapping', text: 'Map the progression of afternoon ambiance, golden hour light, and twilight mood.' },
      { name: 'Movement & Connection Layout', text: 'Curate dynamic pairings that emphasize genuine glances, motion, and negative space.' },
      { name: 'Optional Guest Signage Margins', text: 'Engineer balanced white space margins when used as a reception signing book.' },
      { name: 'Print-Ready Delivery', text: 'Full-resolution 300 DPI spreads delivered per your print partner specifications.' }
    ]
  },
  {
    slug: 'photo-retouching',
    title: 'Photo Retouching & Color Correction',
    shortTitle: 'Retouching & Color',
    tagline: 'Natural Skin Tones, Film-Inspired Tonal Harmony, and Restrained Polish',
    description: 'Specialized wedding photo retouching that preserves natural skin texture while harmonizing color temperature and luminosity across every album spread.',
    heroImage: '/assets/services/photo-retouching/hero.webp',
    steps: [
      { name: 'Tonal Assessment', text: 'Evaluate exposure, white balance, and dynamic range across every image pair.' },
      { name: 'Frequency Separation & Texture Preservation', text: 'Evening out skin tone naturally while keeping real pore structure intact.' },
      { name: 'Color Matching Across Spreads', text: 'Strictly calibrate left and right facing pages for cohesive print harmony.' },
      { name: 'Hi-Res Delivery', text: 'Deliver finished portraits in lossless 16-bit TIFF or maximum quality JPEG.' }
    ]
  },
  {
    slug: 'album-layout-cover-design',
    title: 'Album Layout & Cover Design',
    shortTitle: 'Cover & Foil Typography',
    tagline: 'Heirloom Debossing, Custom Typography & Cover Artistry',
    description: 'Custom vector typography for foil stamping, blind debossing, acrylic faceplates, and archival spine titling engineered to print lab specifications.',
    heroImage: '/assets/services/album-layout-cover/hero.webp',
    steps: [
      { name: 'Typography Exploration', text: 'Curate modern serif, delicate script, or geometric type pairings.' },
      { name: 'Vector Die Construction', text: 'Build production-ready vector foil and debossing dies with accurate stroke weights.' },
      { name: '3D Studio Mockup', text: 'Preview metallic foil or blind debossing against your chosen linen or leather swatch.' },
      { name: 'Die & Layout Export', text: 'Supply 100% vector EPS/PDF die artwork alongside full album spreads.' }
    ]
  },
  {
    slug: 'wedding-photo-editing',
    title: 'Wedding Photo Editing & Culling',
    shortTitle: 'Editing & Culling',
    tagline: 'Intelligent Story Selection & Consistent Lightroom Color Grading',
    description: 'Overcome post-production bottlenecks with narrative wedding culling and consistent Lightroom color grading matched to your studio preset.',
    heroImage: '/assets/services/wedding-photo-editing/hero.webp',
    steps: [
      { name: 'Intelligent First Pass', text: 'Remove blinks, out-of-focus frames, test shots, and redundant duplicates.' },
      { name: 'Story Arc Selection', text: 'Curate balanced coverage across ceremonies, portraits, and both families.' },
      { name: 'Consistent Color Calibration', text: 'Apply your signature aesthetic and tune exposure image-by-image.' },
      { name: 'Lightroom Catalog Return', text: 'Return clean .lrcat catalog files ready for instant client gallery export.' }
    ]
  },
  {
    slug: 'photo-manipulation',
    title: 'Photo Manipulation & Object Removal',
    shortTitle: 'Object Removal & Clean-up',
    tagline: 'Clean Architectural Lines, Distraction-Free Vistas & Seamless Retouching',
    description: 'Manual pixel artistry to remove exit signs, cables, stray guest phones, and background tourists while matching native sensor grain at 100% zoom.',
    heroImage: '/assets/services/photo-manipulation/hero.webp',
    steps: [
      { name: 'Scene Structure Analysis', text: 'Inspect perspective geometry, grain structure, and lens depth of field.' },
      { name: 'Pixel Synthesis & Reconstruction', text: 'Rebuild architecture, foliage, or flooring seamlessly behind removed objects.' },
      { name: 'Lighting & Shadow Integration', text: 'Match natural cast shadows and ambient reflections across edited surfaces.' },
      { name: 'Grain & Texture Matching', text: 'Restore native sensor grain so edits stay undetectable in large archival prints.' }
    ]
  }
];

const FAQS_SEO = [
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

function getAlbumThumb(folderName) {
  const entry = albumManifest[folderName];
  if (entry?.thumbnailPath) return entry.thumbnailPath;
  return `/albums/${folderName}/thumbnail.webp`;
}

function buildRoutes() {
  const routes = [
    {
      path: '/portfolio',
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Wedding Album Design Portfolio | 2R Creations',
      description: 'Explore bespoke wedding album concepts, editorial spread pacing, natural skin retouching, and before/after color grading crafted by 2R Creations.',
      ogImage: getAlbumThumb('01-traditional-sri-lankan'),
      ogImageAlt: '2R Creations Signature Wedding Album Design Portfolio',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' }
      ],
      structuredData: {
        '@type': 'CollectionPage',
        name: '2R Creations Wedding Album & Retouching Portfolio',
        url: `${baseUrl}/portfolio`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: ALBUMS_SEO.length,
          itemListElement: ALBUMS_SEO.map((a, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: a.title,
            url: `${baseUrl}/portfolio/${a.slug}`
          }))
        }
      }
    },
    {
      path: '/services',
      changefreq: 'monthly',
      priority: '0.9',
      title: 'Album Design & Retouching Services | 2R Creations',
      description: 'Wedding album layout design, cover typography, pre-shoot monographs, photo retouching, culling, and object removal for photographers worldwide.',
      ogImage: SERVICES_SEO[0].heroImage,
      ogImageAlt: '2R Creations Wedding Album Design & Fine Art Retouching Services',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' }
      ],
      structuredData: {
        '@type': 'CollectionPage',
        name: '2R Creations Services & Capabilities',
        url: `${baseUrl}/services`,
        mainEntity: {
          '@type': 'OfferCatalog',
          name: 'Studio Services',
          itemListElement: SERVICES_SEO.map((svc, idx) => ({
            '@type': 'Offer',
            position: idx + 1,
            itemOffered: {
              '@type': 'Service',
              name: svc.title,
              description: svc.tagline,
              url: `${baseUrl}/services/${svc.slug}`
            }
          }))
        }
      }
    },
    {
      path: '/gallery',
      changefreq: 'weekly',
      priority: '0.8',
      title: 'Selected Work & Client Archive | 2R Creations',
      description: 'Curated wedding album designs, retouching case studies, and print-ready spreads crafted for fine art photographers and studios worldwide.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Gallery', path: '/gallery' }
      ],
      structuredData: {
        '@type': 'CollectionPage',
        name: '2R Creations Selected Work & Client Archive',
        url: `${baseUrl}/gallery`
      }
    },
    {
      path: '/about',
      changefreq: 'monthly',
      priority: '0.75',
      title: 'About Sachini Fernando & Studio | 2R Creations',
      description: 'Meet Sachini Fernando, founder of 2R Creations. Dedicated to heirloom wedding album design and natural photo retouching with 2–3 day turnaround.',
      ogImage: '/assets/images/2R-Creations-Designer-Portrait-Editorial.jpg',
      ogImageAlt: 'Sachini Fernando — Lead Wedding Album Designer & Founder of 2R Creations',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' }
      ],
      structuredData: {
        '@type': 'AboutPage',
        name: 'About 2R Creations',
        url: `${baseUrl}/about`,
        mainEntity: { '@id': `${baseUrl}/#founder` }
      }
    },
    {
      path: '/process',
      changefreq: 'monthly',
      priority: '0.75',
      title: '4-Step Album Design Workflow | 2R Creations',
      description: 'Our streamlined 4-step wedding album workflow for photographers: photo upload, bespoke spread design, online proofing, and lab-ready delivery.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Process', path: '/process' }
      ],
      structuredData: {
        '@type': 'HowTo',
        name: 'How 2R Creations Designs Your Wedding Album',
        description: 'A seamless 4-step outsourcing workflow for wedding photographers and couples worldwide.',
        totalTime: 'P3D',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Send Your Photos', text: 'Provide your selected wedding photographs and print lab specifications.' },
          { '@type': 'HowToStep', position: 2, name: 'Design', text: 'We craft bespoke spreads balanced around story pacing, style, and visual direction.' },
          { '@type': 'HowToStep', position: 3, name: 'Review', text: 'Review the digital proofing spreads online and share requested adjustments.' },
          { '@type': 'HowToStep', position: 4, name: 'Final Delivery', text: 'Print-ready high-resolution artwork is exported strictly to your lab dimensions.' }
        ]
      }
    },
    {
      path: '/faq',
      changefreq: 'monthly',
      priority: '0.75',
      title: 'Wedding Album Design FAQ | 2R Creations',
      description: 'Answers on wedding album turnaround times, revisions, international photographer collaboration, wedding styles, and image curation.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'FAQ', path: '/faq' }
      ],
      structuredData: {
        '@type': 'FAQPage',
        mainEntity: FAQS_SEO.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      }
    },
    {
      path: '/contact',
      changefreq: 'monthly',
      priority: '0.85',
      title: 'Start Your Wedding Album Project | 2R Creations',
      description: 'Contact 2R Creations for a custom wedding album design or retouching quote, free sample spread, and 2–3 day turnaround schedule.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' }
      ],
      structuredData: {
        '@type': 'ContactPage',
        name: 'Contact 2R Creations Studio',
        url: `${baseUrl}/contact`,
        mainEntity: { '@id': `${baseUrl}/#organization` }
      }
    },
    {
      path: '/privacy',
      changefreq: 'yearly',
      priority: '0.3',
      title: 'Privacy Policy | 2R Creations',
      description: 'How 2R Creations collects, protects, and handles contact form submissions and studio inquiry details.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' }
      ]
    },
    {
      path: '/client-image-policy',
      changefreq: 'yearly',
      priority: '0.4',
      title: 'Client Image Protection Policy | 2R Creations',
      description: 'Our strict confidentiality standards for client wedding photographs, encrypted storage, and non-disclosure commitments.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Client Image Policy', path: '/client-image-policy' }
      ]
    },
    {
      path: '/terms',
      changefreq: 'yearly',
      priority: '0.3',
      title: 'Terms of Service | 2R Creations',
      description: 'Terms and conditions governing album design orders, turnaround estimates, proofing revisions, and lab print exports.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' }
      ]
    },
    {
      path: '/preferences',
      changefreq: 'yearly',
      priority: '0.4',
      title: 'Privacy Preferences & Opt-Out | 2R Creations',
      description: 'Manage your cookie consent preferences, submit an instant WhatsApp opt-out, or exercise GDPR/CCPA data export and erasure rights.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Privacy Preferences', path: '/preferences' }
      ]
    }
  ];

  for (const album of ALBUMS_SEO) {
    const thumb = getAlbumThumb(album.folderName);
    routes.push({
      path: `/portfolio/${album.slug}`,
      changefreq: 'monthly',
      priority: '0.85',
      title: `${album.title} Album Design | 2R Creations`,
      description: `${album.description} 24 spreads (48 pages) crafted with editorial pacing by 2R Creations.`,
      ogImage: thumb,
      ogImageAlt: `${album.title} — ${album.subtitle} | 2R Creations`,
      type: 'article',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: album.title, path: `/portfolio/${album.slug}` }
      ],
      structuredData: {
        '@type': 'CreativeWork',
        name: album.title,
        headline: album.subtitle,
        description: album.description,
        url: `${baseUrl}/portfolio/${album.slug}`,
        image: `${baseUrl}${thumb}`,
        keywords: album.keywords,
        creator: { '@id': `${baseUrl}/#organization` }
      }
    });

    routes.push({
      path: `/portfolio/${album.slug}/view`,
      changefreq: 'monthly',
      priority: '0.75',
      title: `${album.title} Spread Viewer | 2R Creations`,
      description: `Flip through all 24 editorial spreads of the ${album.title} wedding album concept designed by 2R Creations.`,
      ogImage: thumb,
      ogImageAlt: `${album.title} Interactive Album Spread Viewer`,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: album.title, path: `/portfolio/${album.slug}` },
        { name: 'Spread Viewer', path: `/portfolio/${album.slug}/view` }
      ]
    });
  }

  for (const svc of SERVICES_SEO) {
    routes.push({
      path: `/services/${svc.slug}`,
      changefreq: 'monthly',
      priority: '0.8',
      title: `${svc.title} | 2R Creations`,
      description: svc.description.slice(0, 158),
      ogImage: svc.heroImage,
      ogImageAlt: `${svc.title} — 2R Creations Studio`,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: svc.shortTitle, path: `/services/${svc.slug}` }
      ],
      structuredData: [
        {
          '@type': 'Service',
          name: svc.title,
          serviceType: svc.shortTitle,
          description: svc.description,
          url: `${baseUrl}/services/${svc.slug}`,
          image: `${baseUrl}${svc.heroImage}`,
          provider: { '@id': `${baseUrl}/#organization` },
          areaServed: ['US', 'GB', 'AU', 'CA', 'NZ', 'LK', 'IN', 'EU']
        },
        {
          '@type': 'HowTo',
          name: `${svc.title} Workflow`,
          step: svc.steps.map((st, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            name: st.name,
            text: st.text
          }))
        }
      ]
    });
  }

  return routes;
}

function renderRouteHtml(templateHtml, route) {
  const fullUrl = `${baseUrl}${route.path}`;
  const ogImageRel = route.ogImage || DEFAULT_OG_IMAGE;
  const fullOgImage = ogImageRel.startsWith('http') ? ogImageRel : `${baseUrl}${ogImageRel}`;
  const ogImageAlt = route.ogImageAlt || DEFAULT_OG_ALT;
  const isDefaultOg = ogImageRel === DEFAULT_OG_IMAGE;

  let html = templateHtml;

  // Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlText(route.title)}</title>`);

  // Canonical
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtmlAttr(fullUrl)}" />`
  );

  // Description & Robots
  html = replaceOrInsertMeta(html, 'name', 'description', route.description);
  if (route.noIndex) {
    html = replaceOrInsertMeta(html, 'name', 'robots', 'noindex, nofollow');
  }

  // OpenGraph
  html = replaceOrInsertMeta(html, 'property', 'og:type', route.type || 'website');
  html = replaceOrInsertMeta(html, 'property', 'og:url', fullUrl);
  html = replaceOrInsertMeta(html, 'property', 'og:title', route.title);
  html = replaceOrInsertMeta(html, 'property', 'og:description', route.description);
  html = replaceOrInsertMeta(html, 'property', 'og:image', fullOgImage);
  html = replaceOrInsertMeta(html, 'property', 'og:image:secure_url', fullOgImage);
  html = replaceOrInsertMeta(html, 'property', 'og:image:alt', ogImageAlt);

  if (!isDefaultOg) {
    html = removeMeta(html, 'property', 'og:image:width');
    html = removeMeta(html, 'property', 'og:image:height');
    const mimeType = ogImageRel.endsWith('.webp') ? 'image/webp' : ogImageRel.endsWith('.png') ? 'image/png' : 'image/jpeg';
    html = replaceOrInsertMeta(html, 'property', 'og:image:type', mimeType);
  }

  // Twitter
  html = replaceOrInsertMeta(html, 'name', 'twitter:url', fullUrl);
  html = replaceOrInsertMeta(html, 'name', 'twitter:title', route.title);
  html = replaceOrInsertMeta(html, 'name', 'twitter:description', route.description);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image', fullOgImage);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image:alt', ogImageAlt);

  // Route-specific JSON-LD
  const graph = [];
  if (route.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: route.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: `${baseUrl}${b.path}`
      }))
    });
  }
  if (route.structuredData) {
    if (Array.isArray(route.structuredData)) {
      graph.push(...route.structuredData);
    } else {
      graph.push(route.structuredData);
    }
  }

  if (graph.length > 0) {
    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="route-structured-data">${jsonLd}</script>\n  </head>`
    );
  }

  return html;
}

function buildSitemapXml(routes) {
  const entries = [
    {
      loc: `${baseUrl}/`,
      lastmod: todayIso,
      changefreq: 'weekly',
      priority: '1.0'
    },
    ...routes.map((r) => ({
      loc: `${baseUrl}${r.path}`,
      lastmod: todayIso,
      changefreq: r.changefreq || 'monthly',
      priority: r.priority || '0.7'
    }))
  ];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const entry of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${entry.loc}</loc>`);
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    lines.push(`    <priority>${entry.priority}</priority>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>', '');
  return lines.join('\n');
}

function main() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('[generate-seo-routes] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  let baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  if (baseUrl !== 'https://2rcreations.com') {
    baseHtml = baseHtml.replaceAll('https://2rcreations.com', baseUrl);
  }
  fs.writeFileSync(indexHtmlPath, baseHtml, 'utf8');

  const routes = buildRoutes();

  for (const route of routes) {
    const cleanRel = route.path.replace(/^\/+/, '');
    const outFile = path.join(distDir, `${cleanRel}.html`);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, renderRouteHtml(baseHtml, route), 'utf8');
  }

  // Write static 404.html with noindex
  const notFoundHtml = renderRouteHtml(baseHtml, {
    path: '/404',
    title: 'Page Not Found | 2R Creations',
    description: 'The requested page could not be found on 2R Creations.',
    noIndex: true
  });
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

  // Write updated sitemap.xml to both dist/ and public/
  const sitemapXml = buildSitemapXml(routes);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(`[generate-seo-routes] Pre-rendered ${routes.length} SEO HTML routes + 404.html + sitemap.xml (${routes.length + 1} URLs) for ${baseUrl}`);
}

main();
