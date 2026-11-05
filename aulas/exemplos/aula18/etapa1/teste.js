import assert from 'node:assert/strict';
import { MessageRepository } from './src/repositories/MessageRepository.js';
import { ContactRepository } from './src/repositories/ContactRepository.js';
import { ChatService } from './src/services/ChatService.js';

const repository = new MessageRepository();
const contacts = new ContactRepository();
const ana = new ChatService(repository, 'ana');
const bruno = new ChatService(new MessageRepository(), 'bruno');
let events = 0;
const unsubscribe = ana.onNewMessage((message) => {
  events++;
  console.log(
    '[evento]',
    message.senderId,
    '→',
    message.receiverId,
    ':',
    message.content
  );
});

const sent = ana.sendMessage('bruno', '  Oi, Bruno!  ');
assert.equal(sent.content, 'Oi, Bruno!');
assert.equal(bruno.receiveMessage(sent).id, sent.id);
assert.equal(bruno.receiveMessage(sent), null); // Entrega duplicada.
const reply = bruno.sendMessage('ana', 'Oi, Ana!');
ana.receiveMessage(reply);
ana.sendMessage('carla', 'Oi, Carla!');
assert.equal(ana.sendMessage('bruno', '   '), null);
assert.equal(ana.receiveMessage({ content: 'incompleto' }), null);
assert.equal(ana.receiveMessage(sent), null); // Destinatário é Bruno.
assert.equal(ana.getConversation('bruno').length, 2);
assert.equal(ana.getConversation('carla').length, 1);
assert.equal(events, 3);
unsubscribe();
ana.sendMessage('bruno', 'Até mais!');
assert.equal(events, 3); // A assinatura foi cancelada.

console.log(
  'Contatos:',
  contacts.list('ana').map((contact) => contact.name)
);
console.log('OK: validação, conversa, ID preservado, duplicatas e cancelamento.');
