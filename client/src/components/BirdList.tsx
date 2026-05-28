import axios from "axios"
import type { Bird } from "../types/birds"
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BirdCard from "./BirdCard";

const API_URL_BIRDS = "http://127.0.0.1:8000/api/birds/birds/";

const BirdList = () => {
    const [birds, setBirds] = useState<Bird[]>([]);
    const [loading, setLoading] = useState(true);

    const getBirds = async () => {
        try {
            const response = await axios.get<Bird[]>(API_URL_BIRDS);
            setBirds(response.data);
        } catch (error) {
            console.error("Ошибка загрузки птиц:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBirds();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Загрузка...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Список птиц</Text>
            <FlatList
                data={birds}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <BirdCard bird={item} />}
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
    }
});

export default BirdList;