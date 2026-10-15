import { View, Text, ScrollView } from 'react-native';

const tarefas = [
  { id: '1', titulo: 'Estudar React', concluida: false },
  { id: '2', titulo: 'Praticar props', concluida: false },
  { id: '3', titulo: 'Revisar estado', concluida: false },
];

function Tarefa({ item }) {
  return (
    <View style={{ padding: 16 }}>
      <Text>{item.titulo}</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 48 }}>
      <Text>Minhas tarefas</Text>
      <ScrollView style={{ flex: 1 }}>
        {tarefas.map(item => (
          <Tarefa key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}
