import React, { useState } from 'react';
import { FlatList, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { BIRD_SPECIES } from '../../constants/species';
import { ThemedView, ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

export default function GuideScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [search, setSearch] = useState('');
  const filteredBirds = BIRD_SPECIES.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.family.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (birdName: string) => router.push({ pathname: '/main/add', params: { birdName } });
  const handleView = (birdName: string) => router.push({ pathname: '/main/feed', params: { search: birdName } });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Птицы Оренбуржья</ThemedText>
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FontAwesome6 name="magnifying-glass" size={16} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Поиск по виду или семейству..."
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
        data={filteredBirds}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderBottomColor: colors.border }]}>
            <View style={styles.itemText}>
              <ThemedText style={styles.birdName}>{item.name}</ThemedText>
              <ThemedTextSecondary style={styles.desc}>{item.family} — {item.statusText}</ThemedTextSecondary>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accentLight }]} onPress={() => handleAdd(item.name)}>
                <FontAwesome6 name="plus" size={12} color={colors.accentDark} />
                <ThemedText>Добавить</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accentLight }]} onPress={() => handleView(item.name)}>
                <FontAwesome6 name="eye" size={12} color={colors.accentDark} />
                <ThemedText>Мои</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 48, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 16, borderWidth: 0.5, gap: 12 },
  searchInput: { flex: 1, fontSize: 16 },
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5 },
  itemText: { flex: 1 },
  birdName: { fontWeight: 'bold', fontSize: 16 },
  desc: { fontSize: 13 },
  buttons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
});