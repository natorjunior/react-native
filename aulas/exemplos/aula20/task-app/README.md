# TaskApp · evolução da lista e separação de responsabilidades

Esta é a sequência usada pelas novas seções da aula 20. Tudo funciona em memória; SQLite será acrescentado em outra etapa.

Crie um projeto Expo JavaScript:

```bash
npx create-expo-app@latest task-app --template blank
cd task-app
npx expo start
```

## Evolução em um arquivo

Substitua o `App.js` do projeto pelo arquivo de cada etapa, um de cada vez:

| Etapa | Arquivo completo | O que muda |
| --- | --- | --- |
| 1 | [etapa1/App.js](etapa1/App.js) | View e título. |
| 2 | [etapa2/App.js](etapa2/App.js) | Estado vazio, contador e estilos básicos. |
| 3 | [etapa3/App.js](etapa3/App.js) | Duas tarefas iniciais; contador mostra 2. |
| 4 | [etapa4/App.js](etapa4/App.js) | map e key exibem os textos. |
| 5 | [etapa5/App.js](etapa5/App.js) | done, TouchableOpacity e toggleTask permitem concluir/reabrir. |

Os arquivos incluem imports, export default e os estilos usados por cada exemplo. Os slides destacam o componente e a novidade; `estilos.js` serve apenas como referência, pois os estilos já estão nos App.js completos. `styles.title`, `styles.task`, `styles.taskText` e `styles.taskDone` estão definidos.

Na primeira etapa, a View é propositalmente simples; a partir da segunda, o padding superior evita que o título fique sob a área de status do aparelho. O setter de conclusão usa a forma funcional para calcular o próximo array com base no estado atual.

## Separar responsabilidades

Copie `App.js` e `src` de `camadas/` para a raiz do projeto. Não crie uma pasta extra chamada camadas no projeto.

```text
App.js
src/
├── repositories/
│   └── TaskRepository.js
└── services/
    └── TaskService.js
```

- **TaskApp:** renderiza, recebe o toque, chama o service e atualiza o estado da interface.
- **TaskService:** decide a regra de alternar o status (`!task.done`) e coordena o repository.
- **TaskRepository:** guarda o array e oferece leitura e atualização. Devolve cópias dos registros, impedindo alteração acidental por referência.

As funções são assíncronas desde essa separação. A tela aguarda os resultados e bloqueia toques durante a leitura ou atualização. Um erro não deve ser anunciado como sucesso. O efeito evita atualizar o estado se a tela já tiver sido desmontada.

## Testar

1. Na etapa 2, o contador mostra zero.
2. Na etapa 3, mostra dois; os títulos ainda não aparecem como lista.
3. Na etapa 4, os dois títulos são renderizados com IDs como keys.
4. Na etapa 5, tocar em uma tarefa altera somente ela; tocar de novo desfaz.
5. Na versão em camadas, o comportamento visível deve ser o mesmo, e a inversão do status fica no service.
6. Um ID inexistente deve resultar em erro, sem alterar as tarefas.
7. Recarregue completamente o app: os dados e status voltam aos valores iniciais. Não há persistência nesta parte.

Fast Refresh pode preservar estado ou módulos. Faça uma recarga completa para verificar o reinício. O exemplo usa map por ser uma lista pequena; FlatList e cadastro de novas tarefas ficam para extensões posteriores.
