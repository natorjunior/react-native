import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { initDB, getById } from './db';

export default function App() {
  useEffect(() => {
    async function iniciar() {
      try {
        await initDB();
        const usuario = await getById(1);
        console.log('Usuário:', usuario);
      } catch (error) {
        console.error('Erro no banco:', error);
      }
    }
    iniciar();
  }, []);
  return (
    <View>
      <Text>Meu aplicativo</Text>
    </View>
  );
}
