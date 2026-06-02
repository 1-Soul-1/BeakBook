import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { getCurrentUser } from '../services/authService';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      setIsAuthenticated(!!user);
    });
  }, []);

  if (isAuthenticated === null) {
    return null; // можно добавить сплеш-экран
  }

  // Не авторизованы – показываем экраны входа/регистрации
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>
    );
  }

  // Авторизованы – показываем вкладки
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="main" />
    </Stack>
  );
}