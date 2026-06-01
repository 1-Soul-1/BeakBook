import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observation } from '../types/observation';

const OBSERVATIONS_KEY = '@beakbook_observations';

export const saveObservations = async (observations: Observation[]) => {
  await AsyncStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(observations));
};

export const loadObservations = async (): Promise<Observation[]> => {
  const data = await AsyncStorage.getItem(OBSERVATIONS_KEY);
  return data ? JSON.parse(data) : [];
};