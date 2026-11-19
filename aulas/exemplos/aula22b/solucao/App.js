import { useRef, useState } from 'react';
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
    if (nota.id) {
      setNotas((atuais) => atuais.map((item) => item.id === nota.id ? nota : item));
    } else {
      const nova = { ...nota, id: String(proximoId.current++) };
      setNotas((atuais) => [nova, ...atuais]);
    }
    return true;
  }

  function excluirNota(id) {
    setNotas((atuais) => atuais.filter((nota) => nota.id !== id));
    return true;
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
