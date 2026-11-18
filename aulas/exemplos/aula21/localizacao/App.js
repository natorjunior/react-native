import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function localizar() {
    setLatitude('');
    setLongitude('');
    setMensagem('');
    try {
      const permissao =
        await Location.requestForegroundPermissionsAsync();
      if (!permissao.granted) {
        setMensagem('Permissão negada.');
        return;
      }

      const ativa = await Location.hasServicesEnabledAsync();
      if (!ativa) {
        setMensagem('Ative a localização do aparelho.');
        return;
      }

      const resultado = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLatitude(resultado.coords.latitude);
      setLongitude(resultado.coords.longitude);
    } catch {
      setMensagem('Não foi possível localizar.');
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 64 }}>
      <Button title="Obter localização" onPress={localizar} />
      <Text>{mensagem}</Text>
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
    </View>
  );
}
