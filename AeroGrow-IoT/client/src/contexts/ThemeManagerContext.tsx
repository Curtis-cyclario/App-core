import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'organic' | 'cyber' | 'source-code' | 'green-thumb' | 'minimalist' | 'racing';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string;
  textColor: string;
  cardStyle: string;
  buttonStyle: string;
}

export interface ThemeManagerContextType {
  currentTheme: Theme;
  setTheme: (themeId: ThemeId) => void;
  availableThemes: Theme[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const themes: Theme[] = [
  {
    id: 'organic',
    name: 'Organic Modern',
    description: 'Timeless design with natural elements and premium glass effects',
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
    accentColor: '#06d6a0',
    backgroundGradient: 'from-slate-900 via-gray-900 to-emerald-900',
    textColor: 'text-white',
    cardStyle: 'organic-card',
    buttonStyle: 'organic-button'
  },
  {
    id: 'cyber',
    name: 'Cyber Matrix',
    description: 'Futuristic neon aesthetics with digital grid patterns',
    primaryColor: '#00ffff',
    secondaryColor: '#ff00ff',
    accentColor: '#ffff00',
    backgroundGradient: 'from-gray-900 via-purple-900 to-violet-900',
    textColor: 'text-cyan-100',
    cardStyle: 'cyber-card',
    buttonStyle: 'cyber-button'
  },
  {
    id: 'source-code',
    name: 'Source Code',
    description: 'Terminal-inspired interface with monospace typography',
    primaryColor: '#22c55e',
    secondaryColor: '#84cc16',
    accentColor: '#65a30d',
    backgroundGradient: 'from-gray-900 via-green-900 to-emerald-900',
    textColor: 'text-green-100',
    cardStyle: 'terminal-card',
    buttonStyle: 'terminal-button'
  },
  {
    id: 'green-thumb',
    name: 'Green Thumb',
    description: 'Natural garden aesthetic with earth tones and plant motifs',
    primaryColor: '#22c55e',
    secondaryColor: '#16a34a',
    accentColor: '#15803d',
    backgroundGradient: 'from-green-900 via-emerald-900 to-teal-900',
    textColor: 'text-green-50',
    cardStyle: 'nature-card',
    buttonStyle: 'nature-button'
  },
  {
    id: 'minimalist',
    name: 'Clean Minimalist',
    description: 'Pure simplicity with clean lines and subtle shadows',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#a855f7',
    backgroundGradient: 'from-slate-50 via-blue-50 to-indigo-50',
    textColor: 'text-slate-900',
    cardStyle: 'minimal-card',
    buttonStyle: 'minimal-button'
  },
  {
    id: 'racing',
    name: 'Racing Dashboard',
    description: 'High-performance motorsport interface with speed elements',
    primaryColor: '#ef4444',
    secondaryColor: '#f97316',
    accentColor: '#eab308',
    backgroundGradient: 'from-red-900 via-orange-900 to-yellow-900',
    textColor: 'text-red-100',
    cardStyle: 'racing-card',
    buttonStyle: 'racing-button'
  }
];

const ThemeManagerContext = createContext<ThemeManagerContextType | undefined>(undefined);

export interface ThemeManagerProviderProps {
  children: React.ReactNode;
}

export const ThemeManagerProvider: React.FC<ThemeManagerProviderProps> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('organic');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') as ThemeId;
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentThemeId(savedTheme);
    }
    setIsDarkMode(savedDarkMode);
  }, []);

  const setTheme = (themeId: ThemeId) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('selectedTheme', themeId);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0];

  const value: ThemeManagerContextType = {
    currentTheme,
    setTheme,
    availableThemes: themes,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeManagerContext.Provider value={value}>
      {children}
    </ThemeManagerContext.Provider>
  );
};

export const useThemeManager = () => {
  const context = useContext(ThemeManagerContext);
  if (context === undefined) {
    throw new Error('useThemeManager must be used within a ThemeManagerProvider');
  }
  return context;
};