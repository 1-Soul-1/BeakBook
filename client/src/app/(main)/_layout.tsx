// src/app/(main)/_layout.tsx
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedText, ThemedTextSecondary, getThemeColors } from '@/components/Themed';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, isIOS, BorderRadius } from '@/constants/theme';

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);
  const insets = useSafeAreaInsets();

  // Размеры для заголовка в зависимости от платформы
  const headerHeight = Platform.select({
    ios: 90,
    android: 70,
    default: 80,
  });

  const logoFontSize = Platform.select({
    ios: 24,
    android: 20,
    default: 22,
  });

  const subheadFontSize = Platform.select({
    ios: 11,
    android: 9,
    default: 10,
  });

  return (
    <Tabs
      screenOptions={{
        headerTitle: '',
        headerTitleStyle: { display: 'none' },
        headerLeft: () => (
          <View style={[styles.headerLeft, { paddingLeft: Math.max(insets.left, Spacing.four) }]}>
            <ThemedText style={[styles.logo, { color: colors.accent, fontSize: logoFontSize }]}>
              BeakBook
            </ThemedText>
            <ThemedTextSecondary style={[styles.subhead, { fontSize: subheadFontSize }]}>
              Оренбургская область • 90+ видов
            </ThemedTextSecondary>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
                paddingVertical: Platform.select({ ios: Spacing.two, android: Spacing.one }),
                paddingHorizontal: Platform.select({ ios: Spacing.three, android: Spacing.two }),
              },
            ]}
            activeOpacity={0.7}
          >
            <FontAwesome6
              name={theme === 'light' ? 'moon' : 'sun'}
              size={Platform.select({ ios: 18, android: 16 })}
              color={colors.text}
            />
            <ThemedText
              style={[
                styles.themeButtonText,
                {
                  color: colors.text,
                  fontSize: Platform.select({ ios: 12, android: 10 }),
                },
              ]}
            >
              {theme === 'light' ? 'Тёмная' : 'Светлая'}
            </ThemedText>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          height: headerHeight,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingBottom: isIOS ? insets.bottom : Spacing.two,
          height: Platform.select({ ios: 80, android: 60 }),
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: Platform.select({ ios: 10, android: 9 }),
          fontWeight: '500',
          marginBottom: Platform.select({ ios: 0, android: 2 }),
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Лента',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="list-ul" size={Platform.select({ ios: 22, android: 20 })} color={color} solid={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Гид',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="compass" size={Platform.select({ ios: 22, android: 20 })} color={color} solid={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Новое',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="circle-plus" size={Platform.select({ ios: 24, android: 22 })} color={color} solid={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Избранное',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="star" size={Platform.select({ ios: 20, android: 18 })} color={color} solid={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="user" size={Platform.select({ ios: 20, android: 18 })} color={color} solid={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
  },
  logo: {
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: Platform.select({ ios: 2, android: 1 }),
  },
  subhead: {
    fontWeight: '400',
    opacity: 0.8,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    marginRight: Spacing.four,
  },
  themeButtonText: {
    fontWeight: '500',
  },
});