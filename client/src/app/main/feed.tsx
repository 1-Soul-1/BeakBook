import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, View, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useObservations } from '../../hooks/useObservations';
import { ObservationCard } from '../../components/ObservationCard';
import { ThemedView, ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../../utils/image';
import { Observation } from '../../types/observation';
import { useTheme } from '../../contexts/ThemeContext';

const PAGE_SIZE = 20;

export default function FeedScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { observations, loading, updateObservation, deleteObservation, toggleFavorite } = useObservations();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'date_desc' | 'date_asc' | 'name_asc'>('date_desc');
  const [filtered, setFiltered] = useState<Observation[]>([]);
  const [displayed, setDisplayed] = useState<Observation[]>([]);
  const [page, setPage] = useState(1);
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPhoto, setEditPhoto] = useState<string | null>(null);

  useEffect(() => {
    let result = [...observations];
    if (search) {
      result = result.filter(o => o.birdName.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'date_desc') result.sort((a,b) => b.timestamp - a.timestamp);
    if (sort === 'date_asc') result.sort((a,b) => a.timestamp - b.timestamp);
    if (sort === 'name_asc') result.sort((a,b) => a.birdName.localeCompare(b.birdName));
    setFiltered(result);
    setPage(1);
  }, [observations, search, sort]);

  useEffect(() => {
    setDisplayed(filtered.slice(0, page * PAGE_SIZE));
  }, [filtered, page]);

  const loadMore = () => {
    if (displayed.length < filtered.length) setPage(p => p + 1);
  };

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

  if (loading) return <ThemedView style={styles.center}><ThemedText>Загрузка...</ThemedText></ThemedView>;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Журнал</ThemedText>
        <ThemedTextSecondary style={styles.count}>Всего: {observations.length}</ThemedTextSecondary>
      </View>
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FontAwesome6 name="magnifying-glass" size={16} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Поиск по виду или месту..."
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
          <ThemedText style={sort === 'date_desc' ? styles.activeSort : styles.sort}>Новые сначала</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('date_asc')}>
          <ThemedText style={sort === 'date_asc' ? styles.activeSort : styles.sort}>Старые сначала</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('name_asc')}>
          <ThemedText style={sort === 'name_asc' ? styles.activeSort : styles.sort}>А-Я</ThemedText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayed}
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
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<ThemedTextSecondary style={styles.empty}>Нет наблюдений. Добавьте первое!</ThemedTextSecondary>}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  count: { fontSize: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 48, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 12, borderWidth: 0.5, gap: 12 },
  searchInput: { flex: 1, fontSize: 16 },
  sortBar: { flexDirection: 'row', gap: 16, marginBottom: 16, justifyContent: 'flex-end' },
  sort: { fontSize: 14, color: '#6B6355' },
  activeSort: { fontSize: 14, fontWeight: 'bold', color: '#6A7A5C' },
  empty: { textAlign: 'center', marginTop: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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