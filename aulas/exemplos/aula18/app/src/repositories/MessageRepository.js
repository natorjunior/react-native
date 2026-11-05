export class MessageRepository {
  constructor() {
    this.messages = [];
    this.listeners = new Set();
  }

  add(message) {
    // QoS 1 pode repetir uma entrega. O id da mensagem continua igual.
    if (this.messages.some((item) => item.id === message.id)) return null;
    this.messages.push(message);
    this.listeners.forEach((listener) => listener(message));
    return message;
  }

  listBetween(userA, userB) {
    return this.messages.filter(
      (message) =>
        (message.senderId === userA && message.receiverId === userB) ||
        (message.senderId === userB && message.receiverId === userA)
    );
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
