import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getWikis } from '../api/client';
import { Wiki } from '../types/wiki';

export default function WikiList() {
  const [articles, setArticles] = useState<Wiki[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getWikis()
      .then(res => setArticles(res.data))
      .catch(() => setError('Ошибка загрузки статей'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error) return <Text style={styles.center}>{error}</Text>;

  return (
    <FlatList
      data={articles}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.author}>Автор: {item.author}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  author: { fontSize: 14, color: '#555', marginBottom: 4 },
  description: { fontSize: 14, color: '#777', marginTop: 4 },
});