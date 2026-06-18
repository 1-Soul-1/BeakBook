// src/app/index.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { getCurrentUser, getToken } from '@/services/authService';
import { ThemedView, ThemedText } from '@/components/Themed';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          const user = await getCurrentUser();
          if (user) {
            router.replace('/feed');
          } else {
            router.replace('/signin');
          }
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
