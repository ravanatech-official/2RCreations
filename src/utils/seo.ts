/**
 * SEO & Metadata Utility for 2R Creations
 * Manages document title, meta descriptions, canonical URLs, and OpenGraph tags dynamically.
 */

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  type?: 'website' | 'article';
}

export function updateSEO({
  title,
  description,
  canonicalPath = '',
  ogImage = '/assets/images/2R-Creations-Designer-Portrait-Editorial.jpg',
  type = 'website'
}: SEOProps) {
  if (typeof document === 'undefined') return;

  // Title
  const formattedTitle = title.includes('2R CREATIONS') ? title : `${title} | 2R CREATIONS`;
  document.title = formattedTitle;

  // Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', description);

  // Canonical URL
  const baseUrl = import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://2rcreations.com');
  const fullUrl = `${baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullUrl);

  // Open Graph
  const ogTags: Record<string, string> = {
    'og:title': formattedTitle,
    'og:description': description,
    'og:url': fullUrl,
    'og:type': type,
    'og:image': ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
    'og:site_name': '2R CREATIONS — Professional Wedding Album Designer'
  };

  for (const [property, content] of Object.entries(ogTags)) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  // Twitter Card
  const twitterTags: Record<string, string> = {
    'twitter:card': 'summary_large_image',
    'twitter:title': formattedTitle,
    'twitter:description': description,
    'twitter:image': ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`
  };

  for (const [name, content] of Object.entries(twitterTags)) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }
}
