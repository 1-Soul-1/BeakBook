// src/components/AutocompleteInput.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ThemedText, ThemedTextSecondary, getThemeColors } from './Themed';
import { BIRD_SPECIES } from '../constants/species';
import { BirdSpecies } from '../types/birds';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../constants/theme';

type Props = {
  onSelect: (species: BirdSpecies) => void;
  placeholder?: string;
};

export const AutocompleteInput: React.FC<Props> = ({ onSelect, placeholder }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<BirdSpecies[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.length > 1 && isFocused) {
      const filtered = BIRD_SPECIES.filter(b =>
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.family.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, isFocused]);

  const selectItem = (item: BirdSpecies) => {
    setQuery(item.name);
    setSuggestions([]);
    setIsFocused(false);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
      />
      {suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.suggestion, { borderBottomColor: colors.border }]} onPress={() => selectItem(item)}>
                <ThemedText style={styles.suggestionName}>{item.name}</ThemedText>
                <ThemedTextSecondary style={styles.suggestionDesc}>{item.family} — {item.statusText}</ThemedTextSecondary>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: Spacing.two,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    maxHeight: 200,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  suggestion: {
    padding: Spacing.three,
    borderBottomWidth: 0.5,
  },
  suggestionName: {
    fontWeight: '600',
    fontSize: 14,
  },
  suggestionDesc: {
    fontSize: 12,
  },
});