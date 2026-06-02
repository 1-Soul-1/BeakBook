import { Tabs } from 'expo-router';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import { useTheme } from '../../contexts/ThemeContext';

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => (
          <View>
            <View style={styles.headerTitle}>
              <FontAwesome6 name="feather" size={24} color={colors.accent} />
              <ThemedText style={styles.logo}>BeakBook</ThemedText>
            </View>
            <ThemedTextSecondary style={styles.subhead}>
              Оренбургская область • 90+ видов под охраной
            </ThemedTextSecondary>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
            <FontAwesome6 name={theme === 'light' ? 'moon' : 'sun'} size={22} color={colors.text} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: colors.background, elevation: 0, shadowOpacity: 0 },
        headerTitleStyle: { color: colors.text },
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: 8, height: 60 },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen name="feed" options={{ title: 'Лента', tabBarIcon: ({ color }) => <FontAwesome6 name="list-ul" size={20} color={color} /> }} />
      <Tabs.Screen name="guide" options={{ title: 'Гид', tabBarIcon: ({ color }) => <FontAwesome6 name="compass" size={20} color={color} /> }} />
      <Tabs.Screen name="add" options={{ title: 'Новое', tabBarIcon: ({ color }) => <FontAwesome6 name="circle-plus" size={24} color={color} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Избранное', tabBarIcon: ({ color }) => <FontAwesome6 name="star" size={20} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль', tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={20} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subhead: { fontSize: 10, marginTop: 2 },
});