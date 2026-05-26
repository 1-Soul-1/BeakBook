import axios from "axios"
import type { Bird } from "../types/birds"
import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import BirdCard from "./BirdCard";

const API_URL_BIRDS = "http://10.0.2.2:8000/api/birds/birds/";

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
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View>
            <Text>Список птиц</Text>
            <FlatList
                data={birds}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <BirdCard bird={item} />}
            />
        </View>
    );
};

export default BirdList