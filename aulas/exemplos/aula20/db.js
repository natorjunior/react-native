import { openDatabaseAsync } from 'expo-sqlite';

let db = null;

export async function initDB() {
  db = await openDatabaseAsync('app.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    );
  `);

  return db;
}

export async function insertUsuario(nome) {
  if (!db) throw new Error('Chame initDB() antes.');
  if (!nome.trim()) throw new Error('Informe o nome.');

  const result = await db.runAsync(
    'INSERT INTO usuarios (nome) VALUES (?);',
    [nome.trim()]
  );

  return result.lastInsertRowId;
}

// Buscar todos
export const getAll = async () => {
  if (!db) throw new Error('Chame initDB() antes.');
  return await db.getAllAsync('SELECT * FROM usuarios;');
};

// Buscar por ID
export const getById = async (id) => {
  if (!db) throw new Error('Chame initDB() antes.');
  return await db.getFirstAsync(
    'SELECT * FROM usuarios WHERE id = ?;',
    [id]
  );
};

export const updateUser = async (id, nome) => {
  if (!db) throw new Error('Chame initDB() antes.');
  if (!nome.trim()) throw new Error('Informe o nome.');
  const result = await db.runAsync(
    'UPDATE usuarios SET nome = ? WHERE id = ?;',
    [nome.trim(), id]
  );
  return result.changes > 0;
};

export const deleteUser = async (id) => {
  if (!db) throw new Error('Chame initDB() antes.');
  const result = await db.runAsync(
    'DELETE FROM usuarios WHERE id = ?;',
    [id]
  );
  return result.changes > 0;
};
