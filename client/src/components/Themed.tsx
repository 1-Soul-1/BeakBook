// src/components/Themed.tsx
import { Text, TextProps, View, ViewProps, StyleSheet, TouchableOpacity, TouchableOpacityProps, ActivityIndicator, Platform, TextInput as RNTextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../constants/theme';

export const getThemeColors = (theme: 'light' | 'dark') => Colors[theme];

export const ThemedView: React.FC<ViewProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  return <View style={[{ backgroundColor: colors.background }, style]} {...props} />;
};

export const ThemedCard: React.FC<ViewProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 0.5,
          borderRadius: BorderRadius.xxl,
          ...Shadows.medium,
        },
        style,
      ]}
      {...props}
    />
  );
};

export const ThemedText: React.FC<TextProps & { type?: keyof typeof Typography }> = ({ 
  style, 
  type = 'body', 
  ...props 
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  return <Text style={[{ color: colors.text }, Typography[type], style]} {...props} />;
};

export const ThemedTextSecondary: React.FC<TextProps & { type?: keyof typeof Typography }> = ({ 
  style, 
  type = 'bodySmall', 
  ...props 
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  return <Text style={[{ color: colors.textSecondary }, Typography[type], style]} {...props} />;
};

export const ThemedSearchBar: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}> = ({ value, onChangeText, placeholder, onClear }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  return (
    <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.searchIcon, { color: colors.textMuted }]}>🔍</Text>
      <RNTextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
      {value !== '' && onClear && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={{ color: colors.textMuted }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const ThemedButton: React.FC<TouchableOpacityProps & { variant?: 'primary' | 'secondary' | 'danger' }> = ({
  children,
  variant = 'primary',
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.accent };
      case 'secondary':
        return { backgroundColor: colors.accentLight, borderWidth: 1, borderColor: colors.border };
      case 'danger':
        return { backgroundColor: colors.danger };
      default:
        return { backgroundColor: colors.accent };
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return colors.text;
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {typeof children === 'string' ? (
        <ThemedText style={[styles.buttonText, { color: getTextColor() }]}>{children}</ThemedText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Platform.OS === 'ios' ? Spacing.three : Spacing.two,
    borderWidth: 0.5,
    gap: Spacing.two,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? Spacing.two : 0,
  },
  clearButton: {
    padding: Spacing.one,
  },
});