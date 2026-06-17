import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://62.113.99.166/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Переменная для хранения токена в памяти (для быстрого доступа)
let authToken: string | null = null;

// Загрузка токена из AsyncStorage при инициализации
export const loadToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('@BeakBook:token');
    authToken = token;
    return token;
  } catch (error) {
    console.error('Load token error:', error);
    return null;
  }
};

// Установка токена
export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Загружаем токен при старте
loadToken().then(token => {
  if (token) {
    setAuthToken(token);
  }
});

api.interceptors.request.use(
  async (config) => {
    // Если токен ещё не загружен, пробуем загрузить
    if (!authToken) {
      const token = await loadToken();
      if (token) {
        setAuthToken(token);
      }
    }
    
    // Добавляем токен к запросу, если он есть
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Если 401 – токен истек, удаляем его
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@BeakBook:token');
      await AsyncStorage.removeItem('@BeakBook:user');
      authToken = null;
      delete api.defaults.headers.common['Authorization'];
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

// Birds endpoints
export const getBirdSpecies = () => api.get('/birds/species/');
export const getWikis = () => api.get('/wiki/wikis/');
export const getObservations = () => api.get('/user/api/observations/');
export const createObservation = (data: any) => api.post('/user/api/observations/', data);
export const updateObservation = (id: number, data: any) => api.put(`/user/api/observations/${id}/`, data);
export const deleteObservationAPI = (id: number) => api.delete(`/user/api/observations/${id}/`);
