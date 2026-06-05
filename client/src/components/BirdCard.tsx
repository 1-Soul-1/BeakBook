// components/BirdCard.tsx
import { View, StyleSheet } from 'react-native';
import { BirdSpecies } from '../types/birds';
import { ThemedText, ThemedTextSecondary, getThemeColors } from './Themed';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius, Shadows } from '../constants/theme';

type Props = { species: BirdSpecies };

export default function BirdCard({ species }: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const getStatusColor = () => {
    switch (species.statusClass) {
      case 'endangered': return colors.statusEndangered;
      case 'vulnerable': return colors.statusVulnerable;
      case 'rare': return colors.statusRare;
      default: return colors.statusCommon;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
      <ThemedText style={styles.name}>{species.name}</ThemedText>
      <ThemedTextSecondary style={styles.detail}>
        Семейство: {species.family}
      </ThemedTextSecondary>
      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
        <ThemedTextSecondary style={[styles.statusText, { color: getStatusColor() }]}>
          {species.statusText}
        </ThemedTextSecondary>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    marginHorizontal: Spacing.four,
    borderWidth: 0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  detail: {
    fontSize: 14,
    marginBottom: Spacing.two,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.one,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});