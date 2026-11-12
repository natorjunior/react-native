# Conferência · sqlite

Crie o projeto com `npx create-expo-app@latest tarefas-aula20 --template blank` e entre com `cd tarefas-aula20`.

Copie App.js e src para a raiz desse projeto (sem criar uma pasta extra chamada sqlite).

```bash
npx expo install expo-sqlite
npx expo start
```

Execute em Android/iOS pelo Expo Go. O banco local preserva os dados após encerrar e reabrir, sem desinstalar.

O ZIP contém fontes, não node_modules ou um projeto Expo já instalado. App.js e a tela são idênticos nos dois pontos de conferência; a mudança está no repository e, na versão SQLite, no novo arquivo de conexão.
