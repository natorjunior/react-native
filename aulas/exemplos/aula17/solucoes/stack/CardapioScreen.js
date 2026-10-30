import React from 'react';
import { View, Text, Button } from 'react-native';

export default function CardapioScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text>Escolha um lanche:</Text>
      <Button
        title="Ver cuscuz"
        onPress={() => navigation.navigate('Detalhes', {
          nome: 'Cuscuz', preco: 5,
        })}
      />
      <Button
        title="Ver tapioca"
        onPress={() => navigation.navigate('Detalhes', {
          nome: 'Tapioca', preco: 7,
        })}
      />
    </View>
  );
}
