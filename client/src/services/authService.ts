import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api/client';

const TOKEN_KEY = '@BeakBook:token';
const USER_KEY = '@BeakBook:user';
const REFRESH_TOKEN_KEY = '@BeakBook:refresh_token';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  refresh_token?: string;
  user: User;
};

// Сохранение токенов
const saveTokens = async (token: string, refreshToken?: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

// Сохранение пользователя
const saveUser = async (user: User) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await api.post('/user/register/', { email, name, password });
    const { token, refresh_token, user } = response.data;
    
    // Сохраняем токены и пользователя
    await saveTokens(token, refresh_token);
    await saveUser(user);
    
    return user;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Ошибка регистрации');
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await api.post('/user/login/', { email, password });
    const { token, refresh_token, user } = response.data;
    
    // Сохраняем токены и пользователя
    await saveTokens(token, refresh_token);
    await saveUser(user);
    
    return user;
  } catch (error: any) {
    console.error('Login error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Ошибка входа');
  }
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
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
