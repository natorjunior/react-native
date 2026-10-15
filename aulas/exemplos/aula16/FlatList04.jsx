import { useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';

const iniciais = [
  { id: '1', titulo: 'Estudar React', concluida: false },
  { id: '2', titulo: 'Praticar props', concluida: false },
  { id: '3', titulo: 'Revisar estado', concluida: false },
];

function Tarefa({ item, onToggle }) {
  return (
    <Pressable onPress={onToggle} style={{ padding: 16 }}>
      <Text>
        {item.concluida ? '✓ ' : '○ '}{item.titulo}
      </Text>
    </Pressable>
  );
}

export default function App() {
  const [tarefas, setTarefas] = useState(iniciais);
  function alternar(id) {
    setTarefas(atuais => atuais.map(item =>
      item.id === id
        ? { ...item, concluida: !item.concluida }
        : item
    ));
  }
  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <Text style={{ padding: 16 }}>Minhas tarefas</Text>
      <FlatList
        data={tarefas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Tarefa item={item} onToggle={() => alternar(item.id)} />
        )}
      />
    </View>
  );
}
