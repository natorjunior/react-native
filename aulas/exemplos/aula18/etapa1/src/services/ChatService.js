import { createMessage, isMessage } from '../models/Message.js';

export class ChatService {
  constructor(messageRepository, currentUserId, network = null) {
    this.messages = messageRepository;
    this.userId = currentUserId;
    this.network = network;
    this.unsubscribe = null;
  }

  connect() {
    if (!this.network || this.unsubscribe) return;
    this.network.connect();
    this.unsubscribe = this.network.subscribe(this.userId, (payload) => {
      try {
        this.receiveMessage(JSON.parse(payload));
      } catch {
        console.warn('JSON inválido: mensagem ignorada.');
      }
    });
  }

  sendMessage(receiverId, content) {
    if (!content.trim()) return null;
    const message = createMessage({ senderId: this.userId, receiverId, content });
    // Publica o objeto completo: quem recebe preserva o id original.
    this.network?.publish(receiverId, JSON.stringify(message));
    return this.messages.add(message);
  }

  receiveMessage(message) {
    if (!isMessage(message) || message.receiverId !== this.userId) return null;
    return this.messages.add(message);
  }

  getConversation(contactId) {
    return this.messages.listBetween(this.userId, contactId);
  }

  onNewMessage(listener) {
    return this.messages.subscribe(listener);
  }

  disconnect() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.network?.disconnect();
  }
}
