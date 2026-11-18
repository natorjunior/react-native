# Aula 21 · Sensores e dispositivos

Três exemplos independentes para acompanhar [os slides](../../../aula21.html). As telas mostram apenas os controles e o resultado. Execute um exemplo por vez.

A [sequência da câmera](../../../aula21.html#/camera-importar) usa Auto-Animate: o mesmo `App` cresce em oito passos, dos imports até o botão Fotografar. As linhas em destaque indicam a parte em construção; o bloco acompanha esse trecho por rolagem. É possível rolar para rever os comandos anteriores ou voltar pelos slides.

Essa sequência mostra uma versão didática do código. O arquivo completo de câmera abaixo acrescenta os controles de luz, Nova foto, tratamento de permissão bloqueada e proteção contra capturas simultâneas.

A [sequência de localização](../../../aula21.html#/localizacao-importar) também usa Auto-Animate. São sete passos: estados, botão, permissão, recusa, serviço ativo, consulta e exibição das coordenadas. A atividade ao final pede um aplicativo com um botão que mostre latitude e longitude, incluindo o teste com a localização desligada.

O exemplo de localização para download é igual à última etapa dos slides. Usa três estados simples (`latitude`, `longitude` e `mensagem`) e mostra cada valor diretamente em um `Text`, sem `!!`, `&&` ou renderização condicional no JSX.

A [sequência do acelerômetro](../../../aula21.html#/acelerometro-importar) tem sete passos com Auto-Animate: estados, valores na tela, botão Iniciar, permissão, disponibilidade, leituras e botão Parar. O arquivo completo é igual à última etapa. Usa três estados (`dados`, `lendo` e `mensagem`), dois botões com rótulos fixos e textos diretos no JSX.

## Preparação

```bash
npx create-expo-app@latest dispositivos-aula21 --template blank
cd dispositivos-aula21
npx expo install expo-camera expo-location expo-sensors
npx expo start
```

Copie o conteúdo de um dos arquivos abaixo para o `App.js` da raiz do projeto criado. O template `blank` evita a estrutura de rotas; estes exemplos não usam Expo Router. Não substitua o `package.json` gerado: `expo install` escolhe as versões dos módulos compatíveis com o SDK instalado.

| Exemplo | Arquivo completo | Comportamento |
| --- | --- | --- |
| Câmera | [camera/App.js](camera/App.js) | Câmera traseira, fotografia, flash e lanterna. |
| Localização | [localizacao/App.js](localizacao/App.js) | Um botão; latitude, longitude e mensagem. |
| Acelerômetro | [acelerometro/App.js](acelerometro/App.js) | Disponibilidade, permissão, eixos em g, iniciar/parar e remoção do listener. |

## Onde testar

Use preferencialmente um **celular Android ou iOS com Expo Go compatível com o SDK do projeto**. Os módulos usados estão incluídos no Expo Go; a disponibilidade de cada recurso ainda depende do aparelho. O foco da aula é o uso em primeiro plano.

- Câmera e LED: teste em aparelho físico com câmera traseira e flash. Nem toda câmera tem LED. O exemplo não detecta essa capacidade; um botão habilitado não garante a presença do hardware.
- Localização: ative o serviço de localização. No emulador/simulador, forneça uma posição simulada pelos controles da plataforma. Uma permissão concedida não garante que haja sinal ou uma posição disponível.
- Acelerômetro: um aparelho físico permite observar a mudança dos eixos; ambientes virtuais podem não oferecer leituras ou podem exigir simulação de movimento.
- Web: as APIs têm diferenças de suporte, contexto seguro, gestos e permissões. O controle de LED não é garantido. Estes exemplos foram preparados para Android/iOS; a validação no navegador dos slides não valida o hardware do app.

## Permissões e compilação própria

O botão solicita a permissão em tempo de execução. A câmera oferece acesso às configurações quando o sistema não permite perguntar novamente. Nos exemplos de localização e movimento, altere a permissão manualmente nas configurações do app se ela estiver bloqueada.

[app.config.exemplo.json](app.config.exemplo.json) mostra a configuração dos plugins para uma **compilação própria**. Mescle o array `expo.plugins` com o `app.json` existente, preservando nome, slug e demais configurações. O arquivo de exemplo não é carregado automaticamente pelo Expo. As mensagens configuradas são para iOS; o texto do diálogo de permissões do Android é controlado pelo sistema. A configuração desativa a permissão de gravação de áudio do módulo de câmera no Android porque o exemplo usa somente fotos.

Alterações de configuração nativa exigem nova compilação, por exemplo `npx expo run:android` ou `npx expo run:ios`, com o ambiente nativo correspondente instalado. Recarregar o JavaScript ou abrir o Expo Go não aplica essas mudanças ao binário do Expo Go. Não se solicita localização em segundo plano nesta aula.

## Roteiro de conferência no aparelho

### Câmera

1. Instale/abra e recuse a permissão. A tela deve explicar o motivo e continuar utilizável. Se puder solicitar novamente, use o botão; se estiver bloqueada, abra as configurações.
2. Autorize e espere a prévia. O botão Fotografar só deve habilitar após `onCameraReady`.
3. Fotografe e confira a imagem. A prévia dá lugar à foto e ao botão Nova foto.
4. Na câmera traseira, teste o flash da foto com a lanterna desligada. Depois desligue o flash e teste a luz contínua. O exemplo alterna os modos para facilitar a comparação.
5. Ligue a lanterna e coloque o app em segundo plano. A prévia é desmontada e a lanterna é desligada. Ao voltar, ela permanece desligada.
6. O exemplo usa somente a câmera traseira. A troca para a frontal pode ser uma extensão.
7. Em um app com navegação, desmonte a câmera também quando a tela perder o foco, mesmo que o aplicativo continue ativo.

`takePictureAsync` produz um arquivo no cache no Android/iOS. Exibir sua URI não salva a foto na galeria, não faz upload e não garante conservação permanente. O exemplo mantém a URI em memória; uma recarga completa perde esse estado. Para persistir registros, copie o arquivo para armazenamento durável do app e guarde seu caminho; para exportar para a galeria, use uma API como `expo-media-library` com as permissões pertinentes.

### Atividade · Minha lanterna

Crie um aplicativo com um botão. Ao tocar nele, a lanterna do celular deve acender. Use a permissão de câmera, um estado booleano e `enableTorch`, como apresentado na aula. Teste em um aparelho físico com câmera traseira e flash.

Desafio opcional: um segundo toque apaga a lanterna.

### Localização

1. Abra o exemplo: os campos Latitude e Longitude começam vazios. Toque em Obter localização.
2. Desative o serviço de localização do aparelho e faça uma nova consulta. O app deve orientar sua ativação.
3. Ative o serviço e consulte em um local com sinal. Confira os dois valores na tela.
4. Recuse a permissão e consulte novamente: a mensagem deve informar a recusa. Uma falha de leitura também deve mostrar uma mensagem.

A leitura é pontual e não é enviada nem salva pelo exemplo. `getCurrentPositionAsync` pode demorar, especialmente em ambientes internos. `Balanced` expressa a precisão desejada e não uma garantia. Os valores são mostrados diretamente, sem formatação adicional. O bloqueio do botão durante a consulta e a exibição da precisão ficam como desafios opcionais da atividade.

### Acelerômetro

1. Observe x, y e z inicialmente zerados. Toque em Iniciar e autorize, se surgir um diálogo. A forma da solicitação varia por plataforma; nem todo sistema mostra um diálogo para esse sensor.
2. Incline o aparelho e observe x, y e z. A leitura inclui a gravidade: parado não significa três zeros.
3. Toque em Parar. Os números devem parar de mudar e o listener é removido.
4. Inicie outra vez e repita. Os botões têm rótulos fixos; `disabled` indica qual ação está disponível.

O intervalo solicitado é 300 ms. `useEffect` cria uma assinatura quando `lendo` muda para `true` e remove essa assinatura quando muda para `false` ou o componente é desmontado. O exemplo básico não implementa cancelamento do pedido de permissão nem pausa automática em segundo plano.

### Atividade · Movimento na tela

Crie uma tela com os valores de x, y e z e dois botões: Iniciar e Parar. Incline o celular para observar as leituras e confira se elas param após o toque em Parar.

Desafios opcionais: alterar o intervalo das leituras ou pausar ao colocar o app em segundo plano usando `AppState`.

## Atividade final · Diário de campo

Construa uma tela com uma foto e as coordenadas obtidas por botão. Reutilize os dois exemplos. Se uma permissão for negada, mostre uma mensagem. Pause recursos ao sair da tela ou colocar o app em segundo plano.

Entregue o código e demonstre o fluxo autorizado e uma falha. Confira a foto, as coordenadas e o encerramento correto dos recursos. Compartilhe somente dados de teste.

Extensões: mostrar o acelerômetro em um painel com Iniciar/Parar; integrar o SQLite da aula 20 para salvar metadados. Antes de guardar o caminho da foto, mova/copie o arquivo do cache para uma pasta durável com `expo-file-system`. Não use a imagem em base64 como conteúdo de uma coluna de texto nesta atividade.

## Referências oficiais

- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo Accelerometer](https://docs.expo.dev/versions/latest/sdk/accelerometer/)
- [Expo Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)
- [Expo Permissions](https://docs.expo.dev/guides/permissions/)
- [React Native AppState](https://reactnative.dev/docs/appstate)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Expo MediaLibrary](https://docs.expo.dev/versions/latest/sdk/media-library/)
