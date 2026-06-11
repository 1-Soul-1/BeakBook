// app/(main)/_layout.tsx
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, isIOS } from '../../constants/theme';

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => null,
        headerLeft: () => (
          <View style={[styles.headerLeft, { paddingLeft: Math.max(insets.left, Spacing.five) }]}>
            <ThemedText style={[styles.logo, { color: colors.accent }]}>BeakBook</ThemedText>
            <ThemedTextSecondary style={styles.subhead}>Оренбургская область</ThemedTextSecondary>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeButton, { borderColor: colors.border, backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <FontAwesome6 name={theme === 'light' ? 'moon' : 'sun'} size={18} color={colors.text} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 100 : 80,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingBottom: isIOS ? insets.bottom : Spacing.two,
          height: Platform.OS === 'ios' ? 85 : 70,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen name="feed" options={{ title: 'Лента', tabBarIcon: ({ color, focused }) => <FontAwesome6 name="list-ul" size={22} color={color} solid={focused} /> }} />
      <Tabs.Screen name="guide" options={{ title: 'Гид', tabBarIcon: ({ color, focused }) => <FontAwesome6 name="compass" size={22} color={color} solid={focused} /> }} />
      <Tabs.Screen name="add" options={{ title: 'Новое', tabBarIcon: ({ color, focused }) => <FontAwesome6 name="circle-plus" size={24} color={color} solid={focused} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Избранное', tabBarIcon: ({ color, focused }) => <FontAwesome6 name="star" size={20} color={color} solid={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль', tabBarIcon: ({ color, focused }) => <FontAwesome6 name="user" size={20} color={color} solid={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeft: { flexDirection: 'column', justifyContent: 'center', paddingVertical: Spacing.two },
  logo: { fontSize: Platform.OS === 'ios' ? 28 : 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: Spacing.one },
  subhead: { fontSize: Platform.OS === 'ios' ? 11 : 10 },
  themeButton: { padding: Spacing.two, borderRadius: 30, borderWidth: 1, marginRight: Spacing.four },
});