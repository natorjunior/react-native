import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { contacts, session, endSession } from '../session';

export default function ContactsScreen({ navigation }) {
  const sair = () => {
    endSession();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text>
          Você: {session.userId} · {session.network ? 'MQTT' : 'local'}
        </Text>
        <TouchableOpacity onPress={sair}>
          <Text style={styles.link}>Sair</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={contacts.list(session.userId)}
        keyExtractor={(contact) => contact.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('Chat', { contactId: item.id, name: item.name })
            }
          >
            <Text style={styles.avatar}>{item.name[0]}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.link}>→</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  heading: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  link: { color: '#087e72', fontWeight: '600' },
  item: {
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    backgroundColor: '#e0f1e9',
    padding: 12,
    borderRadius: 14,
    color: '#087e72',
  },
  name: { flex: 1, fontSize: 18, color: '#172a39' },
});
