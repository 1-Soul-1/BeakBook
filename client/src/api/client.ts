import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    return 'http://localhost:8000/api';
  }
  // return 'https://your-production-server.com/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@BeakBook:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const register = (email: string, name: string, password: string) =>
  api.post('/user/register/', { email, name, password });

export const login = (email: string, password: string) =>
  api.post('/user/login/', { email, password });

export const getCurrentUser = () => api.get('/user/me/');

export const getBirdSpecies = () => api.get('/birds/species/');
export const getWikis = () => api.get('/wiki/wikis/');