/* Figuras e laboratórios da aula 18. Nenhuma conexão de rede ao abrir a aula. */
(() => {
  const $ = (id) => document.getElementById(id);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const beats = [
    {
      label: 'Bruno assina sua caixa de entrada',
      left: 'aguardando envio',
      right: 'SUBSCRIBE ←',
      broker: 'Assinatura registrada',
      received: 'Caixa de entrada pronta',
      code: "subscribe(topicFor('bruno'))",
      text: 'Bruno assina seu tópico. O broker registra a assinatura.',
    },
    {
      label: 'Ana cria e serializa o objeto',
      left: 'JSON.stringify',
      right: 'assinatura ativa',
      broker: 'Aguardando publicação',
      received: 'Aguardando mensagem',
      code: 'JSON.stringify(message)',
      text: 'Ana cria a mensagem e transforma o objeto em JSON.',
    },
    {
      label: 'Ana publica no tópico do Bruno',
      left: 'PUBLISH →',
      right: 'assinatura ativa',
      broker: 'Recebeu o JSON',
      received: 'Aguardando mensagem',
      code: "publish(topicFor('bruno'), payload)",
      text: 'Ana publica em …/chat/bruno e registra o envio local.',
      moving: 'left',
    },
    {
      label: 'O broker encaminha ao assinante',
      left: 'PUBACK ←',
      right: 'PUBLISH →',
      broker: 'Encaminhou para Bruno',
      received: 'JSON recebido',
      code: "client.on('message', onMessage)",
      text: 'O broker entrega a Bruno. PUBACK confirma o trecho até o broker.',
      moving: 'right',
    },
    {
      label: 'Bruno valida e atualiza a conversa',
      left: 'envio registrado',
      right: 'JSON.parse',
      broker: 'Distribuição concluída',
      received: '“Oi, Bruno!”',
      code: 'receiveMessage → add → setMessages',
      text: 'Bruno valida, guarda uma vez por ID e atualiza a tela.',
    },
  ];
  const storySlide = $('viagem');
  let storyStep = -1;
  function syncStory(animate = false) {
    const step = Math.min(
      storySlide.querySelectorAll('.story-cue.visible').length,
      beats.length - 1
    );
    const beat = beats[step];
    const changed = step !== storyStep;
    storyStep = step;
    storySlide.querySelector('.network-story').dataset.step = step;
    $('story-label').textContent = beat.label;
    $('story-count').textContent = `${String(step + 1).padStart(2, '0')} / 05`;
    $('left-label').textContent = beat.left;
    $('right-label').textContent = beat.right;
    storySlide.querySelector('.link-right > b').textContent = step === 0 ? '←' : '→';
    storySlide.querySelector('.link-left > b').textContent = step === 3 ? '←' : '→';
    $('broker-label').textContent = beat.broker;
    $('bruno-message').textContent = beat.received;
    $('story-code').textContent = beat.code;
    $('story-narration').textContent = beat.text;
    $('story-prev').disabled = step === 0;
    $('story-next').hidden = step === beats.length - 1;
    $('story-replay').hidden = step !== beats.length - 1;
    storySlide
      .querySelectorAll('.network-link')
      .forEach((link) => link.classList.remove('is-moving', 'is-active'));
    if (beat.moving) {
      const link = storySlide.querySelector(`.link-${beat.moving}`);
      link.classList.add('is-active');
      if (animate && changed && !reducedMotion) {
        void link.offsetWidth;
        link.classList.add('is-moving');
      }
    }
  }
  $('story-prev').addEventListener('click', () => Reveal.prevFragment());
  $('story-next').addEventListener('click', () => Reveal.nextFragment());
  $('story-replay').addEventListener('click', () => {
    const indices = Reveal.getIndices(storySlide);
    Reveal.slide(indices.h, indices.v, -1);
    syncStory();
    $('story-next').focus({ preventScroll: true });
  });
  Reveal.on('fragmentshown', () => {
    if (Reveal.getCurrentSlide() === storySlide) syncStory(true);
  });
  Reveal.on('fragmenthidden', () => {
    if (Reveal.getCurrentSlide() === storySlide) syncStory(true);
  });
  Reveal.on('slidechanged', (event) => {
    if (event.currentSlide === storySlide) syncStory();
  });

  document.querySelectorAll('.quiz').forEach((quiz) => {
    const feedback = quiz.querySelector('.quiz-feedback');
    quiz.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => {
        quiz
          .querySelectorAll('[data-answer]')
          .forEach((item) => item.classList.remove('is-correct', 'is-wrong'));
        const correct = button.dataset.answer === quiz.dataset.correct;
        button.classList.add(correct ? 'is-correct' : 'is-wrong');
        feedback.textContent = correct
          ? `✓ ${feedback.dataset.feedback}`
          : 'Tente outra opção. Pense na função dessa camada.';
      });
    });
    quiz.querySelector('.quiz-reset').addEventListener('click', () => {
      quiz
        .querySelectorAll('[data-answer]')
        .forEach((item) => item.classList.remove('is-correct', 'is-wrong'));
      feedback.textContent = 'Escolha para conferir.';
    });
  });

  // Simulação visual: dois arrays independentes e uma entrega via JSON.
  let serial = 0;
  let memories = { ana: [], bruno: [] };
  const names = { ana: 'Ana', bruno: 'Bruno' };
  function appendBubble(userId, message) {
    if (memories[userId].some((item) => item.id === message.id)) return false;
    memories[userId].push(message);
    const bubble = document.createElement('div');
    bubble.className = `bubble ${message.senderId === userId ? 'outgoing' : 'incoming'}`;
    bubble.textContent = message.content;
    const small = document.createElement('small');
    small.textContent = `${message.id} · ${message.senderId === userId ? 'você' : names[message.senderId]}`;
    bubble.append(small);
    $(`lab-${userId}`).append(bubble);
    $(`lab-${userId}`).scrollTop = $(`lab-${userId}`).scrollHeight;
    return true;
  }
  document.querySelectorAll('.lab-form').forEach((form) =>
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const senderId = form.dataset.user;
      const receiverId = senderId === 'ana' ? 'bruno' : 'ana';
      const input = form.querySelector('input');
      const content = input.value.trim();
      if (!content) return;
      const message = {
        id: `m${++serial}`,
        senderId,
        receiverId,
        content,
        createdAt: new Date().toISOString(),
      };
      appendBubble(senderId, message);
      const payload = JSON.stringify(message);
      appendBubble(receiverId, JSON.parse(payload));
      if ($('lab-duplicate').checked) appendBubble(receiverId, JSON.parse(payload));
      $('lab-route').textContent = `PUBLISH → …/chat/${receiverId}`;
      $('lab-payload').textContent = JSON.stringify(message, null, 2);
      $('lab-result').textContent = $('lab-duplicate').checked
        ? '2 entregas · mesmo id · 1 inserção no destinatário.'
        : '1 publicação · 1 bolha em cada aparelho.';
      const icon = document.querySelector('.lab-broker-icon');
      icon.classList.remove('lab-flash');
      void icon.offsetWidth;
      icon.classList.add('lab-flash');
      input.value = '';
      input.focus();
    })
  );
  $('lab-reset').addEventListener('click', () => {
    memories = { ana: [], bruno: [] };
    serial = 0;
    $('lab-ana').replaceChildren();
    $('lab-bruno').replaceChildren();
    $('lab-route').textContent = 'Aguardando publicação';
    $('lab-payload').textContent = 'Envie uma mensagem para ver o JSON.';
    $('lab-result').textContent = 'Cada aparelho tem seu próprio array.';
    document.querySelectorAll('.lab-form').forEach((form) => form.reset());
    $('lab-duplicate').checked = false;
  });

  // Rede real: carregamento sob demanda, limites no log e isolamento entre tentativas.
  let client = null;
  let loadPromise = null;
  let generation = 0;
  let subscribedTopic = '';
  function log(message) {
    const rows = $('mq-log').textContent.trimEnd().split('\n');
    rows.push(`${new Date().toLocaleTimeString('pt-BR')}  ${message}`);
    $('mq-log').textContent = rows.slice(-80).join('\n') + '\n';
    $('mq-log').scrollTop = $('mq-log').scrollHeight;
  }
  function status(message, ready = false) {
    $('mq-status').textContent = message;
    $('mq-send').disabled = !ready;
  }
  function disconnect() {
    generation++;
    const previous = client;
    client = null;
    previous?.removeAllListeners();
    previous?.end(true);
    subscribedTopic = '';
    $('mq-topic').disabled = false;
    $('mq-connect').disabled = false;
    $('mq-disconnect').disabled = true;
    status('Desconectado');
  }
  function loadMqtt() {
    if (typeof window.mqtt?.connect === 'function')
      return Promise.resolve(window.mqtt);
    if (!loadPromise) {
      loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/mqtt@5.10.4/dist/mqtt.min.js';
        let settled = false;
        const fail = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          script.remove();
          loadPromise = null;
          reject(
            new Error(
              'Não foi possível carregar MQTT.js. Confira a internet e tente novamente.'
            )
          );
        };
        const timer = setTimeout(fail, 12000);
        script.onload = () => {
          if (settled) return;
          if (typeof window.mqtt?.connect !== 'function') return fail();
          settled = true;
          clearTimeout(timer);
          resolve(window.mqtt);
        };
        script.onerror = fail;
        document.head.append(script);
      });
    }
    return loadPromise;
  }
  $('mq-connect-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const topic = $('mq-topic').value.trim();
    if (!topic || /[+#\u0000]/.test(topic))
      return log('Use um tópico concreto, sem +, # ou caracteres nulos.');
    disconnect();
    const attempt = generation;
    $('mq-connect').disabled = true;
    $('mq-topic').disabled = true;
    $('mq-disconnect').disabled = false;
    status('Carregando biblioteca…');
    try {
      const mqttLibrary = await loadMqtt();
      if (attempt !== generation) return;
      status('Conectando…');
      const active = mqttLibrary.connect('wss://broker.hivemq.com:8884/mqtt', {
        clientId: `aula18-demo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        reconnectPeriod: 2000,
        connectTimeout: 10000,
        resubscribe: false,
        clean: true,
      });
      client = active;
      active.on('connect', () => {
        if (client !== active) return;
        status('Assinando…');
        log('CONNACK recebido. SUBSCRIBE → ' + topic);
        active.subscribe(topic, { qos: 1 }, (error, granted) => {
          if (client !== active) return;
          if (
            error ||
            !granted?.length ||
            granted.some((item) => item.qos === 128)
          ) {
            status('Assinatura recusada');
            return log('Falha no SUBACK. Desconecte para tentar novamente.');
          }
          subscribedTopic = topic;
          status('Conectado e assinado', true);
          log('SUBACK recebido: ' + topic);
        });
      });
      active.on('message', (receivedTopic, payload) => {
        if (client === active && receivedTopic === topic)
          log(
            `PUBLISH recebido [${receivedTopic}]: ${payload.toString().slice(0, 500)}`
          );
      });
      active.on('reconnect', () => {
        if (client === active) status('Reconectando…');
      });
      active.on('close', () => {
        if (client === active) status('Sem conexão · tentando reconectar…');
      });
      active.on('error', (error) => {
        if (client === active) {
          status('Erro na conexão');
          log('Erro: ' + error.message);
        }
      });
    } catch (error) {
      if (attempt !== generation) return;
      disconnect();
      log(error.message);
      status('Falha ao conectar');
    }
  });
  $('mq-disconnect').addEventListener('click', () => {
    disconnect();
    log('Cliente encerrado.');
  });
  $('mq-send-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = $('mq-text').value.trim();
    if (!text || !client?.connected || $('mq-send').disabled || !subscribedTopic)
      return;
    const active = client;
    active.publish(subscribedTopic, text, { qos: 1, retain: false }, (error) => {
      if (client === active)
        log(
          error
            ? 'Falha ao publicar: ' + error.message
            : 'PUBACK recebido · broker confirmou a publicação.'
        );
    });
    log('PUBLISH enviado: ' + text);
    $('mq-text').value = '';
  });
  window.addEventListener('pagehide', disconnect);

  function syncLessonLocation(slide) {
    if (!slide) return;
    $('lesson-location').textContent =
      `${slide.dataset.lessonSection} · ${slide.dataset.lessonSubsection}`;
  }
  Reveal.on('slidechanged', (event) => syncLessonLocation(event.currentSlide));

  // Ajusta a fonte ao tamanho do trecho: maior quando cabe, menor quando é longo.
  document.querySelectorAll('.editor pre code').forEach((code) => {
    const lines = code.textContent.trim().split('\n');
    const longest = Math.max(...lines.map((line) => line.length));
    const height = code.closest('.terminal-editor') ? 326 : 381;
    const size = Math.min(22, height / (lines.length * 1.5), 650 / (longest * 0.602));
    code.closest('.editor').style.setProperty('--code-size', `${Math.max(16, Math.floor(size))}px`);
  });

  syncStory();
  Reveal.initialize({
    width: 1200,
    height: 800,
    margin: 0.04,
    center: false,
    controls: true,
    progress: true,
    slideNumber: 'h.v',
    hash: true,
    transition: reducedMotion ? 'none' : 'slide',
    backgroundTransition: 'fade',
    autoAnimateDuration: reducedMotion ? 0 : 0.45,
    plugins: [RevealHighlight, RevealMenu, RevealNotes],
    menu: {
      side: 'left',
      width: 330,
      numbers: false,
      titleSelector: 'h1, h2',
      loadIcons: false,
    },
    pdfSeparateFragments: false,
  }).then(() => {
    syncStory();
    syncLessonLocation(Reveal.getCurrentSlide());
    document
      .querySelector('.slide-menu-button a')
      ?.setAttribute('aria-label', 'Abrir sumário de seções e subseções');
  });
})();
