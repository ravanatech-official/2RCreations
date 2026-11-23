const env = (
  typeof import.meta !== 'undefined' && (import.meta as any)?.env
    ? (import.meta as any).env
    : {}
) as Record<string, any>;

/**
 * Centralized Feature Flags for 2R Creations.
 * Marketplace remains hidden on the frontend until VITE_ENABLE_MARKETPLACE === 'true'.
 */
export const FEATURE_FLAGS = {
  marketplaceEnabled: env.VITE_ENABLE_MARKETPLACE === 'true',
  apiBaseUrl: typeof env.VITE_API_BASE_URL === 'string' ? env.VITE_API_BASE_URL.trim() : ''
} as const;
