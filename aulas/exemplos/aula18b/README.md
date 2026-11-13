# Aula 18b — subscribe e publish em funções

Crie o projeto e instale o cliente MQTT:

```bash
npx create-expo-app@latest mqtt-basico --template blank
cd mqtt-basico
npm install mqtt
npx expo start
```

Copie [config.js](config.js), [mqttService.js](mqttService.js) e [estilos.js](estilos.js) para a raiz. Troque o identificador da dupla em TOPICO. Use o mesmo broker e tópico nos aparelhos.

## Funções prontas

O módulo cria uma única instância com `const client = mqtt.connect(BROKER)`, fora das funções. `publish` e `subscribe` usam esse mesmo cliente, sem abrir outra conexão. O evento `connect` assina o tópico ao conectar ou reconectar.

`publish(mensagem)` publica pela instância compartilhada. MQTT.js mantém os envios QoS 0 em fila enquanto conecta, por padrão. Não é confirmação de entrega ou leitura. [Referência MQTT.js](https://github.com/mqttjs/MQTT.js#client).

`subscribe(receber)` registra um callback para receber textos e retorna a função de limpeza. O tópico já foi assinado pela configuração da instância. A limpeza remove apenas esse callback, preservando outros listeners e a conexão compartilhada. Ela permanece aberta enquanto o app usa o serviço.

## App.js — primeiro publicar

```jsx
import { Button } from 'react-native';
import { publish } from './mqttService';

export default function App() {
  return <Button title="Enviar" onPress={() => {
    publish('Olá, MQTT!');
  }} />;
}
```

Depois importe subscribe e use `useEffect(() => subscribe(setMensagem), [])` para receber. O App.js não precisa importar mqtt, broker, tópico ou opções de conexão.

## Etapas

1. [Tela inicial](etapas/etapa1/App.js).
2. [Importar e publicar](etapas/etapa2/App.js).
3. [Publicação para testar com o professor](etapas/etapa3/App.js).
4. [Assinar e mostrar a última mensagem](etapas/etapa4/App.js).
5. [Testar recebimento em dupla](etapas/etapa5/App.js).
6. [Evoluir para lista](etapas/etapa6/App.js).

Copie a etapa desejada para App.js na raiz, com os três arquivos de apoio. [App.js](App.js) contém a versão final com lista em memória. O emissor também recebe porque assina o mesmo tópico. Use conteúdo fictício no broker público.

Na atividade, publique nas duas direções, personalize o texto e teste tópicos diferentes.
