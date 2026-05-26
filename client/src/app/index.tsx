import axios from "axios"
import type { Bird } from "@/types/birds"
import { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, ActivityIndicator } from "react-native";
// Импортируем из папки Bird
// import BirdCard from "./Bird";
import BirdCard from "@/components/BirdCard";

const API_URL_BIRDS = "http://127.0.0.1:8000/api/birds/birds/";

const BirdList = () => {
    const [birds, setBirds] = useState<Bird[]>([]);
    const [loading, setLoading] = useState(true);

    const getBirds = async () => {
        const response = await axios.get<Bird[]>(API_URL_BIRDS);
        setBirds(response.data);
        setLoading(false);
    }

    useEffect(() => {
        getBirds();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Список птиц</Text>
            <FlatList
                data={birds}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <BirdCard bird={item} />
                )}
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
    }
});

export default BirdList