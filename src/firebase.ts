import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics, logEvent } from "firebase/analytics";
import { getFirestore, Firestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseAppletConfig from "../firebase-applet-config.json";

// Safe env access helper supporting both Vite browser runtime and Node environments
const env = (typeof import.meta !== "undefined" && (import.meta as any)?.env ? (import.meta as any).env : {}) as Record<string, any>;

// Web app Firebase configuration for iiR-Creations (iir-creations)
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || "AIzaSyBomyVMeYkQ1lzrwOZnjMYbMOfH-_0YV1E",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || "iir-creations.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || "iir-creations",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || "iir-creations.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || "783543979300",
  appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || "1:783543979300:web:ae9b4868cfecd7e6a1f7b1",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId || "G-E1XWMCL7C1"
};

export const firestoreDatabaseId =
  env.VITE_FIREBASE_DATABASE_ID ||
  firebaseAppletConfig.firestoreDatabaseId ||
  "(default)";

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (connecting to (default) or named database)
export const db: Firestore =
  firestoreDatabaseId && firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firestoreDatabaseId)
    : getFirestore(app);

// Validate connection to Firestore on initial boot (Firebase Skill constraint)
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

// Safe client-side analytics initialization
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Graceful fallback if analytics not supported or blocked
  });
}

export function trackAnalyticsEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined") {
    // Respect user cookie preferences under GDPR / ePrivacy Directive
    try {
      if (window.localStorage) {
        const savedPrefs = window.localStorage.getItem("2r_cookie_preferences");
        if (savedPrefs) {
          const parsed = JSON.parse(savedPrefs);
          if (parsed && parsed.analytics === false) {
            // User explicitly opted out of analytics
            return;
          }
        }
        const simpleConsent = window.localStorage.getItem("2r_cookie_consent");
        if (simpleConsent === "declined") {
          return;
        }
      }
    } catch {
      // Restrictive iframe or storage sandbox
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
}
