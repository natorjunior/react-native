import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { contacts, startSession } from '../session';

export default function LoginScreen({ navigation }) {
  const [useMqtt, setUseMqtt] = useState(false);
  const entrar = (id) => {
    startSession(id, useMqtt);
    navigation.replace('Contatos');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>AULA 18 / CHAT EM CAMADAS</Text>
      <Text style={styles.title}>Quem é você?</Text>
      <View style={styles.mode}>
        <Text>Usar MQTT (etapa 3)</Text>
        <Switch
          value={useMqtt}
          onValueChange={setUseMqtt}
          accessibilityLabel="Usar MQTT"
        />
      </View>
      <Text style={styles.hint}>
        {useMqtt
          ? 'Dois aparelhos, mesma sala, usuários diferentes.'
          : 'Etapa 2: mensagens apenas na memória deste aparelho.'}
      </Text>
      {contacts.list().map((contact) => (
        <TouchableOpacity
          key={contact.id}
          style={styles.item}
          onPress={() => entrar(contact.id)}
        >
          <Text style={styles.name}>{contact.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f4f6f8',
  },
  kicker: { color: '#087e72', fontSize: 12, fontWeight: '700', marginBottom: 16 },
  title: { fontSize: 32, color: '#172a39', fontWeight: 'bold', marginBottom: 24 },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hint: { color: '#536773', lineHeight: 22, marginBottom: 20 },
  item: {
    padding: 20,
    backgroundColor: '#e0f1e9',
    borderRadius: 14,
    marginBottom: 12,
  },
  name: { fontSize: 18, color: '#174d42', fontWeight: '600' },
});
