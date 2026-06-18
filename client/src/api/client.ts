// src/api/client.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Единый базовый URL (порт 80, без 8000)
const API_BASE_URL = 'http://62.113.99.166/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

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

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

loadToken().then(token => {
  if (token) setAuthToken(token);
});

api.interceptors.request.use(
  async (config) => {
    if (!authToken) {
      const token = await loadToken();
      if (token) setAuthToken(token);
    }
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    console.log(`📤 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`📥 [${response.status}] ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@BeakBook:token');
      await AsyncStorage.removeItem('@BeakBook:user');
      authToken = null;
      delete api.defaults.headers.common['Authorization'];
    }
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const register = (email: string, name: string, password: string) =>
  api.post('/user/register/', { email, name, password });

export const login = (email: string, password: string) =>
  api.post('/user/login/', { email, password });

export const getCurrentUserAPI = () => api.get('/user/me/');

export const getBirdSpecies = () => api.get('/birds/species/');
export const getWikis = () => api.get('/wiki/wikis/');
export const getObservations = () => api.get('/user/api/observations/');
export const createObservation = (data: any) => api.post('/user/api/observations/', data);
export const updateObservation = (id: number, data: any) => api.put(`/user/api/observations/${id}/`, data);
export const deleteObservationAPI = (id: number) => api.delete(`/user/api/observations/${id}/`);
