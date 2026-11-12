# Aula 20 · Do repository em memória ao SQLite

A aula alterna demonstração, prática dos alunos e conferência. A tela é construída sobre um contrato assíncrono de repository. Primeiro os dados ficam em um array; só depois a implementação passa a usar SQLite.

## Ordem de trabalho

1. Apresentar SQLite, suas características, usos e limitações.
2. Criar o projeto Expo e rodar a tela inicial.
3. Criar `src/screens` e `src/repositories`, os arquivos e os imports.
4. Completar o repository em memória: adicionar, listar, atualizar e excluir.
5. Construir o formulário e a lista; conectar as ações e testar o app.
6. Recarregar completamente o app e observar a perda dos dados em memória.
7. Instalar `expo-sqlite`, criar `src/database/conexao.js` e trocar apenas a implementação do repository.
8. Repetir os testes e verificar a persistência após encerrar e reabrir.

Os slides “Bola com vocês” vêm antes da solução e indicam arquivo, tarefa e resultado esperado. As notas do professor sugerem a retomada. Só avance para a conferência depois de os alunos executarem a tarefa; os ZIPs são pontos de conferência, não o ponto de partida da oficina.

## Criar o projeto

```bash
npx create-expo-app@latest tarefas-aula20 --template blank
cd tarefas-aula20
npx expo start
```

Nesta etapa, não instale SQLite. Crie as pastas pelo editor:

```text
App.js
src/
├── repositories/
│   └── TarefaRepository.js
└── screens/
    └── TarefasScreen.js
```

O [molde do repository](exercicios/TarefaRepository.js) contém `inicializar` e `listar`, além de TODOs para os alunos implementarem. Ele não é o repository resolvido: as operações pendentes lançam mensagens de erro até serem completadas.

## Conferência 1 · Aplicação com array

[Baixar memoria.zip](memoria.zip). Copie `App.js` e a pasta `src` de `memoria/` para o projeto criado. Não copie a pasta `memoria` como uma pasta extra dentro do projeto.

- [App.js](memoria/App.js)
- [TarefasScreen.js](memoria/src/screens/TarefasScreen.js)
- [TarefaRepository.js](memoria/src/repositories/TarefaRepository.js)

Cadastre duas tarefas, conclua/reabra uma delas e exclua a outra. Recarregue completamente o aplicativo: o array e os dados voltam ao estado inicial. Fast Refresh pode preservar módulos ou estado e não deve ser usado como prova desse teste.

## Contrato usado pela tela

| Método | Entrada | Resultado ao usar await |
| --- | --- | --- |
| `inicializar()` | — | Prepara o armazenamento; não apaga tarefas. |
| `listar()` | — | Array de `{ id, titulo, concluida }`, ID decrescente. |
| `adicionar(titulo)` | Texto não vazio | ID da nova tarefa. |
| `atualizar(id, concluida)` | ID e status 0 ou 1 | Atualiza uma tarefa; falha se o ID não existir. |
| `excluir(id)` | ID | Remove uma tarefa; falha se o ID não existir. |

As duas implementações expõem as mesmas funções e usam Promises. `listar` devolve cópias dos objetos em memória, para que a tela não altere o armazenamento por referência. Os IDs identificam registros, não posições no array.

## Conferência 2 · Trocar o array por SQLite

Somente na parte final:

```bash
npx expo install expo-sqlite
```

Crie `src/database/conexao.js` e substitua o conteúdo de `src/repositories/TarefaRepository.js` pela implementação SQLite. O `App.js` e o `TarefasScreen.js` permanecem idênticos, inclusive seus imports.

```text
App.js                          ← permanece igual
src/
├── database/
│   └── conexao.js               ← novo
├── repositories/
│   └── TarefaRepository.js      ← nova implementação
└── screens/
    └── TarefasScreen.js         ← permanece igual
```

[Baixar sqlite.zip](sqlite.zip). Para conferir o resultado completo, copie `App.js` e `src` de `sqlite/` para o mesmo projeto.

- [App.js](sqlite/App.js)
- [TarefasScreen.js](sqlite/src/screens/TarefasScreen.js)
- [conexao.js](sqlite/src/database/conexao.js)
- [TarefaRepository.js](sqlite/src/repositories/TarefaRepository.js)

Execute no Android/iOS pelo Expo Go. O suporte web do `expo-sqlite` requer configuração de WebAssembly e cabeçalhos HTTP, fora desta oficina. `exemplo-sqlite.zip` é um alias do ZIP final para manter o download anterior disponível.

### Como a persistência é acrescentada

`abrirBanco` usa `openDatabaseAsync` e guarda a Promise da conexão. Se a abertura falhar, a referência é liberada para permitir outra tentativa. A conexão é reaproveitada durante a execução do aplicativo.

`inicializar` cria a tabela sem apagar registros existentes. Os valores digitados são passados como parâmetros em `runAsync`; `execAsync` recebe apenas o SQL fixo do esquema. As alterações são aguardadas antes de consultar novamente a lista.

A tela completa controla carregamento, bloqueio e mensagens. Se uma escrita funcionar, mas a releitura falhar, informa que a alteração foi feita e oferece Recarregar, sem pedir para repetir a escrita. Uma falha na preparação também permite nova tentativa. Esses cuidados são comuns aos dois repositories.

### Comprovar o resultado

1. Cadastre duas tarefas e conclua uma.
2. Encerre e reabra o mesmo app: títulos e status devem reaparecer.
3. Reabra a tarefa concluída e confirme a mudança após reiniciar.
4. Exclua uma tarefa e reabra: ela deve continuar ausente.
5. Teste um título com apóstrofo, como `Ler D'Ávila`.
6. Confira que título vazio, status inválido e ID ausente são tratados.

Os dados do array não são importados para o SQLite. A troca de implementação começa com uma tabela vazia; isso não é uma migração dos registros antigos. Não desinstale nem limpe os dados para testar persistência. `CREATE TABLE IF NOT EXISTS` não altera uma tabela antiga nem substitui uma migração de esquema.

SQLite não sincroniza aparelhos e não fornece, por padrão, a proteção de pequenos segredos do SecureStore. Há um escritor por vez por banco; muitos leitores podem coexistir. A adequação depende do uso e do volume de concorrência, não de uma proibição genérica de muitos registros.

## Fechamento

Acrescente `buscarPorId(id)` ao contrato e implemente nos dois repositories: `find` em memória e `getFirstAsync` com parâmetro no SQLite. Devolva objeto ou `null` nos dois casos. Confirme que a tela consome o mesmo resultado, independentemente do armazenamento.

## Referências

- [SQLite: usos apropriados e limites de concorrência](https://www.sqlite.org/whentouse.html)
- [SQLite: arquivo do banco](https://www.sqlite.org/onefile.html)
- [SQLite: transações](https://www.sqlite.org/transactional.html)
- [SQLite: particularidades e tipos](https://www.sqlite.org/quirks.html)
- [Expo SQLite: instalação e API](https://docs.expo.dev/versions/latest/sdk/sqlite/)
