// app/index.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { getCurrentUser } from '../services/authService';
import { ThemedView, ThemedText } from '../components/Themed';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Только существующий маршрут
          router.replace('/main/feed');
        } else {
          router.replace('/signin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/signin');
      }
    };
    checkAuth();
  }, []);

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <ThemedText>Загрузка...</ThemedText>
    </ThemedView>
  );
}