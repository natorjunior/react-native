import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@aula19/apelido';

export default function App() {
  const [apelido, setApelido] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE);
        if (ativo) setApelido(salvo ?? '');
      } catch {
        if (ativo) setMensagem('Não foi possível ler o apelido.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  async function salvar() {
    if (ocupado || carregando || !apelido.trim()) return;
    setOcupado(true);
    try {
      await AsyncStorage.setItem(CHAVE, apelido.trim());
      setApelido(apelido.trim());
      setMensagem('Apelido salvo. Feche e abra o app!');
    } catch {
      setMensagem('Não foi possível salvar. Tente novamente.');
    } finally {
      setOcupado(false);
    }
  }

  if (carregando) return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64 }}>
      <Text>Carregando preferências…</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64, gap: 16 }}>
      <Text style={{ fontSize: 26 }}>Meu apelido</Text>
      <TextInput
        accessibilityLabel="Apelido"
        placeholder="Digite seu apelido"
        value={apelido}
        onChangeText={setApelido}
        editable={!ocupado}
        style={{ borderWidth: 1, borderColor: '#667', padding: 12 }}
      />
      <Button title="Salvar" onPress={salvar}
        disabled={ocupado || !apelido.trim()} />
      <Text accessibilityLiveRegion="polite">{mensagem}</Text>
    </View>
  );
}
