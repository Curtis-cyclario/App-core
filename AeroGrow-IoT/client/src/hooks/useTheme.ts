import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ThemeType, ThemePreset } from '../types';

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// Helper to get color variables consistent with theme
export function useThemeColor(colorName: string, variant?: 'default' | 'foreground') {
  const { theme } = useTheme();
  const suffix = variant === 'foreground' ? '-foreground' : '';
  
  return `hsl(var(--${colorName}${suffix}))`;
}

// Get color map for charts based on current theme
export function useChartColors() {
  const { theme } = useTheme();
  
  // Return array of color values
  return [
    `hsl(var(--chart-1))`,
    `hsl(var(--chart-2))`,
    `hsl(var(--chart-3))`,
    `hsl(var(--chart-4))`,
    `hsl(var(--chart-5))`
  ];
}
