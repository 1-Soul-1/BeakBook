// src/app/(auth)/signup.tsx
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView, ThemedText, getThemeColors } from '@/components/Themed';
import { useTheme } from '@/contexts/ThemeContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StatusBar } from 'expo-status-bar';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/Toast';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Заполните все поля', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Пароль должен содержать минимум 6 символов', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Пароли не совпадают', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast('Введите корректный email', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      showToast('Аккаунт успешно создан!', 'success');
      setTimeout(() => {
        router.replace('/feed');
      }, 1500);
    } catch (error: any) {
      showToast(error.message || 'Ошибка регистрации', 'error');
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
              <FontAwesome6 name="feather" size={36} color={colors.accent} />
            </View>
            <ThemedText style={styles.title}>Создать аккаунт</ThemedText>
            <ThemedText style={styles.subtitle}>Присоединяйтесь к сообществу</ThemedText>
          </View>
          
          <View style={styles.formContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <FontAwesome6 name="user" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Имя"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>
            
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
                placeholder="Пароль (мин. 6 символов)"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <FontAwesome6 name="lock" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Подтвердите пароль"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.accent }]} 
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <FontAwesome6 name="user-plus" size={16} color="white" />
                  <ThemedText style={styles.buttonText}>Зарегистрироваться</ThemedText>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/signin')} 
              disabled={loading}
              style={styles.linkButton}
            >
              <ThemedText style={styles.link}>
                Уже есть аккаунт? <ThemedText style={[styles.linkBold, { color: colors.accent }]}>Войти</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>

      {/* Всплывающие уведомления */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
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
    marginBottom: 28,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  formContainer: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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