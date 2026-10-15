import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';

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
  const [busca, setBusca] = useState('');
  const visiveis = tarefas.filter(item =>
    item.titulo.toLowerCase().includes(busca.toLowerCase())
  );
  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <Text style={{ padding: 16 }}>Minhas tarefas</Text>
      <TextInput
        value={busca} onChangeText={setBusca}
        placeholder="Buscar tarefa" style={{ padding: 16 }}
      />
      <ScrollView style={{ flex: 1 }}>
        {visiveis.length === 0 && <Text>Nenhuma tarefa.</Text>}
        {visiveis.map(item => (
          <Tarefa key={item.id} item={item}
            onToggle={() => alternar(item.id)} />
        ))}
      </ScrollView>
    </View>
  );
}
