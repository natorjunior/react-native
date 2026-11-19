import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <View style={styles.card}>
        <Text style={styles.destaque}>Nome</Text>
        <View style={styles.info}>
          {/* Acrescente style={styles.destaque} para destacar este descendente. */}
          <Text>Descrição</Text>
        </View>
        <Text style={styles.destaque}>Rodapé</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flexGrow: 1, padding: 24, paddingVertical: 64 },
  card: { padding: 24, borderWidth: 1, borderColor: '#637681', borderRadius: 16 },
  info: { padding: 16, marginVertical: 16, backgroundColor: '#e2f0ea' },
  // Estilo aplicado explicitamente: o nome não é um seletor CSS.
  destaque: { color: '#087e72', fontSize: 24, fontWeight: '700' },
});
