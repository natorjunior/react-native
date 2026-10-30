import React from 'react';
import { View, Text, Button } from 'react-native';

export default function DetalhesScreen({ route, navigation }) {
  const { nome, preco } = route.params;
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text>{nome}</Text>
      <Text>Preço: R$ {preco.toFixed(2)}</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
