import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../estilos';

export default function ListaNotas({ navigation, notas }) {
  return (
    <SafeAreaView style={styles.tela} edges={['bottom', 'left', 'right']}>
      <View style={styles.conteiner}>
        <View style={styles.cabecalho}>
          <Text style={styles.contador}>{notas.length} nota(s)</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Criar nova nota"
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={() => navigation.navigate('Editor')}>
            <Text style={styles.textoBotao}>+ Nova nota</Text>
          </Pressable>
        </View>
        <FlatList
          data={notas}
          keyExtractor={(nota) => nota.id}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhuma nota ainda. Crie a primeira!</Text>}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" accessibilityLabel={`Editar nota: ${item.titulo}`}
              onPress={() => navigation.navigate('Editor', { notaId: item.id })}
              style={({ pressed }) => [styles.card, pressed && styles.pressionado]}>
              <Text style={styles.tituloNota} numberOfLines={2}>{item.titulo}</Text>
              <Text style={styles.resumo} numberOfLines={2}>{item.conteudo}</Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
