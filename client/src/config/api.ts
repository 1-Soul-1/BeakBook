// src/api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// Базовый URL сервера
const BASE_URL = 'http://62.113.99.166:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу (если есть)
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@BeakBook:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// ============ AUTH ENDPOINTS ============
export const register = (email: string, name: string, password: string) =>
  api.post('/user/register/', { email, name, password });

export const login = (email: string, password: string) =>
  api.post('/user/login/', { email, password });

export const getCurrentUserAPI = () => api.get('/user/me/');

// ============ BIRDS ENDPOINTS ============
export const getBirdSpecies = () => api.get('/birds/species/');
export const getBirdById = (id: number) => api.get(`/birds/species/${id}/`);

// ============ WIKI ENDPOINTS ============
export const getWikis = () => api.get('/wiki/wikis/');
export const getWikiById = (id: number) => api.get(`/wiki/wikis/${id}/`);

// ============ OBSERVATIONS ENDPOINTS ============
export const getObservations = () => api.get('/user/api/observations/');
export const createObservation = (data: any) => api.post('/user/api/observations/', data);
export const updateObservation = (id: number, data: any) => api.put(`/user/api/observations/${id}/`, data);
export const deleteObservationAPI = (id: number) => api.delete(`/user/api/observations/${id}/`);

// ============ LOCATIONS ENDPOINTS ============
export const getLocations = () => api.get('/birds/locations/');
export const createLocation = (data: any) => api.post('/birds/locations/', data);

// ============ PHOTOS ENDPOINTS ============
export const uploadPhoto = (formData: FormData) =>
  api.post('/wiki/photos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });