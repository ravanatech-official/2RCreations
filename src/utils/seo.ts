/**
 * SEO, OpenGraph, Twitter & Schema.org JSON-LD Utility for 2R Creations
 * Dynamically manages route-level metadata, canonical URLs, social cards, and structured data.
 */

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogImageAlt?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_OG_IMAGE = '/assets/og/default-og.jpg';
const DEFAULT_OG_ALT = '2R Creations — Specialist Wedding Album Designer & Editions of Timeless Memories';
const PRODUCTION_BASE_URL = 'https://2rcreations.com';

export function getCanonicalBaseUrl(): string {
  const configured = (import.meta.env.VITE_APP_URL as string | undefined)?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return PRODUCTION_BASE_URL;
}

function setMetaByAttr(attr: 'name' | 'property', key: string, value: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', value);
}

function setCanonicalLink(href: string) {
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', href);
}

function syncRouteStructuredData(
  baseUrl: string,
  breadcrumbs?: BreadcrumbItem[],
  structuredData?: Record<string, any> | Record<string, any>[]
) {
  const scriptId = 'route-structured-data';
  const existing = document.getElementById(scriptId);

  const graph: Record<string, any>[] = [];

  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => {
        const normalizedPath = crumb.path === '/' ? '/' : `/${crumb.path.replace(/^\/+/, '')}`;
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${baseUrl}${normalizedPath}`
        };
      })
    });
  }

  if (structuredData) {
    if (Array.isArray(structuredData)) {
      graph.push(...structuredData);
    } else {
      graph.push(structuredData);
    }
  }

  if (graph.length === 0) {
    if (existing) existing.remove();
    return;
  }

  const payload = {
    '@context': 'https://schema.org',
    '@graph': graph
  };

  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

export function updateSEO({
  title,
  description,
  canonicalPath = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_ALT,
  type = 'website',
  noIndex = false,
  breadcrumbs,
  structuredData
}: SEOProps) {
  if (typeof document === 'undefined') return;

  // Title
  const normalizedTitle = title.trim();
  const formattedTitle =
    normalizedTitle.toLowerCase().includes('2r creations')
      ? normalizedTitle
      : `${normalizedTitle} | 2R Creations`;
  document.title = formattedTitle;

  // Description & Robots
  setMetaByAttr('name', 'description', description);
  setMetaByAttr(
    'name',
    'robots',
    noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  // Canonical URL (normalized without trailing slash except root '/')
  const baseUrl = getCanonicalBaseUrl();
  const cleanPath =
    !canonicalPath || canonicalPath === '/'
      ? '/'
      : `/${canonicalPath.replace(/^\/+|\/+$/g, '')}`;
  const fullUrl = `${baseUrl}${cleanPath}`;
  setCanonicalLink(fullUrl);

  // Resolve absolute social image URL
  const normalizedOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${baseUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  // OpenGraph
  setMetaByAttr('property', 'og:locale', 'en_US');
  setMetaByAttr('property', 'og:type', type);
  setMetaByAttr('property', 'og:site_name', '2R CREATIONS');
  setMetaByAttr('property', 'og:url', fullUrl);
  setMetaByAttr('property', 'og:title', formattedTitle);
  setMetaByAttr('property', 'og:description', description);
  setMetaByAttr('property', 'og:image', normalizedOgImage);
  setMetaByAttr('property', 'og:image:secure_url', normalizedOgImage);
  setMetaByAttr('property', 'og:image:alt', ogImageAlt);

  // Twitter / X
  setMetaByAttr('name', 'twitter:card', 'summary_large_image');
  setMetaByAttr('name', 'twitter:url', fullUrl);
  setMetaByAttr('name', 'twitter:title', formattedTitle);
  setMetaByAttr('name', 'twitter:description', description);
  setMetaByAttr('name', 'twitter:image', normalizedOgImage);
  setMetaByAttr('name', 'twitter:image:alt', ogImageAlt);

  // Dynamic Route JSON-LD (BreadcrumbList + Page/Service/CreativeWork/FAQPage)
  syncRouteStructuredData(baseUrl, noIndex ? undefined : breadcrumbs, noIndex ? undefined : structuredData);
}
