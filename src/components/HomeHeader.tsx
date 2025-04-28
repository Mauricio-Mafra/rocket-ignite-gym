import { UserPhoto } from '@components/UserPhoto';
import { Heading, HStack, Text, VStack, Icon } from '@gluestack-ui/themed';
import { useAuth } from '@hooks/useAuth';
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export function HomeHeader() {
    const { user, signOut } = useAuth();

    return (
        <HStack
            bg="$gray600"
            pt="$16"
            pb="$5"
            px="$8"
            alignItems="center"
            gap="$4"
        >
            <UserPhoto
                source={{
                    uri: 'https://avatars.fastly.steamstatic.com/8be3015ca517420d39b0a6224cf0a3be131faae3_full.jpg',
                }}
                alt="Imagem do usuário"
            />
            <VStack flex={1}>
                <Text color="$gray100" fontSize="$sm">
                    Olá,
                </Text>
                <Heading color="$gray100" fontSize="$md">
                    {user.name}
                </Heading>
            </VStack>
            <TouchableOpacity onPress={signOut}>
                <Icon as={LogOut} color="$gray200" size="xl" />
            </TouchableOpacity>
        </HStack>
    );
}
