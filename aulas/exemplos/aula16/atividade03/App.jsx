import { useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { TarefasContext, TarefasProvider } from './TarefasContext';
import TarefaItem from './TarefaItem';

function ResumoTarefas() {
  const { tarefas } = useContext(TarefasContext);
  const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
  return (
    <Text style={{ padding: 12 }}>
      Concluídas: {concluidas} de {tarefas.length}
    </Text>
  );
}

function ListaTarefas() {
  const { tarefas, adicionar, alternar, remover } = useContext(TarefasContext);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  const visiveis = tarefas.filter(tarefa => {
    if (filtro === 'Pendentes') return !tarefa.concluida;
    if (filtro === 'Concluídas') return tarefa.concluida;
    return true;
  });

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Nova tarefa"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12 }}
      />
      <Button title="Adicionar" onPress={() => {
        adicionar(texto);
        setTexto('');
      }} />
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

export default function App() {
  return (
    <TarefasProvider>
      <View style={{ flex: 1, paddingTop: 48 }}>
        <ResumoTarefas />
        <ListaTarefas />
      </View>
    </TarefasProvider>
  );
}
