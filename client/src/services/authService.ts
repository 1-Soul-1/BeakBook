import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api/client';

const TOKEN_KEY = '@BeakBook:token';
const USER_KEY = '@BeakBook:user';

export type User = {
  id: string;
  name: string;
  email: string;
};

const extractErrorMessage = (error: any): string => {
  if (error.response) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.error) return data.error;
    if (data.message) return data.message;
    if (data.email) return data.email[0];
    if (data.name) return data.name[0];
    if (data.password) return data.password[0];
    return 'Неизвестная ошибка сервера';
  }
  return 'Ошибка сети или сервер не отвечает';
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    console.log('🔐 Register request:', { email, name, password });
    const response = await api.post('/user/register/', { email, name, password });
    console.log('✅ Register response:', response.data);
    const { token, user } = response.data;
    if (!token || !user) {
      throw new Error('Неверный ответ сервера: отсутствует token или user');
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
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
    const { token, user } = response.data;
    if (!token || !user) {
      throw new Error('Неверный ответ сервера: отсутствует token или user');
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
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
