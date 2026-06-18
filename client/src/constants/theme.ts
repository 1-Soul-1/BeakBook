// src/constants/theme.ts
import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ========== ЦВЕТА ==========
export const Colors = {
  light: {
    background: '#F5F0E8',
    card: '#FFFFFF',
    cardAlt: '#FDFCF5',
    text: '#2E2C28',
    textSecondary: '#6B6355',
    textMuted: '#9B9383',
    border: '#E6E0D0',
    accent: '#6A7A5C',
    accentLight: '#DDE6D6',
    accentDark: '#4A5A3E',
    warning: '#D4B87A',
    warningLight: '#FDF6E8',
    danger: '#E39371',
    dangerLight: '#FDF0EA',
    favorite: '#E8B84B',
    favoriteLight: '#FEF7E8',
    statusEndangered: '#E39371',
    statusEndangeredBg: '#FDF0EA',
    statusVulnerable: '#E0B85C',
    statusVulnerableBg: '#FEF8EC',
    statusRare: '#8FA47E',
    statusRareBg: '#EEF3EA',
    statusCommon: '#A8A090',
    statusCommonBg: '#F3F1ED',
  },
  dark: {
    background: '#121412',
    card: '#1E221B',
    cardAlt: '#282D24',
    text: '#F2EFE8',
    textSecondary: '#CFCAB8',
    textMuted: '#9B9682',
    border: '#4A5042',
    accent: '#8FA47E',
    accentLight: '#3A4334',
    accentDark: '#6A7A5C',
    warning: '#E0C068',
    warningLight: '#3E3A28',
    danger: '#E39371',
    dangerLight: '#3E2E28',
    favorite: '#F0C45A',
    favoriteLight: '#3E3828',
    statusEndangered: '#E39371',
    statusEndangeredBg: '#3E2E28',
    statusVulnerable: '#E0B85C',
    statusVulnerableBg: '#3E3A28',
    statusRare: '#8FA47E',
    statusRareBg: '#2E342A',
    statusCommon: '#A8A090',
    statusCommonBg: '#2A2E28',
  },
} as const;

// ========== ОТСТУПЫ ==========
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
  ten: 64,
} as const;

// ========== СКРУГЛЕНИЯ ==========
export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  round: 40,
  pill: 48,
  circle: 999,
} as const;

// ========== ТИПОГРАФИКА ==========
export const Typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  title: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  captionSmall: { fontSize: 10, fontWeight: '500' as const, lineHeight: 14 },
} as const;

// ========== ШРИФТЫ (платформозависимые) ==========
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  android: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
}) as Record<string, string>;

// ========== ТЕНИ ==========
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// ========== ПЛАТФОРМА ==========
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export const BOTTOM_TAB_HEIGHT = isIOS ? 80 : 60;
export const HEADER_HEIGHT = isIOS ? 100 : 80;

// ========== НОВЫЕ АДАПТИВНЫЕ ФУНКЦИИ ==========
export const responsiveSize = (size: number): number => {
  const baseWidth = 375;
  return Math.round((size * width) / baseWidth);
};

export const getSpacing = (size: keyof typeof Spacing): number => {
  const value = Spacing[size];
  return Platform.select({
    ios: value,
    android: value * 0.85,
    default: value,
  });
};

export const getFontSize = (size: number): number => {
  return Platform.select({
    ios: size,
    android: size * 0.9,
    default: size,
  });
};