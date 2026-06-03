// app/main/_layout.tsx
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, StyleSheet, Platform, StatusBar } from 'react-native';
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
    <>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background}
      />
      <Tabs
        screenOptions={{
          headerTitle: () => null,
          headerLeft: () => (
            <View style={[styles.headerLeft, { paddingLeft: Math.max(insets.left, Spacing.four) }]}>
              <View style={styles.headerTitle}>
                <FontAwesome6 name="feather" size={32} color={colors.accent} />
                <ThemedText style={styles.logo}>BeakBook</ThemedText>
              </View>
              <ThemedTextSecondary style={styles.subhead}>
                Оренбургская область • 90+ видов под охраной
              </ThemedTextSecondary>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleTheme} 
              style={[styles.themeButton, { paddingRight: Math.max(insets.right, Spacing.four) }]}
              activeOpacity={0.7}
            >
              <FontAwesome6 
                name={theme === 'light' ? 'moon' : 'sun'} 
                size={24} 
                color={colors.text} 
              />
            </TouchableOpacity>
          ),
          headerStyle: { 
            backgroundColor: colors.background, 
            elevation: 0, 
            shadowOpacity: 0,
            height: Platform.OS === 'ios' ? 110 : 90,
          },
          headerTitleStyle: { color: colors.text },
          tabBarStyle: { 
            backgroundColor: colors.background, 
            borderTopColor: colors.border, 
            borderTopWidth: 0.5,
            paddingBottom: isIOS ? insets.bottom : Spacing.two,
            paddingTop: Platform.OS === 'ios' ? Spacing.two : Spacing.one,
            height: Platform.OS === 'ios' ? 85 : 65,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: styles.tabLabel,
          tabBarShowLabel: true,
          tabBarLabelPosition: 'below-icon',
        }}
      >
        <Tabs.Screen 
          name="feed" 
          options={{ 
            title: 'Лента', 
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6 name="list-ul" size={22} color={color} solid={focused} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="guide" 
          options={{ 
            title: 'Гид', 
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6 name="compass" size={22} color={color} solid={focused} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="add" 
          options={{ 
            title: 'Новое', 
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6 name="circle-plus" size={24} color={color} solid={focused} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="favorites" 
          options={{ 
            title: 'Избранное', 
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6 name="star" size={20} color={color} solid={focused} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            title: 'Профиль', 
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6 name="user" size={20} color={color} solid={focused} />
            ),
          }} 
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  logo: {
    fontSize: Platform.OS === 'ios' ? 24 : 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subhead: {
    fontSize: Platform.OS === 'ios' ? 11 : 10,
    marginTop: Spacing.one,
  },
  themeButton: {
    padding: Spacing.two,
  },
  tabLabel: {
    fontSize: Platform.OS === 'ios' ? 10 : 11,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 0 : Spacing.one,
    marginTop: Platform.OS === 'ios' ? 2 : 0,
  },
});