import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [seguindo, setSeguindo] = useState(false);

  return (
    <ScrollView style={styles.fundo} contentContainerStyle={styles.tela}>
      <View style={styles.card}>
        <View style={styles.linha}>
          <View style={styles.avatar}>
            <Text style={styles.iniciais}>AS</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.titulo}>Ana Silva</Text>
            <Text style={styles.descricao}>Desenvolvedora mobile</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: seguindo }}
          onPress={() => setSeguindo((atual) => !atual)}
          style={[styles.botao, seguindo && styles.botaoAtivo]}
        >
          <Text style={styles.textoBotao}>{seguindo ? 'Seguindo' : 'Seguir'}</Text>
        </Pressable>
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
    padding: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe4e8',
    borderRadius: 16,
  },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e2f0ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iniciais: { color: '#087e72', fontSize: 20, fontWeight: '700' },
  info: { flex: 1 },
  titulo: { fontSize: 22, fontWeight: '700', color: '#172e3b' },
  descricao: { fontSize: 16, color: '#637681', marginTop: 4 },
  botao: {
    marginTop: 24,
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#087e72',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAtivo: { backgroundColor: '#172e3b' },
  textoBotao: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
