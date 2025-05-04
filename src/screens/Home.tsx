import { Heading, HStack, Text, useToast, VStack } from '@gluestack-ui/themed';
import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { ExerciseCard } from '@components/ExerciseCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { ToastMessage } from '@components/ToastMessage';
import { api } from '@services/api';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Loading } from '@components/Loading';

export function Home() {
    const toast = useToast();
    const [groupSelected, setGroupSelected] = useState('');
    const [groups, setGroups] = useState<string[]>([]);
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate('exercise', { exerciseId });
    }

    async function fetchGroups() {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError
                ? error.message
                : 'Não foi possível carregar os grupos';

            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title={title}
                        onClose={() => toast.close(id)}
                    />
                ),
            });
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true);
            const response = await api.get(
                `/exercises/bygroup/${groupSelected}`,
            );
            setExercises(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError
                ? error.message
                : 'Não foi possível carregar os exercícios';

            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title={title}
                        onClose={() => toast.close(id)}
                    />
                ),
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchExercisesByGroup();
        }, [groupSelected]),
    );

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
                        isActive={
                            groupSelected.toUpperCase() === item.toUpperCase()
                        }
                        onPress={() => setGroupSelected(item)}
                    />
                )}
            />
            {isLoading ? (
                <Loading />
            ) : (
                <VStack px="$8" flex={1}>
                    <HStack
                        justifyContent="space-between"
                        mb="$5"
                        alignItems="center"
                    >
                        <Heading
                            color="$gray200"
                            fontSize="$md"
                            fontFamily="$heading"
                        >
                            Exercícios
                        </Heading>
                        <Text
                            color="$gray200"
                            fontSize="$sm"
                            fontFamily="$body"
                        >
                            {exercises.length}
                        </Text>
                    </HStack>

                    <FlatList
                        data={exercises}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ExerciseCard
                                onPress={() =>
                                    handleOpenExerciseDetails(item.id)
                                }
                                data={item}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </VStack>
            )}
        </VStack>
    );
}
