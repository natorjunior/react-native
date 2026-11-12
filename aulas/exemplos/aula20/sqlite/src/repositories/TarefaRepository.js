import { abrirBanco } from '../database/conexao';

export async function inicializar() {
  const db = await abrirBanco();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL CHECK(length(trim(titulo)) > 0),
      concluida INTEGER NOT NULL DEFAULT 0 CHECK(concluida IN (0, 1))
    );
  `);
}

export async function listar() {
  const db = await abrirBanco();
  return db.getAllAsync(
    'SELECT id, titulo, concluida FROM tarefas ORDER BY id DESC'
  );
}

export async function adicionar(titulo) {
  if (!titulo.trim()) throw new Error('Informe um título.');
  const db = await abrirBanco();
  const resultado = await db.runAsync(
    'INSERT INTO tarefas (titulo) VALUES (?)', titulo.trim()
  );
  return resultado.lastInsertRowId;
}

export async function atualizar(id, concluida) {
  if (![0, 1].includes(concluida)) throw new Error('Status inválido.');
  const db = await abrirBanco();
  const resultado = await db.runAsync(
    'UPDATE tarefas SET concluida = ? WHERE id = ?', concluida, id
  );
  if (resultado.changes !== 1) throw new Error('Tarefa não encontrada.');
}

export async function excluir(id) {
  const db = await abrirBanco();
  const resultado = await db.runAsync(
    'DELETE FROM tarefas WHERE id = ?', id
  );
  if (resultado.changes !== 1) throw new Error('Tarefa não encontrada.');
}
