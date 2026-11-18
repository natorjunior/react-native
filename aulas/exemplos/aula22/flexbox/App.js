import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [direcao, setDirecao] = useState('column');

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <View style={[styles.area, { flexDirection: direcao }]}>
        {[1, 2, 3].map((numero) => (
          <View key={numero} style={styles.bloco}>
            <Text style={styles.numero}>{numero}</Text>
          </View>
        ))}
      </View>
      <Button title={direcao === 'column' ? 'Mudar para linha' : 'Mudar para coluna'}
        onPress={() => setDirecao((atual) => atual === 'column' ? 'row' : 'column')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 64,
    gap: 24,
  },
  area: {
    width: '100%',
    maxWidth: 360,
    height: 280,
    backgroundColor: '#e2f0ea',
    padding: 16,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloco: {
    width: 48,
    height: 48,
    backgroundColor: '#087e72',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numero: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
});
