export const Palette = {
  lime: '#a3e635',
  limeDark: '#4d7c0f',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#0ea5e9',
};

export const darkTheme = {
  mode: 'dark' as const,
  background: '#121216',
  card: '#1E1E24',
  cardBorder: '#2A2A32',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#52525B',
  inputBg: '#18181B',
  inputBorder: '#27272A',
  tabBarBg: '#121216',
  tabBarBorder: '#1E1E24',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  accent: Palette.lime,
  expense: Palette.red,
  income: Palette.green,
  investment: Palette.blue,
};

export const lightTheme = {
  mode: 'light' as const,
  background: '#F4F4F6',
  card: '#FFFFFF',
  cardBorder: '#E4E4E7',
  textPrimary: '#18181B',
  textSecondary: '#71717A',
  textMuted: '#A1A1AA',
  inputBg: '#F4F4F5',
  inputBorder: '#E4E4E7',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E4E4E7',
  modalOverlay: 'rgba(0, 0, 0, 0.4)',
  accent: Palette.lime,
  expense: Palette.red,
  income: Palette.green,
  investment: Palette.blue,
};

export type Theme = typeof darkTheme;