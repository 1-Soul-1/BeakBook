// app/main/favorites.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TextInput, StyleSheet, Alert, TouchableOpacity, Modal, ScrollView, Image, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useObservations } from '../../hooks/useObservations';
import { ObservationCard } from '../../components/ObservationCard';
import { ThemedView, ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import { useTheme } from '../../contexts/ThemeContext';
import { Observation } from '../../types/observation';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../../utils/image';
import { Spacing, BorderRadius } from '../../constants/theme';

type SortType = 'date_desc' | 'date_asc' | 'name_asc';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { observations, toggleFavorite, deleteObservation, updateObservation, refreshObservations } = useObservations();
  const { toast, showToast, hideToast } = useToast();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('date_desc');
  const [favorites, setFavorites] = useState<Observation[]>([]);
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPhoto, setEditPhoto] = useState<string | null>(null);

  useEffect(() => {
    refreshObservations();
  }, [refreshObservations]);

  useEffect(() => {
    let favs = observations.filter(o => o.favorite);
    if (search) {
      favs = favs.filter(o => o.birdName.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'date_desc') favs.sort((a, b) => b.timestamp - a.timestamp);
    else if (sort === 'date_asc') favs.sort((a, b) => a.timestamp - b.timestamp);
    else favs.sort((a, b) => a.birdName.localeCompare(b.birdName));
    setFavorites(favs);
  }, [observations, search, sort]);

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
    await refreshObservations();
    showToast('Наблюдение обновлено', 'success');
  };

  const pickImageForEdit = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.6, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      const compressed = await compressImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setEditPhoto(compressed);
      showToast('Фото загружено', 'success');
    }
  };

  const handleDelete = async (id: number) => {
    await deleteObservation(id);
    if (selectedObs?.id === id) setModalVisible(false);
    await refreshObservations();
  };

  const handleToggleFavorite = async (id: number) => {
    await toggleFavorite(id);
    await refreshObservations();
  };

  const getStatusColor = (statusClass: string) => {
    switch(statusClass) {
      case 'endangered': return colors.statusEndangered;
      case 'vulnerable': return colors.statusVulnerable;
      case 'rare': return colors.statusRare;
      default: return colors.statusCommon;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="h2">Избранное</ThemedText>
        <ThemedTextSecondary style={styles.count}>⭐ {favorites.length}</ThemedTextSecondary>
      </View>
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
      <View style={styles.sortBar}>
        <TouchableOpacity onPress={() => setSort('date_desc')}>
          <ThemedTextSecondary style={sort === 'date_desc' ? styles.activeSort : styles.sort}>
            Новые сначала
          </ThemedTextSecondary>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('date_asc')}>
          <ThemedTextSecondary style={sort === 'date_asc' ? styles.activeSort : styles.sort}>
            Старые сначала
          </ThemedTextSecondary>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('name_asc')}>
          <ThemedTextSecondary style={sort === 'name_asc' ? styles.activeSort : styles.sort}>
            А-Я
          </ThemedTextSecondary>
        </TouchableOpacity>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ObservationCard
            observation={item}
            onPress={() => openModal(item)}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            onEdit={() => { setSelectedObs(item); startEdit(); }}
            onDelete={() => handleDelete(item.id)}
            showToast={showToast}
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
                <ThemedText type="h3" style={styles.modalTitle}>{selectedObs.birdName}</ThemedText>
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
                    <FontAwesome6 name="trash-can" size={14} color={colors.danger} />
                    <ThemedText style={{ color: colors.danger }}>Удалить</ThemedText>
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
                <ThemedText type="h3" style={styles.modalTitle}>Редактирование</ThemedText>
                <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Локация" value={editLocation} onChangeText={setEditLocation} />
                <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Дата (ГГГГ-ММ-ДД)" value={editDate} onChangeText={setEditDate} />
                <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, minHeight: 80 }]} placeholder="Заметки" value={editNotes} onChangeText={setEditNotes} multiline />
                {editPhoto && <Image source={{ uri: editPhoto }} style={styles.previewThumb} />}
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={pickImageForEdit}>
                  <FontAwesome6 name="camera" size={14} color={colors.accentDark} />
                  <ThemedText>Изменить фото</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accentLight }]} onPress={() => setEditPhoto(null)}>
                  <FontAwesome6 name="trash-can" size={14} color={colors.danger} />
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

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Spacing.three },
  count: { fontSize: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, marginBottom: Spacing.three, borderWidth: 0.5, gap: Spacing.two },
  searchInput: { flex: 1, fontSize: 16 },
  sortBar: { flexDirection: 'row', gap: Spacing.four, marginBottom: Spacing.four, justifyContent: 'flex-end' },
  sort: { fontSize: 14 },
  activeSort: { fontSize: 14, fontWeight: 'bold', color: '#6A7A5C' },
  empty: { textAlign: 'center', marginTop: Spacing.eight },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: Spacing.five, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderRadius: BorderRadius.xxl, padding: Spacing.five, maxHeight: '80%' },
  modalImage: { width: '100%', height: 200, borderRadius: BorderRadius.large, marginBottom: Spacing.four },
  modalTitle: { marginBottom: Spacing.three },
  modalBadges: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.two, marginBottom: Spacing.three },
  modalBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: BorderRadius.xl },
  modalNotes: { marginTop: Spacing.two, fontSize: 14, lineHeight: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing.five, flexWrap: 'wrap', gap: Spacing.two },
  modalButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, borderRadius: BorderRadius.round, marginVertical: Spacing.one },
  input: { borderWidth: 1, borderRadius: BorderRadius.xxl, padding: Spacing.three, marginVertical: Spacing.two },
  previewThumb: { width: 80, height: 80, borderRadius: BorderRadius.large, marginVertical: Spacing.two },
});