import { View, Text, Pressable, Button } from 'react-native';

export default function TarefaItem({ item, onAlternar, onRemover }) {
  return (
    <View style={{ flexDirection: 'row', padding: 12 }}>
      <Pressable style={{ flex: 1 }} onPress={onAlternar}>
        <Text>{item.concluida ? '✓ ' : '○ '}{item.titulo}</Text>
      </Pressable>
      <Button title="Remover" onPress={onRemover} />
    </View>
  );
}
