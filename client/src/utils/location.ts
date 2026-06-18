// src/utils/location.ts
import * as Location from 'expo-location';

export const getCurrentLocationName = async (): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return 'Оренбургская область';
    }

    const location = await Location.getCurrentPositionAsync({});
    const [geo] = await Location.reverseGeocodeAsync(location.coords);
    
    // Собираем части адреса в порядке убывания точности
    const parts = [];
    
    // Самые точные: название места (лес, парк, микрорайон) или улица
    if (geo?.name) parts.push(geo.name);
    if (geo?.street) parts.push(geo.street);
    if (geo?.district) parts.push(geo.district);       // район города
    if (geo?.subregion) parts.push(geo.subregion);     // область, край
    if (geo?.city) parts.push(geo.city);
    if (geo?.region) parts.push(geo.region);
    
    // Если ничего не найдено – заглушка
    if (parts.length === 0) {
      return 'Оренбургская область, Россия';
    }
    
    // Убираем дубликаты (иногда дублируются район и город)
    const uniqueParts = [...new Set(parts)];
    
    // Собираем в строку через запятую, добавляем страну
    let address = uniqueParts.join(', ');
    
    // Добавляем страну, если её нет
    if (!address.includes('Россия')) {
      address += ', Россия';
    }
    
    return address;
  } catch (error) {
    console.error('Ошибка получения местоположения:', error);
    return 'Оренбургская область';
  }
};