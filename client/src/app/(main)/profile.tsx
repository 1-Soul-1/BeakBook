// app/main/profile.tsx
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedView, ThemedText, ThemedCard, getThemeColors } from '../../components/Themed';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/signin');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Удалить аккаунт?',
      'Все ваши наблюдения также будут удалены без возможности восстановления.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/signin');
          },
        },
      ]
    );
  };

  if (!user) return <ThemedView style={styles.center}><ThemedText>Загрузка...</ThemedText></ThemedView>;

  return (
    <ThemedView style={styles.container}>
      <ThemedCard style={styles.card}>
        <FontAwesome6 name="user-circle" size={60} color={colors.accent} style={styles.avatar} />
        <ThemedText style={styles.title}>{user.name}</ThemedText>
        <ThemedText style={styles.email}>{user.email}</ThemedText>
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleLogout}>
            <FontAwesome6 name="arrow-right-from-bracket" size={16} color="white" />
            <ThemedText style={{ color: 'white' }}>Выйти</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#E39371' }]} onPress={handleDeleteAccount}>
            <FontAwesome6 name="trash-can" size={16} color="white" />
            <ThemedText style={{ color: 'white' }}>Удалить аккаунт</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 28, padding: 24, alignItems: 'center', width: '100%' },
  avatar: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  email: { fontSize: 16, color: '#6B6355', marginBottom: 24 },
  buttons: { gap: 12, width: '100%' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 40, paddingVertical: 12, paddingHorizontal: 20 },
});