import { View, Text, FlatList } from 'react-native';

const iniciais = [
  { id: '1', titulo: 'Estudar React', concluida: false },
  { id: '2', titulo: 'Praticar props', concluida: false },
  { id: '3', titulo: 'Revisar estado', concluida: false },
];

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <FlatList
        data={iniciais}
        renderItem={({ item }) => <Text>{item.titulo}</Text>}
      />
    </View>
  );
}
