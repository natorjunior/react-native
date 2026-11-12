import { openDatabaseAsync } from 'expo-sqlite';

let conexao;

export function abrirBanco() {
  if (!conexao) {
    conexao = openDatabaseAsync('aula20.db').catch(erro => {
      conexao = undefined;
      throw erro;
    });
  }
  return conexao;
}
