import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ListaNotas from './telas/ListaNotas';
import EditorNota from './telas/EditorNota';

const Stack = createNativeStackNavigator();
const notasIniciais = [
  { id: '1', titulo: 'Ideias para o projeto', conteudo: 'Criar um app simples com duas telas.' },
  { id: '2', titulo: 'Revisar estilos', conteudo: 'Praticar padding, margin, bordas e Flexbox.' },
];

export default function App() {
  // Uma única lista, compartilhada pelas duas telas. Reiniciar restaura os exemplos.
  const [notas, setNotas] = useState(notasIniciais);
  const proximoId = useRef(3);

  function salvarNota(nota) {
    // TODO 1: se houver id, atualize com map; senão, crie um id com
    // String(proximoId.current++) e acrescente a nota sem alterar o array original.
    // Retorne true apenas depois de atualizar a lista.
    Alert.alert('Sua vez', 'Implemente salvarNota em App.js.');
    return false;
  }

  function excluirNota(id) {
    // TODO 2: remova pelo id com filter, atualize o estado e retorne true.
    Alert.alert('Sua vez', 'Implemente excluirNota em App.js.');
    return false;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTintColor: '#087e72' }}>
          <Stack.Screen name="Notas" options={{ title: 'Minhas notas' }}>
            {(props) => <ListaNotas {...props} notas={notas} />}
          </Stack.Screen>
          <Stack.Screen name="Editor" options={({ route }) => ({
            title: route.params?.notaId ? 'Editar nota' : 'Nova nota',
          })}>
            {(props) => (
              <EditorNota {...props} notas={notas}
                onSalvar={salvarNota} onExcluir={excluirNota} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
