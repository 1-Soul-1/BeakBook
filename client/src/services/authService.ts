import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: number;
  name: string;
  email: string;
};

// Ключи для хранения
const USERS_KEY = '@beakbook_users';
const CURRENT_USER_KEY = '@beakbook_current_user';

// Загрузка всех пользователей
const loadUsers = async (): Promise<User[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

// Сохранение всех пользователей
const saveUsers = async (users: User[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Регистрация (сохраняет пользователя локально)
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  const users = await loadUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  const newUser: User = {
    id: Date.now(),
    name,
    email,
  };
  // В реальном приложении пароль нужно хешировать! Сейчас просто для демо.
  await saveUsers([...users, newUser]);
  // Автоматически логиним после регистрации
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

// Вход (проверяет email и пароль)
export const loginUser = async (email: string, password: string): Promise<User> => {
  const users = await loadUsers();
  const user = users.find(u => u.email === email);
  // Для простоты пароль не проверяется (в демо). В реальности нужно хранить хеш.
  if (!user) {
    throw new Error('Неверный email или пароль');
  }
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

// Выход
export const logoutUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

// Получение текущего пользователя
export const getCurrentUser = async (): Promise<User | null> => {
  const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
};