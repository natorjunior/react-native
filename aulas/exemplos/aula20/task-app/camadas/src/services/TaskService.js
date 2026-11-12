import * as TaskRepository from '../repositories/TaskRepository';

export async function getTasks() {
  return TaskRepository.getAllTasks();
}

export async function toggleTask(id) {
  const task = await TaskRepository.getTaskById(id);
  if (!task) throw new Error('Tarefa não encontrada.');
  await TaskRepository.setTaskDone(id, !task.done);
  return TaskRepository.getAllTasks();
}
