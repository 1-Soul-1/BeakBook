import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BirdList from '../components/BirdList';
import WikiList from '../components/WikiList';
import ObservationForm from '../components/ObservationForm';

type Tab = 'birds' | 'wiki' | 'add';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('birds');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>BeakBook</Text>
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => setActiveTab('birds')} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === 'birds' && styles.activeTab]}>Виды</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('wiki')} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === 'wiki' && styles.activeTab]}>Энциклопедия</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('add')} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === 'add' && styles.activeTab]}>➕ Новое</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        {activeTab === 'birds' && <BirdList />}
        {activeTab === 'wiki' && <WikiList />}
        {activeTab === 'add' && <ObservationForm />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  header: { paddingTop: 48, paddingBottom: 8, backgroundColor: '#F5F0E8', borderBottomWidth: 1, borderBottomColor: '#E6E0D0' },
  logo: { fontSize: 24, fontWeight: '800', color: '#4A5A3E', textAlign: 'center', marginBottom: 12 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20 },
  tab: { paddingVertical: 8, paddingHorizontal: 16 },
  tabText: { fontSize: 16, fontWeight: '600', color: '#6B6355' },
  activeTab: { color: '#6A7A5C', borderBottomWidth: 2, borderBottomColor: '#6A7A5C' },
  content: { flex: 1 },
});