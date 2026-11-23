export type AlbumCategory = 
  | 'ALL'
  | 'WEDDING'
  | 'TRADITIONAL'
  | 'MODERN'
  | 'LUXURY'
  | 'CHURCH WEDDING'
  | 'INDIAN'
  | 'INDIAN HERITAGE'
  | 'WESTERN'
  | 'PRE-SHOOT'
  | 'ENGAGEMENT';

export type SpreadType = 
  | 'hero'          // Full spread cinematic single image
  | 'full-bleed'     // Full single page with subtle counterpart
  | 'split'          // Two balanced images (left & right)
  | 'triple'         // Three storytelling sequence images
  | 'editorial'      // Image with elegant editorial typographic placement
  | 'detail';        // Detail macro/grid (rings, invitations, attire, decor)

export type StoryPart = 
  | 'Opening'
  | 'Details'
  | 'Getting Ready'
  | 'First Look & Couple'
  | 'Ceremony'
  | 'Celebration'
  | 'Couple Portrait Story'
  | 'Closing';

export interface AlbumImageAsset {
  id: string;
  src: string;
  alt: string;
  role?: 'cover' | 'hero' | 'story' | 'detail';
  orientation?: 'portrait' | 'landscape' | 'square' | 'wide' | 'panoramic';
  available: boolean;
}

export interface AlbumPageSpread {
  id: string;
  spreadNumber: number;
  type: SpreadType;
  storyPart: StoryPart;
  leftImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
  rightImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
  heroImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
  secondaryImages?: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  editorialLabel?: string;
}

export interface Album {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: AlbumCategory;
  tags: string[];
  conceptLabel: string;
  represents: string[];
  visualLanguage: string;
  description: string;
  coverImage: string;
  heroSpreadImage: string;
  photoCount: number;             // Total designed photo slots (e.g. 48)
  availablePhotoCount: number;    // Real available images detected in folder
  totalPages: number;             // Total designed pages (e.g. 48)
  totalSpreads: number;           // Total designed spreads (e.g. 24)
  folderPath: string;
  folderName: string;
  dimensions?: string;
  isFeatured?: boolean;
  physicalCoverImage?: string;
  page01Image?: string;
  pageLastImage?: string;
  spreads: AlbumPageSpread[];
}

export interface LeadInquiry {
  id?: string;
  name: string;
  email: string;
  whatsapp: string;
  projectType: string;
  message: string;
  requestFreeSample?: boolean;
  samplePhotosLink?: string;
  photoCountNote?: string;
  source?: string;
  whatsappConsent?: boolean;
  marketingConsent?: boolean;
  createdAt: string;
}

export type DataRequestType = 
  | 'WHATSAPP_OPT_OUT' 
  | 'COMMUNICATION_PREFERENCE' 
  | 'DATA_EXPORT' 
  | 'RIGHT_TO_BE_FORGOTTEN';

export interface DataSubjectRequest {
  id?: string;
  email: string;
  whatsapp?: string;
  name?: string;
  requestType: DataRequestType;
  details?: string;
  status: 'PENDING' | 'PROCESSED';
  createdAt: string;
  source?: string;
}

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean; // Google Analytics GA4
  functional: boolean; // UI preferences, viewer state
  updatedAt: string;
}

export type LegalPageType = 'privacy' | 'client-image-policy' | 'terms';

export type GalleryFilterCategory = 
  | 'ALL'
  | 'WEDDING'
  | 'TRADITIONAL'
  | 'EDITORIAL'
  | 'LUXURY'
  | 'DESTINATION'
  | 'PRE-SHOOT';

export interface GalleryProjectImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  orientation?: 'portrait' | 'landscape' | 'wide' | 'panoramic';
  caption?: string;
}

export interface GalleryProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  style?: string;
  year?: number;
  location?: string;
  coverImage: string;
  images: GalleryProjectImage[];
  description?: string;
  shortDescription?: string;
  albumType?: string;
  photographerName?: string;
  clientDisplayName?: string;
  projectDate?: string;
  featured: boolean;
  clientApproved: boolean;
  published: boolean;
  linkedAlbumId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder?: number;
}

export interface ServiceConceptExample {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  heroImage?: string;
  heroDescription: string;
  editorialNote: string;
  whoItsFor: string[];
  whatClientProvides: string[];
  howItWorks: Array<{ step: string; title: string; description: string }>;
  concepts: ServiceConceptExample[];
  relatedServices: Array<{ slug: string; title: string }>;
  pricingNote: string;
}
