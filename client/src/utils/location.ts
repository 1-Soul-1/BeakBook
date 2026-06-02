import * as Location from 'expo-location';

export const getCurrentLocationName = async (): Promise<string> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return 'Оренбургская область';
  const location = await Location.getCurrentPositionAsync({});
  const [geo] = await Location.reverseGeocodeAsync(location.coords);
  return `${geo.region || geo.city || 'Оренбургская область'}, Россия`;
};