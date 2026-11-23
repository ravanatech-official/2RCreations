import { GalleryProject } from '../types';

/**
 * 2R CREATIONS — REAL CLIENT WORK ARCHIVE / GALLERY DATA REPOSITORY
 * =================================================================
 * 
 * CORE PRINCIPLE: PORTFOLIO ≠ GALLERY
 * - PORTFOLIO contains the 6 signature Concept Albums (illustrating design potential, storytelling pacing, and layout styles).
 * - GALLERY contains real, completed, photographer/client projects approved for public exhibition.
 * 
 * PUBLICATION & PRIVACY SAFETY RULES:
 * 1. A project MUST have BOTH `clientApproved: true` AND `published: true` to ever be displayed on the public website.
 * 2. Never create fictitious client names, fake wedding dates, or stock image client mockups.
 * 3. An empty gallery (`GALLERY_PROJECTS = []`) is the honest, professional default until real client agreements are finalized.
 * 
 * HOW TO ADD A NEW REAL CLIENT PROJECT (Future Workflow):
 * --------------------------------------------------------
 * 1. Secure written permission from the photographer/couple.
 * 2. Add client project photos to the public/assets/gallery/projects directory.
 * 3. Add a new object to GALLERY_PROJECTS with clientApproved: true, published: true.
 * 4. To temporarily hide or unpublish a project upon client request, set `published: false`.
 */

export const GALLERY_PROJECTS: GalleryProject[] = [];

/**
 * Helper to retrieve only published, client-approved projects for public display.
 */
export function getPublishedGalleryProjects(): GalleryProject[] {
  return GALLERY_PROJECTS.filter(project => project.clientApproved === true && project.published === true);
}

/**
 * Helper to retrieve only published, client-approved projects that are marked as featured.
 */
export function getPublishedFeaturedProjects(): GalleryProject[] {
  return GALLERY_PROJECTS.filter(
    project => project.clientApproved === true && project.published === true && project.featured === true
  );
}

/**
 * Helper to find a specific published project by slug.
 */
export function getGalleryProjectBySlug(slug: string): GalleryProject | undefined {
  return GALLERY_PROJECTS.find(
    project => project.slug === slug && project.clientApproved === true && project.published === true
  );
}

/**
 * Helper to get adjacent published projects for previous/next pagination.
 */
export function getAdjacentPublishedProjects(currentSlug: string): { prev?: GalleryProject; next?: GalleryProject } {
  const published = getPublishedGalleryProjects();
  const currentIndex = published.findIndex(p => p.slug === currentSlug);
  if (currentIndex === -1) {
    return { prev: undefined, next: undefined };
  }
  const prev = currentIndex > 0 ? published[currentIndex - 1] : undefined;
  const next = currentIndex < published.length - 1 ? published[currentIndex + 1] : undefined;
  return { prev, next };
}

