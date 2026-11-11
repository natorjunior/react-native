import { useState } from 'react';
import { Button, Text, View } from 'react-native';

const TOKEN_DEMO = 'token-ficticio-da-aula';

export default function App() {
  const [token, setToken] = useState(null);

  function entrar() {
    setToken(TOKEN_DEMO);
  }

  return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64, gap: 16 }}>
      <Text style={{ fontSize: 26 }}>Sessão de demonstração</Text>
      <Text>{token ? 'Sessão apenas na memória' : 'Sem sessão local'}</Text>
      <Button title="Simular entrada" onPress={entrar} />
      <Text>Etapa 1: o token fictício some ao reiniciar.</Text>
    </View>
  );
}
