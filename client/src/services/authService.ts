import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@BeakBook:users';
const CURRENT_USER_KEY = '@BeakBook:currentUser';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const loadUsers = async (): Promise<User[]> => {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsers = async (users: User[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  const users = await loadUsers();
  if (users.some(u => u.email === email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  const newUser: User = { id: Date.now().toString(), name, email, password };
  await saveUsers([...users, newUser]);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }));
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const users = await loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Неверный email или пароль');
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  return user;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = async (): Promise<{ id: string; name: string; email: string } | null> => {
  const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};