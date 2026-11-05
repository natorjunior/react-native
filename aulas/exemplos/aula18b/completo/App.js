import { useEffect, useRef, useState } from 'react';
import { Button, FlatList, Text, View }
  from 'react-native';
import mqtt from 'mqtt';
const BROKER = 'wss://mqtt.acilab.com.br';
const TOPICO = 'ufc-quixada/aula18b/dupla07';

export default function App() {
  const cliente = useRef(null);
  const [conectado, setConectado] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  useEffect(() => {
    const client = mqtt.connect(BROKER);
    cliente.current = client;
    client.on('connect', () => {
      client.subscribe(TOPICO);
      setConectado(true);
    });
    client.on('message', (_, payload) => {
      setMensagens(lista =>
        [...lista, payload.toString()]);
    });
    client.on('close', () => setConectado(false));
    client.on('error', () => setConectado(false));
    return () => client.end(true);
  }, []);

  function enviar() {
    if (cliente.current?.connected) {
      cliente.current.publish(TOPICO, 'Olá, MQTT!');
    }
  }
  return (
    <View style={{ flex: 1, padding: 32,
      paddingTop: 60 }}>
      <Text>
        {conectado ? 'Conectado' : 'Desconectado'}
      </Text>
      <FlatList
        style={{ flex: 1 }}
        data={mensagens}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <Text>{item}</Text>
        )}
      />
      <Button title="Enviar Olá" onPress={enviar}
        disabled={!conectado} />
    </View>
  );
}
