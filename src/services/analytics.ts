import { trackAnalyticsEvent } from "../firebase";

export const analytics = {
  albumOpen: (albumId: string, albumTitle: string) => {
    trackAnalyticsEvent("album_open", { album_id: albumId, album_title: albumTitle });
  },
  albumPage25: (albumId: string, pageNumber: number) => {
    trackAnalyticsEvent("album_page_25_percent", { album_id: albumId, page: pageNumber });
  },
  albumPage50: (albumId: string, pageNumber: number) => {
    trackAnalyticsEvent("album_page_50_percent", { album_id: albumId, page: pageNumber });
  },
  albumComplete: (albumId: string, albumTitle: string) => {
    trackAnalyticsEvent("album_complete", { album_id: albumId, album_title: albumTitle });
  },
  projectCtaClick: (source: string) => {
    trackAnalyticsEvent("project_cta_click", { source });
  },
  whatsappClick: (source: string) => {
    trackAnalyticsEvent("whatsapp_click", { source });
  },
  emailClick: (source: string) => {
    trackAnalyticsEvent("email_click", { source });
  },
  leadFormStart: () => {
    trackAnalyticsEvent("lead_form_start");
  },
  leadFormSubmit: (data: { projectType: string; requestFreeSample: boolean }) => {
    trackAnalyticsEvent("lead_form_submit", data);
  },
  contactSubmit: (data?: any) => {
    trackAnalyticsEvent("contact_submit", data);
  },
  freeSampleRequest: () => {
    trackAnalyticsEvent("free_sample_request");
  },
  galleryView: () => {
    trackAnalyticsEvent("gallery_view");
  },
  galleryFilter: (category: string) => {
    trackAnalyticsEvent("gallery_filter", { category });
  },
  galleryProjectOpen: (projectId: string, projectTitle: string) => {
    trackAnalyticsEvent("gallery_project_open", { project_id: projectId, project_title: projectTitle });
  },
  galleryFullAlbumOpen: (projectId: string, linkedAlbumId: string) => {
    trackAnalyticsEvent("gallery_full_album_open", { project_id: projectId, linked_album_id: linkedAlbumId });
  },
  galleryStartProjectClick: (source: string) => {
    trackAnalyticsEvent("gallery_start_project_click", { source });
  },
  navClick: (destination: string) => {
    trackAnalyticsEvent("nav_click", { destination });
  },
  portfolioCategoryChange: (category: string) => {
    trackAnalyticsEvent("portfolio_category_change", { category });
  }
};
