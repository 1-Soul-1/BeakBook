import { useState, useEffect } from 'react';
import { View, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ThemedView, ThemedText, getThemeColors } from '../components/Themed';
import { useTheme } from '../contexts/ThemeContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, user } = useAuth();

  useEffect(() => {
    if (user) router.replace('/main/feed');
  }, [user]);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    try {
      await register(name, email, password);
    } catch (error: any) {
      Alert.alert('Ошибка регистрации', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Регистрация</ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder="Имя"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder="Пароль"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleRegister}>
        <ThemedText style={styles.buttonText}>Зарегистрироваться</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signin')}>
        <ThemedText style={styles.link}>Уже есть аккаунт? Войти</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { borderRadius: 60, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '600' },
  link: { marginTop: 20, textAlign: 'center', fontWeight: '600' },
});