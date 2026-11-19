# Aula 22 · CSS no React Native

A aula segue esta sequência: **seletores → modelo de caixa → medidas fixas e relativas → relações entre elementos → Flexbox**. Cada bloco parte de uma referência do CSS da web e mostra como trabalhar no React Native. A prática final reúne os conceitos em um cartão de perfil.

Os trechos HTML/CSS dos slides servem para comparação. Os arquivos `App.js` abaixo são exemplos completos para executar no Expo; os desenhos dos slides são ilustrações.

## Executar

```bash
npx create-expo-app@latest estilos-aula22 --template blank
cd estilos-aula22
npx expo start
```

Copie um dos arquivos abaixo para o `App.js` da raiz do projeto. Use um exemplo por vez. Não é necessário instalar bibliotecas extras.

| Ordem | Arquivo | Uso na aula |
| --- | --- | --- |
| 1 | [etapa1/App.js](etapa1/App.js) | Começar com nome e descrição; aplicar `style` e reutilizar estilos nomeados. |
| 2 | [etapa2/App.js](etapa2/App.js) | Explorar conteúdo, `padding`, `margin` e borda no cartão. |
| 3 | [medidas/App.js](medidas/App.js) | Comparar largura fixa 120 com 50% de um pai que alterna entre 300 e 200. |
| 4 | [hierarquia/App.js](hierarquia/App.js) | Identificar filhos diretos, descendentes indiretos e irmãos; aplicar estilos aos alvos. |
| 5 | [flexbox/App.js](flexbox/App.js) | Alternar coluna/linha e experimentar alinhamento e `gap`. |
| 6 | [etapa3/App.js](etapa3/App.js) | Reunir avatar, conteúdo em linha e botão Seguir com estilo condicional. |

## Roteiro didático

### 1. Seletores: quem recebe o estilo?

Na web, compare elemento (`p`), ID (`#nome`) e classe (`.destaque`). Identifique os alvos antes de mudar a regra. O ID deve ser único no documento; uma classe pode aparecer em vários elementos.

No React Native, comece pela etapa 1. Aplique um objeto inline ao `Text` do nome, extraia para `StyleSheet.create` e reaplique a referência em outro `Text`. `styles.destaque` é uma propriedade do objeto de estilos; não seleciona componentes automaticamente. `nativeID` e `testID` também não são seletores de estilo.

Apresente cores e tipografia como propriedades dos alvos. Em um array de estilos, propriedades repetidas são sobrescritas pelos estilos posteriores: `[styles.titulo, styles.destaque]`. Retome essa composição no botão da prática final.

### 2. Modelo de caixa: onde fica o espaço?

Leia o diagrama do conteúdo para fora: **conteúdo → padding → border → margin**. Na etapa 2:

- Altere `padding` do cartão de 24 para 0 e depois para 40.
- Altere `marginTop` da descrição e observe o espaço entre os textos.
- Experimente `borderWidth`, `borderColor` e `borderRadius` separadamente.

A largura e o posicionamento da etapa 2 estão preparados para a demonstração; serão explicados nos blocos seguintes. A cor de fundo não pinta a margem externa.

### 3. Medidas: qual é a referência?

Na web, compare `px`, `%`, `rem` e `vw`. Nos exemplos nativos desta aula, use números sem unidade para medidas fixas e strings de porcentagem para medidas relativas ao pai. Números de layout representam unidades independentes de densidade, não pixels físicos.

Execute `medidas/App.js`. Antes de tocar no botão, preveja a largura da barra relativa: 50% de 300 é 150; 50% de 200 é 100. A barra fixa continua com 120. O pai não tem padding ou borda, para isolar o cálculo.

Retome o cartão da etapa 2: `width: '100%'` acompanha a largura disponível do pai; `maxWidth: 360` limita o crescimento em telas maiores. Evite altura fixa no cartão para permitir o crescimento do texto.

### 4. Relações: quem é filho, descendente ou irmão?

Use a mesma árvore dos slides e identifique o pai de cada elemento. Os combinadores da web selecionam alvos conforme essas relações:

| Combinador | Seleciona |
| --- | --- |
| `.card > p` | Os `p` que são filhos diretos de `.card`. |
| `.card p` | Os `p` descendentes de `.card`, diretos **e** indiretos. |
| `h2 ~ p` | Os `p` posteriores ao `h2` que têm o mesmo pai, mesmo com outros elementos entre eles. |
| `h2 + p` | O `p` que é o próximo elemento irmão do `h2`. |

`~` e `+` não selecionam irmãos anteriores. O espaço não significa apenas descendência indireta: inclui também a direta.

No React Native, execute `hierarquia/App.js`. `Nome` e `Rodapé` recebem o mesmo estilo explicitamente. `Descrição` só recebe esse estilo se você aplicá-lo ao seu `Text`. Não há interpretação desses combinadores pelo `StyleSheet`.

Diferencie seleção e herança: um `Text` aninhado em outro `Text` pode herdar propriedades de texto; uma `View` não transmite `color` e `fontSize` aos seus `Text` como uma cascata global.

### 5. Flexbox: como organizar os filhos?

Parta da árvore: o pai organiza seus filhos diretos. O contêiner `linha` do cartão organiza `avatar` e `info`; os textos dentro de `info` pertencem a outro nível.

Execute `flexbox/App.js`. Alterne `flexDirection` e edite `justifyContent`, `alignItems` e `gap` em `styles.area`, uma propriedade por vez. Preveja o resultado antes de salvar.

`justifyContent` acompanha o eixo principal: vertical em `column`, horizontal em `row`. `alignItems` acompanha o eixo transversal. O React Native começa em coluna; um contêiner Flexbox da web começa em linha. O `gap` separa os filhos e o `padding` separa o conteúdo da borda. O exemplo tem espaço livre e dimensões definidas para tornar os alinhamentos visíveis.

## Atividade final

Crie seu cartão: iniciais, nome, descrição e um botão que mude de aparência ao tocar. Use `StyleSheet.create`, organize avatar e texto em linha e mantenha espaço entre os elementos. Escolha outra cor principal. Use `etapa3/App.js` para conferência.

O botão alterna entre Seguir e Seguindo, mudando a cor por meio de um array de estilos e estado local.

Confira no aparelho:

- O conteúdo tem espaço interno e texto legível.
- O botão alterna texto e cor a cada toque.
- Um nome longo quebra linha sem empurrar o avatar para fora.
- O cartão cabe em uma tela menor e tem largura limitada em uma tela maior.
- Em paisagem ou com fonte ampliada, é possível rolar para alcançar o botão.

Os exemplos do cartão usam `ScrollView`, largura em porcentagem e `maxWidth`. O espaçamento vertical de 64 é uma simplificação didática; em um app de produção, trate as áreas seguras conforme o dispositivo.

## Referências

- [MDN: seletores e combinadores](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors)
- [MDN: modelo de caixa](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model/Introduction)
- [MDN: medidas de comprimento](https://developer.mozilla.org/en-US/docs/Web/CSS/length)
- [React Native: Style](https://reactnative.dev/docs/style)
- [React Native: StyleSheet](https://reactnative.dev/docs/stylesheet)
- [React Native: Height and Width](https://reactnative.dev/docs/height-and-width)
- [React Native: Layout Props](https://reactnative.dev/docs/layout-props)
- [React Native: Text e herança limitada](https://reactnative.dev/docs/text#limited-style-inheritance)
- [React Native: Flexbox](https://reactnative.dev/docs/flexbox)
- [React Native: Pressable](https://reactnative.dev/docs/pressable)
