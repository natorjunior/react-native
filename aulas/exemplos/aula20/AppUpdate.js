import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { initDB, updateUser, getById } from './db';

export default function App() {
  useEffect(() => {
    async function iniciar() {
      try {
        await initDB();
        const atualizado = await updateUser(
          1, 'João Silva'
        );
        console.log('Atualizado:', atualizado);
        console.log('Usuário:', await getById(1));
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
