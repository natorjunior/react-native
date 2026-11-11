import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function App() {
  const [apelido, setApelido] = useState('');

  return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64, gap: 16 }}>
      <Text style={{ fontSize: 26 }}>Meu apelido</Text>
      <TextInput
        accessibilityLabel="Apelido"
        placeholder="Digite seu apelido"
        value={apelido}
        onChangeText={setApelido}
        style={{ borderWidth: 1, borderColor: '#667', padding: 12 }}
      />
      <Text>Etapa 1: o texto está apenas na memória.</Text>
    </View>
  );
}
