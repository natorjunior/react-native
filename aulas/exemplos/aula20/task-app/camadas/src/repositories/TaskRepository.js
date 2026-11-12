let tasks = [
  { id: 1, text: 'Estudar React Native', done: false },
  { id: 2, text: 'Fazer exercícios', done: false }
];

export async function getAllTasks() {
  return tasks.map(task => ({ ...task }));
}

export async function getTaskById(id) {
  const task = tasks.find(task => task.id === id);
  return task ? { ...task } : null;
}

export async function setTaskDone(id, done) {
  if (!tasks.some(task => task.id === id)) {
    throw new Error('Tarefa não encontrada.');
  }
  tasks = tasks.map(task => task.id === id
    ? { ...task, done } : task);
}
