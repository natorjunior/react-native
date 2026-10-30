import { View, Text, FlatList, Pressable, Button, Alert } from 'react-native';

const posts = [
  { id: '1', autor: 'Ana', texto: 'Bom dia, campus!', favorito: true },
  { id: '2', autor: 'Bruno', texto: 'Meu primeiro app!', favorito: false },
];

function FeedScreen() {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={{ padding: 20 }}
          onPress={() => Alert.alert(item.autor, item.texto)}
        >
          <Text>{item.autor}</Text>
          <Text>{item.texto}</Text>
        </Pressable>
      )}
    />
  );
}
export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <Text style={{ padding: 20 }}>Feed do campus</Text>
      <FeedScreen />
    </View>
  );
}
