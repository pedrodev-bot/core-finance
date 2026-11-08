import { create } from 'zustand';
import { darkTheme, lightTheme, Theme } from '../constants/theme';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: darkTheme,
  isDark: true,
  toggleTheme: () =>
    set((state) => {
      const nextIsDark = !state.isDark;
      return {
        isDark: nextIsDark,
        theme: (nextIsDark ? darkTheme : lightTheme) as Theme,
      };
    }),
  setTheme: (mode) =>
    set({
      isDark: mode === 'dark',
      theme: (mode === 'dark' ? darkTheme : lightTheme) as Theme,
    }),
}));