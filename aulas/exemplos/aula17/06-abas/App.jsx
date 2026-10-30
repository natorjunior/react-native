import { View, Text, FlatList, Pressable, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const posts = [
  { id: '1', autor: 'Ana', texto: 'Bom dia, campus!', favorito: true },
  { id: '2', autor: 'Bruno', texto: 'Meu primeiro app!', favorito: false },
];

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function FeedScreen({ navigation }) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={{ padding: 20 }}
          onPress={() => navigation.navigate('Detalhes', { postId: item.id })}
        >
          <Text>{item.autor}</Text>
          <Text>{item.texto}</Text>
        </Pressable>
      )}
    />
  );
}

function DetalhesScreen({ route, navigation }) {
  const post = posts.find((item) => item.id === route.params?.postId);
  if (!post) return <Text>Post não encontrado.</Text>;
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>{post.autor}</Text>
      <Text>{post.texto}</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

function FavoritosScreen() {
  return (
    <FlatList
      data={posts.filter((post) => post.favorito)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text style={{ padding: 20 }}>{item.texto}</Text>
      )}
    />
  );
}

function FeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#112632' },
        headerTintColor: '#f0f6f5',
      }}
    >
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen
        name="Detalhes"
        component={DetalhesScreen}
        options={({ route }) => ({ title: `Post ${route.params.postId}` })}
      />
    </Stack.Navigator>
  );
}

function CampusTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Inicio"
        component={FeedStack}
        options={{ title: 'Feed' }}
      />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <CampusTabs />
    </NavigationContainer>
  );
}
