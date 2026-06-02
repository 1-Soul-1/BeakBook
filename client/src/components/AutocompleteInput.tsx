import React, { useState, useRef } from 'react';
import { TextInput, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedText, ThemedTextSecondary, getThemeColors } from './Themed';
import { BIRD_SPECIES } from '../constants/species';
import { BirdSpecies } from '../types/birds';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  onSelect: (species: BirdSpecies) => void;
  placeholder?: string;
};

export const AutocompleteInput: React.FC<Props> = ({ onSelect, placeholder }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<BirdSpecies[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      const filtered = BIRD_SPECIES.filter(b => b.name.toLowerCase().includes(text.toLowerCase())).slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectItem = (item: BirdSpecies) => {
    setQuery(item.name);
    setShowSuggestions(false);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={handleChange}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => query.length > 1 && setShowSuggestions(true)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.name}
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
  container: { position: 'relative', zIndex: 1000 },
  input: { borderWidth: 1, borderRadius: 24, padding: 14, fontSize: 16 },
  suggestionsContainer: { position: 'absolute', top: 60, left: 0, right: 0, borderWidth: 1, borderRadius: 20, maxHeight: 200, zIndex: 1000 },
  suggestion: { padding: 12, borderBottomWidth: 0.5 },
  suggestionName: { fontWeight: '600', fontSize: 14 },
  suggestionDesc: { fontSize: 12 },
});