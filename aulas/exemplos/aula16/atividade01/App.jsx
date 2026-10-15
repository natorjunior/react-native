import { View, Text, FlatList } from 'react-native';

const produtos = [
  { id: '1', nome: 'Caderno', preco: 18.90 },
  { id: '2', nome: 'Caneta', preco: 3.50 },
  { id: '3', nome: 'Lápis', preco: 2.00 },
  { id: '4', nome: 'Borracha', preco: 1.50 },
  { id: '5', nome: 'Mochila', preco: 129.90 },
  { id: '6', nome: 'Estojo', preco: 24.90 },
  { id: '7', nome: 'Agenda', preco: 32.00 },
  { id: '8', nome: 'Régua', preco: 4.00 },
  { id: '9', nome: 'Marcador', preco: 6.50 },
  { id: '10', nome: 'Garrafa', preco: 39.90 },
];

function ProdutoItem({ item }) {
  return (
    <View style={{ padding: 16 }}>
      <Text>{item.nome}</Text>
      <Text>R$ {item.preco.toFixed(2)}</Text>
    </View>
  );
}

export default function App() {
  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24, paddingTop: 48 }}
      data={produtos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ProdutoItem item={item} />}
      ListEmptyComponent={<Text>Nenhum produto cadastrado</Text>}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: '#ddd' }} />
      )}
    />
  );
}
