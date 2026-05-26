import { Bird } from "../types/birds"
import { View, Text } from "react-native";

type Props = {
    bird: Bird;
}

const BirdCard = ({ bird }: Props) => {
    return (
        <View>
            <Text>Имя: {bird.name}</Text>
            <Text>Описание: {bird.description}</Text>
        </View>
    );
};

export default BirdCard