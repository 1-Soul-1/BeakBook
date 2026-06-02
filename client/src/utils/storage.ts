import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observation } from '../types/observation';

const OBS_KEY = '@beakbook_observations';

export const saveObservations = async (obs: Observation[]) => {
  await AsyncStorage.setItem(OBS_KEY, JSON.stringify(obs));
};

export const loadObservations = async (): Promise<Observation[]> => {
  const raw = await AsyncStorage.getItem(OBS_KEY);
  return raw ? JSON.parse(raw) : [];
};