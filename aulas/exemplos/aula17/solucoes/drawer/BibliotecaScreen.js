import React from 'react';
import { View, Text } from 'react-native';

export default function BibliotecaScreen() {
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text>Biblioteca</Text>
      <Text>Horário fictício: segunda a sexta, das 8h às 18h.</Text>
    </View>
  );
}
