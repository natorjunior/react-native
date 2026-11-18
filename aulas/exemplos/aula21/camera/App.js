import { useEffect, useRef, useState } from 'react';
import {
  AppState, Button, Image, Linking, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [permission, requestPermission, refreshPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const capturando = useRef(false);
  const [ativa, setAtiva] = useState(AppState.currentState === 'active');
  const [flash, setFlash] = useState('off');
  const [lanterna, setLanterna] = useState(false);
  const [pronta, setPronta] = useState(false);
  const [ocupada, setOcupada] = useState(false);
  const [foto, setFoto] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (estado) => {
      const emUso = estado === 'active';
      setAtiva(emUso);
      if (emUso) {
        refreshPermission().catch(() => setMensagem('Falha ao consultar a permissão.'));
      } else {
        setPronta(false);
        setLanterna(false);
      }
    });
    return () => subscription.remove();
  }, [refreshPermission]);

  async function abrirAjustes() {
    try {
      await Linking.openSettings();
    } catch {
      setMensagem('Abra as configurações do app manualmente.');
    }
  }

  async function fotografar() {
    if (!cameraRef.current || !pronta || capturando.current || !ativa) return;
    capturando.current = true;
    setOcupada(true);
    setMensagem('');
    try {
      const resultado = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      if (!resultado?.uri) throw new Error('Imagem não recebida.');
      setLanterna(false);
      setPronta(false);
      setFoto(resultado.uri);
    } catch {
      setMensagem('Falha ao capturar. Aguarde a câmera e tente novamente.');
    } finally {
      capturando.current = false;
      setOcupada(false);
    }
  }

  if (!permission) {
    return <View style={styles.container}><Text>Consultando permissão…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Câmera</Text>
        <Text>Permita o acesso para fotografar.</Text>
        <Button
          title={permission.canAskAgain ? 'Permitir câmera' : 'Abrir configurações'}
          onPress={permission.canAskAgain ? requestPermission : abrirAjustes}
        />
        {!!mensagem && <Text accessibilityLiveRegion="polite">{mensagem}</Text>}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Câmera</Text>
      {foto ? (
        <>
          <Image source={{ uri: foto }} style={styles.preview} accessibilityLabel="Foto capturada" />
          <Button title="Nova foto" onPress={() => { setPronta(false); setFoto(null); }} />
        </>
      ) : (
        <>
          {ativa ? (
            <CameraView
              ref={cameraRef}
              style={styles.preview}
              facing="back"
              flash={flash}
              enableTorch={ativa && lanterna}
              onCameraReady={() => setPronta(true)}
              onMountError={() => {
                setPronta(false);
                setMensagem('Câmera indisponível. Confira as permissões e o aparelho.');
              }}
            />
          ) : <Text>Câmera pausada.</Text>}
          <Button title={ocupada ? 'Capturando…' : 'Fotografar'} onPress={fotografar}
            disabled={!ativa || !pronta || ocupada} />
          <Button title={flash === 'on' ? 'Flash ligado' : 'Flash desligado'} disabled={ocupada || !pronta}
            onPress={() => { setLanterna(false); setFlash((atual) => atual === 'off' ? 'on' : 'off'); }} />
          <Button title={lanterna ? 'Desligar lanterna' : 'Ligar lanterna'}
            disabled={ocupada || !pronta}
            onPress={() => { setFlash('off'); setLanterna((atual) => !atual); }} />
        </>
      )}
      {!!mensagem && <Text accessibilityLiveRegion="polite">{mensagem}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 60, gap: 16, backgroundColor: '#f4f6f8' },
  titulo: { fontSize: 24, fontWeight: '700' },
  preview: { width: '100%', height: 360, borderRadius: 16, overflow: 'hidden' },
});
