import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentLocationName } from '../../utils/location';
import { compressImage } from '../../utils/image';
import { useObservations } from '../../hooks/useObservations';
import { AutocompleteInput } from '../../components/AutocompleteInput';
import { ThemedView, ThemedText, ThemedCard, getThemeColors } from '../../components/Themed';
import { BirdSpecies } from '../../types/birds';
import { router, useLocalSearchParams } from 'expo-router';
import { BIRD_SPECIES } from '../../constants/species';
import { useTheme } from '../../contexts/ThemeContext';

export default function AddObservationScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { addObservation } = useObservations();
  const params = useLocalSearchParams<{ birdName?: string }>();
  const [selectedBird, setSelectedBird] = useState<BirdSpecies | null>(null);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const rareBirds = ["Балобан", "Кудрявый пеликан", "Дрофа", "Степной орёл", "Чёрный аист", "Филин", "Скопа", "Сапсан"];

  useEffect(() => {
    if (params.birdName) {
      const bird = BIRD_SPECIES.find(b => b.name === params.birdName);
      if (bird) setSelectedBird(bird);
    }
  }, [params.birdName]);

  const handleSelectBird = (bird: BirdSpecies) => setSelectedBird(bird);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.6, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      const compressed = await compressImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setPhoto(compressed);
    }
  };
  const getLocation = async () => {
    const name = await getCurrentLocationName();
    setLocation(name);
  };
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const handleSave = async () => {
    if (!selectedBird) { Alert.alert('Ошибка', 'Выберите вид птицы'); return; }
    setLoading(true);
    try {
      await addObservation({
        id: Date.now(),
        birdName: selectedBird.name,
        family: selectedBird.family,
        status: selectedBird.status,
        statusText: selectedBird.statusText,
        statusClass: selectedBird.statusClass,
        location: location.trim() || '—',
        notes: notes.trim(),
        date: formatDate(date),
        timestamp: Date.now(),
        favorite: false,
        photo: photo || null,
      });
      Alert.alert('Успех', 'Наблюдение сохранено', [{ text: 'OK', onPress: () => router.replace('/main/feed') }]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить наблюдение');
    } finally {
      setLoading(false);
    }
  };
  const selectRareBird = (name: string) => {
    const bird = BIRD_SPECIES.find(b => b.name.startsWith(name));
    if (bird) setSelectedBird(bird);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText style={styles.title}>Новая встреча</ThemedText>
      <AutocompleteInput onSelect={handleSelectBird} placeholder="Начните вводить название птицы..." />
      {selectedBird && (
        <View style={[styles.birdInfo, { backgroundColor: colors.accentLight }]}>
          <ThemedText>Семейство: {selectedBird.family}</ThemedText>
          <ThemedText>Статус: {selectedBird.statusText}</ThemedText>
        </View>
      )}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Локация"
          placeholderTextColor={colors.textSecondary}
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity style={[styles.locationBtn, { backgroundColor: colors.accentLight }]} onPress={getLocation}>
          <FontAwesome6 name="location-dot" size={20} color={colors.accentDark} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder="Заметки"
        placeholderTextColor={colors.textSecondary}
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, justifyContent: 'center' }]}>
          <ThemedText>{formatDate(date)}</ThemedText>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <View style={styles.photoRow}>
        {photo ? <Image source={{ uri: photo }} style={styles.preview} /> : <View style={[styles.previewPlaceholder, { backgroundColor: colors.accentLight }]} />}
        <TouchableOpacity style={[styles.photoBtn, { backgroundColor: colors.accentLight }]} onPress={pickImage}>
          <FontAwesome6 name="camera" size={16} color={colors.accentDark} />
          <ThemedText>Загрузить фото</ThemedText>
        </TouchableOpacity>
        {photo && <TouchableOpacity onPress={() => setPhoto(null)}><FontAwesome6 name="trash-can" size={20} color="#E39371" /></TouchableOpacity>}
      </View>
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSave} disabled={loading}>
        <FontAwesome6 name="check" size={16} color="white" />
        <ThemedText style={styles.saveButtonText}>{loading ? 'Сохранение...' : 'Сохранить'}</ThemedText>
      </TouchableOpacity>

      <ThemedCard style={styles.rareCard}>
        <ThemedText style={styles.rareTitle}>Редкие виды региона</ThemedText>
        <View style={styles.rareTags}>
          {rareBirds.map(name => (
            <TouchableOpacity key={name} style={[styles.rareTag, { backgroundColor: colors.accentLight }]} onPress={() => selectRareBird(name)}>
              <ThemedText>{name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  birdInfo: { padding: 12, borderRadius: 20, marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { borderWidth: 1, borderRadius: 24, padding: 12, marginVertical: 8 },
  locationBtn: { padding: 12, borderRadius: 40 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12, flexWrap: 'wrap' },
  preview: { width: 80, height: 80, borderRadius: 20 },
  previewPlaceholder: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  photoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 40 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 60, padding: 14, marginTop: 16 },
  saveButtonText: { color: 'white', fontWeight: '600' },
  rareCard: { marginTop: 24, padding: 16 },
  rareTitle: { fontWeight: 'bold', marginBottom: 12 },
  rareTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rareTag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 30 },
});