import { useState, useEffect } from 'react';

interface NotificationSettings {
  popupsEnabled: boolean;
  soundEnabled: boolean;
  criticalOnly: boolean;
}

const defaultSettings: NotificationSettings = {
  popupsEnabled: true,
  soundEnabled: false,
  criticalOnly: false
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notification-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('notification-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const togglePopups = () => {
    updateSettings({ popupsEnabled: !settings.popupsEnabled });
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const toggleCriticalOnly = () => {
    updateSettings({ criticalOnly: !settings.criticalOnly });
  };

  return {
    settings,
    updateSettings,
    togglePopups,
    toggleSound,
    toggleCriticalOnly
  };
};