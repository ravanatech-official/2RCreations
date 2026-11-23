import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, getCollectionName, logFirestoreError, OperationType } from '../firebase';
import { FEATURE_FLAGS } from '../config/features';
import { MarketplaceProduct } from '../types/marketplace';

/**
 * Marketplace Data Service Layer.
 * Inactive while FEATURE_FLAGS.marketplaceEnabled === false so zero unnecessary
 * Firestore reads occur and the frontend remains completely hidden.
 */
export async function listPublishedMarketplaceProducts(): Promise<MarketplaceProduct[]> {
  if (!FEATURE_FLAGS.marketplaceEnabled) {
    return [];
  }

  const collectionPath = getCollectionName('marketplace_products');
  try {
    const q = query(
      collection(db, collectionPath),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<MarketplaceProduct, 'id'>)
    }));
  } catch (error) {
    logFirestoreError(error, OperationType.LIST, collectionPath);
    return [];
  }
}

export async function fetchMarketplaceHealth(): Promise<{ enabled: boolean }> {
  if (!FEATURE_FLAGS.marketplaceEnabled) {
    return { enabled: false };
  }
  try {
    const res = await fetch(`${FEATURE_FLAGS.apiBaseUrl}/api/v1/marketplace/products`);
    if (!res.ok) return { enabled: false };
    const data = await res.json();
    return { enabled: Boolean(data?.enabled) };
  } catch {
    return { enabled: false };
  }
}
