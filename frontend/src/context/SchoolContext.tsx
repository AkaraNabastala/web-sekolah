import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SchoolProfile, WebsiteSettings } from '../types';
import { schoolApi } from '../services/api';

interface SchoolContextType {
  profile: SchoolProfile | null;
  settings: WebsiteSettings | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateCachedProfile: (profile: SchoolProfile) => void;
  updateCachedSettings: (settings: WebsiteSettings) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [profRes, setRes] = await Promise.all([
        schoolApi.getProfile(),
        schoolApi.getSettings()
      ]);
      setProfile(profRes);
      setSettings(setRes);
    } catch (err) {
      console.error('[SchoolContext] Failed to load school data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Apply the active school's palette as shared design tokens for public components.
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty('--school-primary', settings.primary_color || '#1B3B2B');
    root.style.setProperty('--school-secondary', settings.secondary_color || '#E5C178');
    root.style.setProperty('--school-accent-orange', settings.accent_orange || '#C87941');
    root.style.setProperty('--school-accent-blue', settings.accent_blue || '#547C91');
  }, [settings]);

  const updateCachedProfile = (newProfile: SchoolProfile) => {
    setProfile(newProfile);
  };

  const updateCachedSettings = (newSettings: WebsiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <SchoolContext.Provider
      value={{
        profile,
        settings,
        isLoading,
        refreshData,
        updateCachedProfile,
        updateCachedSettings
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
