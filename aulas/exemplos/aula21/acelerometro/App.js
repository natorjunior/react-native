import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [dados, setDados] = useState({ x: 0, y: 0, z: 0 });
  const [lendo, setLendo] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (lendo === false) return;
    Accelerometer.setUpdateInterval(300);
    const assinatura = Accelerometer.addListener(setDados);
    return () => assinatura.remove();
  }, [lendo]);

  async function iniciar() {
    setMensagem('');
    try {
      const permissao = await Accelerometer.requestPermissionsAsync();
      if (permissao.granted === false) {
        setMensagem('Permissão negada.');
        return;
      }
      const disponivel = await Accelerometer.isAvailableAsync();
      if (disponivel === false) {
        setMensagem('Sensor indisponível.');
        return;
      }
      setLendo(true);
    } catch {
      setMensagem('Não foi possível iniciar o sensor.');
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 64 }}>
      <Button title="Iniciar" onPress={iniciar} disabled={lendo} />
      <Button title="Parar" onPress={() => setLendo(false)}
        disabled={lendo === false} />
      <Text>{mensagem}</Text>
      <Text>x: {dados.x} g</Text>
      <Text>y: {dados.y} g</Text>
      <Text>z: {dados.z} g</Text>
    </View>
  );
}
