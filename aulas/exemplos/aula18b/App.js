import { useEffect, useState } from 'react';
import { Button, FlatList, Text, View }
  from 'react-native';
import { publish, subscribe } from './mqttService';
import estilos from './estilos';

export default function App() {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    return subscribe(texto => {
      setMensagens(lista => [...lista, texto]);
    });
  }, []);
  return (
    <View style={estilos.tela}>
      <Text>MQTT básico</Text>
      <FlatList
        data={mensagens}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <Text>{item}</Text>
        )}
      />
      <Button title="Enviar Olá" onPress={() => {
        publish('Olá, MQTT!');
      }} />
    </View>
  );
}
