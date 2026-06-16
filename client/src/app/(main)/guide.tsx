import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { BIRD_SPECIES } from '../../constants/species';
import { ThemedView, ThemedText, ThemedTextSecondary, getThemeColors } from '../../components/Themed';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getWikis } from '../../api/client';
import { Wiki } from '../../types/wiki';

export default function GuideScreen() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [activeTab, setActiveTab] = useState<'birds' | 'wiki'>('birds');
  const [search, setSearch] = useState('');
  const [wikiArticles, setWikiArticles] = useState<Wiki[]>([]);
  const [wikiLoading, setWikiLoading] = useState(true);
  const [wikiError, setWikiError] = useState('');

  // Загрузка вики-статей
  useEffect(() => {
    if (activeTab === 'wiki') {
      getWikis()
        .then(res => setWikiArticles(res.data))
        .catch(() => setWikiError('Ошибка загрузки статей'))
        .finally(() => setWikiLoading(false));
    }
  }, [activeTab]);

  const filteredBirds = BIRD_SPECIES.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.family.toLowerCase().includes(search.toLowerCase())
  );

  const filteredWiki = wikiArticles.filter(article =>
    article.name.toLowerCase().includes(search.toLowerCase()) ||
    article.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (birdName: string) => router.push({ pathname: '/add', params: { birdName } });
  const handleView = (birdName: string) => router.push({ pathname: '/feed', params: { search: birdName } });

  const renderBirdItem = ({ item, index }: { item: typeof BIRD_SPECIES[0]; index: number }) => (
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
  );

  const renderWikiItem = ({ item }: { item: Wiki }) => (
    <View style={[styles.wikiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <ThemedText style={styles.wikiTitle}>{item.name}</ThemedText>
      <ThemedTextSecondary style={styles.wikiAuthor}>
        <FontAwesome6 name="user" size={10} color={colors.textSecondary} /> Автор: {item.author}
      </ThemedTextSecondary>
      <ThemedTextSecondary style={styles.wikiDescription}>{item.description}</ThemedTextSecondary>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Гид орнитолога</ThemedText>
      
      {/* Переключатель вкладок */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'birds' && { borderBottomColor: colors.accent, borderBottomWidth: 2 }]} 
          onPress={() => { setActiveTab('birds'); setSearch(''); }}
        >
          <FontAwesome6 name="feather" size={18} color={activeTab === 'birds' ? colors.accent : colors.textSecondary} />
          <ThemedText style={[styles.tabText, activeTab === 'birds' && { color: colors.accent, fontWeight: 'bold' }]}>
            Справочник птиц
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'wiki' && { borderBottomColor: colors.accent, borderBottomWidth: 2 }]} 
          onPress={() => { setActiveTab('wiki'); setSearch(''); }}
        >
          <FontAwesome6 name="book-open" size={18} color={activeTab === 'wiki' ? colors.accent : colors.textSecondary} />
          <ThemedText style={[styles.tabText, activeTab === 'wiki' && { color: colors.accent, fontWeight: 'bold' }]}>
            Познавательные статьи
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Поиск */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FontAwesome6 name="magnifying-glass" size={16} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={activeTab === 'birds' ? "Поиск по названию или семейству..." : "Поиск по статьям..."}
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

      {/* Контент вкладок */}
      {activeTab === 'birds' ? (
        <FlatList
          data={filteredBirds}
          keyExtractor={(item, index) => `${item.name}_${index}`}
          renderItem={renderBirdItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ThemedTextSecondary style={styles.empty}>
              <FontAwesome6 name="search" size={20} /> Птицы не найдены
            </ThemedTextSecondary>
          }
        />
      ) : (
        wikiLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
            <ThemedTextSecondary>Загрузка статей...</ThemedTextSecondary>
          </View>
        ) : wikiError ? (
          <View style={styles.center}>
            <FontAwesome6 name="exclamation-triangle" size={40} color="#E39371" />
            <ThemedTextSecondary style={styles.errorText}>{wikiError}</ThemedTextSecondary>
          </View>
        ) : (
          <FlatList
            data={filteredWiki}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderWikiItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <ThemedTextSecondary style={styles.empty}>
                <FontAwesome6 name="book-open" size={20} /> Статьи не найдены
              </ThemedTextSecondary>
            }
          />
        )
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  
  // Вкладки
  tabBar: { flexDirection: 'row', marginBottom: 16, gap: 24, borderBottomWidth: 0.5, borderBottomColor: '#E6E0D0' },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 10, paddingHorizontal: 4 },
  tabText: { fontSize: 15, color: '#6B6355' },
  
  // Поиск
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 48, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 16, borderWidth: 0.5, gap: 12 },
  searchInput: { flex: 1, fontSize: 16 },
  
  // Список птиц
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, alignItems: 'center' },
  itemText: { flex: 1 },
  birdName: { fontWeight: 'bold', fontSize: 16 },
  desc: { fontSize: 13 },
  buttons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  
  // Вики-статьи
  wikiCard: { padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 0.5 },
  wikiTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  wikiAuthor: { fontSize: 11, marginBottom: 8, fontStyle: 'italic' },
  wikiDescription: { fontSize: 13, lineHeight: 18 },
  
  // Общие стили
  empty: { textAlign: 'center', marginTop: 40, gap: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 50 },
  errorText: { textAlign: 'center', marginTop: 12 },
});