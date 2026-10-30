import { View, Text, FlatList, Pressable, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const posts = [
  { id: '1', autor: 'Ana', texto: 'Bom dia, campus!', favorito: true },
  { id: '2', autor: 'Bruno', texto: 'Meu primeiro app!', favorito: false },
];

const Stack = createNativeStackNavigator();

function FeedScreen({ navigation }) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={{ padding: 20 }}
          onPress={() => navigation.navigate('Detalhes')}
        >
          <Text>{item.autor}</Text>
          <Text>{item.texto}</Text>
        </Pressable>
      )}
    />
  );
}

function DetalhesScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>Aqui vamos mostrar um post.</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
