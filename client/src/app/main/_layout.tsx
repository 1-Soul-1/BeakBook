import { Tabs } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { logoutUser } from '../../services/authService';

export default function MainLayout() {
  const handleLogout = async () => {
    await logoutUser();
    router.replace('/signin');
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Text style={{ color: '#8B7A6B', fontSize: 14, fontWeight: '600' }}>Выйти</Text>
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: '#F5F0E8' },
        headerTitleStyle: { color: '#4A5A3E', fontWeight: '800' },
        tabBarStyle: { backgroundColor: '#F5F0E8' },
        tabBarActiveTintColor: '#6A7A5C',
        tabBarInactiveTintColor: '#6B6355',
      }}
    >
      <Tabs.Screen name="birds" options={{ title: 'Виды' }} />
      <Tabs.Screen name="wiki" options={{ title: 'Энциклопедия' }} />
      <Tabs.Screen name="add" options={{ title: '➕ Новое' }} />
    </Tabs>
  );
}