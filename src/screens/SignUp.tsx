import {
    VStack,
    Image,
    Center,
    Text,
    Heading,
    ScrollView,
    useToast,
} from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { api } from '@services/api';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { AppError } from '@utils/AppError';
import { ToastMessage } from '@components/ToastMessage';
import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = yup.InferType<typeof signUpSchema>;

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    password: yup
        .string()
        .required('Informe a senha.')
        .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    password_confirm: yup
        .string()
        .required('Confirme a senha.')
        .oneOf(
            [yup.ref('password'), ''],
            'A confirmação da senha não confere.',
        ),
});

export function SignUp() {
    const toast = useToast();
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const [isLoading, setIsLoading] = useState(false);
    const {signIn} = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema),
    });

    function handleGoBack() {
        navigation.navigate('signIn');
    }

    async function handleSignUp({ name, email, password }: FormDataProps) {
        try {
            setIsLoading(true);
            await api.post('/users', {
                name,
                email,
                password,
            });

            await signIn(email, password);


        } catch (error) {
            setIsLoading(false);
            const isAppError = error instanceof AppError;

            const title = isAppError
                ? error.message
                : 'Não foi possível criar a conta. Tente novamente mais tarde.';

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

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack flex={1}>
                <Image
                    w="$full"
                    h={624}
                    defaultSource={BackgroundImg}
                    source={BackgroundImg}
                    alt="Pessoas treinando"
                    position="absolute"
                />

                <VStack flex={1} px="$10" pb="$16">
                    <Center my="$24">
                        <Logo />
                        <Text color="$gray100" fontSize="$sm">
                            Treine sua mente e o seu corpo
                        </Text>
                    </Center>

                    <Center gap="$2" flex={1}>
                        <Heading color="$gray100">Crie sua conta</Heading>

                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nome"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="E-mail"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password_confirm"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Confirmar senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    value={value}
                                    returnKeyType="send"
                                    errorMessage={
                                        errors.password_confirm?.message
                                    }
                                />
                            )}
                        />

                        <Button
                            title="Criar e acessar"
                            onPress={handleSubmit(handleSignUp)}
                            isLoading={isLoading}
                        />
                    </Center>

                    <Button
                        variant="outline"
                        title="Voltar para o Login"
                        mt="$12"
                        onPress={handleGoBack}
                    />
                </VStack>
            </VStack>
        </ScrollView>
    );
}
