# Aula 18b — MQTT no App.js: primeiro publicar, depois evoluir

A meta é apertar **Enviar Olá** em um celular e ver **Olá, MQTT!** no outro. O app final tem um botão, um status e a última mensagem recebida.

## Criar o projeto do zero

No terminal, dentro da pasta onde você guarda seus projetos:

```bash
npx create-expo-app@latest mqtt-basico --template blank
cd mqtt-basico
npm install mqtt
```

O template `blank` cria um app em JavaScript. O pacote `mqtt` fornece o cliente MQTT.js para conectar, publicar e assinar; o broker é um servidor separado.

O desenvolvimento acontece no `App.js` criado pelo template. Acrescente somente estes dois arquivos ao lado dele:

- [config.js](config.js): endereço do broker e tópico da dupla.
- [estilos.js](estilos.js): aparência da tela.

Comece com esta estrutura em `App.js`. Os imports serão usados ao longo da prática:

```jsx
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import mqtt from 'mqtt';
import { BROKER, TOPICO } from './config';
import estilos from './estilos';

export default function App() {
  // Primeiro enviar; depois mostrar status e receber.
  return <Text>MQTT básico</Text>;
}
```

Inicie o projeto:

```bash
npx expo start
```

Abra o QR code no Expo Go compatível com o SDK criado pelo template. Use uma versão de Node compatível com esse SDK. A tela inicial mostra **MQTT básico**.

Comece pelo botão de envio abaixo. Depois evolua esse mesmo componente `App`, acrescentando status, recebimento e uma conexão mantida no efeito. Consulte o [App.js completo](App.js) para comparar o resultado final.

Para executar no navegador, instale também as dependências web com `npx expo install react-dom react-native-web` e selecione a opção web no Expo.

Referência: [criação de projetos com create-expo-app](https://docs.expo.dev/more/create-expo/).

## Primeiro envio no App.js

O primeiro exemplo tem apenas um botão. Substitua o conteúdo de `App.js` por:

```jsx
import { Button, Text, View } from 'react-native';
import mqtt from 'mqtt';
import { BROKER, TOPICO } from './config';
import estilos from './estilos';

export default function App() {
  function enviar() {
    const client = mqtt.connect(BROKER, { reconnectPeriod: 0 });
    client.once('connect', () => {
      client.publish(TOPICO, 'Olá, MQTT!', () => {
        client.end();
      });
    });
    client.on('error', () => client.end(true));
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>MQTT básico</Text>
      <Text style={estilos.legenda}>Texto a enviar:</Text>
      <Text style={estilos.mensagem}>Olá, MQTT!</Text>
      <Button title="Enviar Olá" onPress={enviar} />
    </View>
  );
}
```

Cada toque **conecta → publica → encerra**. A publicação espera a conexão antes de enviar. A versão completa acima desativa reconexões automáticas para essa operação pontual e encerra o cliente em caso de erro. O callback de `publish`, com QoS 0, não confirma entrega a outro cliente.

Para observar a mensagem, mantenha o app completo do professor ou outro cliente MQTT conectado ao **mesmo broker** e já assinando o **mesmo tópico**. Este primeiro app só publica.

No próximo slide, **1. Conectar e mostrar o status**, mova a criação do cliente para um `useEffect`, mantenha a conexão enquanto a tela estiver montada e exiba `status` no JSX. A versão inicial de `enviar` será substituída depois por outra que usa essa conexão aberta.

Referência: [API do MQTT.js](https://github.com/mqttjs/MQTT.js#api).

## Rodar o app final

```bash
cd aulas/exemplos/aula18b
npm install
npx expo start
```

Abra no Expo Go compatível com o SDK 58 do projeto. Use Node compatível com esse SDK (na linha 22, versão 22.13 ou superior). Para experimentar no navegador, execute `npm run web` e abra duas abas.

Em `config.js`, troque `dupla07` pelo código da sua dupla. Os dois aparelhos precisam usar o mesmo `TOPICO`.

1. Abra o app nos dois aparelhos.
2. Espere **Conectado** nos dois.
3. Toque em **Enviar Olá** em um deles.
4. Confira **Olá, MQTT!** na tela do outro. O emissor também recebe, porque assina o mesmo tópico.

## Sequência da prática no App.js

| Etapa | O que acrescentar ao App.js | Resultado |
| --- | --- | --- |
| Primeiro envio | Botão que conecta, publica e encerra. | Enviar **Olá, MQTT!** ao acionar o botão. |
| 1. Conectar | `useState` para o status e `useEffect` com `mqtt.connect(BROKER)`. | Mostrar `status` em um `<Text>` e confirmar **Conectado**. |
| 2. Receber | `client.subscribe(TOPICO)`, estado `mensagem` e listener `message`. | Exibir a mensagem recebida na tela. |
| 3. Reutilizar a conexão | Acrescentar `useRef` ao import de React e substituir a função `enviar`. | Usar o mesmo cliente conectado para publicar pelo botão. |

Todo o roteiro acontece no mesmo `App.js`. Depois do primeiro envio pontual, mantenha uma única conexão no `useEffect`. Remova `mqtt.connect` da função `enviar` ao passar para essa versão. A assinatura fica no callback `connect`; o listener `message` fica no mesmo efeito da conexão. A limpeza encerra o cliente.

Os slides destacam os trechos que serão acrescentados em cada etapa. O [App.js completo](App.js) reúne imports, estado, interface e tratamento básico de erros. `estilos.js` contém a aparência; `config.js` contém o broker e o tópico.

## Quatro linhas que explicam a ideia

```js
mqtt.connect(BROKER); // conectar
client.subscribe(TOPICO); // escolher o canal
client.on('message', receber); // tratar o recebimento
client.publish(TOPICO, 'Olá, MQTT!'); // enviar
```

No React Native, a conexão e os listeners ficam no `useEffect`. `useState` guarda o texto mostrado na tela; `useRef` permite que o botão use o cliente já conectado. A limpeza do efeito fecha a conexão. A variável `ativo` no arquivo completo ignora eventos atrasados depois da saída da tela.

O projeto usa o bundle ESM `mqtt/dist/mqtt.esm` da versão fixada de MQTT.js. O status **Conectado** indica a conexão ao broker, não confirmação de leitura ou confirmação da assinatura. O exercício usa o broker público, em um tópico próprio da dupla, com as opções básicas da biblioteca: QoS 0, sem retenção e sem histórico offline. Não há lista de mensagens, campo de digitação ou confirmação de entrega neste exemplo.

## Exercício

No `App.js`, troque apenas `'Olá, MQTT!'` por `'Bom dia!'`. Publique de novo e confira a mudança no outro aparelho.

Use conteúdo fictício: o broker é público e não há autenticação no exemplo.

## Exemplo completo com lista de mensagens

O final da apresentação reúne um exemplo independente em [completo/App.js](completo/App.js). Copie seu conteúdo para o `App.js` do projeto criado com Expo e execute `npm install mqtt` e `npx expo start`.

Esse arquivo contém tudo: endereço do broker, tópico, um `Text` com o status, `subscribe`, uma `FlatList` com as mensagens recebidas e um `Button` que executa `publish`. Ajuste `BROKER` e `TOPICO` no próprio arquivo. Use os mesmos valores nos dois aparelhos.

A mensagem enviada só entra na lista quando chega pelo evento `message`. A atualização funcional `setMensagens(lista => [...lista, texto])` preserva os itens anteriores. A lista fica na memória enquanto o app está aberto. O botão fica desabilitado quando não há conexão.

Os slides finais mostram o mesmo arquivo com Auto-Animate e destaques por trecho; o último slide apresenta o código inteiro em duas colunas. O exemplo anterior com uma única mensagem permanece disponível em [App.js](App.js).

## Apresentação

Na raiz do repositório:

```bash
python3 -m http.server 8018
# http://localhost:8018/aula18b.html
```

A aula tem quatro seções: entender a ideia, construir no React Native, praticar e exemplo completo. Direita/esquerda mudam de seção; cima/baixo percorrem as explicações. Espaço segue toda a aula. S abre as notas do professor.

## Referências

- [MQTT.js](https://github.com/mqttjs/MQTT.js)
- [Expo](https://docs.expo.dev/)
- [MQTT — especificação OASIS](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
