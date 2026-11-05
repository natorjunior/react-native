// Bundle WebSocket: evita depender de módulos TCP do Node no Metro.
import mqtt from 'mqtt/dist/mqtt';
import { BROKER_URL, topicFor } from '../config';

export class ChatRepository {
  constructor() {
    this.client = null;
    this.status = 'offline';
    this.statusListeners = new Set();
  }

  setStatus(status) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  onStatus(listener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  connect() {
    if (this.client) return;
    this.setStatus('connecting');
    const client = mqtt.connect(BROKER_URL, {
      clientId: `aula18-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      reconnectPeriod: 1000,
      resubscribe: false, // Nossa assinatura é refeita no evento connect.
      clean: true,
    });
    this.client = client;
    client.on('reconnect', () => this.setStatus('connecting'));
    client.on('offline', () => this.setStatus('offline'));
    client.on('close', () => this.setStatus('offline'));
    client.on('error', (error) => {
      console.warn('MQTT:', error.message);
      this.setStatus('error');
    });
  }

  subscribe(userId, callback) {
    const client = this.client;
    if (!client) throw new Error('Conecte antes de assinar.');
    const topic = topicFor(userId);
    let active = true;
    const onConnect = () => {
      client.subscribe(topic, { qos: 1 }, (error, granted) => {
        if (!active || this.client !== client) return;
        const accepted =
          !error && granted?.length > 0 && granted.every((item) => item.qos !== 128);
        this.setStatus(accepted ? 'connected' : 'error');
      });
    };
    const onMessage = (receivedTopic, payload) => {
      if (receivedTopic === topic) callback(payload.toString());
    };
    client.on('connect', onConnect);
    client.on('message', onMessage);
    if (client.connected) onConnect();

    return () => {
      active = false;
      client.removeListener('connect', onConnect);
      client.removeListener('message', onMessage);
      if (client.connected) client.unsubscribe(topic);
    };
  }

  publish(receiverId, payload) {
    if (!this.client?.connected || this.status !== 'connected') {
      throw new Error('Aguarde a conexão e a assinatura MQTT.');
    }
    const client = this.client;
    client.publish(
      topicFor(receiverId),
      payload,
      { qos: 1, retain: false },
      (error) => {
        if (error && this.client === client) this.setStatus('error');
      }
    );
  }

  disconnect() {
    const client = this.client;
    this.client = null;
    client?.removeAllListeners();
    client?.end(true);
    this.setStatus('offline');
  }
}
