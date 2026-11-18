# Aula 22 · CSS no React Native

Um cartão de perfil construído em três etapas, com `style`, `StyleSheet` e Flexbox. Os slides mostram uma mudança por vez; estes arquivos têm os exemplos completos.

## Executar

```bash
npx create-expo-app@latest estilos-aula22 --template blank
cd estilos-aula22
npx expo start
```

Copie um dos arquivos abaixo para o `App.js` da raiz do projeto. Use um exemplo por vez. Não é necessário instalar bibliotecas extras.

| Arquivo | Resultado |
| --- | --- |
| [etapa1/App.js](etapa1/App.js) | Nome e descrição sem estilo no cartão. |
| [etapa2/App.js](etapa2/App.js) | Cartão com cores, tipografia, espaçamento e borda. |
| [flexbox/App.js](flexbox/App.js) | Três blocos e um botão para alternar coluna/linha. |
| [etapa3/App.js](etapa3/App.js) | Avatar, conteúdo em linha e botão Seguir com estilo condicional. |

Na etapa 1, os estilos da tela apenas posicionam o conteúdo. Na etapa 3, o botão alterna entre Seguir e Seguindo, mudando a cor. É uma interação local de demonstração; não há conexão com um serviço de usuários.

## Durante a aula

1. Execute a etapa 1 e observe a hierarquia de `View` e `Text`.
2. Na etapa 2, altere uma propriedade por vez: `color`, `fontSize`, `padding`, `marginTop` e `borderRadius`.
3. Execute o exemplo Flexbox. Alterne a direção e edite `justifyContent`, `alignItems` e `gap` em `styles.area`.
4. Na etapa 3, identifique o contêiner `linha`, o espaço ocupado por `info` e o array de estilos do botão.

`justifyContent` acompanha o eixo principal: vertical em `column`, horizontal em `row`. `alignItems` acompanha o eixo transversal. Os diagramas dos slides usam contêineres com tamanho definido para tornar a diferença visível.

## Atividade final

Crie seu cartão: iniciais, nome, descrição e um botão que mude de aparência ao tocar. Use `StyleSheet.create`, organize avatar e texto em linha e mantenha espaço entre os elementos. Escolha outra cor principal.

Confira no aparelho:

- O conteúdo tem espaço interno e texto legível.
- O botão alterna texto e cor a cada toque.
- Um nome longo quebra linha sem empurrar o avatar para fora.
- O cartão cabe em uma tela menor e tem largura limitada em uma tela maior.
- Em paisagem ou com fonte ampliada, é possível rolar para alcançar o botão.

Os exemplos usam `ScrollView`, largura em porcentagem e `maxWidth` para acomodar o conteúdo. O espaçamento vertical de 64 é uma simplificação didática; em um app de produção, trate as áreas seguras conforme o dispositivo.

## Lembretes

- No React Native, estilos são objetos JavaScript aplicados pela prop `style`.
- Use `backgroundColor`, números sem `px` e strings para cores/porcentagens.
- `styles.card` é uma referência a um estilo nomeado, não um seletor CSS.
- Propriedades de texto vão no `Text`; propriedades de layout organizam os contêineres.
- Em um array, os estilos posteriores sobrescrevem propriedades repetidas.
- `padding` fica dentro; `margin` fica fora; `gap` separa os filhos.
- O Flexbox do React Native começa em coluna. A web começa em linha.
- `gap` numérico é suportado nas versões atuais do React Native usadas pelo Expo.

## Referências oficiais

- [Style](https://reactnative.dev/docs/style)
- [StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Flexbox](https://reactnative.dev/docs/flexbox)
- [Layout Props](https://reactnative.dev/docs/layout-props)
- [Text Style Props](https://reactnative.dev/docs/text-style-props)
- [Height and Width](https://reactnative.dev/docs/height-and-width)
- [Pressable](https://reactnative.dev/docs/pressable)
