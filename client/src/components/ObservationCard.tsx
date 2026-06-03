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
  showToast?: (message: string, type?: 'success' | 'error' | 'warning') => void;
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
      showToast('Наблюдение удалено', 'success');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <ThemedCard style={[styles.card, observation.favorite && styles.favorited]}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: isDark ? '#3A4334' : '#DDE6D6' }]}>
              <FontAwesome6 name="feather" size={24} color={isDark ? '#8FA47E' : '#4A5A3E'} />
            </View>
            <View style={styles.content}>
              <ThemedText style={styles.birdName}>{observation.birdName}</ThemedText>
              <View style={styles.meta}>
                <FontAwesome6 name="location-dot" size={12} color={colors.textSecondary} />
                <ThemedTextSecondary style={styles.metaText}>{observation.location || '—'}</ThemedTextSecondary>
                <FontAwesome6 name="calendar" size={12} color={colors.textSecondary} />
                <ThemedTextSecondary style={styles.metaText}>{observation.date}</ThemedTextSecondary>
              </View>
              <View style={styles.tags}>
                <View style={[styles.familyBadge, { backgroundColor: isDark ? '#3A4334' : '#DDE6D6' }]}>
                  <FontAwesome6 name="leaf" size={12} color={colors.accentDark} />
                  <ThemedText style={styles.familyText}>{observation.family}</ThemedText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                  <FontAwesome6 name="shield" size={12} color={statusColor} />
                  <ThemedText style={{ color: statusColor }}>{observation.statusText}</ThemedText>
                </View>
              </View>
            </View>
            {hasPhoto ? (
              <Image source={{ uri: observation.photo! }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnailPlaceholder, { backgroundColor: isDark ? '#3A4334' : '#DDE6D6' }]}>
                <FontAwesome6 name="camera" size={20} color={isDark ? '#8FA47E' : '#6A7A5C'} />
              </View>
            )}
          </View>
          {observation.notes ? (
            <ThemedTextSecondary style={styles.notes} numberOfLines={2}>
              {observation.notes}
            </ThemedTextSecondary>
          ) : (
            <ThemedTextSecondary style={[styles.notes, styles.emptyNotes]}>— нет заметок —</ThemedTextSecondary>
          )}
          <View style={[styles.actions, { borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionButton}>
              <FontAwesome6 
                name="star" 
                size={14} 
                color={observation.favorite ? '#E8B84B' : colors.textSecondary} 
                solid={observation.favorite} 
              />
              <ThemedTextSecondary style={styles.actionText}>
                {observation.favorite ? 'В избранном' : 'В избранное'}
              </ThemedTextSecondary>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <FontAwesome6 name="pen-to-square" size={14} color={colors.textSecondary} />
              <ThemedTextSecondary style={styles.actionText}>Изменить</ThemedTextSecondary>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress} style={styles.actionButton}>
              <FontAwesome6 name="trash-can" size={14} color={colors.danger} />
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
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    }),
  },
  favorited: { borderLeftWidth: 4, borderLeftColor: '#E8B84B' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { width: 50, height: 50, borderRadius: BorderRadius.xxxl, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.three },
  content: { flex: 1 },
  birdName: { fontWeight: 'bold', fontSize: 16, marginBottom: Spacing.one },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.one, flexWrap: 'wrap' },
  metaText: { fontSize: 12 },
  tags: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  familyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: BorderRadius.xl },
  familyText: { fontSize: 12, fontWeight: '500', color: '#4A5A3E' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: BorderRadius.xl },
  thumbnail: { width: 56, height: 56, borderRadius: BorderRadius.large, marginLeft: Spacing.two },
  thumbnailPlaceholder: { width: 56, height: 56, borderRadius: BorderRadius.large, marginLeft: Spacing.two, justifyContent: 'center', alignItems: 'center' },
  notes: { marginTop: Spacing.three, fontSize: 13, fontStyle: 'italic' },
  emptyNotes: { opacity: 0.5 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing.three, paddingTop: Spacing.two, borderTopWidth: 0.5 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingVertical: Spacing.one },
  actionText: { fontSize: 12, fontWeight: '600' },
  
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