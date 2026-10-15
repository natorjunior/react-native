import { useContext, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NotasContext } from './NotasContext';

export default function App() {
  const [notas, setNotas] = useState(['Estudar React']);

  function adicionarNota(texto) {
    setNotas(atuais => [...atuais, texto]);
  }

  return (
    <NotasContext.Provider value={{ notas, adicionarNota }}>
      <View style={styles.app}>
        <View style={styles.caderno}>
          <Text style={styles.kicker}>MEU CADERNO</Text>
          <Text style={styles.titulo}>Minhas notas</Text>
          <FormularioNota />
          <ResumoNotas />
          <ListaNotas />
        </View>
      </View>
    </NotasContext.Provider>
  );
}

function FormularioNota() {
  // O rascunho interessa apenas ao formulário: seu estado fica aqui.
  const [texto, setTexto] = useState('');
  const { adicionarNota } = useContext(NotasContext);

  function salvarNota() {
    const conteudo = texto.trim();
    if (!conteudo) return;

    adicionarNota(conteudo);
    setTexto('');
  }

  return (
    <View style={styles.formulario}>
      <TextInput
        accessibilityLabel="Nova nota"
        placeholder="Escreva uma ideia…"
        placeholderTextColor="#637380"
        value={texto}
        onChangeText={setTexto}
        onSubmitEditing={salvarNota}
        returnKeyType="done"
        maxLength={80}
        style={styles.input}
      />
      <Button title="Adicionar" onPress={salvarNota} color="#087e72" />
    </View>
  );
}

function ListaNotas() {
  const { notas } = useContext(NotasContext);

  return (
    <ScrollView style={styles.lista} keyboardShouldPersistTaps="handled">
      {notas.map((nota, indice) => (
        <View key={indice} style={styles.nota}>
          <Text style={styles.textoNota}>{nota}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// Solução da atividade 03: mais um leitor do mesmo contexto.
function ResumoNotas() {
  const { notas } = useContext(NotasContext);
  return <Text style={styles.resumo}>Total: {notas.length}</Text>;
}

// Esta lista só acrescenta ao final. Para excluir ou reordenar, use notas com
// identificadores estáveis como key. As notas ficam em memória nesta aula.
const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#f4f5f7', paddingTop: 64, paddingBottom: 28 },
  caderno: { flex: 1, paddingHorizontal: 28, maxWidth: 480, width: '100%', alignSelf: 'center' },
  kicker: { fontSize: 12, fontWeight: '600', letterSpacing: 2, color: '#637380', marginBottom: 12 },
  titulo: { fontSize: 32, fontWeight: '600', color: '#182938', marginBottom: 24 },
  formulario: { marginBottom: 20, gap: 12 },
  input: { borderWidth: 1, borderColor: '#d9e1e5', borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#182938' },
  resumo: { fontSize: 14, color: '#087e72', marginBottom: 18 },
  lista: { flex: 1 },
  nota: { padding: 20, borderRadius: 16, backgroundColor: '#fff4d6', borderWidth: 1, borderColor: '#eadbb3', marginBottom: 12 },
  textoNota: { fontSize: 18, lineHeight: 26, color: '#514632' },
});
