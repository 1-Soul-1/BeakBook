// src/components/WikiList.tsx
import { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getWikis } from '../api/client';
import { Wiki } from '../types/wiki';
import { ThemedView, ThemedText, ThemedTextSecondary, getThemeColors, ThemedCard } from './Themed';
import { useTheme } from '../contexts/ThemeContext';

export default function WikiList() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [articles, setArticles] = useState<Wiki[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getWikis()
      .then(res => setArticles(res.data))
      .catch(() => setError('Ошибка загрузки статей'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
        <ThemedTextSecondary>Загрузка статей...</ThemedTextSecondary>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <FontAwesome6 name="exclamation-triangle" size={40} color="#E39371" />
        <ThemedTextSecondary style={styles.errorText}>{error}</ThemedTextSecondary>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <ThemedCard style={styles.card}>
          <ThemedText style={styles.title}>{item.name}</ThemedText>
          <ThemedTextSecondary style={styles.author}>
            <FontAwesome6 name="user" size={10} color={colors.textSecondary} /> Автор: {item.author}
          </ThemedTextSecondary>
          <ThemedTextSecondary style={styles.description}>{item.description}</ThemedTextSecondary>
        </ThemedCard>
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
      ListEmptyComponent={
        <ThemedView style={styles.center}>
          <FontAwesome6 name="book-open" size={40} color={colors.textSecondary} />
          <ThemedTextSecondary>Нет статей</ThemedTextSecondary>
        </ThemedView>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 40 },
  errorText: { textAlign: 'center', marginTop: 12 },
  card: { marginBottom: 12, marginHorizontal: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  author: { fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  description: { fontSize: 14, lineHeight: 20 },
});