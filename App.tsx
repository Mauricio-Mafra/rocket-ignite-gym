
import { StatusBar, View } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { GluestackUIProvider, Text } from '@gluestack-ui/themed';

export default function App() {
  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});
  return (
    <GluestackUIProvider>
      <View style={{flex: 1, backgroundColor: '#202024', alignItems: 'center',justifyContent: 'center'}}>

        <StatusBar 
          barStyle='light-content' 
          backgroundColor='transparent'
          translucent
          />

        {fontsLoaded ? <Text>Home</Text> : <View/>}
      </View>
    </GluestackUIProvider>
  );
}
