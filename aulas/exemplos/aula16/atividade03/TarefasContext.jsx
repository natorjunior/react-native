import { createContext, useState, useRef } from 'react';

const iniciais = [
  { id: '1', titulo: 'Estudar React', concluida: false },
  { id: '2', titulo: 'Praticar props', concluida: false },
  { id: '3', titulo: 'Revisar estado', concluida: false },
];

export const TarefasContext = createContext(null);

export function TarefasProvider({ children }) {
  const [tarefas, setTarefas] = useState(iniciais);
  const proximoId = useRef(4);

  function adicionar(texto) {
    const titulo = texto.trim();
    if (!titulo) return;
    const nova = {
      id: String(proximoId.current),
      titulo,
      concluida: false,
    };
    proximoId.current += 1;
    setTarefas(atuais => [...atuais, nova]);
  }

  function alternar(id) {
    setTarefas(atuais => atuais.map(tarefa =>
      tarefa.id === id
        ? { ...tarefa, concluida: !tarefa.concluida }
        : tarefa
    ));
  }
  function remover(id) {
    setTarefas(atuais => atuais.filter(tarefa => tarefa.id !== id));
  }

  return (
    <TarefasContext.Provider
      value={{ tarefas, adicionar, alternar, remover }}
    >
      {children}
    </TarefasContext.Provider>
  );
}
