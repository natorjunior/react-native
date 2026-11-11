import { useEffect, useState } from 'react';
import { Button, Switch, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PERFIL = '@aula19/perfil';
const PADRAO = { apelido: '', tema: 'claro' };

function validarPerfil(valor) {
  return valor !== null && typeof valor === 'object'
    && typeof valor.apelido === 'string'
    && ['claro', 'escuro'].includes(valor.tema);
}

async function salvarPerfil(perfil) {
  const texto = JSON.stringify(perfil);
  await AsyncStorage.setItem(CHAVE_PERFIL, texto);
}

async function lerPerfil() {
  const texto = await AsyncStorage.getItem(CHAVE_PERFIL);
  if (texto === null) return { ...PADRAO };
  const perfil = JSON.parse(texto);
  if (!validarPerfil(perfil)) {
    throw new Error('Formato de perfil inválido.');
  }
  return perfil;
}

export default function App() {
  const [perfil, setPerfil] = useState({ ...PADRAO });
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const salvo = await lerPerfil();
        if (ativo) setPerfil(salvo);
      } catch {
        if (ativo) setMensagem('Não foi possível ler o perfil. Você pode restaurar o padrão.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  async function salvar() {
    if (ocupado || carregando || !perfil.apelido.trim()) return;
    setOcupado(true);
    try {
      const atualizado = { ...perfil, apelido: perfil.apelido.trim() };
      await salvarPerfil(atualizado);
      setPerfil(atualizado);
      setMensagem('Perfil salvo. Reabra para recuperar apelido e tema.');
    } catch {
      setMensagem('Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setOcupado(false);
    }
  }

  async function restaurarPadrao() {
    if (ocupado || carregando) return;
    setOcupado(true);
    try {
      await AsyncStorage.removeItem(CHAVE_PERFIL);
      setPerfil({ ...PADRAO });
      setMensagem('Perfil removido. Valores padrão restaurados.');
    } catch {
      setMensagem('Não foi possível restaurar. Tente novamente.');
    } finally {
      setOcupado(false);
    }
  }

  if (carregando) return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64 }}>
      <Text>Carregando perfil…</Text>
    </View>
  );

  const escuro = perfil.tema === 'escuro';
  const corTexto = escuro ? '#f4f6f8' : '#172a39';

  return (
    <View style={{ flex: 1, padding: 32, paddingTop: 64, gap: 16,
      backgroundColor: escuro ? '#172a39' : '#f4f6f8' }}>
      <Text style={{ fontSize: 26, color: corTexto }}>Meu perfil</Text>
      <TextInput
        accessibilityLabel="Apelido"
        placeholder="Digite seu apelido"
        placeholderTextColor={escuro ? '#a9bac6' : '#536875'}
        value={perfil.apelido}
        onChangeText={apelido => setPerfil(atual => ({ ...atual, apelido }))}
        editable={!ocupado}
        style={{ color: corTexto, borderWidth: 1, borderColor: corTexto, padding: 12 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={{ color: corTexto }}>Tema escuro</Text>
        <Switch
          accessibilityLabel="Tema escuro"
          value={escuro}
          onValueChange={valor => setPerfil(atual => ({
            ...atual, tema: valor ? 'escuro' : 'claro',
          }))}
          disabled={ocupado}
        />
      </View>
      <Button title="Salvar perfil" onPress={salvar}
        disabled={ocupado || !perfil.apelido.trim()} />
      <Button title="Restaurar padrão" onPress={restaurarPadrao} disabled={ocupado} />
      <Text accessibilityLiveRegion="polite" style={{ color: corTexto }}>{mensagem}</Text>
    </View>
  );
}
