// client/src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключ, под которым будет храниться список пользователей
const USERS_STORAGE_KEY = '@BeakBook:users';
// Ключ для хранения данных текущего залогиненного пользователя
const CURRENT_USER_KEY = '@BeakBook:currentUser';

// Определяем структуру объекта пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // В реальном приложении пароль нужно хэшировать!
}

/**
 * Регистрация нового пользователя
 * @param name - Имя пользователя
 * @param email - Email пользователя
 * @param password - Пароль
 * @returns Promise, который резолвится с данными нового пользователя (без пароля)
 * @throws Ошибку, если пользователь с таким email уже существует
 */
export const registerUser = async (name: string, email: string, password: string): Promise<Omit<User, 'password'>> => {
  try {
    // 1. Получаем список существующих пользователей
    const existingUsersJSON = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

    // 2. Проверяем, не занят ли email
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      throw new Error('Пользователь с таким email уже зарегистрирован.');
    }

    // 3. Создаём нового пользователя
    const newUser: User = {
      id: Date.now().toString(), // Простой способ получить уникальный ID
      name,
      email,
      password, // ВНИМАНИЕ: в учебных целях храним пароль открыто.
    };

    // 4. Сохраняем обновлённый список пользователей
    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // 5. Возвращаем данные пользователя без пароля
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Вход пользователя в приложение
 * @param email - Email пользователя
 * @param password - Пароль
 * @returns Promise, который резолвится с данными пользователя (без пароля)
 * @throws Ошибку, если пользователь не найден или пароль неверный
 */
export const loginUser = async (email: string, password: string): Promise<Omit<User, 'password'>> => {
  try {
    // 1. Получаем список пользователей
    const existingUsersJSON = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

    // 2. Ищем пользователя по email и паролю
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Неверный email или пароль.');
    }

    // 3. Сохраняем информацию о текущем пользователе
    const { password: _, ...userWithoutPassword } = user;
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Выход пользователя из приложения (удаление данных о текущей сессии)
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Проверка, авторизован ли пользователь (есть ли текущая сессия)
 * @returns Promise, который резолвится с данными пользователя, если он авторизован, иначе null
 */
export const getCurrentUser = async (): Promise<Omit<User, 'password'> | null> => {
  try {
    const currentUserJSON = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return currentUserJSON ? JSON.parse(currentUserJSON) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};
