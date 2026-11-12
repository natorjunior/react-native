import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as TaskService from './src/services/TaskService';

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    TaskService.getTasks()
      .then(data => { if (active) setTasks(data); })
      .catch(() => { if (active) setError('Não foi possível carregar. Reabra o app.'); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  const handleToggle = async (id) => {
    if (busy) return;
    setBusy(true);
    try {
      const updatedTasks = await TaskService.toggleTask(id);
      setTasks(updatedTasks);
      setError('');
    } catch {
      setError('Não foi possível alterar a tarefa. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista de Tarefas</Text>
      <Text>Total: {tasks.length} tarefas</Text>
      {busy && <Text>Aguarde…</Text>}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {tasks.map(task => (
        <TouchableOpacity key={task.id}
          onPress={() => handleToggle(task.id)} style={styles.task}
          disabled={busy} accessibilityRole="checkbox"
          accessibilityState={{ checked: task.done, disabled: busy }}>
          <Text style={[styles.taskText, task.done && styles.taskDone]}>
            {task.done ? '✅' : '⭕'} {task.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecf0f1',
    padding: 8, paddingTop: 64 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  task: { padding: 12, marginTop: 8, backgroundColor: '#fff',
    borderRadius: 8 },
  taskText: { fontSize: 18 },
  taskDone: { textDecorationLine: 'line-through', color: '#667' },
  error: { color: '#b3261e', marginVertical: 8 },
});

export default TaskApp;
