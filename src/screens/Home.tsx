import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import { HomeHeader } from "./HomeHeader";
import { Group } from "@components/Group";
import { useState } from "react";
import { FlatList } from "react-native";
import { ExerciseCard } from "@components/ExerciseCard";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

export function Home() {
    const [groupSelected, setGroupSelected] = useState("Costas");
    const [groups, setGroups] = useState(["Costas", "Bíceps", "Tríceps", "Ombros"]);
    const [exercises, setExercises] = useState([
        "Vash",
        "O Vash",
        "Definitivamente o Vash"
    ]);

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails(){
        navigation.navigate("exercise");
    }

    return (
        <VStack flex={1}>
            <HomeHeader />
            <FlatList
                data={groups}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 32 }}
                style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={groupSelected.toUpperCase() === item.toUpperCase()}
                        onPress={() => setGroupSelected(item)}
                    />
                )}
            />
            <VStack px="$8" flex={1}>
                <HStack justifyContent="space-between" mb="$5" alignItems="center">
                    <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
                        Exercícios
                    </Heading>
                    <Text color="$gray200" fontSize="$sm" fontFamily="$body">
                        4
                    </Text>
                </HStack>


                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => <ExerciseCard onPress={handleOpenExerciseDetails}/>}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

            </VStack>
        </VStack>
    )
}