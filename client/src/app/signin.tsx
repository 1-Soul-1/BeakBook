// app/signin.tsx
import { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ThemedView, ThemedText, getThemeColors } from '../components/Themed';
import { useTheme } from '../contexts/ThemeContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StatusBar } from 'expo-status-bar';

export default function SignInScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/main/feed');
    } catch (error: any) {
      Alert.alert('Ошибка входа', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accentLight }]}>
              <FontAwesome6 name="feather" size={48} color={colors.accent} />
            </View>
            <ThemedText style={styles.title}>BeakBook</ThemedText>
            <ThemedText style={styles.subtitle}>Дневник наблюдений за птицами</ThemedText>
            <ThemedText style={styles.region}>Оренбургская область</ThemedText>
          </View>
          
          <View style={styles.formContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <FontAwesome6 name="envelope" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
            
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <FontAwesome6 name="lock" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Пароль"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.accent }]} 
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <FontAwesome6 name="arrow-right-to-bracket" size={16} color="white" />
                  <ThemedText style={styles.buttonText}>Войти</ThemedText>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/signup')} 
              disabled={loading}
              style={styles.linkButton}
            >
              <ThemedText style={styles.link}>
                Нет аккаунта? <ThemedText style={[styles.linkBold, { color: colors.accent }]}>Зарегистрироваться</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 48,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 14, 
    opacity: 0.7,
    textAlign: 'center',
  },
  region: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
  },
  formContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  link: {
    fontSize: 14,
  },
  linkBold: {
    fontWeight: '600',
  },
});