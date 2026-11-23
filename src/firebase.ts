import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  Analytics,
  logEvent,
  setAnalyticsCollectionEnabled
} from "firebase/analytics";
import { getFirestore, Firestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseAppletConfig from "../firebase-applet-config.json";

// Safe env access helper supporting both Vite browser runtime and Node environments
const env = (
  typeof import.meta !== "undefined" && (import.meta as any)?.env
    ? (import.meta as any).env
    : {}
) as Record<string, any>;

// Web app Firebase configuration (env overrides allow multi-site deployment e.g. ravanatek / 2rcreations)
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId
};

export const firestoreDatabaseId =
  env.VITE_FIREBASE_DATABASE_ID ||
  firebaseAppletConfig.firestoreDatabaseId ||
  "(default)";

/**
 * Collection prefix isolates 2R Creations collections inside shared Firebase projects
 * (such as `ravanatek`) so they never collide with sibling sites.
 */
export const firestoreCollectionPrefix =
  typeof env.VITE_FIRESTORE_COLLECTION_PREFIX === "string"
    ? env.VITE_FIRESTORE_COLLECTION_PREFIX.trim()
    : "";

export type BaseCollectionName =
  | "leads"
  | "data_requests"
  | "marketplace_products"
  | "marketplace_orders"
  | "marketplace_entitlements";

export function getCollectionName(baseName: BaseCollectionName): string {
  return `${firestoreCollectionPrefix}${baseName}`;
}

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (connecting to (default) or named database)
export const db: Firestore =
  firestoreDatabaseId && firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firestoreDatabaseId)
    : getFirestore(app);

// Structured Firestore Error Diagnostics (Firebase Integration Standard)
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write"
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  projectId?: string;
  databaseId?: string;
}

export function logFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    projectId: firebaseConfig.projectId,
    databaseId: firestoreDatabaseId
  };
  console.error("Firestore Error:", JSON.stringify(errInfo));
  return errInfo;
}

// Validate connection to Firestore on initial boot
if (typeof window !== "undefined") {
  (async function validateFirestoreConnection() {
    try {
      await getDocFromServer(doc(db, "test", "connection"));
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("client is offline")) {
        console.warn("Firestore connection check: please verify network or Firebase database status.");
      }
    }
  })();
}

let analyticsInstance: Analytics | null = null;
let analyticsInitPromise: Promise<void> | null = null;

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (!window.localStorage) return false;
    const savedPrefs = window.localStorage.getItem("2r_cookie_preferences");
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      return Boolean(parsed && parsed.analytics === true);
    }
    const simpleConsent = window.localStorage.getItem("2r_cookie_consent");
    return simpleConsent === "accepted";
  } catch {
    return false;
  }
}

/**
 * GDPR / ePrivacy-compliant Analytics Consent Synchronization.
 * GA4 is ONLY initialized after explicit opt-in consent and immediately disabled if revoked.
 */
export function syncAnalyticsConsent(enabled: boolean): void {
  if (typeof window === "undefined") return;

  const measurementId = firebaseConfig.measurementId;
  if (measurementId) {
    (window as any)[`ga-disable-${measurementId}`] = !enabled;
  }

  if (!enabled) {
    if (analyticsInstance) {
      try {
        setAnalyticsCollectionEnabled(analyticsInstance, false);
      } catch {
        // Ignore
      }
    }
    return;
  }

  if (analyticsInstance) {
    try {
      setAnalyticsCollectionEnabled(analyticsInstance, true);
    } catch {
      // Ignore
    }
    return;
  }

  if (!analyticsInitPromise && measurementId) {
    analyticsInitPromise = isSupported()
      .then((supported) => {
        if (supported && hasAnalyticsConsent()) {
          analyticsInstance = getAnalytics(app);
          setAnalyticsCollectionEnabled(analyticsInstance, true);
        }
      })
      .catch(() => {
        // Graceful fallback if analytics not supported or blocked
      });
  }
}

// Only initialize GA4 on boot if the visitor has ALREADY explicitly opted in
if (typeof window !== "undefined" && hasAnalyticsConsent()) {
  syncAnalyticsConsent(true);
}

export function trackAnalyticsEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  if (!analyticsInstance) {
    syncAnalyticsConsent(true);
  }

  if (env.DEV) {
    console.info(`[Analytics Event: ${eventName}]`, params);
  }
  if (analyticsInstance) {
    try {
      logEvent(analyticsInstance, eventName, params);
    } catch (err) {
      console.warn("Analytics error:", err);
    }
  }
}
