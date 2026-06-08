// app/signup.tsx
import { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setLoading(true);
    try {
      await register(name, email, password);
      router.replace('/main/feed');
    } catch (error: any) {
      Alert.alert('Ошибка регистрации', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome6 name="feather" size={40} color={colors.accent} />
        <ThemedText style={styles.title}>BeakBook</ThemedText>
        <ThemedText style={styles.subtitle}>Создайте аккаунт</ThemedText>
      </View>
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder="Имя"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder="Пароль"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.accent }]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <ThemedText style={styles.buttonText}>Зарегистрироваться</ThemedText>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/signin')} disabled={loading}>
        <ThemedText style={styles.link}>Уже есть аккаунт? Войти</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40, gap: 8 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 4 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 16 },
  button: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  link: { marginTop: 20, textAlign: 'center', fontWeight: '500' },
});