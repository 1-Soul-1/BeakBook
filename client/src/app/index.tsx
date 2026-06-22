// src/app/index.tsx
import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { ThemedView, ThemedText } from '@/components/Themed';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Ждём, пока навигатор будет готов
    if (!rootNavigationState?.key) return;
    router.replace('/feed');
  }, [rootNavigationState?.key]);

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <ThemedText>Загрузка...</ThemedText>
    </ThemedView>
  );
}