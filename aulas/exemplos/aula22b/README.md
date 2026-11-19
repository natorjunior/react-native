# Aula 22b · Atividade: bloco de notas em duas telas

Construa **Minhas notas**, um app React Native com uma lista de notas e um editor. A atividade retoma os estilos da aula 22 e a navegação entre telas. Pode ser feita individualmente ou em dupla, em aproximadamente 80 minutos.

## O que construir

O aplicativo deve ter exatamente duas telas:

| Tela | Elementos e comportamento |
| --- | --- |
| **Minhas notas** | Quantidade de notas, botão **Nova nota**, lista de cartões com título e resumo, rolagem e mensagem quando não houver notas. |
| **Nova / Editar nota** | Campos de título e conteúdo, botões **Cancelar** e **Salvar**, e **Excluir nota** apenas durante a edição. |

O botão Nova nota abre o editor vazio. Tocar em um cartão abre o mesmo editor com o conteúdo daquela nota. Ao salvar, o aplicativo volta à lista atualizada. Cancelar ou voltar pelo cabeçalho descarta o rascunho. Excluir pede confirmação antes de remover a nota.

O título e o conteúdo são obrigatórios. Campos vazios ou contendo apenas espaços devem mostrar uma mensagem e manter o editor aberto.

As notas ficam em memória nesta atividade. Um reinício completo do app restaura as duas notas de exemplo; persistência é um desafio opcional.

## Preparar o projeto

Crie um projeto JavaScript com `App.js`:

```bash
npx create-expo-app@latest notas-aula22b --template blank
cd notas-aula22b
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/elements
npx expo install react-native-screens react-native-safe-area-context
```

Baixe [base.zip](base.zip) e extraia os quatro arquivos na raiz do projeto, preservando a pasta `telas`:

```text
App.js
estilos.js
telas/
  ListaNotas.js
  EditorNota.js
```

O ZIP contém apenas o código-fonte. Mantenha o `package.json` e o arquivo de entrada gerados pelo Expo. Depois execute:

```bash
npx expo start
```

Use Android/iOS, no aparelho com Expo Go compatível com o projeto ou em um emulador. A confirmação de exclusão usa `Alert.alert`; o roteiro de teste tem como alvo o app nativo.

## O que a base já oferece

- Duas telas registradas em um Native Stack do React Navigation.
- Uma lista em `App.js`, compartilhada com as telas por props.
- Duas notas de exemplo, contagem, cartões e mensagem de lista vazia.
- Navegação para criar e editar, passando somente o ID da nota.
- Campos controlados com `useState`, validação com `trim()` e mensagem de erro.
- Cancelamento, confirmação de exclusão e ajuste de tela com o teclado.
- Um `StyleSheet` mínimo para começar, com os nomes usados no JSX.

**Salvar e Excluir ainda não alteram a lista.** Na base, essas ações mostram “Sua vez” e retornam `false`. Complete as funções antes de testar o fluxo completo. A solução é separada para conferência depois da tentativa.

## Etapas da atividade

### 1. Reconhecer o projeto · 10 minutos

Abra as duas telas, localize cada componente e identifique quem recebe cada estilo. Observe a separação entre a lista compartilhada no `App.js` e o rascunho local no editor.

Cada nota tem este formato:

```js
{
  id: '1',
  titulo: 'Ideias para o projeto',
  conteudo: 'Criar um app simples com duas telas.',
}
```

O ID identifica a nota. Títulos podem se repetir. A criação abre `Editor` sem parâmetros; a edição usa `{ notaId: item.id }`.

### 2. Completar as funções · 20 minutos

Em `App.js`, procure os comentários `TODO`:

| Tarefa | Comportamento esperado | Dica |
| --- | --- | --- |
| **TODO 1: salvarNota** | Sem ID, adicionar uma nota; com ID, substituir a correspondente e preservar sua identidade. | Use spread para acrescentar e `map` para atualizar. |
| **TODO 2: excluirNota** | Remover somente a nota com o ID recebido. | Use `filter`. |

Use a forma funcional de `setNotas`, sem modificar o array ou seus objetos originais. Para uma nova nota, gere o ID com `String(proximoId.current++)`, antes de chamar o atualizador do estado. Retorne `true` quando a alteração estiver concluída; o editor usa esse retorno para voltar à lista.

A base já valida os textos antes de chamar `onSalvar`. Não substitua a lista inteira pelo rascunho nem crie uma segunda lista no editor.

### 3. Criar a aparência · 25 minutos

Complete o **TODO 3** em `estilos.js`. Estilize nesta ordem: tela → cabeçalho → cartões → formulário → ações. Personalize a cor principal e mantenha contraste legível.

| Conceito da aula 22 | Onde aplicar |
| --- | --- |
| Alvo do estilo | Identifique os componentes que recebem `styles.card`, `styles.campo` e `styles.botao`. |
| Modelo de caixa | Espaço interno nos cartões e campos; borda; margem entre título e resumo. |
| Medidas fixas e relativas | `width: '100%'`, `maxWidth` e `minHeight`; evite altura fixa em cartões. |
| Hierarquia | Cabeçalho e grupo de ações organizam seus próprios filhos diretos. |
| Flexbox | Contador e Nova nota em linha; alinhamento; `gap`; ações com quebra em pouco espaço. |
| Composição de estilos | Botão secundário, botão de exclusão e retorno visual no estado pressionado. |

Medidas sugeridas:

| Parte | Ponto de partida |
| --- | --- |
| Conteúdo da tela | Padding 24 e largura máxima 560. |
| Cartões | Padding 20, intervalo 16, borda 1 e cantos 16. |
| Textos | Título 20 em negrito, resumo 16 e margem superior 8. |
| Campos | Altura mínima 48; conteúdo multilinha com mínimo 180. |
| Botões | Altura mínima 48, padding e cantos 12. |

As medidas são uma referência, sem exigência de cópia exata. Os botões podem quebrar para outra linha em telas estreitas. Não corte o texto dos campos nem impeça a rolagem para alcançar Salvar.

### 4. Testar e corrigir · 15 minutos

Confira todos os cenários:

- [ ] Nova nota abre campos vazios, inclusive depois de editar outra nota.
- [ ] Criar duas notas aumenta a contagem em dois.
- [ ] Editar uma nota preserva o ID e a quantidade de itens.
- [ ] Alterar e cancelar mantém o conteúdo salvo anteriormente.
- [ ] Voltar pelo cabeçalho também descarta o rascunho.
- [ ] Título ou conteúdo vazio, ou só com espaços, não é salvo.
- [ ] Espaços no início e no fim são removidos ao salvar.
- [ ] Excluir aparece somente para uma nota existente.
- [ ] Cancelar a confirmação de exclusão mantém a nota.
- [ ] Confirmar exclui somente a nota escolhida, mesmo com títulos iguais.
- [ ] Excluir todas as notas mostra a mensagem de lista vazia e contagem zero.
- [ ] Títulos longos e várias notas não quebram a tela; a lista rola.
- [ ] Com o teclado aberto, é possível alcançar os campos e Salvar.
- [ ] Em tela estreita ou com fonte ampliada, textos e botões continuam utilizáveis.

### 5. Entregar e demonstrar · 10 minutos

Entregue os quatro arquivos por repositório ou ZIP, sem `node_modules`, e duas capturas de tela: lista e editor estilizados. Demonstre o ciclo **criar → editar → cancelar → excluir**.

Explique uma escolha de espaçamento e uma de Flexbox. Em dupla, ambos devem participar da explicação.

## Critérios de avaliação

| Critério | Pontos |
| --- | --- |
| Criar, editar, excluir e validar os campos | 4 |
| Duas telas e retorno sem salvar ao cancelar | 2 |
| Estilos: caixa, medidas, hierarquia e Flexbox | 3 |
| Organização dos arquivos e explicação do código | 1 |
| **Total** | **10** |

## Desafio opcional: persistência

Retome o AsyncStorage da aula 19 para recuperar as notas ao iniciar e gravar as alterações. Termine a leitura antes de liberar edição ou gravar o estado. Use JSON, valide o formato recuperado e trate falhas de leitura e escrita.

Se mantiver o contador de IDs, ajuste-o após carregar os dados para não repetir identidades. Teste criar, editar e excluir, encerrando e reabrindo o app após cada operação. Persistência não é necessária para a pontuação completa.

## Solução de referência

Após realizar a atividade, use [solucao.zip](solucao.zip) para comparar. Extraia os quatro arquivos sobre o mesmo projeto com as dependências instaladas. Ela implementa os requisitos obrigatórios e mantém as notas em memória.

Os arquivos também estão disponíveis em [base/](base/) e [solucao/](solucao/). A solução usa `map`, spread e `filter` para atualizar a lista, e concentra a aparência em `estilos.js`.

## Referências

- [Aula 22: estilos](../../../aula22.html)
- [React Navigation: instalação](https://reactnavigation.org/docs/getting-started/)
- [React Navigation: Native Stack e telas](https://reactnavigation.org/docs/hello-react-navigation/)
- [React Navigation: parâmetros](https://reactnavigation.org/docs/params/)
- [React Navigation: render callback de Screen](https://reactnavigation.org/docs/screen/#children)
- [React Native: TextInput](https://reactnative.dev/docs/textinput)
- [React Native: KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview)
- [React Native: Style](https://reactnative.dev/docs/style)
- [React Native: Flexbox](https://reactnative.dev/docs/flexbox)
