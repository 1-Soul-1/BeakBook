// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api/client';

const TOKEN_KEY = '@BeakBook:token';
const USER_KEY = '@BeakBook:user';

export type User = {
  id: string;
  name: string;
  email: string;
};

// Улучшенная функция извлечения сообщения об ошибке
const extractErrorMessage = (error: any): string => {
  if (error.response) {
    const data = error.response.data;
    // Если ответ - объект с деталями валидации
    if (data && typeof data === 'object') {
      // Проверяем распространённые поля ошибок Django REST Framework
      const errorMessages: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) && value.length > 0) {
          errorMessages.push(`${key}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          errorMessages.push(`${key}: ${value}`);
        } else if (typeof value === 'object' && value !== null) {
          // Рекурсивно обрабатываем вложенные объекты (редко, но на всякий случай)
          errorMessages.push(JSON.stringify(value));
        }
      }
      if (errorMessages.length > 0) {
        return errorMessages.join('; ');
      }
      // Если поле "detail" – возвращаем его
      if (data.detail) return data.detail;
      if (data.error) return data.error;
      if (data.message) return data.message;
      // Если ничего не подошло – возвращаем JSON строку
      return JSON.stringify(data);
    }
    return data || 'Неизвестная ошибка сервера';
  }
  return 'Ошибка сети или сервер не отвечает';
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    console.log('🔐 Register request:', { email, name });
    const response = await api.post('/user/register/', { email, name, password });
    console.log('✅ Register response:', response.data);
    const { access, user } = response.data;
    if (!access || !user) {
      throw new Error('Неверный ответ сервера: отсутствует access или user');
    }
    await AsyncStorage.setItem(TOKEN_KEY, access);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error: any) {
    const message = extractErrorMessage(error);
    console.error('❌ Register error:', message);
    throw new Error(message);
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    console.log('🔐 Login request:', { email });
    const response = await api.post('/user/login/', { email, password });
    console.log('✅ Login response:', response.data);
    const { access, user } = response.data;
    if (!access || !user) {
      throw new Error('Неверный ответ сервера: отсутствует access или user');
    }
    await AsyncStorage.setItem(TOKEN_KEY, access);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error: any) {
    const message = extractErrorMessage(error);
    console.error('❌ Login error:', message);
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const userStr = await AsyncStorage.getItem(USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};