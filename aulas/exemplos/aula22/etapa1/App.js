import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <View>
        <Text>Ana Silva</Text>
        <Text>Desenvolvedora mobile</Text>
      </View>
    </ScrollView>
  );
}

// Apenas posiciona o exemplo. O conteúdo do cartão ainda não tem estilos.
const styles = StyleSheet.create({
  tela: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 64 },
});
