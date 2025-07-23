import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContextType, ThemeType, ThemePreset } from '../types';
import { applyTheme } from '../lib/theme';

// Default values
const defaultTheme: ThemeType = 'light';
const defaultThemePreset: ThemePreset = 'organic';

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  themePreset: defaultThemePreset,
  setTheme: () => {},
  setThemePreset: () => {},
  toggleTheme: () => {}
});

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeType;
  initialThemePreset?: ThemePreset;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
  initialThemePreset
}) => {
  // Initialize state with defaults first
  const [theme, setThemeState] = useState<ThemeType>(initialTheme || defaultTheme);
  const [themePreset, setThemePresetState] = useState<ThemePreset>(initialThemePreset || defaultThemePreset);
  
  // Load from localStorage when component mounts
  useEffect(() => {
    // Only access localStorage and window API on client side
    try {
      // Check if a theme preference is stored
      const storedTheme = localStorage.getItem('theme') as ThemeType | null;
      
      if (storedTheme) {
        setThemeState(storedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark');
      }
      
      const storedPreset = localStorage.getItem('themePreset') as ThemePreset | null;
      if (storedPreset) {
        setThemePresetState(storedPreset);
      }
    } catch (e) {
      console.log('Could not access localStorage', e);
    }
  }, []);

  // Apply theme to document when theme or themePreset changes
  useEffect(() => {
    try {
      // Only execute in browser environment
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        // Add or remove 'dark' class from document root
        document.documentElement.classList.toggle('dark', theme === 'dark');
        
        // Apply HSL color values from theme preset
        applyTheme(themePreset, theme === 'dark');
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        localStorage.setItem('themePreset', themePreset);
      }
    } catch (e) {
      console.log('Error applying theme:', e);
    }
  }, [theme, themePreset]);

  // Set theme with localStorage persistence
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  // Set theme preset with localStorage persistence
  const setThemePreset = (newPreset: ThemePreset) => {
    setThemePresetState(newPreset);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themePreset,
      setTheme,
      setThemePreset,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
