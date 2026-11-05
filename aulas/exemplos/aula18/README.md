# Aula 18 — Chat em camadas com MQTT

O exemplo usa o contrato da mensagem enviado pelo professor: `id`, `senderId`, `receiverId`, `content` e `createdAt`. A mesma identidade é preservada nos dois aparelhos.

## 1. Lógica local no terminal

Na raiz deste repositório:

```bash
cd aulas/exemplos/aula18/etapa1
npm start
```

Não há dependências para instalar nessa etapa. `teste.js` verifica texto vazio, limpeza dos espaços, filtro de conversas, destinatário, preservação de IDs, duplicatas e cancelamento de listeners. O resultado termina com `OK: validação, conversa, ID preservado, duplicatas e cancelamento.`

`MessageRepository` guarda dados em memória. `ChatService` concentra validação e coordenação. O mesmo Service funciona com ou sem um transporte de rede.

## 2. Interface no Expo

A pasta `app/` é código de apoio, para copiar para um projeto Expo criado com o template **blank**. Ela não contém um projeto Expo instalado. Use Node compatível com a versão de Expo gerada e Expo Go compatível com o SDK.

```bash
npx create-expo-app@latest chat-mqtt --template blank
cd chat-mqtt
npm install @react-navigation/native@^7 @react-navigation/stack@^7 \
  @react-navigation/elements@^2 mqtt@5
npx expo install react-native-screens react-native-safe-area-context \
  react-native-gesture-handler @react-native-masked-view/masked-view
```

Copie `app/App.js` e a pasta `app/src/` deste material para o projeto gerado, substituindo `App.js`. Preserve os demais arquivos do projeto Expo. O template blank usa `App.js`; o template padrão com Expo Router tem outra estrutura.

```bash
npx expo start
```

Na identificação, deixe **Usar MQTT desligado**. Entre como Ana, abra Bruno e envie uma mensagem. Volte e reabra a conversa: o histórico continua enquanto a sessão existe. O modo local não produz respostas automáticas nem comunica com outro aparelho.

## 3. Dois aparelhos via MQTT

1. Em `src/config.js`, escolha um sufixo exclusivo para a dupla em `ROOM`. Use exatamente o mesmo valor nas duas cópias.
2. Abra o app em dois aparelhos ou simuladores. Ative **Usar MQTT** antes de entrar.
3. Escolha Ana num aparelho e Bruno no outro. Abra a conversa correspondente em ambos.
4. Espere **MQTT conectado** nos dois e envie uma mensagem em cada sentido.
5. Volte e reabra a conversa para verificar o histórico. Use **Sair** nos contatos para encerrar a sessão e a conexão.

O transporte usa o bundle WebSocket de MQTT.js (`mqtt/dist/mqtt`) e `wss://broker.hivemq.com:8884/mqtt`. Para usar o broker da disciplina, substitua `BROKER_URL` pela URL WSS com a porta e o caminho configurados pelo servidor. O endereço do broker e a sala são conceitos separados.

### Caminho da mensagem

```text
ChatScreen → ChatService → MessageRepository (memória)
                        → ChatRepository (MQTT) → Broker
                                                    ↓
ChatScreen ← listener ← MessageRepository ← ChatService ← ChatRepository
```

- Cada usuário assina `${ROOM}/chat/${seuId}` e publica no tópico do destinatário.
- O repository de rede lida com texto; o Service serializa/interpreta JSON e valida o contrato.
- O repository local ignora IDs já existentes e só então notifica os listeners.
- `subscribe` devolve uma função de limpeza; a tela a retorna no `useEffect`.
- A conexão pertence à sessão. Navegar para trás remove o listener da tela, mantendo a conexão e o histórico. Sair encerra ambos.
- A assinatura é refeita após reconexão. O status de pronto depende do SUBACK aceito.

### Limites observáveis do exercício

O histórico é um array e desaparece ao sair ou reiniciar. Não há autenticação, fila offline ou sincronização de histórico. Com `clean: true`, `retain: false` e sem persistência, não espere recuperar mensagens enviadas enquanto o destinatário estava desconectado.

QoS 1 permite repetição de entrega; a deduplicação usa o ID criado pelo remetente. PUBACK confirma a publicação naquele trecho MQTT, sem representar leitura pelo destinatário. A bolha local indica um envio aceito pelo cliente conectado, sem implementar confirmação de entrega pela aplicação. Erros de publicação são refletidos no estado da conexão; um rascunho é preservado quando o envio síncrono é recusado por falta de conexão.

O broker é público e a seleção de usuário é apenas didática. Use mensagens fictícias e uma sala exclusiva por dupla. TLS protege a conexão ao broker; não adiciona autenticação nem autorização por tópico.

## Apresentação e laboratórios

Abra `aula18.html` no navegador. A apresentação usa Reveal.js e menu locais. Uma alternativa é servir a raiz do material:

```bash
python3 -m http.server 8018
# Abra http://localhost:8018/aula18.html
```

- A aula está organizada em 11 seções horizontais e 81 subseções verticais. Direita/esquerda mudam de seção; cima/baixo percorrem suas partes; Espaço segue a sequência completa.
- Cada trecho de código tem uma subseção própria de explicação, com os passos do método e um link para rever o código.
- O sumário é clicável e cada seção tem sua numeração. `Esc` abre a visão geral; o menu permite ir direto a qualquer subseção.
- A figura de publish/subscribe avança por fragments e pode ser repetida.
- O laboratório de dois aparelhos é uma **simulação local**: não se conecta a um broker e funciona sem internet. Ative a entrega repetida para ver a deduplicação.
- O cliente MQTT real carrega a biblioteca pela CDN apenas ao clicar em **Conectar e assinar**. Use duas abas com o mesmo tópico. A publicação é texto simples para observar os eventos, enquanto o app publica o objeto serializado.
- As explicações usam passos visuais curtos, revelados progressivamente. A tecla `S` abre as notas do apresentador com os detalhes.
- A animação respeita a preferência do sistema por movimento reduzido. A impressão mostra fragments juntos.

## Leituras

- [MQTT.js — API, reconexão e React Native](https://github.com/mqttjs/MQTT.js)
- [Expo — create-expo-app e templates](https://docs.expo.dev/more/create-expo/)
- [React Navigation — Stack](https://reactnavigation.org/docs/stack-navigator/)
