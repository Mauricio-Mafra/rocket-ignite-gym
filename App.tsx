import { StatusBar } from 'react-native';
import {
    useFonts,
    Roboto_400Regular,
    Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';
import { Routes } from '@routes/index';
import { Loading } from '@components/Loading';
import { AuthContext } from '@contexts/AuthContext';

export default function App() {
    const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
    return (
        <GluestackUIProvider config={config}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <AuthContext.Provider
                value={{
                    user: {
                        id: '1',
                        name: 'Mauricio Mafra',
                        email: 'mauricio@email.com',
                        avatar: 'mauricio.png',
                    },
                }}
            >
                {fontsLoaded ? <Routes /> : <Loading />}
            </AuthContext.Provider>
        </GluestackUIProvider>
    );
}
