// src/app/(auth)/signin.tsx
import { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView, ThemedText, getThemeColors } from '@/components/Themed';
import { useTheme } from '@/contexts/ThemeContext';
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
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/feed');
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
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accentLight }]}>
              <FontAwesome6 name="feather" size={40} color={colors.accent} />
            </View>
            <ThemedText style={styles.title}>BeakBook</ThemedText>
            <ThemedText style={styles.subtitle}>Дневник наблюдений</ThemedText>
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
              {loading ? <ActivityIndicator color="white" size="small" /> : <ThemedText style={styles.buttonText}>Войти</ThemedText>}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/signup')} disabled={loading} style={styles.linkButton}>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  region: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  formContainer: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Platform.select({ ios: 14, android: 12 }),
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    gap: Platform.select({ ios: 10, android: 8 }),
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
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