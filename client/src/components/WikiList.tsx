import axios from "axios"
import type { Wiki } from "../types/wiki"
import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";

const API_URL_WIKI = "http://10.0.2.2:8000/api/wiki/wikis/";

const WikiList = () => {
    const [articles, setArticles] = useState<Wiki[]>([]);
    const [loading, setLoading] = useState(true);

    const getArticles = async () => {
        const response = await axios.get<Wiki[]>(API_URL_WIKI);
        setArticles(response.data);
        setLoading(false);
    }

    useEffect(() => {
        getArticles();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View>
            <Text>Энциклопедия птиц</Text>
            <FlatList
                data={articles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text> Имя: {item.name}</Text>
                        <Text>Автор: {item.author}</Text>
                        <Text>Описание {item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default WikiList