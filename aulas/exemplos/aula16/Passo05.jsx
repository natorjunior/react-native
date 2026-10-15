import { View, Text, ScrollView } from 'react-native';

const tarefas = [
  { id: '1', titulo: 'Estudar React', concluida: false },
  { id: '2', titulo: 'Praticar props', concluida: false },
  { id: '3', titulo: 'Revisar estado', concluida: false },
];

export default function App() {
  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 48 }}>
      <Text>Minhas tarefas</Text>
      <ScrollView style={{ flex: 1 }}>
        {tarefas.map(item => (
          <Text key={item.id}>{item.titulo}</Text>
        ))}
      </ScrollView>
    </View>
  );
}
