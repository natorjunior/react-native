import mqtt from 'mqtt/dist/mqtt.esm';
import { BROKER, TOPICO } from './config';

const client = mqtt.connect(BROKER);
client.on('error', console.error);
client.on('connect', () => {
  client.subscribe(TOPICO);
});

export function publish(mensagem) {
  client.publish(TOPICO, mensagem);
}

export function subscribe(receber) {
  function onMessage(topico, payload) {
    if (topico === TOPICO) {
      receber(payload.toString());
    }
  }
  client.on('message', onMessage);
  return () => {
    client.removeListener('message', onMessage);
  };
}
