/**
 * 2R Creations - Centralized Studio Configuration
 * 
 * Update these constants with actual client-supplied numbers and URLs when available.
 * Placeholders are cleanly labeled to prevent fabricating URLs or contact information.
 */

export const STUDIO_CONFIG = {
  brandName: '2R CREATIONS',
  positioning: 'Professional Wedding Album Designer',
  email: 'hello.2rcreations@gmail.com',
  
  // WhatsApp Configuration:
  // International phone number for Sri Lanka (+94)
  whatsappNumber: '94726387340',
  whatsappDisplayNumber: '+94 72 638 7340',
  whatsappPrefilledMessage: 'Hi 2R Creations, I’d love to know more details about your ALBUM DESIGN & FINE ART RETOUCHING SERVICE.',
  
  // Social Profile Configuration:
  // Treat all external social URLs as unverified until confirmed by the owner.
  // When confirmed, enter actual URLs here or via environment variables.
  socialLinks: {
    instagram: '', // Configurable: enter real Instagram profile when verified
    behance: '',   // e.g. 'https://behance.net/2rcreations'
    pinterest: '', // e.g. 'https://pinterest.com/2rcreations'
    facebook: 'https://www.facebook.com/share/19im5NfyGj/',
    linkedin: 'https://www.linkedin.com/company/2r-creations/',
    fiverr: 'https://www.fiverr.com/the2rcreations',
    youtube: '',   // e.g. 'https://youtube.com/@2rcreations'
    tiktok: ''
  },

  // About Section Designer Portrait:
  aboutImage: '/assets/images/2R-Creations-Designer-Portrait-Editorial.jpg',

  // Factual Trust & Positioning Facts
  facts: {
    experienceYears: '2+',
    albumsDesigned: '50+',
    typicalTurnaround: '2–3 Day Typical Turnaround*',
    turnaroundFootnote: '* Depending on project scope, spread count, and custom retouching requirements.',
    revisionsPolicy: 'Revisions are handled according to the scope of each project, with clear communication throughout the design process.',
    globalReach: 'Working with photographers worldwide. Communication is handled through email and WhatsApp.'
  },

  // Concept Album Disclaimer
  conceptDisclaimer: 'Conceptual artwork created for portfolio demonstration. Real client wedding images are always protected and private.'
};

/**
 * Returns true only if a real WhatsApp phone number is configured.
 */
export function hasWhatsApp(): boolean {
  return Boolean(STUDIO_CONFIG.whatsappNumber && STUDIO_CONFIG.whatsappNumber.trim().length >= 8);
}

/**
 * Returns WhatsApp URL if configured, or null if unconfigured.
 * Prevents opening empty or generic links that mislead visitors.
 */
export function getWhatsAppUrl(customMessage?: string): string | null {
  if (!hasWhatsApp()) {
    return null;
  }
  const message = encodeURIComponent(customMessage || STUDIO_CONFIG.whatsappPrefilledMessage);
  return `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${message}`;
}

/**
 * Returns a direct Gmail web compose URL pre-filled with studio email and optional subject/body.
 * Guarantees composing works in browser even without desktop mail apps installed.
 */
export function getGmailComposeUrl(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  params.set('view', 'cm');
  params.set('fs', '1');
  params.set('to', STUDIO_CONFIG.email);
  if (subject) params.set('su', subject);
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Returns standard mailto URL for desktop/native mail clients.
 */
export function getMailtoUrl(subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${STUDIO_CONFIG.email}${query}`;
}
