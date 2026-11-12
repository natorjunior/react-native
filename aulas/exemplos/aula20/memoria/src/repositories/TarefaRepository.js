let tarefas = [];
let proximoId = 1;

export async function inicializar() {
  // A lista em memória não precisa abrir um banco.
}

export async function listar() {
  return tarefas.map(tarefa => ({ ...tarefa }));
}

export async function adicionar(titulo) {
  if (!titulo.trim()) throw new Error('Informe um título.');
  const tarefa = {
    id: proximoId++, titulo: titulo.trim(), concluida: 0,
  };
  tarefas = [tarefa, ...tarefas];
  return tarefa.id;
}

export async function atualizar(id, concluida) {
  if (![0, 1].includes(concluida)) throw new Error('Status inválido.');
  if (!tarefas.some(tarefa => tarefa.id === id)) {
    throw new Error('Tarefa não encontrada.');
  }
  tarefas = tarefas.map(tarefa => tarefa.id === id
    ? { ...tarefa, concluida } : tarefa);
}

export async function excluir(id) {
  if (!tarefas.some(tarefa => tarefa.id === id)) {
    throw new Error('Tarefa não encontrada.');
  }
  tarefas = tarefas.filter(tarefa => tarefa.id !== id);
}
