// app/main/add.tsx
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
import { Spacing, BorderRadius } from '../../constants/theme';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function AddObservationScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { addObservation, refreshObservations } = useObservations();
  const { toast, showToast, hideToast } = useToast();
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

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const clearForm = () => {
    setSelectedBird(null);
    setLocation('');
    setNotes('');
    setDate(new Date());
    setPhoto(null);
  };

  const handleSelectBird = (bird: BirdSpecies) => setSelectedBird(bird);
  
  const handleClearBird = () => {
    setSelectedBird(null);
    showToast('Выбор птицы отменен', 'warning');
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.6, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      const compressed = await compressImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setPhoto(compressed);
      showToast('Фото загружено', 'success');
    }
  };
  
  const getLocation = async () => {
    const name = await getCurrentLocationName();
    setLocation(name);
    showToast('Местоположение определено', 'success');
  };
  
  const selectRareBird = (birdName: string) => {
    const bird = BIRD_SPECIES.find(b => b.name.startsWith(birdName));
    if (bird) setSelectedBird(bird);
    showToast(`Выбран вид: ${birdName}`, 'success');
  };
  
  const handleSave = async () => {
    if (!selectedBird) { 
      Alert.alert('Ошибка', 'Выберите вид птицы'); 
      return; 
    }
    setLoading(true);
    try {
      const birdNameShort = selectedBird.name.split('(')[0].trim();
      
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
      
      await refreshObservations();
      clearForm();
      
      showToast(`Наблюдение "${birdNameShort}" добавлено`, 'success');
      
      setTimeout(() => {
        router.replace('/main/feed');
      }, 1000);
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить наблюдение');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    router.replace('/main/feed');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <ThemedText type="h2" style={styles.title}>Новая встреча</ThemedText>
      
      <AutocompleteInput onSelect={handleSelectBird} placeholder="Начните вводить название птицы..." />
      
      {selectedBird && (
        <View style={[styles.birdInfo, { backgroundColor: colors.accentLight }]}>
          <View style={styles.birdInfoRow}>
            <View style={styles.birdInfoText}>
              <ThemedText style={styles.birdInfoFamily}>Семейство: {selectedBird.family}</ThemedText>
              <ThemedText style={styles.birdInfoStatus}>Статус: {selectedBird.statusText}</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.clearBirdBtn, { backgroundColor: colors.dangerLight }]} 
              onPress={handleClearBird}
            >
              <FontAwesome6 name="xmark" size={14} color={colors.danger} />
              <ThemedText style={{ color: colors.danger, fontSize: 12 }}>Отменить</ThemedText>
            </TouchableOpacity>
          </View>
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
        numberOfLines={3}
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
        {photo ? (
          <Image source={{ uri: photo }} style={styles.preview} />
        ) : (
          <View style={[styles.previewPlaceholder, { backgroundColor: colors.accentLight }]}>
            <FontAwesome6 name="camera" size={24} color={colors.accentDark} />
          </View>
        )}
        <TouchableOpacity style={[styles.photoBtn, { backgroundColor: colors.accentLight }]} onPress={pickImage}>
          <FontAwesome6 name="camera" size={16} color={colors.accentDark} />
          <ThemedText>Загрузить фото</ThemedText>
        </TouchableOpacity>
        {photo && (
          <TouchableOpacity onPress={() => setPhoto(null)}>
            <FontAwesome6 name="trash-can" size={20} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.accent, flex: 2 }]} 
          onPress={handleSave} 
          disabled={loading}
        >
          <FontAwesome6 name="check" size={16} color="white" />
          <ThemedText style={styles.saveButtonText}>{loading ? 'Сохранение...' : 'Сохранить'}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.cancelButton, { backgroundColor: colors.accentLight, flex: 1 }]} 
          onPress={handleCancel}
        >
          <ThemedText style={{ color: colors.text }}>Отмена</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedCard style={styles.rareCard}>
        <ThemedText style={styles.rareTitle}>Редкие виды региона</ThemedText>
        <View style={styles.rareTags}>
          {rareBirds.map(name => (
            <TouchableOpacity 
              key={name} 
              style={[styles.rareTag, { backgroundColor: colors.accentLight }]} 
              onPress={() => selectRareBird(name)}
            >
              <ThemedText>{name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedCard>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four },
  title: { marginBottom: Spacing.five },
  birdInfo: { 
    padding: Spacing.three, 
    borderRadius: BorderRadius.xl, 
    marginVertical: Spacing.three,
  },
  birdInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  birdInfoText: {
    flex: 1,
  },
  birdInfoFamily: {
    fontSize: 14,
    marginBottom: Spacing.one,
  },
  birdInfoStatus: {
    fontSize: 14,
  },
  clearBirdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.round,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: BorderRadius.xxl, padding: Spacing.three, marginVertical: Spacing.two },
  locationBtn: { padding: Spacing.three, borderRadius: BorderRadius.round },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginVertical: Spacing.three, flexWrap: 'wrap' },
  preview: { width: 80, height: 80, borderRadius: BorderRadius.xl },
  previewPlaceholder: { width: 80, height: 80, borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center' },
  photoBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, borderRadius: BorderRadius.round },
  buttonRow: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.four },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two, borderRadius: BorderRadius.round, padding: Spacing.four },
  cancelButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.round, padding: Spacing.four },
  saveButtonText: { color: 'white', fontWeight: '600' },
  rareCard: { marginTop: Spacing.six, padding: Spacing.four },
  rareTitle: { fontWeight: 'bold', marginBottom: Spacing.three },
  rareTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  rareTag: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: BorderRadius.round },
});