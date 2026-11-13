import { useEffect, useState } from 'react';
import { Button, Text, View }
  from 'react-native';
import { publish, subscribe } from './mqttService';
import estilos from './estilos';

export default function App() {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    return subscribe(setMensagem);
  }, []);
  return (
    <View style={estilos.tela}>
      <Text>MQTT básico</Text>
      <Text>{mensagem || 'Aguardando…'}</Text>
      <Button title="Enviar Olá" onPress={() => {
        publish('Olá, MQTT!');
      }} />
    </View>
  );
}
