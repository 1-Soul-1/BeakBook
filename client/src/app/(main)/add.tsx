// app/main/add.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Platform, KeyboardAvoidingView } from 'react-native';
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

  const formatDate = (d: Date) => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

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
    showToast('Выбор птицы отменён', 'warning');
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      const compressed = await compressImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setPhoto(compressed);
      showToast('Фото загружено', 'success');
    }
  };
  
  const getLocation = async () => {
    try {
      const name = await getCurrentLocationName();
      setLocation(name);
      showToast('Местоположение определено', 'success');
    } catch (error) {
      showToast('Не удалось определить местоположение', 'error');
      setLocation('Оренбургская область');
    }
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
      const dateParts = formatDate(date).split('.');
      const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      
      await addObservation({
        id: Date.now(),
        birdName: selectedBird.name,
        family: selectedBird.family,
        status: selectedBird.status,
        statusText: selectedBird.statusText,
        statusClass: selectedBird.statusClass,
        location: location.trim() || '—',
        notes: notes.trim(),
        date: isoDate,
        timestamp: Date.now(),
        favorite: false,
        photo: photo || null,
      });
      
      await refreshObservations();
      clearForm();
      showToast(`Наблюдение "${birdNameShort}" добавлено`, 'success');
      
      setTimeout(() => {
        router.replace('/feed');
      }, 1000);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить наблюдение');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    router.replace('/feed');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView 
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="h2" style={styles.title}>Новая встреча</ThemedText>
        <ThemedCard style={styles.formCard}>
          {/* Вид птицы */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <FontAwesome6 name="dove" size={14} color={colors.accentDark} />
              <ThemedText style={styles.label}>Вид птицы</ThemedText>
              <ThemedText style={styles.required}> *</ThemedText>
            </View>
            <AutocompleteInput onSelect={handleSelectBird} placeholder="Начните вводить название или семейство..." />
          </View>

          {selectedBird && (
            <>
              <View style={[styles.selectedBirdInfo, { backgroundColor: colors.accentLight }]}>
                <ThemedText style={styles.selectedBirdName}>{selectedBird.name}</ThemedText>
                <TouchableOpacity onPress={handleClearBird} style={styles.clearBirdBtn}>
                  <FontAwesome6 name="xmark" size={14} color={colors.danger} />
                </TouchableOpacity>
              </View>
              <View style={styles.birdInfoContainer}>
                <View style={[styles.infoBadge, { backgroundColor: colors.accentLight }]}>
                  <FontAwesome6 name="leaf" size={12} color={colors.accentDark} />
                  <ThemedText style={styles.infoText}>Семейство: {selectedBird.family}</ThemedText>
                </View>
                <View style={[styles.statusBadgeLarge, { backgroundColor: `${colors.statusRare}20` }]}>
                  <FontAwesome6 name="shield" size={12} color={colors.statusRare} />
                  <ThemedText style={[styles.infoText, { color: colors.statusRare }]}>{selectedBird.statusText}</ThemedText>
                </View>
              </View>
            </>
          )}

          {/* Локация */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <FontAwesome6 name="location-dot" size={14} color={colors.accentDark} />
              <ThemedText style={styles.label}>Локация</ThemedText>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Национальный парк, берег реки..."
              placeholderTextColor={colors.textSecondary}
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={[styles.locationAuto, { backgroundColor: colors.accentLight }]} onPress={getLocation}>
              <FontAwesome6 name="crosshairs" size={12} color={colors.accentDark} />
              <ThemedText style={styles.locationAutoText}>Определить моё местоположение</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Фотография птицы */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <FontAwesome6 name="image" size={14} color={colors.accentDark} />
              <ThemedText style={styles.label}>Фотография птицы</ThemedText>
            </View>
            <View style={styles.photoUpload}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoPreview} />
              ) : (
                <View style={[styles.photoPreview, styles.photoPlaceholder, { backgroundColor: colors.accentLight }]}>
                  <FontAwesome6 name="camera" size={32} color={colors.accentDark} />
                </View>
              )}
              <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: colors.accentLight }]} onPress={pickImage}>
                <FontAwesome6 name="upload" size={12} color={colors.accentDark} />
                <ThemedText style={styles.uploadBtnText}>Загрузить</ThemedText>
              </TouchableOpacity>
              {photo && (
                <TouchableOpacity style={[styles.removePhotoBtn, { backgroundColor: colors.dangerLight }]} onPress={() => setPhoto(null)}>
                  <FontAwesome6 name="trash-alt" size={12} color={colors.danger} />
                  <ThemedText style={{ color: colors.danger }}>Удалить</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Заметки */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <FontAwesome6 name="pen" size={14} color={colors.accentDark} />
              <ThemedText style={styles.label}>Заметки</ThemedText>
            </View>
            <TextInput
              style={[styles.textarea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Активность, особенности..."
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Дата */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <FontAwesome6 name="calendar" size={14} color={colors.accentDark} />
              <ThemedText style={styles.label}>Дата</ThemedText>
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={[styles.dateInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ThemedText>{formatDate(date)}</ThemedText>
              </View>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
          )}

          {/* Кнопки */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: colors.accent }]}
              onPress={handleSave}
              disabled={loading}
            >
              <FontAwesome6 name="check" size={14} color="#FFF" />
              <ThemedText style={styles.btnPrimaryText}>{loading ? 'Сохранение...' : 'Сохранить'}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSecondary, { borderColor: colors.border }]}
              onPress={handleCancel}
            >
              <ThemedText style={{ color: colors.textSecondary }}>Отмена</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedCard>

        {/* Редкие виды региона */}
        <ThemedCard style={styles.rareCard}>
          <View style={styles.rareHeader}>
            <FontAwesome6 name="feather" size={14} color={colors.accentDark} />
            <ThemedText style={styles.rareTitle}>Редкие виды региона</ThemedText>
          </View>
          <View style={styles.rareSpeciesContainer}>
            {rareBirds.map(name => (
              <TouchableOpacity
                key={name}
                style={[styles.rareTag, { backgroundColor: colors.accentLight, borderColor: colors.border }]}
                onPress={() => selectRareBird(name)}
              >
                <ThemedText style={styles.rareTagText}>{name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedCard>

        <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.five,
    paddingBottom: Spacing.ten,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.five,
  },
  formCard: {
    padding: Spacing.five,
    marginBottom: Spacing.four,
  },
  formGroup: {
    marginBottom: Spacing.five,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E39371',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    fontSize: 15,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    fontSize: 15,
    minHeight: 80,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  locationAuto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: BorderRadius.xxl,
    marginTop: Spacing.two,
    alignSelf: 'flex-start',
  },
  locationAutoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedBirdInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  selectedBirdName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  clearBirdBtn: {
    padding: Spacing.one,
  },
  birdInfoContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
    flexWrap: 'wrap',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.xl,
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.xl,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  photoUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.round,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.round,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  btnPrimary: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: BorderRadius.round,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  btnSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  rareCard: {
    marginTop: Spacing.four,
    padding: Spacing.four,
  },
  rareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  rareTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  rareSpeciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  rareTag: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.round,
    borderWidth: 0.5,
  },
  rareTagText: {
    fontSize: 13,
    fontWeight: '500',
  },
});