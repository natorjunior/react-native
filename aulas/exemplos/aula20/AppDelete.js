import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { initDB, deleteUser, getById } from './db';

export default function App() {
  useEffect(() => {
    async function iniciar() {
      try {
        await initDB();
        const deletado = await deleteUser(1);
        console.log('Deletado:', deletado);
        console.log('Após excluir:', await getById(1));
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
