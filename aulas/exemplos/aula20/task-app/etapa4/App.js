import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskApp = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Estudar React Native' },
    { id: 2, text: 'Fazer exercícios' }
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista de Tarefas</Text>
      <Text>Total: {tasks.length} tarefas</Text>
      {tasks.map(task => (
        <Text key={task.id}>• {task.text}</Text>
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
