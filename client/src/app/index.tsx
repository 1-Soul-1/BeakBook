import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BirdList from "@/components/BirdList";
import WikiList from "@/components/WikiList";

export default function Index() {
    const [showWiki, setShowWiki] = useState(false);

    if (showWiki) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => setShowWiki(false)}
                    >
                        <Text style={styles.backButtonText}>Назад</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Энциклопедия птиц</Text>
                    <View style={styles.placeholder} />
                </View>
                <WikiList />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Птицы</Text>
                <TouchableOpacity 
                    style={styles.wikiButton}
                    onPress={() => setShowWiki(true)}
                >
                    <Text style={styles.wikiButtonText}>Энциклопедия</Text>
                </TouchableOpacity>
            </View>
            <BirdList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f5f5f5',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    wikiButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    wikiButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 70,
    },
});