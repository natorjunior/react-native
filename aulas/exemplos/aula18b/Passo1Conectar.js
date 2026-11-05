import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import mqtt from 'mqtt/dist/mqtt.esm';
import { BROKER } from './config';
import estilos from './estilos';

export default function Passo1Conectar() {
  const [status, setStatus] = useState('Conectando…');

  useEffect(() => {
    let ativo = true;
    const client = mqtt.connect(BROKER);
    client.on('connect', () => {
      if (ativo) setStatus('Conectado');
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
      <Text style={estilos.titulo}>1. Conectar</Text>
      <Text style={estilos.status}>{status}</Text>
    </View>
  );
}
