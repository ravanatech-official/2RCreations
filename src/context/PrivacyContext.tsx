import React, { createContext, useContext, useState, useEffect } from 'react';
import { CookiePreferences } from '../types';

export type PreferenceTab = 'cookies' | 'communications' | 'rights';

interface PrivacyContextType {
  isPreferenceModalOpen: boolean;
  activeTab: PreferenceTab;
  cookiePreferences: CookiePreferences;
  hasAnsweredConsent: boolean;
  openPreferencesModal: (tab?: PreferenceTab) => void;
  closePreferencesModal: () => void;
  setActiveTab: (tab: PreferenceTab) => void;
  updateCookiePreferences: (prefs: Partial<CookiePreferences>) => void;
  acceptAllCookies: () => void;
  rejectNonEssentialCookies: () => void;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: true,
  functional: true,
  updatedAt: new Date().toISOString()
};

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PreferenceTab>('cookies');
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('2r_cookie_preferences');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_PREFERENCES,
            ...parsed,
            necessary: true // Enforce strict necessity
          };
        }
        const simpleConsent = window.localStorage.getItem('2r_cookie_consent');
        if (simpleConsent === 'declined') {
          return {
            necessary: true,
            analytics: false,
            functional: false,
            updatedAt: new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn('Could not read cookie preferences from localStorage:', err);
      }
    }
    return DEFAULT_PREFERENCES;
  });

  const [hasAnsweredConsent, setHasAnsweredConsent] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return Boolean(
          window.localStorage.getItem('2r_cookie_preferences') ||
          window.localStorage.getItem('2r_cookie_consent')
        );
      } catch {
        return true;
      }
    }
    return true;
  });

  const savePreferences = (prefs: CookiePreferences) => {
    setCookiePreferences(prefs);
    setHasAnsweredConsent(true);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('2r_cookie_preferences', JSON.stringify(prefs));
        window.localStorage.setItem('2r_cookie_consent', prefs.analytics ? 'accepted' : 'declined');
      } catch (err) {
        console.warn('Could not save cookie preferences:', err);
      }
    }
  };

  const updateCookiePreferences = (partial: Partial<CookiePreferences>) => {
    const updated: CookiePreferences = {
      ...cookiePreferences,
      ...partial,
      necessary: true,
      updatedAt: new Date().toISOString()
    };
    savePreferences(updated);
  };

  const acceptAllCookies = () => {
    const allOn: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      updatedAt: new Date().toISOString()
    };
    savePreferences(allOn);
  };

  const rejectNonEssentialCookies = () => {
    const essentialOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
      updatedAt: new Date().toISOString()
    };
    savePreferences(essentialOnly);
  };

  const openPreferencesModal = (tab: PreferenceTab = 'cookies') => {
    setActiveTab(tab);
    setIsPreferenceModalOpen(true);
  };

  const closePreferencesModal = () => {
    setIsPreferenceModalOpen(false);
  };

  return (
    <PrivacyContext.Provider
      value={{
        isPreferenceModalOpen,
        activeTab,
        cookiePreferences,
        hasAnsweredConsent,
        openPreferencesModal,
        closePreferencesModal,
        setActiveTab,
        updateCookiePreferences,
        acceptAllCookies,
        rejectNonEssentialCookies
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = (): PrivacyContextType => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};
