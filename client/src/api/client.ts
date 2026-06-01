import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Функции аутентификации
export const register = (email: string, name: string, password: string) =>
  api.post('/user/register/', { email, name, password });

export const login = (email: string, password: string) =>
  api.post('/user/login/', { email, password });

export const getCurrentUser = () => api.get('/user/me/');

// Существующие функции
export const getBirdSpecies = () => api.get('/birds/species/');
export const getWikis = () => api.get('/wiki/wikis/');