import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskApp = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Estudar React Native', done: false },
    { id: 2, text: 'Fazer exercícios', done: false }
  ]);

  const toggleTask = (id) => {
    setTasks(current => current.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista de Tarefas</Text>
      <Text>Total: {tasks.length} tarefas</Text>
      {tasks.map(task => (
        <TouchableOpacity key={task.id}
          onPress={() => toggleTask(task.id)} style={styles.task}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.done }}>
          <Text style={[styles.taskText,
            task.done && styles.taskDone]}>
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
