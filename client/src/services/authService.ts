import AsyncStorage from '@react-native-async-storage/async-storage';
import { register as apiRegister, login as apiLogin } from '../api/client';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const CURRENT_USER_KEY = '@BeakBook:currentUser';

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await apiRegister(email, name, password);
  const { access, refresh, user } = response.data;
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiLogin(email, password);
  const { access, refresh, user } = response.data;
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = async () => {
  const userJSON = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return userJSON ? JSON.parse(userJSON) : null;
};