// app/main/profile.tsx
import { View, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedView, ThemedText, ThemedCard, getThemeColors } from '../../components/Themed';
import { useTheme } from '../../contexts/ThemeContext';
import { useObservations } from '../../hooks/useObservations';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { observations } = useObservations();

  return (
    <ThemedView style={styles.container}>
      <ThemedCard style={styles.card}>
        <FontAwesome6 name="user-circle" size={60} color={colors.accent} style={styles.avatar} />
        <ThemedText style={styles.title}>Гостевой режим</ThemedText>
        <ThemedText style={styles.email}>Вы не авторизованы</ThemedText>
        <View style={styles.stats}>
          <ThemedText style={styles.stat}>📋 Всего наблюдений: {observations.length}</ThemedText>
        </View>
        <ThemedText style={styles.note}>
          Данные хранятся локально на устройстве.
        </ThemedText>
      </ThemedCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { borderRadius: 28, padding: 24, alignItems: 'center', width: '100%' },
  avatar: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  email: { fontSize: 16, color: '#6B6355', marginBottom: 24 },
  stats: { marginBottom: 16, width: '100%', alignItems: 'center' },
  stat: { fontSize: 16 },
  note: { fontSize: 12, color: '#9B9383', textAlign: 'center', marginTop: 8 },
});