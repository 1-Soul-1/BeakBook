import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Observation } from '../types/observation';
import { saveObservations, loadObservations } from '../utils/storage';

export default function ObservationForm() {
  const [birdName, setBirdName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!birdName.trim()) {
      Alert.alert('Ошибка', 'Введите название птицы');
      return;
    }
    const newObs: Observation = {
      id: Date.now().toString(),
      birdId: 0,
      birdName,
      location,
      notes,
      date: new Date().toISOString().split('T')[0],
      favorite: false,
    };
    const existing = await loadObservations();
    await saveObservations([newObs, ...existing]);
    Alert.alert('Успех', 'Наблюдение сохранено');
    setBirdName('');
    setLocation('');
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Вид птицы</Text>
      <TextInput style={styles.input} value={birdName} onChangeText={setBirdName} />
      <Text style={styles.label}>Место</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />
      <Text style={styles.label}>Заметки</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} multiline />
      <Button title="Сохранить" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
});