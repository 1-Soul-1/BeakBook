import { Text, TextProps, View, ViewProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const lightColors = {
  background: '#F5F0E8',
  card: '#FFFFFF',
  cardAlt: '#FDFCF5',
  text: '#2E2C28',
  textSecondary: '#6B6355',
  border: '#E6E0D0',
  accent: '#6A7A5C',
  accentLight: '#DDE6D6',
  accentDark: '#4A5A3E',
};

const darkColors = {
  background: '#121412',
  card: '#1E221B',
  cardAlt: '#282D24',
  text: '#F2EFE8',
  textSecondary: '#CFCAB8',
  border: '#4A5042',
  accent: '#8FA47E',
  accentLight: '#3A4334',
  accentDark: '#6A7A5C',
};

export const ThemedView: React.FC<ViewProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? darkColors.background : lightColors.background;
  return <View style={[{ backgroundColor }, style]} {...props} />;
};

export const ThemedCard: React.FC<ViewProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? darkColors.card : lightColors.card;
  const borderColor = theme === 'dark' ? darkColors.border : lightColors.border;
  return <View style={[{ backgroundColor, borderColor, borderWidth: 0.5, borderRadius: 24 }, style]} {...props} />;
};

export const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const color = theme === 'dark' ? darkColors.text : lightColors.text;
  return <Text style={[{ color }, style]} {...props} />;
};

export const ThemedTextSecondary: React.FC<TextProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const color = theme === 'dark' ? darkColors.textSecondary : lightColors.textSecondary;
  return <Text style={[{ color }, style]} {...props} />;
};

export const getThemeColors = (theme: 'light' | 'dark') => (theme === 'dark' ? darkColors : lightColors);