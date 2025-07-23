import { ThemePreset } from '../types';

interface ThemeColors {
  // Primary colors
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // Accent colors
  accent: string;
  accentForeground: string;
  
  // Status colors
  success: string;
  warning: string;
  danger: string;
  info: string;
  
  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export type ThemeConfig = {
  light: ThemeColors;
  dark: ThemeColors;
}

const themes: Record<ThemePreset, ThemeConfig> = {
  organic: {
    light: {
      primary: '142.1 76.2% 36.3%', // #12B76A (green)
      primaryForeground: '355.7 100% 97.3%', // #FEF2F2
      secondary: '221.2 83.2% 53.3%', // #3B82F6 (blue)
      secondaryForeground: '210 40% 98%', // #F5F8FC
      accent: '142.1 76.2% 36.3%', // #12B76A (green)
      accentForeground: '222.2 47.4% 11.2%', // #111827
      success: '142.1 76.2% 36.3%', // #12B76A
      warning: '38 92% 50%', // #FFAB00
      danger: '0 84.2% 60.2%', // #FF5630
      info: '198.6 88.7% 48.4%', // #00B8D9
      chart1: '142.1 76.2% 36.3%', // #12B76A
      chart2: '221.2 83.2% 53.3%', // #3B82F6
      chart3: '38 92% 50%', // #FFAB00
      chart4: '325 78% 59.8%', // #DF4CB6
      chart5: '261 51.1% 52.7%', // #7B61FF
    },
    dark: {
      primary: '142.1 70.6% 45.3%', // #10B981 
      primaryForeground: '210 40% 98%', // #F5F8FC
      secondary: '217.2 91.2% 59.8%', // #3B82F6
      secondaryForeground: '210 40% 98%', // #F5F8FC
      accent: '142.1 70.6% 45.3%', // #10B981
      accentForeground: '210 40% 98%', // #F5F8FC
      success: '142.1 70.6% 45.3%', // #10B981
      warning: '32 94% 49%', // #FFB224
      danger: '0 72.2% 50.6%', // #EF4444
      info: '198.6 88.7% 48.4%', // #00B8D9
      chart1: '142.1 70.6% 45.3%', // #10B981
      chart2: '217.2 91.2% 59.8%', // #3B82F6
      chart3: '32 94% 49%', // #FFB224
      chart4: '320 80% 64%', // #EB559F
      chart5: '261 51.1% 52.7%', // #7B61FF
    }
  },
  modern: {
    light: {
      primary: '224 82% 56%', // #407BFF (blue)
      primaryForeground: '0 0% 100%', // #FFFFFF
      secondary: '262 83% 58%', // #7C3AED (purple)
      secondaryForeground: '0 0% 100%', // #FFFFFF
      accent: '190 80% 50%', // #17B3D9 (cyan)
      accentForeground: '0 0% 100%', // #FFFFFF
      success: '160 84% 39%', // #10B981
      warning: '43 96% 56%', // #FBBF24
      danger: '0 84% 60%', // #F43F5E
      info: '199 89% 48%', // #06B6D4
      chart1: '224 82% 56%', // #407BFF
      chart2: '262 83% 58%', // #7C3AED
      chart3: '190 80% 50%', // #17B3D9
      chart4: '326 100% 59%', // #EC4899
      chart5: '16 100% 50%', // #F97316
    },
    dark: {
      primary: '217 91% 60%', // #3B82F6
      primaryForeground: '0 0% 100%', // #FFFFFF
      secondary: '271 91% 65%', // #8B5CF6
      secondaryForeground: '0 0% 100%', // #FFFFFF
      accent: '189 94% 43%', // #06B6D4
      accentForeground: '0 0% 100%', // #FFFFFF
      success: '142 72% 50%', // #22C55E
      warning: '45 100% 51%', // #FFC233
      danger: '0 84% 60%', // #F43F5E
      info: '199 89% 48%', // #06B6D4
      chart1: '217 91% 60%', // #3B82F6
      chart2: '271 91% 65%', // #8B5CF6
      chart3: '189 94% 43%', // #06B6D4
      chart4: '326 100% 59%', // #EC4899
      chart5: '16 100% 50%', // #F97316
    }
  },
  cyber: {
    light: {
      primary: '260 100% 60%', // #5D5FEF (electric purple)
      primaryForeground: '0 0% 100%', // #FFFFFF
      secondary: '196 100% 50%', // #00C8FF (electric blue)
      secondaryForeground: '0 0% 100%', // #FFFFFF
      accent: '130 100% 50%', // #00FF47 (electric green)
      accentForeground: '0 0% 0%', // #000000
      success: '130 100% 50%', // #00FF47
      warning: '40 100% 50%', // #FFB800
      danger: '0 100% 60%', // #FF3333
      info: '200 100% 50%', // #00D1FF
      chart1: '260 100% 60%', // #5D5FEF
      chart2: '196 100% 50%', // #00C8FF
      chart3: '328 100% 54%', // #FF2DAE
      chart4: '130 100% 50%', // #00FF47
      chart5: '40 100% 50%', // #FFB800
    },
    dark: {
      primary: '275 80% 60%', // #7C4DFF
      primaryForeground: '0 0% 100%', // #FFFFFF
      secondary: '180 100% 50%', // #00FFFF (cyan)
      secondaryForeground: '0 0% 100%', // #FFFFFF
      accent: '120 100% 50%', // #00FF00 (neon green)
      accentForeground: '0 0% 0%', // #000000
      success: '120 100% 50%', // #00FF00
      warning: '60 100% 50%', // #FFFF00
      danger: '0 100% 50%', // #FF0000
      info: '240 100% 50%', // #0000FF
      chart1: '275 80% 60%', // #7C4DFF
      chart2: '180 100% 50%', // #00FFFF
      chart3: '330 100% 50%', // #FF00FF
      chart4: '120 100% 50%', // #00FF00
      chart5: '60 100% 50%', // #FFFF00
    }
  }
};

export function applyTheme(themePreset: ThemePreset, isDark: boolean) {
  const theme = themes[themePreset];
  const colors = isDark ? theme.dark : theme.light;
  
  document.documentElement.style.setProperty('--primary', colors.primary);
  document.documentElement.style.setProperty('--primary-foreground', colors.primaryForeground);
  document.documentElement.style.setProperty('--secondary', colors.secondary);
  document.documentElement.style.setProperty('--secondary-foreground', colors.secondaryForeground);
  document.documentElement.style.setProperty('--accent', colors.accent);
  document.documentElement.style.setProperty('--accent-foreground', colors.accentForeground);
  
  // Set chart colors
  document.documentElement.style.setProperty('--chart-1', colors.chart1);
  document.documentElement.style.setProperty('--chart-2', colors.chart2);
  document.documentElement.style.setProperty('--chart-3', colors.chart3);
  document.documentElement.style.setProperty('--chart-4', colors.chart4);
  document.documentElement.style.setProperty('--chart-5', colors.chart5);
}

export function getThemeConfig(preset: ThemePreset, isDark: boolean): ThemeColors {
  return isDark ? themes[preset].dark : themes[preset].light;
}
