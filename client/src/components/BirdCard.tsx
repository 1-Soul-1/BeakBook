import { View, Text, StyleSheet } from 'react-native';
import { BirdSpecies } from '../types/birds';

type Props = { species: BirdSpecies };

export default function BirdCard({ species }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{species.name}</Text>
      <Text style={styles.detail}>Семейство: {species.family}</Text>
      <Text style={styles.detail}>Статус: {species.conservation_status}</Text>
      <Text style={styles.detail}>Гнездование: {species.typical_nesting}</Text>
      <Text style={styles.description}>{species.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  detail: { fontSize: 14, color: '#555', marginBottom: 2 },
  description: { fontSize: 14, color: '#777', marginTop: 8 },
});