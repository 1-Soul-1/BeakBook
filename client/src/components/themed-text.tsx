// components/themed-text.tsx
import { Text, TextProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../constants/theme';

export const ThemedText: React.FC<TextProps & { type?: keyof typeof Typography }> = ({ 
  style, 
  type = 'body', 
  ...props 
}) => {
  const { theme } = useTheme();
  const colors = require('../constants/theme').Colors;
  const themeColors = colors[theme];
  
  return (
    <Text 
      style={[{ color: themeColors.text }, Typography[type], style]} 
      {...props} 
    />
  );
};