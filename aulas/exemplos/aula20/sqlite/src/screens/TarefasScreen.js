import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import * as TarefaRepository from '../repositories/TarefaRepository';

export default function TarefasScreen() {
  const [titulo, setTitulo] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const bloqueado = carregando || ocupado || !pronto;

  useEffect(() => {
    let ativo = true;
    async function preparar() {
      try {
        await TarefaRepository.inicializar();
        const lista = await TarefaRepository.listar();
        if (ativo) { setTarefas(lista); setPronto(true); }
      } catch {
        if (ativo) setMensagem('Falha ao abrir. Toque em Recarregar.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    preparar();
    return () => { ativo = false; };
  }, []);

  async function recarregar() {
    if (carregando || ocupado) return;
    setOcupado(true);
    try {
      await TarefaRepository.inicializar();
      setTarefas(await TarefaRepository.listar());
      setPronto(true);
      setMensagem('Lista carregada.');
    } catch {
      setPronto(false);
      setMensagem('Falha na leitura. Tente recarregar novamente.');
    } finally {
      setOcupado(false);
    }
  }

  async function atualizarLista(sucesso) {
    try {
      setTarefas(await TarefaRepository.listar());
      setMensagem(sucesso);
    } catch {
      setPronto(false);
      setMensagem('Alteração feita. Toque em Recarregar para ler a lista.');
    }
  }

  async function adicionar() {
    if (bloqueado || !titulo.trim()) return;
    setOcupado(true);
    try {
      await TarefaRepository.adicionar(titulo);
      setTitulo('');
      await atualizarLista('Tarefa adicionada.');
    } catch {
      setMensagem('Não foi possível adicionar. Tente novamente.');
    } finally {
      setOcupado(false);
    }
  }

  async function alternar(tarefa) {
    if (bloqueado) return;
    setOcupado(true);
    try {
      await TarefaRepository.atualizar(tarefa.id, tarefa.concluida ? 0 : 1);
      await atualizarLista('Tarefa atualizada.');
    } catch {
      setMensagem('Não foi possível atualizar. Recarregue a lista.');
    } finally {
      setOcupado(false);
    }
  }

  async function excluir(id) {
    if (bloqueado) return;
    setOcupado(true);
    try {
      await TarefaRepository.excluir(id);
      await atualizarLista('Tarefa excluída.');
    } catch {
      setMensagem('Não foi possível excluir. Recarregue a lista.');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 64, gap: 12 }}>
      <Text style={{ fontSize: 28 }}>Minhas tarefas</Text>
      <TextInput accessibilityLabel="Título da tarefa"
        placeholder="Digite uma tarefa" value={titulo}
        onChangeText={setTitulo} editable={!bloqueado}
        style={{ borderWidth: 1, borderColor: '#536875', padding: 12 }} />
      <Button title="Adicionar" onPress={adicionar}
        disabled={bloqueado || !titulo.trim()} />
      <Button title="Recarregar" onPress={recarregar}
        disabled={carregando || ocupado} />
      <Text accessibilityLiveRegion="polite">{mensagem}</Text>
      <FlatList data={tarefas} keyExtractor={item => String(item.id)}
        ListEmptyComponent={<Text>
          {carregando ? 'Carregando…' : pronto ? 'Nenhuma tarefa.' : 'Lista indisponível.'}
        </Text>}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 16, gap: 8, borderBottomWidth: 1,
            borderColor: '#dbe4e8' }}>
            <Text style={{ fontSize: 20,
              textDecorationLine: item.concluida ? 'line-through' : 'none' }}>
              {item.titulo}
            </Text>
            <Text>{item.concluida ? 'Concluída' : 'Pendente'}</Text>
            <Button title={item.concluida ? 'Reabrir tarefa' : 'Concluir'}
              onPress={() => alternar(item)} disabled={bloqueado} />
            <Button title="Excluir" onPress={() => excluir(item.id)}
              disabled={bloqueado} />
          </View>
        )} />
    </View>
  );
}
