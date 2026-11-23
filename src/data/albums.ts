import { Album, AlbumPageSpread, SpreadType } from '../types';
import albumManifestData from './albumManifest.json';

const manifest = albumManifestData as Record<string, {
  hasThumbnail: boolean;
  thumbnailPath: string;
  availablePhotos: string[];
  availablePhotoCount: number;
}>;

interface StoryThemeConfig {
  part: AlbumPageSpread['storyPart'];
  type: SpreadType;
  label: string;
}

// 01 — SRI LANKAN TRADITIONAL NARRATIVE (Heritage, Culture, Rituals, Family, Emotion)
const SRI_LANKAN_THEMES: StoryThemeConfig[] = [
  { part: 'Opening', type: 'hero', label: 'THE SACRED DAWN & ARRIVAL' },
  { part: 'Opening', type: 'split', label: 'HERITAGE SANCTUARY & ATMOSPHERE' },
  { part: 'Details', type: 'detail', label: 'HEIRLOOM JEWELLERY & TRADITIONAL EMBLEMS' },
  { part: 'Details', type: 'split', label: 'KANDYAN REGALIA & BRIDAL ADORNMENT' },
  { part: 'Getting Ready', type: 'split', label: 'THE BRIDAL SUITE BLESSINGS' },
  { part: 'Getting Ready', type: 'split', label: 'THE GROOM ATTIRE & PREPARATIONS' },
  { part: 'Getting Ready', type: 'split', label: 'FAMILY BLESSINGS & BETEL LEAF OFFERING' },
  { part: 'Getting Ready', type: 'split', label: 'FINAL BLESSINGS BEFORE THE PORUWA' },
  { part: 'Ceremony', type: 'split', label: 'PROCESSION & DRUMMERS PROCESSION' },
  { part: 'Ceremony', type: 'hero', label: 'ASCENDING THE PORUWA' },
  { part: 'Ceremony', type: 'split', label: 'EXCHANGE OF RINGS & PURITY BLESSINGS' },
  { part: 'Ceremony', type: 'split', label: 'TYING OF NUPTIAL THREAD & WATER CHANT' },
  { part: 'Ceremony', type: 'split', label: 'LIGHTING THE TRADITIONAL OIL LAMP' },
  { part: 'Ceremony', type: 'split', label: 'JAYAMANGALA GATHA & BLESSINGS' },
  { part: 'First Look & Couple', type: 'hero', label: 'THE FIRST PORTRAITS AS HUSBAND & WIFE' },
  { part: 'First Look & Couple', type: 'split', label: 'EMOTIONAL FAMILY EMBRACE' },
  { part: 'Couple Portrait Story', type: 'hero', label: 'CULTURAL MAJESTY COUPLE SESSION' },
  { part: 'Couple Portrait Story', type: 'split', label: 'REGAL ARCHITECTURAL SILHOUETTES' },
  { part: 'Celebration', type: 'split', label: 'GRAND ENTRANCE TO CELEBRATION' },
  { part: 'Celebration', type: 'split', label: 'FIRST DANCE & JOYOUS REVELRY' },
  { part: 'Celebration', type: 'split', label: 'TRADITIONAL FEAST & FAMILY TOASTS' },
  { part: 'Celebration', type: 'split', label: 'HEARTFELT BLESSINGS & CONVERSATIONS' },
  { part: 'Closing', type: 'split', label: 'EVENING REVELRY WITH DEAR FRIENDS' },
  { part: 'Closing', type: 'hero', label: 'THE HEIRLOOM FAREWELL' }
];

// 02 — MODERN EDITORIAL NARRATIVE (Architecture, Restraint, Geometry, Editorial Silence, Minimalism)
const MODERN_EDITORIAL_THEMES: StoryThemeConfig[] = [
  { part: 'Opening', type: 'hero', label: 'MONOLITH & MORNING LIGHT' },
  { part: 'Opening', type: 'split', label: 'EDITORIAL GEOMETRY & ARCHITECTURAL VISTA' },
  { part: 'Details', type: 'detail', label: 'TYPOGRAPHY, INVITATIONS & MINIMALIST ACCENTS' },
  { part: 'Details', type: 'split', label: 'COUTURE SILHOUETTES & MODERN RINGS' },
  { part: 'Getting Ready', type: 'split', label: 'CONTEMPORARY BRIDAL PREPARATIONS' },
  { part: 'Getting Ready', type: 'split', label: 'BLACK TIE GROOM SUITE' },
  { part: 'Getting Ready', type: 'split', label: 'QUIET MOMENTS IN EXPANSIVE SPACE' },
  { part: 'Getting Ready', type: 'split', label: 'FINAL FASHION SILHOUETTE' },
  { part: 'First Look & Couple', type: 'hero', label: 'FIRST LOOK IN THE GALLERY' },
  { part: 'First Look & Couple', type: 'split', label: 'ASYMMETRICAL PORTRAIT PAIRING' },
  { part: 'Ceremony', type: 'split', label: 'SCULPTURAL CEREMONY SETTING' },
  { part: 'Ceremony', type: 'hero', label: 'CONTEMPORARY VOWS IN MONOCHROME' },
  { part: 'Ceremony', type: 'split', label: 'THE EXCHANGE' },
  { part: 'Ceremony', type: 'split', label: 'THE FIRST STEP FORWARD' },
  { part: 'Couple Portrait Story', type: 'hero', label: 'EDITORIAL PORTFOLIO SERIES' },
  { part: 'Couple Portrait Story', type: 'split', label: 'EXPANSIVE NEGATIVE SPACE' },
  { part: 'Couple Portrait Story', type: 'split', label: 'HIGH-CONTRAST MONOCHROME STUDY' },
  { part: 'Celebration', type: 'split', label: 'MODERN COCKTAIL HOUR & CHAMPAGNE TOWER' },
  { part: 'Celebration', type: 'split', label: 'MINIMALIST DINING ROOM INSTALLATION' },
  { part: 'Celebration', type: 'split', label: 'ELEGANT SPEECHES & LAUGHTER' },
  { part: 'Celebration', type: 'split', label: 'FIRST DANCE WITH SCULPTED LIGHTING' },
  { part: 'Celebration', type: 'split', label: 'AFTER-PARTY CANDID FRAMES' },
  { part: 'Closing', type: 'split', label: 'NIGHT SILHOUETTES & CITY LIGHTS' },
  { part: 'Closing', type: 'hero', label: 'THE CONTEMPORARY CONCLUSION' }
];

// 03 — LUXURY CHURCH WEDDING NARRATIVE (Cathedral Splendor, Sacred Blessings, Grand Reception)
const LUXURY_THEMES: StoryThemeConfig[] = [
  { part: 'Opening', type: 'hero', label: 'CATHEDRAL ARCHITECTURE & SACRED MORNING LIGHT' },
  { part: 'Opening', type: 'split', label: 'STONE VAULT CORRIDORS & STAINED GLASS REFLECTIONS' },
  { part: 'Details', type: 'detail', label: 'HEIRLOOM RINGS, ROSARY & INTRICATE DETAILS' },
  { part: 'Details', type: 'split', label: 'HAUTE COUTURE GOWN & CATHEDRAL VEIL' },
  { part: 'Getting Ready', type: 'split', label: 'BRIDAL PREPARATIONS & SERENE ANTICIPATION' },
  { part: 'Getting Ready', type: 'split', label: 'GROOM PREPARATIONS IN QUIET REFLECTION' },
  { part: 'Getting Ready', type: 'split', label: 'BRIDAL MAJESTY & VEIL DRAPING' },
  { part: 'Getting Ready', type: 'split', label: 'FATHER-DAUGHTER HEIRLOOM REVEAL' },
  { part: 'Ceremony', type: 'hero', label: 'GRAND PROCESSIONAL TOWARDS THE ALTAR' },
  { part: 'Ceremony', type: 'split', label: 'SOLEMN VOWS BEFORE THE HIGH ALTAR' },
  { part: 'Ceremony', type: 'split', label: 'SACRED BLESSING & RING EXCHANGE' },
  { part: 'Ceremony', type: 'hero', label: 'THE NUPTIAL PRAYER & SACRED BLESSINGS' },
  { part: 'Ceremony', type: 'split', label: 'FIRST KISS UNDER CATHEDRAL ARCHES' },
  { part: 'Ceremony', type: 'split', label: 'JOYOUS RECESSIONAL & PEALING BELLS' },
  { part: 'Couple Portrait Story', type: 'hero', label: 'DRAMATIC VEIL & STONE ARCH PORTRAITS' },
  { part: 'Couple Portrait Story', type: 'split', label: 'GOLDEN LIGHT AT THE CATHEDRAL PORCH' },
  { part: 'Couple Portrait Story', type: 'split', label: 'INTIMATE EMBRACE & CANDID LAUGHTER' },
  { part: 'Celebration', type: 'split', label: 'WELCOME TOASTS & COCKTAIL HOUR' },
  { part: 'Celebration', type: 'hero', label: 'GRAND BALLROOM CANDLELIT RECEPTION' },
  { part: 'Celebration', type: 'split', label: 'EMOTIONAL SPEECHES & FAMILY BLESSINGS' },
  { part: 'Celebration', type: 'split', label: 'ORCHESTRAL FIRST DANCE UNDER CHANDELIERS' },
  { part: 'Celebration', type: 'split', label: 'TIERED WEDDING CAKE CUTTING' },
  { part: 'Celebration', type: 'split', label: 'JOYFUL REVELRY & SPARKLER CHEERS' },
  { part: 'Closing', type: 'hero', label: 'THE SACRED HEIRLOOM FINALE' }
];

// 04 — INDIAN WEDDING STORY (North Indian Hindu Wedding: Heritage, Color, Ritual, Family, Agni)
const INDIAN_WEDDING_THEMES: StoryThemeConfig[] = [
  { part: 'Opening', type: 'hero', label: 'THE PALACE DAWN & AUSPICIOUS BEGINNINGS' },
  { part: 'Opening', type: 'split', label: 'REGAL ARCHITECTURE & COURTYARD DECOR' },
  { part: 'Details', type: 'detail', label: 'INTRICATE MEHENDI ARTISTRY & HEIRLOOM KUNDAN' },
  { part: 'Details', type: 'split', label: 'CRIMSON LEHENGA & EMBROIDERED SHERWANI' },
  { part: 'Getting Ready', type: 'split', label: 'BRIDAL CHURA & KALEERA CEREMONY' },
  { part: 'Getting Ready', type: 'split', label: 'GROOM SAFA BANDHAYI & SEHRA BANDI' },
  { part: 'Getting Ready', type: 'split', label: 'MATERNAL BLESSINGS & SACRED TILAK' },
  { part: 'Getting Ready', type: 'split', label: 'ROYAL BRIDAL PORTRAITURE' },
  { part: 'Ceremony', type: 'hero', label: 'THE EXUBERANT BARAAT PROCESSION' },
  { part: 'Ceremony', type: 'split', label: 'MILNI & WELCOMING OF THE GROOM' },
  { part: 'Ceremony', type: 'hero', label: 'THE JAYAMALA GARLAND EXCHANGE' },
  { part: 'Ceremony', type: 'split', label: 'KANYADAAN & SACRED VOWS' },
  { part: 'Ceremony', type: 'hero', label: 'THE SEVEN SACRED PHERAS AROUND THE AGNI' },
  { part: 'Ceremony', type: 'split', label: 'SINDOOR & MANGALSUTRA BLESSING' },
  { part: 'First Look & Couple', type: 'hero', label: 'ROYAL PORTRAIT AS MAN AND WIFE' },
  { part: 'First Look & Couple', type: 'split', label: 'PALACE ARCHWAY PORTRAITURE' },
  { part: 'Celebration', type: 'split', label: 'EMOTIONAL BIDAAI BLESSINGS' },
  { part: 'Celebration', type: 'split', label: 'ROYAL SANGEET ENTRANCE & PERFORMANCES' },
  { part: 'Celebration', type: 'split', label: 'FAMILY CHOREOGRAPHY & DHOL REVELRY' },
  { part: 'Celebration', type: 'split', label: 'GRAND PALACE BANQUET' },
  { part: 'Couple Portrait Story', type: 'hero', label: 'ILLUMINATED PALACE NIGHT PORTRAITS' },
  { part: 'Celebration', type: 'split', label: 'DHOL BEATS & MIDNIGHT CELEBRATION' },
  { part: 'Closing', type: 'split', label: 'ROYAL FAMILY TOAST & BLESSINGS' },
  { part: 'Closing', type: 'hero', label: 'THE REGAL LEGACY CONCLUSION' }
];

// 05 — WESTERN DESTINATION WEDDING (Coastal Intimacy, Natural Light, Wind, Organic Romance)
const WESTERN_DESTINATION_THEMES: StoryThemeConfig[] = [
  { part: 'Opening', type: 'hero', label: 'COASTAL MIST & CLIFFSIDE HORIZON' },
  { part: 'Opening', type: 'split', label: 'ORGANIC BOTANICALS & SEA BREEZE' },
  { part: 'Details', type: 'detail', label: 'NATURAL LINEN, HANDMADE PAPER & RINGS' },
  { part: 'Details', type: 'split', label: 'AIRY SILK GOWN & DRIFTWOOD ACCENTS' },
  { part: 'Getting Ready', type: 'split', label: 'SUNLIT VILLA PREPARATIONS' },
  { part: 'Getting Ready', type: 'split', label: 'CASUAL GROOM GROOMING WITH FRIENDS' },
  { part: 'Getting Ready', type: 'split', label: 'LAUGHTER & CHAMPAGNE WITH BRIDESMAIDS' },
  { part: 'Getting Ready', type: 'split', label: 'QUIET OCEAN REFLECTION BEFORE VOWS' },
  { part: 'First Look & Couple', type: 'hero', label: 'FIRST LOOK ON THE SUNLIT CLIFF' },
  { part: 'First Look & Couple', type: 'split', label: 'WIND-SWEPT INTIMATE REVEAL' },
  { part: 'Ceremony', type: 'split', label: 'INTIMATE CLIFFSIDE GATHERING' },
  { part: 'Ceremony', type: 'hero', label: 'VOWS OVERLOOKING THE PACIFIC' },
  { part: 'Ceremony', type: 'split', label: 'THE FIRST KISS BY THE SEA' },
  { part: 'Ceremony', type: 'split', label: 'JOYFUL EMBRACE DOWN THE NATURAL PATH' },
  { part: 'Couple Portrait Story', type: 'hero', label: 'GOLDEN HOUR CLIFF WALK' },
  { part: 'Couple Portrait Story', type: 'split', label: 'SUN-WASHED TENDER DETAILS' },
  { part: 'Couple Portrait Story', type: 'split', label: 'BAREFOOT SHORELINE TIDE PRINTS' },
  { part: 'Celebration', type: 'split', label: 'OPEN-AIR RECEPTION & ARTISANAL COCKTAILS' },
  { part: 'Celebration', type: 'split', label: 'DRIFTWOOD TABLES & CANDLELIGHT' },
  { part: 'Celebration', type: 'split', label: 'HEARTFELT SUNSET SPEECHES' },
  { part: 'Celebration', type: 'split', label: 'FIRST DANCE UNDER FAIRY LIGHT CANOPY' },
  { part: 'Celebration', type: 'split', label: 'ACOUSTIC MUSIC & BAREFOOT DANCING' },
  { part: 'Closing', type: 'split', label: 'OCEAN BONFIRE WITH DEAR GUESTS' },
  { part: 'Closing', type: 'hero', label: 'THE STARLIT HORIZON FINALE' }
];

// 06 — PRE-SHOOT / ENGAGEMENT STORY (NO CEREMONY!)
const PRESHOOT_THEMES: StoryThemeConfig[] = [
  { part: 'Opening', type: 'hero', label: 'THE SETTING & EXPANSIVE LANDSCAPE' },
  { part: 'Opening', type: 'split', label: 'ATMOSPHERIC VISTA & QUIET HORIZON' },
  { part: 'Details', type: 'detail', label: 'HELD HANDS, TEXTURES & INTIMATE DETAILS' },
  { part: 'Details', type: 'split', label: 'TENDER GLANCES & SUBTLE GESTURES' },
  { part: 'Couple Portrait Story', type: 'split', label: 'NATURAL CONNECTION & SPONTANEITY' },
  { part: 'Couple Portrait Story', type: 'split', label: 'SHARED SMILES & UNGUARDED LAUGHTER' },
  { part: 'Couple Portrait Story', type: 'hero', label: 'FLUID MOVEMENT & PLAYFUL STEPS' },
  { part: 'Couple Portrait Story', type: 'split', label: 'WALKING TOGETHER THROUGH THE MEADOW' },
  { part: 'Details', type: 'split', label: 'WHISPERED CONVERSATIONS & PROXIMITY' },
  { part: 'Details', type: 'split', label: 'GENTLE EMBRACE IN THE BREEZE' },
  { part: 'First Look & Couple', type: 'hero', label: 'CINEMATIC COUPLE PORTFOLIO' },
  { part: 'First Look & Couple', type: 'split', label: 'MUTUAL ADMIRATION & INTENSE CONNECTION' },
  { part: 'Couple Portrait Story', type: 'split', label: 'WARM EMBRACE AS SHADOWS LENGTHEN' },
  { part: 'Couple Portrait Story', type: 'split', label: 'RESTING SHOULDER TO SHOULDER' },
  { part: 'Couple Portrait Story', type: 'hero', label: 'GOLDEN HOUR LIGHT & WARMTH' },
  { part: 'Couple Portrait Story', type: 'split', label: 'GOLDEN REFLECTIONS & SILHOUETTES' },
  { part: 'Couple Portrait Story', type: 'split', label: 'SUN-DRENCHED CANDID CONNECTION' },
  { part: 'Couple Portrait Story', type: 'split', label: 'SLOW WALKS AS THE SUN DIPS' },
  { part: 'Closing', type: 'hero', label: 'BLUE HOUR ATMOSPHERE & TWILIGHT' },
  { part: 'Closing', type: 'split', label: 'DUSK TONES & DEEP INTIMACY' },
  { part: 'Closing', type: 'split', label: 'WARM COAT SHARED IN THE CHILL' },
  { part: 'Closing', type: 'split', label: 'QUIET CONVERSATIONS AT DUSK' },
  { part: 'Closing', type: 'split', label: 'THE LAST LIGHT OF THE DAY' },
  { part: 'Closing', type: 'hero', label: 'THE INTIMATE STORY CONCLUSION' }
];

function buildAlbumSpreads(
  folderPath: string,
  albumTitle: string,
  themes: StoryThemeConfig[],
  manifestSpreads?: string[]
): AlbumPageSpread[] {
  return themes.map((theme, index) => {
    const spreadNum = index + 1;
    const spreadPadded = String(spreadNum).padStart(2, '0');
    const leftPhotoIndex = String(spreadNum * 2 - 1).padStart(2, '0');
    const rightPhotoIndex = String(spreadNum * 2).padStart(2, '0');

    // Primary spread image path from manifest (supporting .webp, .jpg) or standard path
    const fullSpreadUrl = (manifestSpreads && manifestSpreads[index]) 
      || `${folderPath}/spread-${spreadPadded}.webp`;
    const fallbackSpreadUrl = `${folderPath}/spread-${spreadPadded}.jpg`;

    if (theme.type === 'hero') {
      return {
        id: `spread-${spreadNum}`,
        spreadNumber: spreadNum,
        type: 'hero',
        storyPart: theme.part,
        heroImage: {
          url: fullSpreadUrl,
          alt: `${albumTitle} - Spread ${spreadNum}`,
          caption: `Pages ${spreadNum * 2 - 1}–${spreadNum * 2} • Cinematic Full Spread`
        },
        editorialLabel: `SPREAD ${spreadPadded} / 24 • ${theme.label}`
      };
    }

    return {
      id: `spread-${spreadNum}`,
      spreadNumber: spreadNum,
      type: 'split',
      storyPart: theme.part,
      // If client uploads full spread, heroImage holds it
      heroImage: {
        url: fullSpreadUrl,
        alt: `${albumTitle} - Spread ${spreadNum}`,
        caption: `Spread ${spreadPadded} of 24 • Magazine Spread`
      },
      // Fallback for split photos
      leftImage: {
        url: `${folderPath}/photo-${leftPhotoIndex}.jpg`,
        alt: `${albumTitle} - Page ${spreadNum * 2 - 1} (Photo ${leftPhotoIndex})`,
        caption: `Page ${spreadNum * 2 - 1} of 48 • Photo ${leftPhotoIndex}`
      },
      rightImage: {
        url: `${folderPath}/photo-${rightPhotoIndex}.jpg`,
        alt: `${albumTitle} - Page ${spreadNum * 2} (Photo ${rightPhotoIndex})`,
        caption: `Page ${spreadNum * 2} of 48 • Photo ${rightPhotoIndex}`
      },
      editorialLabel: `SPREAD ${spreadPadded} / 24 • ${theme.label}`
    };
  });
}

const rawAlbumsData = [
  // 01 — TIMELESS SRI LANKAN WEDDING
  {
    id: 'sri-lankan-traditional',
    slug: 'traditional-sri-lankan-wedding',
    title: 'Timeless Sri Lankan Wedding',
    subtitle: 'Sacred Poruwa Rituals, Heritage Regalia & Familial Blessings',
    category: 'TRADITIONAL' as const,
    tags: ['Traditional', 'Sri Lankan', 'Poruwa Rituals', 'Cultural Storytelling', 'Heritage'],
    conceptLabel: 'SRI LANKAN TRADITIONAL',
    dimensions: '17" × 24"',
    represents: ['Traditional', 'Sri Lankan', 'Emotional', 'Cultural', 'Elegant'],
    visualLanguage: 'Warm, timeless, and sophisticated with rich heritage ivory and antique gold tones',
    description: 'A deeply emotional celebration honoring timeless Sri Lankan wedding traditions. Designed with rich cultural pacing, sacred Poruwa ceremony rituals, familial blessings, and intimate couple portraits.',
    folderName: '01-traditional-sri-lankan',
    folderPath: '/albums/01-traditional-sri-lankan',
    isFeatured: true,
    themes: SRI_LANKAN_THEMES
  },

  // 02 — MODERN ROYAL INDIAN WEDDING
  {
    id: 'modern-editorial',
    slug: 'modern-editorial-wedding',
    title: 'Modern Royal Indian Wedding',
    subtitle: 'Palace Grandeur & Contemporary Couture Artistry',
    category: 'INDIAN HERITAGE' as const,
    tags: ['Indian Heritage', 'Royal Wedding', 'Couture', 'Palace', 'Editorial'],
    conceptLabel: 'INDIAN HERITAGE',
    dimensions: '10" × 20"',
    represents: ['Royal', 'Indian Heritage', 'Couture', 'Palace', 'Sophisticated'],
    visualLanguage: 'Contemporary Indian couture, palace architecture, intricate embroidery, and modern editorial narrative pacing',
    description: 'A grand royal Indian celebration styled with contemporary couture elegance, magnificent palace corridors, intricate heirloom jewellery, and refined editorial pacing.',
    folderName: '02-modern-editorial',
    folderPath: '/albums/02-modern-editorial',
    isFeatured: true,
    themes: MODERN_EDITORIAL_THEMES
  },

  // 03 — LUXURY CHURCH WEDDING
  {
    id: 'luxury-wedding',
    slug: 'luxury-wedding',
    title: 'Luxury Church Wedding',
    subtitle: 'Cathedral Splendor, Sacred Blessings & Grand Reception',
    category: 'CHURCH WEDDING' as const,
    tags: ['Church Wedding', 'Cathedral', 'Sacred Blessings', 'Grand Reception', 'Luxury', 'Elegance'],
    conceptLabel: 'CHURCH WEDDING',
    dimensions: '12" × 24"',
    represents: ['Church Wedding', 'Cathedral', 'Sacred', 'Grand', 'Heirloom', 'Elegance'],
    visualLanguage: 'Cathedral architecture, sacred high-altar blessings, dramatic veils, and candlelit grand reception',
    description: 'A solemn yet magnificent cathedral wedding celebration. Featuring dramatic stone arches, sacred nuptial vows, flowing bridal veils, and an opulent evening reception.',
    folderName: '03-luxury-estate',
    folderPath: '/albums/03-luxury-estate',
    isFeatured: true,
    themes: LUXURY_THEMES
  },

  // 04 — INDIAN WEDDING STORY
  {
    id: 'indian-wedding',
    slug: 'indian-wedding',
    title: 'Indian Wedding Story',
    subtitle: 'Sacred Rituals & Royal North Indian Hindu Celebration',
    category: 'INDIAN' as const,
    tags: ['Indian', 'Heritage', 'Mehendi', 'Sangeet', 'Royal Wedding', 'Rituals', 'Pheras'],
    conceptLabel: 'CONCEPT ALBUM 04 — INDIAN WEDDING STORY',
    represents: ['Indian', 'Heritage', 'Vibrant', 'Royal', 'Devotional'],
    visualLanguage: 'Rich saffron, vermillion, and royal gold tones capturing exuberant joy and sacred Hindu rites',
    description: 'An elegant North Indian Hindu wedding celebration honoring sacred rituals, intricate henna art, exuberant Baraat dancing, and heartfelt pheras around the Agni.',
    folderName: '04-indian-heritage',
    folderPath: '/albums/04-indian-heritage',
    isFeatured: false,
    themes: INDIAN_WEDDING_THEMES
  },

  // 05 — WESTERN DESTINATION WEDDING
  {
    id: 'western-wedding',
    slug: 'western-wedding',
    title: 'Western Destination Wedding',
    subtitle: 'Coastal Intimacy & Sun-Drenched Naturalism',
    category: 'WESTERN' as const,
    tags: ['Destination', 'Coastal', 'Sunset', 'Intimate', 'Western'],
    conceptLabel: 'CONCEPT ALBUM 05 — WESTERN DESTINATION WEDDING',
    represents: ['Destination', 'Natural', 'Intimate', 'Scenic', 'Emotional'],
    visualLanguage: 'Soft sea-breeze naturalism with warm golden light, candid documentary intimacy, and relaxed luxury',
    description: 'An intimate coastal destination celebration set against sun-washed cliffs and ocean horizons. Organic textures, candid laughter, and sunset vows.',
    folderName: '05-western-destination',
    folderPath: '/albums/05-western-destination',
    isFeatured: false,
    themes: WESTERN_DESTINATION_THEMES
  },

  // 06 — PRE-SHOOT / ENGAGEMENT STORY
  {
    id: 'pre-shoot-engagement',
    slug: 'pre-shoot-engagement',
    title: 'Pre-Shoot / Engagement Story',
    subtitle: 'Cinematic Narrative of Romance, Connection & Movement',
    category: 'PRE-SHOOT' as const,
    tags: ['Pre-Shoot', 'Engagement', 'Cinematic', 'Couple Story', 'Romance', 'Movement'],
    conceptLabel: 'CONCEPT ALBUM 06 — PRE-SHOOT / ENGAGEMENT STORY',
    represents: ['Pre-Shoot', 'Cinematic', 'Storytelling', 'Intimacy', 'Modern'],
    visualLanguage: 'Film-inspired frames, atmospheric natural light, and relaxed documentary couple moments',
    description: 'A cinematic couple story focusing on intimacy, natural movement, quiet gestures, and golden hour light. Free of wedding day formality, celebrating authentic romance.',
    folderName: '06-preshoot-engagement',
    folderPath: '/albums/06-preshoot-engagement',
    isFeatured: false,
    themes: PRESHOOT_THEMES
  }
];

export const ALBUMS: Album[] = rawAlbumsData.map((item) => {
  const folderManifest = manifest[item.folderName] as any || {
    hasThumbnail: true,
    thumbnailPath: `${item.folderPath}/thumbnail.webp`,
    hasCover: false,
    coverPath: '',
    hasPage01: false,
    page01Path: '',
    hasPageLast: false,
    pageLastPath: '',
    spreads: [],
    spreadCount: 0,
    availablePhotos: [],
    availablePhotoCount: 0
  };

  const spreads = buildAlbumSpreads(item.folderPath, item.title, item.themes, folderManifest.spreads);
  const totalSpreads = spreads.length; // 24 designed spreads
  const totalPages = totalSpreads * 2; // 48 designed pages
  const photoCount = totalPages;       // 48 designed photo slots

  const coverImage = folderManifest.hasThumbnail && folderManifest.thumbnailPath
    ? folderManifest.thumbnailPath
    : `${item.folderPath}/thumbnail.webp`;

  const physicalCoverImage = folderManifest.hasCover && folderManifest.coverPath
    ? folderManifest.coverPath
    : (folderManifest.hasThumbnail ? folderManifest.thumbnailPath : `${item.folderPath}/cover.webp`);

  const page01Image = folderManifest.hasPage01 && folderManifest.page01Path
    ? folderManifest.page01Path
    : undefined;

  const pageLastImage = folderManifest.hasPageLast && folderManifest.pageLastPath
    ? folderManifest.pageLastPath
    : undefined;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle,
    category: item.category,
    tags: item.tags,
    conceptLabel: item.conceptLabel,
    represents: item.represents,
    visualLanguage: item.visualLanguage,
    description: item.description,
    coverImage,
    heroSpreadImage: coverImage,
    physicalCoverImage,
    page01Image,
    pageLastImage,
    folderName: item.folderName,
    folderPath: item.folderPath,
    dimensions: (item as any).dimensions || '17" × 24"',
    isFeatured: item.isFeatured,
    spreads,
    totalSpreads,
    totalPages,
    photoCount,
    availablePhotoCount: (folderManifest.spreadCount ? folderManifest.spreadCount * 2 : folderManifest.availablePhotoCount) || 0
  };
});

export function getAlbumBySlug(slug: string): Album | undefined {
  return ALBUMS.find(a => a.slug === slug || a.id === slug);
}

export function getFeaturedAlbums(): Album[] {
  return ALBUMS.filter(a => a.isFeatured);
}
