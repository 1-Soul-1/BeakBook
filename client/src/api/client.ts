import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const getBirdSpecies = () => api.get('/birds/species/');
export const getWikis = () => api.get('/wiki/wikis/');