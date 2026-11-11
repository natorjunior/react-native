# Aula 19 · Armazenamento local

Três exemplos independentes. Use um `App.js` por vez em um projeto Expo com template `blank` (JavaScript).

```bash
npx create-expo-app@latest armazenamento-aula19 --template blank
cd armazenamento-aula19
npx expo install @react-native-async-storage/async-storage expo-secure-store
```

Escolha um exemplo e copie seu arquivo para o `App.js` criado pelo template:

| Exemplo | Arquivo completo | Conteúdo |
| --- | --- | --- |
| Meu apelido | [preferencias/App.js](preferencias/App.js) | Salvar, ler e remover uma string no AsyncStorage. |
| Meu perfil | [perfil/App.js](perfil/App.js) | Salvar apelido e tema como JSON, validar e restaurar o padrão. |
| Sessão fictícia | [sessao/App.js](sessao/App.js) | Guardar, restaurar e remover um token de demonstração no SecureStore. |

Depois execute:

```bash
npx expo start
```

- **Preferências:** digite um apelido, salve, encerre o app e abra o mesmo projeto. O apelido deve reaparecer. Remova e repita: o campo deve estar vazio. Funciona no Android, iOS e web. Para web, se solicitado pelo Expo, execute `npx expo install react-dom react-native-web @expo/metro-runtime`.
- **Perfil:** digite um apelido, ative o tema escuro e salve. Ao reabrir, ambos devem ser restaurados. Edite sem salvar e reabra: volta o último perfil salvo. Use “Restaurar padrão” e reabra: apelido vazio e tema claro. O app valida os campos lidos do JSON e mostra erros sem sobrescrever automaticamente os dados.
- **Sessão:** execute no Android/iOS pelo Expo Go. Toque em “Simular entrada”, encerre e abra novamente: a sessão local deve ser encontrada. Toque em “Sair” e repita: deve aparecer “Sem sessão local”. Na web, o exemplo apresenta uma orientação sem chamar a API nativa.

O exemplo de sessão usa um token fictício para mostrar escrita, leitura e exclusão no SecureStore. Não faz login real, não consulta servidor nem valida expiração. Em um app real, o servidor emite e valida o token; encontrar um valor local não comprova autenticação. O token não é exibido na tela nem enviado ao console.

Nos três exemplos, a leitura inicial termina antes de liberar os controles. Gravação e exclusão são explícitas e exibem mensagens de sucesso somente após o `await`. Uma falha de leitura permite nova gravação ou remoção manual; não dispara gravação automática do estado inicial.

Não use desinstalação nem limpeza dos dados do Expo Go para testar reinício. SecureStore no Android perde seus dados na desinstalação; no iOS, itens podem permanecer no Keychain, sem garantia. Armazenamento local não sincroniza dois aparelhos.

Referências:

- [AsyncStorage no Expo](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- [Uso do AsyncStorage 2.x](https://react-native-async-storage.github.io/2.0/Usage/)
- [API do AsyncStorage 2.x](https://react-native-async-storage.github.io/2.0/API/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

Atividades ao final das seções:

- **AsyncStorage:** acrescente um tema persistente usando a chave `@aula19/tema` e uma string `claro` ou `escuro`. Salve, reabra e restaure o padrão removendo somente essa chave.
- **SecureStore:** combine perfil e sessão fictícia; ao sair, remova o token do SecureStore e preserve o tema no AsyncStorage. Demonstre a saída após reiniciar o app.

A seção de JSON mantém a introdução visual de objeto ↔ texto com `auto-animate`. Os exemplos principais voltaram a apresentar funções completas, sem troca de versões intermediárias. As notas do professor podem ser abertas com a tecla `S` no Reveal.js.
