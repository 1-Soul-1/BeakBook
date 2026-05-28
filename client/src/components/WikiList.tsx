import axios from "axios"
import type { Wiki } from "../types/wiki"
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const API_URL_WIKI = "http://127.0.0.1:8000/api/wiki/wikis/";

const WikiList = () => {
    const [articles, setArticles] = useState<Wiki[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getArticles = async () => {
        try {
            console.log("Загрузка статей...");
            const response = await axios.get<Wiki[]>(API_URL_WIKI);
            console.log("Получено статей:", response.data.length);
            setArticles(response.data);
        } catch (error) {
            console.error("Ошибка загрузки статей:", error);
            setError("Не удалось загрузить статьи");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getArticles();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Загрузка...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (articles.length === 0) {
        return (
            <View style={styles.center}>
                <Text>Нет доступных статей</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Энциклопедия птиц</Text>
            <FlatList
                data={articles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.author}>Автор: {item.author}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    author: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: '#333',
    }
});

export default WikiList;