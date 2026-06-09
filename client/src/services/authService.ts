import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

const TOKEN_KEY = '@BeakBook:token';
const USER_KEY = '@BeakBook:user';

export type User = {
  id: string;
  name: string;
  email: string;
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await api.post('/user/register/', { email, name, password });
    const { token, user } = response.data;
    
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Ошибка регистрации');
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await api.post('/user/login/', { email, password });
    const { token, user } = response.data;
    
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Ошибка входа');
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
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};