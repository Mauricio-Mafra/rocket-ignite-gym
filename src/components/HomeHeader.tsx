import { UserPhoto } from '@components/UserPhoto';
import { Heading, HStack, Text, VStack, Icon } from '@gluestack-ui/themed';
import { useAuth } from '@hooks/useAuth';
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'
import { api } from '@services/api';

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
                source={
                    user.avatar
                    ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
                    : defaultUserPhotoImg
                }
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
