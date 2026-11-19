import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import styles from '../estilos';

export default function EditorNota({ navigation, route, notas, onSalvar, onExcluir }) {
  const nota = notas.find((item) => item.id === route.params?.notaId);
  const [titulo, setTitulo] = useState(nota?.titulo ?? '');
  const [conteudo, setConteudo] = useState(nota?.conteudo ?? '');
  const [erro, setErro] = useState('');
  const alturaCabecalho = useHeaderHeight();

  function salvar() {
    if (!titulo.trim() || !conteudo.trim()) {
      setErro('Preencha o título e o conteúdo.');
      return;
    }
    const salvou = onSalvar({ id: nota?.id, titulo: titulo.trim(), conteudo: conteudo.trim() });
    if (salvou) navigation.goBack();
  }

  function confirmarExclusao() {
    Alert.alert('Excluir nota?', 'Esta ação remove a nota da lista.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => {
        if (onExcluir(nota.id)) navigation.goBack();
      } },
    ]);
  }

  return (
    <SafeAreaView style={styles.tela} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flexivel}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={alturaCabecalho}>
        <ScrollView contentContainerStyle={styles.formulario} keyboardShouldPersistTaps="handled">
          <Text style={styles.rotulo}>Título</Text>
          <TextInput accessibilityLabel="Título da nota" style={styles.campo}
            placeholder="Ex.: Ideias para o projeto" placeholderTextColor="#637681"
            value={titulo} onChangeText={setTitulo} />
          <Text style={styles.rotulo}>Conteúdo</Text>
          <TextInput accessibilityLabel="Conteúdo da nota" style={[styles.campo, styles.campoConteudo]}
            placeholder="Escreva sua nota..." placeholderTextColor="#637681"
            value={conteudo} onChangeText={setConteudo} multiline textAlignVertical="top" />
          {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}
          <View style={styles.acoes}>
            <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}
              style={({ pressed }) => [styles.botao, styles.botaoSecundario, styles.acao, pressed && styles.pressionado]}>
              <Text style={styles.textoSecundario}>Cancelar</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={salvar}
              style={({ pressed }) => [styles.botao, styles.acao, pressed && styles.pressionado]}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </Pressable>
          </View>
          {nota ? (
            <Pressable accessibilityRole="button" onPress={confirmarExclusao}
              style={({ pressed }) => [styles.botao, styles.botaoExcluir, pressed && styles.pressionado]}>
              <Text style={styles.textoExcluir}>Excluir nota</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
