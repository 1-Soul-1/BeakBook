// api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// API адрес для production и development
const API_BASE_URL = 'http://62.113.99.166:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@BeakBook:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@BeakBook:token');
      await AsyncStorage.removeItem('@BeakBook:user');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (email: string, name: string, password: string) =>
  api.post('/user/register/', { email, name, password });

export const login = (email: string, password: string) =>
  api.post('/user/login/', { email, password });

export const getCurrentUserAPI = () => api.get('/user/me/');

// Data endpoints
export const getBirdSpecies = () => api.get('/birds/species/');
export const getWikis = () => api.get('/wiki/wikis/');
export const getObservations = () => api.get('/user/api/observations/');
export const createObservation = (data: any) => api.post('/user/api/observations/', data);
export const updateObservation = (id: number, data: any) => api.put(`/user/api/observations/${id}/`, data);
export const deleteObservationAPI = (id: number) => api.delete(`/user/api/observations/${id}/`);