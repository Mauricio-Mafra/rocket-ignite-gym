import { Heading, HStack, Icon, Image, Text, VStack } from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";


type Props = TouchableOpacityProps & {}

export function ExerciseCard({ ...rest }: Props) {
    return (
        <TouchableOpacity {...rest}>
            <HStack
                bg="$gray500"
                alignItems="center"
                p="$2"
                pr="$4"
                rounded="$md"
                mb="$3"
            >
                <Image
                    source={{ uri: "https://avatars.fastly.steamstatic.com/8be3015ca517420d39b0a6224cf0a3be131faae3_full.jpg" }}
                    alt="Imagem do exercício"
                    w="$16"
                    h="$16"
                    rounded="$md"
                    mr="$4"
                    resizeMode="cover"
                />

                <VStack flex={1}>
                    <Heading fontSize="$lg" color="white" fontFamily="$heading">Vashzinho</Heading>
                    <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>O estouro da boiada</Text>
                </VStack>

                <Icon as={ChevronRight} color="$gray300" />
            </HStack>
        </TouchableOpacity>
    )
}