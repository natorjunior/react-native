import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { session } from '../session';

export default function ChatScreen({ route }) {
  const { contactId } = route.params;
  const { chat, userId, network } = session;
  const headerHeight = useHeaderHeight();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(network?.status ?? 'local');

  useEffect(() => {
    const refresh = () => setMessages(chat.getConversation(contactId));
    const unsubscribe = chat.onNewMessage(refresh);
    refresh();
    return unsubscribe;
  }, [chat, contactId]);

  useEffect(() => network?.onStatus(setStatus), [network]);

  const enviar = () => {
    setError('');
    try {
      if (chat.sendMessage(contactId, text)) setText('');
    } catch (problem) {
      setError(problem.message); // Preserva o rascunho para tentar de novo.
    }
  };
  const ready = !network || status === 'connected';
  const statusLabel = {
    local: 'Modo local',
    connecting: 'Conectando…',
    connected: 'MQTT conectado',
    offline: 'Sem conexão',
    error: 'Erro de conexão',
  }[status];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <Text style={styles.status}>
        {statusLabel} · você: {userId}
      </Text>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>Envie a primeira mensagem.</Text>
        }
        renderItem={({ item }) => {
          const mine = item.senderId === userId;
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          );
        }}
      />
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Digite uma mensagem…"
          accessibilityLabel="Mensagem"
          onSubmitEditing={enviar}
        />
        <TouchableOpacity
          style={[styles.button, (!ready || !text.trim()) && styles.disabled]}
          onPress={enviar}
          disabled={!ready || !text.trim()}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  status: { padding: 12, textAlign: 'center', color: '#536773', fontSize: 12 },
  list: { padding: 16 },
  empty: { color: '#536773', textAlign: 'center', marginTop: 24 },
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 16, marginBottom: 10 },
  mine: { alignSelf: 'flex-end', backgroundColor: '#c9ecd9' },
  theirs: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  messageText: { fontSize: 16, color: '#172a39' },
  error: { padding: 12, color: '#a23b28' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff' },
  input: {
    flex: 1,
    backgroundColor: '#edf2f4',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    marginLeft: 10,
    backgroundColor: '#087e72',
    borderRadius: 22,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  disabled: { opacity: 0.45 },
});
