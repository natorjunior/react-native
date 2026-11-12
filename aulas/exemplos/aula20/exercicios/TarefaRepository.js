// Copie para src/repositories/TarefaRepository.js e complete na sua vez.
let tarefas = [];
let proximoId = 1;

export async function inicializar() {
  // Nada para preparar enquanto usamos apenas um array.
}

export async function listar() {
  return tarefas.map(tarefa => ({ ...tarefa }));
}

export async function adicionar(titulo) {
  // TODO: validar, criar ID, adicionar no início e devolver o ID.
  throw new Error('Implemente adicionar na sua vez.');
}

export async function atualizar(id, concluida) {
  // TODO: localizar pelo ID e alterar o status sem mudar as outras tarefas.
  throw new Error('Implemente atualizar na sua vez.');
}

export async function excluir(id) {
  // TODO: remover somente o ID escolhido e tratar ID ausente.
  throw new Error('Implemente excluir na sua vez.');
}
