import { View, Text } from 'react-native';

const tarefas = ['Estudar React', 'Praticar props', 'Revisar estado'];

export default function App() {
  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 48 }}>
      <Text>Minhas tarefas</Text>
      {tarefas.map(titulo => (
        <Text key={titulo}>{titulo}</Text>
      ))}
    </View>
  );
}
