import { useEffect, useRef, useState } from 'react';
import { Button, Text, View } from 'react-native';
import mqtt from 'mqtt/dist/mqtt.esm';
import { BROKER, TOPICO } from './config';
import estilos from './estilos';

export default function App() {
  const cliente = useRef(null);
  const [status, setStatus] = useState('Conectando…');
  const [mensagem, setMensagem] = useState('Nenhuma mensagem ainda.');

  useEffect(() => {
    let ativo = true;
    const client = mqtt.connect(BROKER, { resubscribe: false });
    cliente.current = client;

    client.on('connect', () => {
      client.subscribe(TOPICO);
      if (ativo) setStatus('Conectado');
    });
    client.on('message', (topico, payload) => {
      if (ativo && topico === TOPICO) setMensagem(payload.toString());
    });
    client.on('error', () => {
      if (ativo) setStatus('Erro de conexão');
    });
    client.on('close', () => {
      if (ativo) setStatus('Conectando…');
    });
    return () => {
      ativo = false;
      cliente.current = null;
      client.end(true);
    };
  }, []);

  function enviar() {
    if (cliente.current?.connected) {
      cliente.current.publish(TOPICO, 'Olá, MQTT!');
    }
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>MQTT básico</Text>
      <Text style={estilos.status}>{status}</Text>
      <Text style={estilos.legenda}>Última mensagem:</Text>
      <Text testID="mensagem" style={estilos.mensagem}>
        {mensagem}
      </Text>
      <Button
        title="Enviar Olá"
        onPress={enviar}
        disabled={status !== 'Conectado'}
        color="#087e72"
      />
    </View>
  );
}
