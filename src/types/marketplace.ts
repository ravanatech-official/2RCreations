export type MarketplaceCategory =
  | 'ALBUM_TEMPLATES'
  | 'LIGHTROOM_PRESETS'
  | 'RETOUCHING_ACTIONS'
  | 'COVER_MOCKUPS'
  | 'OVERLAYS_TEXTURES';

export type MarketplaceCurrency = 'USD' | 'LKR';

export type MarketplaceOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FULFILLED'
  | 'REFUNDED'
  | 'CANCELLED';

export interface MarketplaceProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  priceCents: number;
  currency: MarketplaceCurrency;
  fileFormat: 'PSD' | 'INDD' | 'XMP' | 'ATN' | 'ZIP';
  previewImages: string[];
  isPublished: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceOrder {
  id?: string;
  buyerUid: string;
  buyerEmail: string;
  productId: string;
  amountCents: number;
  currency: MarketplaceCurrency;
  status: MarketplaceOrderStatus;
  paymentProvider?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceEntitlement {
  id?: string;
  buyerUid: string;
  productId: string;
  orderId: string;
  licenseKey: string;
  downloadCount: number;
  maxDownloads: number;
  revoked: boolean;
  createdAt: string;
}
