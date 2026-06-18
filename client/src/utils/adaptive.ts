// src/utils/adaptive.ts
import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Базовые размеры для расчёта (iPhone SE ширина 375)
const baseWidth = 375;
const baseHeight = 667;

// Проверка типа устройства
export const isSmallDevice = width < 375;
export const isMediumDevice = width >= 375 && width < 768;
export const isTablet = width >= 768;
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

// Масштабирование размера относительно ширины экрана
export const scaleSize = (size: number): number => {
  const scale = width / baseWidth;
  return Math.round(size * scale);
};

// Масштабирование шрифта с учётом платформы
export const scaleFont = (size: number): number => {
  const scale = width / baseWidth;
  const newSize = size * scale;
  return Platform.select({
    ios: newSize,
    android: newSize * 0.9,
    default: newSize,
  });
};

// Адаптивный отступ
export const getResponsivePadding = (base: number): number => {
  return Platform.select({
    ios: base,
    android: base * 0.8,
    default: base,
  });
};

// Адаптивная высота элемента
export const getResponsiveHeight = (base: number): number => {
  const scale = height / baseHeight;
  return Platform.select({
    ios: base * scale,
    android: base * scale * 0.9,
    default: base * scale,
  });
};