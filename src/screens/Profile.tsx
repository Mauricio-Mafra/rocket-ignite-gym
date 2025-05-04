import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed';
import { ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { ToastMessage } from '@components/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

type FormDataProps = {
    name: string;
    email?: string;
    password?: string;
    old_password?: string;
    password_confirmation?: string;
};

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome'),

    password: yup
        .string()
        .min(6, 'A senha deve ter pelo menos 6 dígitos')
        .nullable()
        .transform((value) => (!!value ? value : null)),

    email: yup.string(),

    password_confirmation: yup
        .string()
        .nullable()
        .transform((value) => (!!value ? value : null))
        .oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere')
        .when('password', {
            is: (Field: any) => Field,
            then: (schema) =>
                yup
                    .string()
                    .nullable()
                    .required('Informe a confirmação da senha'),
        }),

    old_password: yup.string(),
});

export function Profile() {
    const [userPhoto, setUserPhoto] = useState(
        'https://avatars.fastly.steamstatic.com/8be3015ca517420d39b0a6224cf0a3be131faae3_full.jpg',
    );
    const [isUpdating, setUpdating] = useState(false);

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema),
    });

    async function handleUserPhotoSelect() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (photoSelected.canceled) {
                return;
            }

            const photoURI = photoSelected.assets[0].uri;

            if (photoURI) {
                const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
                    size: number;
                };

                if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                    return toast.show({
                        placement: 'top',
                        render: ({ id }) => (
                            <ToastMessage
                                id={id}
                                action="error"
                                title="Essa imagem é muito grande. Escolha uma de até 5MB"
                                onClose={() => toast.close(id)}
                            />
                        ),
                    });
                }

                const fileExtension = photoURI.split('.').pop();

                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase(),
                    uri: photoURI,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`,
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                const avatarUpdatedResponse = await api.patch(
                    '/users/avatar',
                    userPhotoUploadForm,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);

                toast.show({
                    placement: 'top',
                    render: ({ id }) => (
                        <ToastMessage
                            id={id}
                            action="success"
                            title="Foto atualizada!"
                            onClose={() => toast.close(id)}
                        />
                    ),
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setUpdating(true);
            const updatedUser = user;
            updatedUser.name = data.name;

            await api.put('/users', data);

            await updateUserProfile(updatedUser);

            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="success"
                        title="Perfil atualizado com sucesso"
                        onClose={() => toast.close(id)}
                    />
                ),
            });
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError
                ? error.message
                : 'Não foi possível atualizar o perfil. Tente novamente mais tarde.';

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
            setUpdating(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />
            <ScrollView>
                <Center mt={'$6'} px={'$10'}>
                    <UserPhoto
                        source={
                            user.avatar
                            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
                            : defaultUserPhotoImg
                        }
                        alt="Foto do usuário"
                        size="xl"
                    />

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text
                            color="$green500"
                            fontFamily="$heading"
                            fontSize="$md"
                            mt="$2"
                            mb="$8"
                        >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                    <Center w="$full" gap="$4">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    placeholder="Nome"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    placeholder="E-mail"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    isReadOnly
                                />
                            )}
                        />
                    </Center>

                    <Heading
                        alignSelf="flex-start"
                        fontFamily="$heading"
                        color="$gray200"
                        fontSize="$md"
                        mt="$12"
                        mb="$2"
                    >
                        Alterar senha
                    </Heading>

                    <Center w="$full" gap="$4">
                        <Controller
                            control={control}
                            name="old_password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Senha antiga"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    secureTextEntry
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Nova senha"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                    secureTextEntry
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password_confirmation"
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Confirme a nova senha"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    errorMessage={
                                        errors.password_confirmation?.message
                                    }
                                    secureTextEntry
                                />
                            )}
                        />
                        <Button
                            title="Atualizar"
                            onPress={handleSubmit(handleProfileUpdate)}
                            isLoading={isUpdating}
                        />
                    </Center>
                </Center>
            </ScrollView>
        </VStack>
    );
}
