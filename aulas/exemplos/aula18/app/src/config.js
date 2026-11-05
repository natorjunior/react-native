export const BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
// Escolha um código exclusivo da dupla e use o MESMO nos dois aparelhos.
export const ROOM = 'ufc-quixada-aula18-dupla07';
export const topicFor = (userId) => `${ROOM}/chat/${userId}`;
