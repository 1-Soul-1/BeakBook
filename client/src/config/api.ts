// Определите платформу
import { Platform } from 'react-native';

// Функция для получения базового URL
const getBaseUrl = () => {
    if (__DEV__) {
        // Для Android эмулятора
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:8000/api';
        }
        // Для iOS симулятора
        return 'http://localhost:8000/api';
    }
    // Для production (замените на ваш реальный URL)
    return 'https://your-production-server.com/api';
};

export const API_URLS = {
    base: getBaseUrl(),
    birds: `${getBaseUrl()}/birds/birds/`,
    locations: `${getBaseUrl()}/birds/locations/`,
    species: `${getBaseUrl()}/birds/species/`,
    wiki: `${getBaseUrl()}/wiki/wikis/`,
    photos: `${getBaseUrl()}/wiki/photos/`,
    users: `${getBaseUrl()}/user/api/users/`,
    observations: `${getBaseUrl()}/user/api/observations/`,
};