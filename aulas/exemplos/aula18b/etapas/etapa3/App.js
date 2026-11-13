import { Button, Text, View }
  from 'react-native';
import { publish } from './mqttService';
import estilos from './estilos';

export default function App() {
  return (
    <View style={estilos.tela}>
      <Text>MQTT básico</Text>
      <Button title="Enviar Olá" onPress={() => {
        publish('Olá, MQTT!');
      }} />
    </View>
  );
}
