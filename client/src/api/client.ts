// src/api/client.ts
import axios from 'axios';

const BASE_URL = 'http://62.113.99.166:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для ответов (без авторизации)
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// ============ BIRDS ENDPOINTS ============
export const getBirdSpecies = () => api.get('/birds/species/');
export const getBirdById = (id: number) => api.get(`/birds/species/${id}/`);

// ============ WIKI ENDPOINTS ============
export const getWikis = () => api.get('/wiki/wikis/');
export const getWikiById = (id: number) => api.get(`/wiki/wikis/${id}/`);

// ============ OBSERVATIONS ENDPOINTS (если нужны – но сейчас локальные) ============
// export const getObservations = () => api.get('/user/api/observations/');
// и т.д. – можно закомментировать или оставить, но они не используются

// ============ LOCATIONS ENDPOINTS ============
export const getLocations = () => api.get('/birds/locations/');
export const createLocation = (data: any) => api.post('/birds/locations/', data);

// ============ PHOTOS ENDPOINTS ============
export const uploadPhoto = (formData: FormData) =>
  api.post('/wiki/photos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });