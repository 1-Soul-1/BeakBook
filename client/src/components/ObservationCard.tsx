// components/ObservationCard.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Observation } from '../types/observation';
import { ThemedCard, ThemedText, ThemedTextSecondary, getThemeColors } from './Themed';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../constants/theme';

type Props = {
  observation: Observation;
  onPress: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
};

const statusColorMap = {
  endangered: '#E39371',
  vulnerable: '#E0B85C',
  rare: '#8FA47E',
  common: '#A8A090',
};

export const ObservationCard: React.FC<Props> = ({
  observation,
  onPress,
  onToggleFavorite,
  onEdit,
  onDelete,
  showToast,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const hasPhoto = observation.photo && observation.photo.startsWith('data:image');
  const statusColor = statusColorMap[observation.statusClass as keyof typeof statusColorMap] || '#8FA47E';
  const isDark = theme === 'dark';

  const handleToggleFavorite = () => {
    onToggleFavorite();
    if (showToast) {
      const message = observation.favorite 
        ? `${observation.birdName.split('(')[0].trim()} удалено из избранного`
        : `${observation.birdName.split('(')[0].trim()} добавлено в избранное`;
      showToast(message, 'success');
    }
  };

  const handleEdit = () => {
    onEdit();
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete();
    if (showToast) {
      showToast('Наблюдение удалено', 'error');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const truncatedNotes = observation.notes 
    ? truncateText(observation.notes, 100)
    : '— нет заметок —';

  // Обрезаем длинные тексты для бейджей
  const truncatedFamily = observation.family.length > 20 
    ? truncateText(observation.family, 18) 
    : observation.family;
    
  const truncatedStatus = observation.statusText.length > 20 
    ? truncateText(observation.statusText, 18) 
    : observation.statusText;

  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <ThemedCard style={[styles.card, observation.favorite && styles.favorited]}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: isDark ? '#3A4334' : '#DDE6D6' }]}>
              <FontAwesome6 name="feather" size={20} color={isDark ? '#8FA47E' : '#4A5A3E'} />
            </View>
            <View style={styles.content}>
              <ThemedText style={styles.birdName} numberOfLines={2}>
                {observation.birdName}
              </ThemedText>
              <View style={styles.meta}>
                <FontAwesome6 name="location-dot" size={10} color={colors.textSecondary} />
                <ThemedTextSecondary style={styles.metaText} numberOfLines={1}>
                  {observation.location || '—'}
                </ThemedTextSecondary>
                <FontAwesome6 name="calendar" size={10} color={colors.textSecondary} />
                <ThemedTextSecondary style={styles.metaText}>{observation.date}</ThemedTextSecondary>
              </View>
              {/* Семейство и статус в одной строке - теперь с flexShrink */}
              <View style={styles.tagsRow}>
                <View style={[styles.infoBadge, { backgroundColor: isDark ? '#3A4334' : '#DDE6D6' }]}>
                  <FontAwesome6 name="leaf" size={9} color={colors.accentDark} />
                  <ThemedText style={styles.infoText} numberOfLines={1}>
                    {truncatedFamily}
                  </ThemedText>
                </View>
                <View style={[styles.infoBadge, { backgroundColor: `${statusColor}20` }]}>
                  <FontAwesome6 name="shield" size={9} color={statusColor} />
                  <ThemedText style={[styles.infoText, { color: statusColor }]} numberOfLines={1}>
                    {truncatedStatus}
                  </ThemedText>
                </View>
              </View>
            </View>
            {hasPhoto ? (
              <Image source={{ uri: observation.photo! }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnailPlaceholder, { backgroundColor: isDark ? '#3A4334' : '#DDE6D6' }]}>
                <FontAwesome6 name="camera" size={16} color={isDark ? '#8FA47E' : '#6A7A5C'} />
              </View>
            )}
          </View>
          
          <View style={styles.notesContainer}>
            <ThemedTextSecondary style={styles.notes} numberOfLines={3}>
              {truncatedNotes}
            </ThemedTextSecondary>
          </View>
          
          <View style={[styles.actions, { borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionButton}>
              <FontAwesome6 
                name="star" 
                size={12} 
                color={observation.favorite ? '#E8B84B' : colors.textSecondary} 
                solid={observation.favorite} 
              />
              <ThemedTextSecondary style={styles.actionText}>
                {observation.favorite ? 'В избранном' : 'В избранное'}
              </ThemedTextSecondary>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <FontAwesome6 name="pen-to-square" size={12} color={colors.textSecondary} />
              <ThemedTextSecondary style={styles.actionText}>Изменить</ThemedTextSecondary>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress} style={styles.actionButton}>
              <FontAwesome6 name="trash-can" size={12} color={colors.danger} />
              <ThemedTextSecondary style={[styles.actionText, { color: colors.danger }]}>Удалить</ThemedTextSecondary>
            </TouchableOpacity>
          </View>
        </ThemedCard>
      </TouchableOpacity>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalIcon}>
              <FontAwesome6 name="trash-can" size={48} color={colors.danger} />
            </View>
            <ThemedText style={styles.modalTitle}>Удалить наблюдение?</ThemedText>
            <ThemedTextSecondary style={styles.modalMessage}>
              Это действие нельзя отменить.
            </ThemedTextSecondary>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.border }]} 
                onPress={handleCancelDelete}
              >
                <ThemedText style={styles.modalButtonText}>Отмена</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonDelete, { backgroundColor: colors.danger }]} 
                onPress={handleConfirmDelete}
              >
                <ThemedText style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Удалить</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: { 
    padding: Spacing.four, 
    marginBottom: Spacing.three,
    height: 230,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    }),
  },
  favorited: { borderLeftWidth: 4, borderLeftColor: '#E8B84B' },
  row: { flexDirection: 'row', alignItems: 'flex-start', flexShrink: 1 },
  icon: { width: 40, height: 40, borderRadius: BorderRadius.xxxl, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.three, flexShrink: 0 },
  content: { flex: 1, marginRight: Spacing.two, flexShrink: 1 },
  birdName: { fontWeight: 'bold', fontSize: 15, marginBottom: Spacing.one },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.one, flexWrap: 'wrap' },
  metaText: { fontSize: 11 },
  tagsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Spacing.one, 
    flexWrap: 'wrap',
    marginTop: Spacing.one,
  },
  infoBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 3, 
    paddingHorizontal: Spacing.two, 
    paddingVertical: 2, 
    borderRadius: BorderRadius.xl,
    flexShrink: 1,
  },
  infoText: { 
    fontSize: 10, 
    fontWeight: '500',
  },
  thumbnail: { width: 48, height: 48, borderRadius: BorderRadius.large, marginLeft: Spacing.two, flexShrink: 0 },
  thumbnailPlaceholder: { width: 48, height: 48, borderRadius: BorderRadius.large, marginLeft: Spacing.two, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  
  notesContainer: {
    marginTop: Spacing.two,
    flex: 1,
  },
  notes: { 
    fontSize: 12, 
    fontStyle: 'italic',
    lineHeight: 16,
  },
  
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: Spacing.two, 
    paddingTop: Spacing.two, 
    borderTopWidth: 0.5,
  },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingVertical: Spacing.one },
  actionText: { fontSize: 11, fontWeight: '600' },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { backdropFilter: 'blur(4px)' },
    }),
  },
  modalContent: {
    width: '80%',
    maxWidth: 320,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.six,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    }),
  },
  modalIcon: { marginBottom: Spacing.four },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: Spacing.two, textAlign: 'center' },
  modalMessage: { fontSize: 14, textAlign: 'center', marginBottom: Spacing.six },
  modalButtons: { flexDirection: 'row', gap: Spacing.three, width: '100%' },
  modalButton: { flex: 1, paddingVertical: Spacing.three, borderRadius: BorderRadius.round, alignItems: 'center', justifyContent: 'center' },
  modalButtonCancel: { borderWidth: 1 },
  modalButtonDelete: { borderWidth: 0 },
  modalButtonText: { fontSize: 14, fontWeight: '600' },
});