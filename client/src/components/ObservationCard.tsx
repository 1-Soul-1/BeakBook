import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Observation } from '../types/observation';
import { ThemedCard, ThemedText, ThemedTextSecondary, getThemeColors } from './Themed';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  observation: Observation;
  onPress: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const hasPhoto = observation.photo && observation.photo.startsWith('data:image');
  const statusColor = statusColorMap[observation.statusClass as keyof typeof statusColorMap] || '#8FA47E';
  const isDark = theme === 'dark';

  const handleDelete = () => {
    Alert.alert('Удалить наблюдение?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
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
          <TouchableOpacity onPress={onToggleFavorite} style={styles.actionButton}>
            <FontAwesome6 name="star" size={14} color={observation.favorite ? '#E8B84B' : colors.textSecondary} solid={observation.favorite} />
            <ThemedTextSecondary style={styles.actionText}>
              {observation.favorite ? 'В избранном' : 'В избранное'}
            </ThemedTextSecondary>
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <FontAwesome6 name="pen-to-square" size={14} color={colors.textSecondary} />
            <ThemedTextSecondary style={styles.actionText}>Изменить</ThemedTextSecondary>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <FontAwesome6 name="trash-can" size={14} color="#E39371" />
            <ThemedTextSecondary style={styles.actionText}>Удалить</ThemedTextSecondary>
          </TouchableOpacity>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  favorited: { borderLeftWidth: 4, borderLeftColor: '#E8B84B' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { width: 50, height: 50, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  content: { flex: 1 },
  birdName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  metaText: { fontSize: 12 },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  familyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  familyText: { fontSize: 12, fontWeight: '500', color: '#4A5A3E' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  thumbnail: { width: 56, height: 56, borderRadius: 16, marginLeft: 8 },
  thumbnailPlaceholder: { width: 56, height: 56, borderRadius: 16, marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
  notes: { marginTop: 12, fontSize: 13, fontStyle: 'italic' },
  emptyNotes: { opacity: 0.5 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, paddingTop: 8, borderTopWidth: 0.5 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6 },
  actionText: { fontSize: 12, fontWeight: '600' },
});