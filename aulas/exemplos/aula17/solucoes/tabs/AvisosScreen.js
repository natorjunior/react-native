import React from 'react';
import { View, Text } from 'react-native';

export default function AvisosScreen() {
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text>Avisos do campus</Text>
      <Text>Biblioteca aberta até as 18h.</Text>
      <Text>Monitoria de programação às 14h.</Text>
    </View>
  );
}
