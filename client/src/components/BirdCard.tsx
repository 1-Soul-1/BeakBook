import { Bird } from "../types/birds"
import { View, Text, StyleSheet } from "react-native";

type Props = {
    bird: Bird;
}

const BirdCard = ({ bird }: Props) => {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>Имя: {bird.name}</Text>
            <Text style={styles.description}>Описание: {bird.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#555',
    }
});

export default BirdCard;