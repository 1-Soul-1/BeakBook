import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getBirdSpecies } from '../api/client'; // путь правильный
import { BirdSpecies } from '../types/birds';
import BirdCard from './BirdCard';

export default function BirdList() {
  const [species, setSpecies] = useState<BirdSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBirdSpecies()
      .then(res => setSpecies(res.data))
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error) return <Text style={styles.center}>{error}</Text>;

  return (
    <FlatList
      data={species}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <BirdCard species={item} />}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
});