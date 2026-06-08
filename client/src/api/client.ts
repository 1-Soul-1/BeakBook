import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const SERVER_URL = 'http://62.113.99.166:8000/api';

const getBaseUrl = () => {
  if (__DEV__) {
    // Web (браузер)
    if (Platform.OS === 'web') {
      return 'http://localhost:8000/api';
    }
    // Android эмулятор
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    // iOS симулятор
    return 'http://localhost:8000/api';
  }
  // Production – замените на реальный URL
  return 'https://62.113.99.166/api';
};

export const api = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Простой logout без лишних ошибок
export const register = (email: string, name: string, password: string) =>
  api.post('/user/register/', { email, name, password });

export const login = (email: string, password: string) =>
  api.post('/user/login/', { email, password });

export const getCurrentUser = () => api.get('/user/me/');