// app/main/feed.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlatList, TextInput, View, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Image, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useObservations } from '../../hooks/useObservations';
import { ObservationCard } from '../../components/ObservationCard';
import { ThemedView, ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../../utils/image';
import { Observation } from '../../types/observation';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../../constants/theme';

const PAGE_SIZE = 15;

export default function FeedScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { observations, loading, updateObservation, deleteObservation, toggleFavorite, refreshObservations } = useObservations();
  const { toast, showToast, hideToast } = useToast();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'date_desc' | 'date_asc' | 'name_asc'>('date_desc');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPhoto, setEditPhoto] = useState<string | null>(null);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);

  // Принудительное обновление при каждом появлении экрана
  useFocusEffect(
    useCallback(() => {
      refreshObservations();
      setDisplayedCount(PAGE_SIZE);
    }, [refreshObservations])
  );

  const getCleanName = useCallback((birdName: string) => {
    return birdName
      .replace('📖', '')
      .replace('Статья:', '')
      .replace('статья:', '')
      .trim();
  }, []);

  const favoritesCount = useMemo(() => observations.filter(o => o.favorite).length, [observations]);

  const filteredAndSorted = useMemo(() => {
    let result = [...observations];
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(o => 
        getCleanName(o.birdName).toLowerCase().includes(searchLower) || 
        o.location?.toLowerCase().includes(searchLower)
      );
    }
    if (sort === 'date_desc') result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sort === 'date_asc') result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === 'name_asc') result.sort((a, b) => getCleanName(a.birdName).localeCompare(getCleanName(b.birdName)));
    return result;
  }, [observations, search, sort, getCleanName]);

  const displayedData = useMemo(() => 
    filteredAndSorted.slice(0, displayedCount),
    [filteredAndSorted, displayedCount]
  );

  const loadMore = useCallback(() => {
    if (displayedCount < filteredAndSorted.length) {
      setDisplayedCount(prev => prev + PAGE_SIZE);
    }
  }, [displayedCount, filteredAndSorted.length]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshObservations();
    setDisplayedCount(PAGE_SIZE);
    setRefreshing(false);
    showToast('Данные обновлены', 'success');
  }, [refreshObservations, showToast]);

  const openModal = useCallback((obs: Observation) => {
    setSelectedObs(obs);
    setEditMode(false);
    setModalVisible(true);
  }, []);

  const startEdit = useCallback(() => {
    if (!selectedObs) return;
    setEditLocation(selectedObs.location);
    setEditDate(selectedObs.date);
    setEditNotes(selectedObs.notes);
    setEditPhoto(selectedObs.photo);
    setEditMode(true);
  }, [selectedObs]);

  const saveEdit = useCallback(async () => {
    if (!selectedObs) return;
    await updateObservation(selectedObs.id, { location: editLocation, date: editDate, notes: editNotes, photo: editPhoto });
    setEditMode(false);
    setModalVisible(false);
    await refreshObservations();
    showToast('Наблюдение обновлено', 'success');
  }, [selectedObs, editLocation, editDate, editNotes, editPhoto, updateObservation, refreshObservations, showToast]);

  const pickImageForEdit = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.6, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      const compressed = await compressImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setEditPhoto(compressed);
      showToast('Фото загружено', 'success');
    }
  }, [showToast]);

  const handleDelete = useCallback(async (id: number) => {
    await deleteObservation(id);
    if (selectedObs?.id === id) {
      setModalVisible(false);
      setSelectedObs(null);
    }
    await refreshObservations();
  }, [deleteObservation, selectedObs, refreshObservations]);

  const handleToggleFavorite = useCallback(async (id: number) => {
    await toggleFavorite(id);
    await refreshObservations();
  }, [toggleFavorite, refreshObservations]);

  const getStatusColor = useCallback((statusClass: string) => {
    switch(statusClass) {
      case 'endangered': return colors.statusEndangered;
      case 'vulnerable': return colors.statusVulnerable;
      case 'rare': return colors.statusRare;
      default: return colors.statusCommon;
    }
  }, [colors]);

  const keyExtractor = useCallback((item: Observation) => item.id.toString(), []);
  const renderItem = useCallback(({ item }: { item: Observation }) => (
    <ObservationCard
      observation={item}
      onPress={() => openModal(item)}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      onEdit={() => { setSelectedObs(item); startEdit(); }}
      onDelete={() => handleDelete(item.id)}
      showToast={showToast}
    />
  ), [openModal, handleToggleFavorite, startEdit, handleDelete, showToast]);

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <ThemedTextSecondary style={{ marginTop: Spacing.three }}>Загрузка...</ThemedTextSecondary>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={displayedData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <ThemedText type="h2">Журнал</ThemedText>
              <View style={styles.counters}>
                <ThemedTextSecondary style={styles.count}>Всего: {observations.length}</ThemedTextSecondary>
                <ThemedTextSecondary style={styles.count}>⭐ {favoritesCount}</ThemedTextSecondary>
              </View>
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
              <TouchableOpacity 
                style={[styles.sortButton, sort === 'date_desc' && styles.sortButtonActive, { borderColor: colors.border, backgroundColor: colors.card }]} 
                onPress={() => setSort('date_desc')}
              >
                <ThemedTextSecondary style={sort === 'date_desc' ? styles.activeSort : styles.sort}>Новые сначала</ThemedTextSecondary>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortButton, sort === 'date_asc' && styles.sortButtonActive, { borderColor: colors.border, backgroundColor: colors.card }]} 
                onPress={() => setSort('date_asc')}
              >
                <ThemedTextSecondary style={sort === 'date_asc' ? styles.activeSort : styles.sort}>Старые сначала</ThemedTextSecondary>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortButton, sort === 'name_asc' && styles.sortButtonActive, { borderColor: colors.border, backgroundColor: colors.card }]} 
                onPress={() => setSort('name_asc')}
              >
                <ThemedTextSecondary style={sort === 'name_asc' ? styles.activeSort : styles.sort}>А-Я</ThemedTextSecondary>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="binoculars" size={48} color={colors.textMuted} />
            <ThemedTextSecondary style={styles.emptyText}>Пока нет наблюдений</ThemedTextSecondary>
            <ThemedTextSecondary style={styles.emptySubtext}>Нажмите «Новое» и добавьте первую птицу</ThemedTextSecondary>
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews={Platform.OS === 'android'}
        initialNumToRender={8}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
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
                    <FontAwesome6 name="trash-alt" size={14} color={colors.danger} />
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
                  <FontAwesome6 name="trash-alt" size={14} color={colors.danger} />
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

      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: Spacing.four, paddingBottom: Spacing.ten },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Spacing.three },
  counters: { flexDirection: 'row', gap: Spacing.three },
  count: { fontSize: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, marginBottom: Spacing.three, borderWidth: 0.5, gap: Spacing.two },
  searchInput: { flex: 1, fontSize: 16 },
  sortBar: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.four, justifyContent: 'flex-end', flexWrap: 'wrap' },
  sortButton: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: BorderRadius.pill, borderWidth: 1 },
  sortButtonActive: { backgroundColor: '#DDE6D6', borderColor: '#6A7A5C' },
  sort: { fontSize: 13, color: '#6B6355' },
  activeSort: { fontSize: 13, fontWeight: '600', color: '#6A7A5C' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', padding: Spacing.eight, marginTop: Spacing.eight },
  emptyText: { marginTop: Spacing.three, fontSize: 16, fontWeight: '600' },
  emptySubtext: { marginTop: Spacing.two, textAlign: 'center' },
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