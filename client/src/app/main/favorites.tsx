import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, StyleSheet, Alert, TouchableOpacity, Modal, ScrollView, Image, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useObservations } from '../../hooks/useObservations';
import { ObservationCard } from '../../components/ObservationCard';
import { ThemedView, ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import { useTheme } from '../../contexts/ThemeContext';
import { Observation } from '../../types/observation';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../../utils/image';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { observations, toggleFavorite, deleteObservation, updateObservation } = useObservations();
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Observation[]>([]);
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPhoto, setEditPhoto] = useState<string | null>(null);

  useEffect(() => {
    let favs = observations.filter(o => o.favorite);
    if (search) {
      favs = favs.filter(o => o.birdName.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase()));
    }
    setFavorites(favs);
  }, [observations, search]);

  const openModal = (obs: Observation) => {
    setSelectedObs(obs);
    setEditMode(false);
    setModalVisible(true);
  };

  const startEdit = () => {
    if (!selectedObs) return;
    setEditLocation(selectedObs.location);
    setEditDate(selectedObs.date);
    setEditNotes(selectedObs.notes);
    setEditPhoto(selectedObs.photo);
    setEditMode(true);
  };

  const saveEdit = async () => {
    if (!selectedObs) return;
    await updateObservation(selectedObs.id, { location: editLocation, date: editDate, notes: editNotes, photo: editPhoto });
    setEditMode(false);
    setModalVisible(false);
    Alert.alert('Успех', 'Наблюдение обновлено');
  };

  const pickImageForEdit = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.6, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      const compressed = await compressImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setEditPhoto(compressed);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Удалить наблюдение?',
      'Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: async () => {
          await deleteObservation(id);
          if (selectedObs?.id === id) setModalVisible(false);
        }}
      ]
    );
  };

  const getStatusColor = (statusClass: string) => {
    switch(statusClass) {
      case 'endangered': return '#E39371';
      case 'vulnerable': return '#E0B85C';
      case 'rare': return '#8FA47E';
      default: return '#A8A090';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Избранное</ThemedText>
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FontAwesome6 name="magnifying-glass" size={16} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Поиск в избранном..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <FontAwesome6 name="times-circle" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ObservationCard
            observation={item}
            onPress={() => openModal(item)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onEdit={() => { setSelectedObs(item); startEdit(); }}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={<ThemedTextSecondary style={styles.empty}>Нет избранных наблюдений</ThemedTextSecondary>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <ThemedView style={styles.modalOverlay}>
          <ScrollView style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {selectedObs && !editMode && (
              <>
                {selectedObs.photo && <Image source={{ uri: selectedObs.photo }} style={styles.modalImage} />}
                <ThemedText style={styles.modalTitle}>{selectedObs.birdName}</ThemedText>
                <ThemedTextSecondary>📍 {selectedObs.location}</ThemedTextSecondary>
                <ThemedTextSecondary>📅 {selectedObs.date}</ThemedTextSecondary>
                <View style={styles.modalBadges}>
                  <View style={[styles.modalBadge, { backgroundColor: colors.accentLight }]}>
                    <FontAwesome6 name="leaf" size={12} color={colors.accentDark} />
                    <ThemedText style={{ fontSize: 12 }}>{selectedObs.family}</ThemedText>
                  </View>
                  <View style={[styles.modalBadge, { backgroundColor: `${getStatusColor(selectedObs.statusClass)}20` }]}>
                    <FontAwesome6 name="shield" size={12} color={getStatusColor(selectedObs.statusClass)} />
                    <ThemedText style={{ fontSize: 12, color: getStatusColor(selectedObs.statusClass) }}>{selectedObs.statusText}</ThemedText>
                  </View>
                </View>
                <ThemedTextSecondary style={styles.modalNotes}>📝 {selectedObs.notes || 'Нет заметок'}</ThemedTextSecondary>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={startEdit}>
                    <FontAwesome6 name="pen-to-square" size={14} color={colors.accentDark} />
                    <ThemedText>Редактировать</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={() => handleDelete(selectedObs.id)}>
                    <FontAwesome6 name="trash-can" size={14} color="#E39371" />
                    <ThemedText style={{ color: '#E39371' }}>Удалить</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={() => setModalVisible(false)}>
                    <FontAwesome6 name="xmark" size={14} color={colors.text} />
                    <ThemedText>Закрыть</ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {selectedObs && editMode && (
              <>
                <ThemedText style={styles.modalTitle}>Редактирование</ThemedText>
                <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Локация" value={editLocation} onChangeText={setEditLocation} />
                <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Дата (ГГГГ-ММ-ДД)" value={editDate} onChangeText={setEditDate} />
                <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, minHeight: 80 }]} placeholder="Заметки" value={editNotes} onChangeText={setEditNotes} multiline />
                {editPhoto && <Image source={{ uri: editPhoto }} style={styles.previewThumb} />}
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={pickImageForEdit}>
                  <FontAwesome6 name="camera" size={14} color={colors.accentDark} />
                  <ThemedText>Изменить фото</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={() => setEditPhoto(null)}>
                  <FontAwesome6 name="trash-can" size={14} color="#E39371" />
                  <ThemedText>Удалить фото</ThemedText>
                </TouchableOpacity>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accent }]} onPress={saveEdit}>
                    <FontAwesome6 name="check" size={14} color="white" />
                    <ThemedText style={{ color: 'white' }}>Сохранить</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={() => setEditMode(false)}>
                    <FontAwesome6 name="xmark" size={14} color={colors.text} />
                    <ThemedText>Отмена</ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 48, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 16, borderWidth: 0.5, gap: 12 },
  searchInput: { flex: 1, fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 40 },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderRadius: 24, padding: 20, maxHeight: '80%' },
  modalImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  modalBadges: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12 },
  modalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  modalNotes: { marginTop: 8, fontSize: 14, lineHeight: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, flexWrap: 'wrap', gap: 8 },
  modalButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 40, marginVertical: 4 },
  input: { borderWidth: 1, borderRadius: 24, padding: 12, marginVertical: 8 },
  previewThumb: { width: 80, height: 80, borderRadius: 16, marginVertical: 8 },
});