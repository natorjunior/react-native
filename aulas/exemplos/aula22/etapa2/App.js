import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.fundo} contentContainerStyle={styles.tela}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Ana Silva</Text>
        <Text style={styles.descricao}>Desenvolvedora mobile</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fundo: { backgroundColor: '#f4f6f8' },
  tela: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    padding: 24,
    borderWidth: 1,
    borderColor: '#dbe4e8',
    borderRadius: 16,
  },
  titulo: { fontSize: 24, fontWeight: '700', color: '#172e3b' },
  descricao: { fontSize: 16, color: '#637681', marginTop: 8 },
});
