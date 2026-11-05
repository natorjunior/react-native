import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import mqtt from 'mqtt/dist/mqtt.esm';
import { BROKER, TOPICO } from './config';
import estilos from './estilos';

export default function Passo2Receber() {
  const [status, setStatus] = useState('Conectando…');
  const [mensagem, setMensagem] = useState('Nenhuma mensagem ainda.');

  useEffect(() => {
    let ativo = true;
    const client = mqtt.connect(BROKER, { resubscribe: false });
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
      client.end(true);
    };
  }, []);

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>2. Receber</Text>
      <Text style={estilos.status}>{status}</Text>
      <Text style={estilos.legenda}>Última mensagem:</Text>
      <Text testID="mensagem" style={estilos.mensagem}>
        {mensagem}
      </Text>
    </View>
  );
}
