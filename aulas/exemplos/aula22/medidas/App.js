import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [larguraPai, setLarguraPai] = useState(300);

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <Text style={styles.titulo}>Largura do pai: {larguraPai}</Text>
      <Text>Filho relativo: 50% de {larguraPai} = {larguraPai * 0.5}</Text>
      <Text>Filho fixo: sempre 120</Text>
      <View style={[styles.pai, { width: larguraPai }]}>
        <View style={styles.relativo}>
          <Text style={styles.rotulo}>50%</Text>
        </View>
        <View style={styles.fixo}>
          <Text style={styles.rotulo}>120</Text>
        </View>
      </View>
      <Button
        title={larguraPai === 300 ? 'Mudar pai para 200' : 'Mudar pai para 300'}
        onPress={() => setLarguraPai((atual) => atual === 300 ? 200 : 300)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // O posicionamento da demonstração será retomado no bloco de Flexbox.
  tela: { flexGrow: 1, paddingHorizontal: 12, paddingVertical: 64, gap: 20 },
  titulo: { fontSize: 22, fontWeight: '700', color: '#172e3b' },
  // Sem padding ou borda no pai, para isolar o cálculo da porcentagem.
  pai: { backgroundColor: '#e2f0ea', gap: 16 },
  relativo: { width: '50%', minHeight: 48, backgroundColor: '#087e72', padding: 12 },
  fixo: { width: 120, minHeight: 48, backgroundColor: '#172e3b', padding: 12 },
  rotulo: { color: '#ffffff', fontSize: 16 },
});
