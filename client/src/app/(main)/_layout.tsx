// src/app/(main)/_layout.tsx
import { Tabs } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeColors } from '@/components/Themed';

export default function MainLayout() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Tabs.Screen name="feed" options={{ title: 'Лента', tabBarIcon: ({ color }) => <FontAwesome6 name="list-ul" size={22} color={color} /> }} />
      <Tabs.Screen name="guide" options={{ title: 'Гид', tabBarIcon: ({ color }) => <FontAwesome6 name="compass" size={22} color={color} /> }} />
      <Tabs.Screen name="add" options={{ title: 'Новое', tabBarIcon: ({ color }) => <FontAwesome6 name="circle-plus" size={24} color={color} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Избранное', tabBarIcon: ({ color }) => <FontAwesome6 name="star" size={20} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль', tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={20} color={color} /> }} />
    </Tabs>
  );
}