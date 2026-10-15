import { useState, useRef } from 'react';
import { View, Text, TextInput, Button, Pressable, FlatList } from 'react-native';

const iniciais = [
  { id: '1', titulo: 'Estudar React', concluida: false },
  { id: '2', titulo: 'Praticar props', concluida: false },
  { id: '3', titulo: 'Revisar estado', concluida: false },
];

function TarefaItem({ item, onAlternar, onRemover }) {
  return (
    <View style={{ flexDirection: 'row', padding: 12 }}>
      <Pressable style={{ flex: 1 }} onPress={onAlternar}>
        <Text>{item.concluida ? '✓ ' : '○ '}{item.titulo}</Text>
      </Pressable>
      <Button title="Remover" onPress={onRemover} />
    </View>
  );
}

export default function App() {
  const [tarefas, setTarefas] = useState(iniciais);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('Todas');
  const proximoId = useRef(4);

  function adicionar() {
    const titulo = texto.trim();
    if (!titulo) return;
    const nova = {
      id: String(proximoId.current),
      titulo,
      concluida: false,
    };
    proximoId.current += 1;
    setTarefas(atuais => [...atuais, nova]);
    setTexto('');
  }

  function alternar(id) {
    setTarefas(atuais => atuais.map(tarefa =>
      tarefa.id === id
        ? { ...tarefa, concluida: !tarefa.concluida }
        : tarefa
    ));
  }
  function remover(id) {
    setTarefas(atuais => atuais.filter(tarefa => tarefa.id !== id));
  }

  const visiveis = tarefas.filter(tarefa => {
    if (filtro === 'Pendentes') return !tarefa.concluida;
    if (filtro === 'Concluídas') return tarefa.concluida;
    return true;
  });

  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 48 }}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Nova tarefa"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12 }}
      />
      <Button title="Adicionar" onPress={adicionar} />
      <View style={{ flexDirection: 'row' }}>
        <Button title="Todas" onPress={() => setFiltro('Todas')} />
        <Button title="Pendentes" onPress={() => setFiltro('Pendentes')} />
        <Button title="Concluídas" onPress={() => setFiltro('Concluídas')} />
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={visiveis}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TarefaItem
            item={item}
            onAlternar={() => alternar(item.id)}
            onRemover={() => remover(item.id)}
          />
        )}
        ListEmptyComponent={<Text>Nenhuma tarefa neste filtro.</Text>}
      />
    </View>
  );
}
