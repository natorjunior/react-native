import { MessageRepository } from './repositories/MessageRepository';
import { ContactRepository } from './repositories/ContactRepository';
import { ChatRepository } from './repositories/ChatRepository';
import { ChatService } from './services/ChatService';

export const contacts = new ContactRepository();
export const session = { userId: null, chat: null, network: null };

// Etapa 2: startSession(id). Etapa 3: startSession(id, true).
export function startSession(userId, useMqtt = false) {
  endSession();
  const network = useMqtt ? new ChatRepository() : null;
  const chat = new ChatService(new MessageRepository(), userId, network);
  Object.assign(session, { userId, chat, network });
  chat.connect();
}

export function endSession() {
  session.chat?.disconnect();
  Object.assign(session, { userId: null, chat: null, network: null });
}
