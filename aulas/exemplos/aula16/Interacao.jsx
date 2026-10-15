import { View, Text, ScrollView, Pressable } from 'react-native';

const tarefas = [
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
  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 48 }}>
      <Text>Minhas tarefas</Text>
      <ScrollView style={{ flex: 1 }}>
        {tarefas.map(item => (
          <Tarefa key={item.id} item={item}
            onToggle={() => alert(item.titulo)} />
        ))}
      </ScrollView>
    </View>
  );
}
