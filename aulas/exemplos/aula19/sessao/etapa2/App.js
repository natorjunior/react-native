import { useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const CHAVE_TOKEN = 'aula19.token';
// Valor fictício: este exemplo ensina armazenamento, sem autenticação real.
const TOKEN_DEMO = 'token-ficticio-da-aula';

export default function App() {
  const [token, setToken] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function entrar() {
    if (ocupado || Platform.OS === 'web') return;
    setOcupado(true);
    try {
      await SecureStore.setItemAsync(CHAVE_TOKEN, TOKEN_DEMO);
      setToken(TOKEN_DEMO);
      setMensagem('Sessão fictícia salva. Feche e abra o app!');
    } catch {
      setMensagem('Não foi possível salvar a sessão.');
    } finally {
      setOcupado(false);
    }
  }

  if (Platform.OS === 'web') return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64 }}>
      <Text>Execute este exemplo no Android ou iOS pelo Expo Go.</Text>
    </View>
  );
  return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64, gap: 16 }}>
      <Text style={{ fontSize: 26 }}>Sessão de demonstração</Text>
      <Text>{token ? 'Sessão local encontrada' : 'Sem sessão local'}</Text>
      <Button title="Simular entrada" onPress={entrar}
        disabled={ocupado || token !== null} />
      <Text accessibilityLiveRegion="polite">{mensagem}</Text>
    </View>
  );
}
