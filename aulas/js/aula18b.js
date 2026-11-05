/* Uma única mensagem acompanha a aula inteira: Olá, MQTT! */
(() => {
  const $ = (id) => document.getElementById(id);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const protocol = $('objetivo');
  const protocolSteps = [
    {
      title: 'Os dois apps se conectam ao broker.',
      description: 'O broker é o servidor intermediário. Cada celular mantém sua própria conexão com ele.',
      broker: 'Conecta os clientes',
      next: 'Assinar o tópico →',
    },
    {
      title: 'B assina o tópico: “Quero receber por aqui”.',
      description: 'A assinatura informa ao broker qual tópico B quer acompanhar. Assinar ainda não envia uma mensagem.',
      broker: 'Registra a assinatura de B',
      next: 'Publicar mensagem →',
    },
    {
      title: 'A publica “Olá, MQTT!” no mesmo tópico.',
      description: 'A envia o tópico e o texto ao broker. Não precisa conhecer o endereço do celular B.',
      broker: 'Recebe a publicação de A',
      next: 'Entregar a B →',
    },
    {
      title: 'O broker entrega a mensagem a B.',
      description: 'B recebe porque assinou esse tópico. Outros clientes que o assinarem também podem receber.',
      broker: 'Encaminha a quem assinou',
    },
  ];
  let protocolPrevious = -1;
  let protocolArrivalTimer;
  let protocolPlaybackTimer;
  let protocolPlaying = false;
  const protocolStage = () =>
    Math.min(protocol.querySelectorAll('.protocol-cue.visible').length, 3);

  function stopProtocolPlayback() {
    clearTimeout(protocolPlaybackTimer);
    protocolPlaying = false;
    $('protocol-play').textContent = '▶ Reproduzir';
    $('protocol-play').setAttribute('aria-pressed', 'false');
  }

  function syncProtocol(animate = false) {
    const stage = protocolStage();
    const step = protocolSteps[stage];
    clearTimeout(protocolArrivalTimer);
    protocol.classList.remove('is-animating');
    protocol.dataset.stage = stage;
    protocol.dataset.arrived = 'false';
    $('protocol-title').textContent = step.title;
    $('protocol-description').textContent = step.description;
    $('protocol-broker-status').textContent = step.broker;
    $('protocol-step-number').textContent = String(stage + 1).padStart(2, '0');
    $('protocol-count').textContent = `${stage + 1} / 4`;
    $('protocol-prev').disabled = stage === 0;
    $('protocol-next').hidden = stage === 3;
    $('protocol-replay').hidden = stage !== 3;
    if (stage < 3) $('protocol-next').textContent = step.next;
    protocol.querySelectorAll('.protocol-steps li').forEach((item, index) => {
      item.classList.toggle('is-complete', index < stage);
      if (index === stage) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    $('protocol-packet').textContent = stage === 1 ? 'ASSINAR TÓPICO' : 'Olá, MQTT!';
    $('protocol-subscription').textContent = stage === 0
      ? 'Nenhuma assinatura ainda' : '✓ B assinou este tópico';
    $('protocol-receive-label').textContent = stage === 0
      ? 'Ainda não assinou o tópico' : '✓ Assinou o tópico do broker';

    const arrive = () => {
      protocol.dataset.arrived = String(stage === 3);
      if (stage === 1) {
        $('protocol-subscription').textContent = '✓ B assinou este tópico';
        $('protocol-receive-label').textContent = '✓ Assinou o tópico do broker';
      }
      if (stage === 3) $('protocol-receive-label').textContent = '✓ Mensagem recebida';
      protocol.classList.remove('is-animating');
    };
    if (animate && stage > protocolPrevious && stage > 0 && !reducedMotion) {
      if (stage === 1) {
        $('protocol-subscription').textContent = 'Registrando a assinatura…';
        $('protocol-receive-label').textContent = 'Solicitando a assinatura…';
      }
      void protocol.offsetWidth;
      protocol.classList.add('is-animating');
      protocolArrivalTimer = setTimeout(arrive, 1100);
    } else {
      arrive();
    }
    protocolPrevious = stage;
  }

  function restartProtocol() {
    const position = Reveal.getIndices(protocol);
    Reveal.slide(position.h, position.v, -1);
    syncProtocol();
  }
  $('protocol-prev').addEventListener('click', () => {
    stopProtocolPlayback();
    Reveal.prevFragment();
    if (protocolStage() === 0) $('protocol-next').focus({ preventScroll: true });
  });
  $('protocol-next').addEventListener('click', () => {
    stopProtocolPlayback();
    Reveal.nextFragment();
    if (protocolStage() === 3) $('protocol-replay').focus({ preventScroll: true });
  });
  $('protocol-replay').addEventListener('click', () => {
    stopProtocolPlayback();
    restartProtocol();
    $('protocol-next').focus({ preventScroll: true });
  });
  $('protocol-play').addEventListener('click', () => {
    if (protocolPlaying) {
      stopProtocolPlayback();
      return;
    }
    if (protocolStage() === 3) restartProtocol();
    protocolPlaying = true;
    $('protocol-play').textContent = 'Ⅱ Pausar';
    $('protocol-play').setAttribute('aria-pressed', 'true');
    const advance = () => {
      protocolPlaybackTimer = setTimeout(() => {
        if (!protocolPlaying || Reveal.getCurrentSlide() !== protocol) {
          stopProtocolPlayback();
          return;
        }
        Reveal.nextFragment();
        if (protocolStage() === 3) stopProtocolPlayback();
        else advance();
      }, 3000);
    };
    advance();
  });
  Reveal.on('fragmentshown', () => {
    if (Reveal.getCurrentSlide() === protocol) syncProtocol(true);
  });
  Reveal.on('fragmenthidden', () => {
    if (Reveal.getCurrentSlide() === protocol) syncProtocol();
  });
  Reveal.on('slidechanged', (event) => {
    stopProtocolPlayback();
    clearTimeout(protocolArrivalTimer);
    protocol.classList.remove('is-animating');
    if (event.currentSlide === protocol) syncProtocol();
  });
  Reveal.on('overviewshown', stopProtocolPlayback);
  document.addEventListener('keydown', (event) => {
    if (Reveal.getCurrentSlide() === protocol &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', ' '].includes(event.key)) {
      stopProtocolPlayback();
    }
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopProtocolPlayback();
  });
  function location(slide) {
    if (slide)
      $('lesson-location').textContent = 'AULA 18b / ' + slide.dataset.location;
  }
  Reveal.on('slidechanged', (event) => location(event.currentSlide));
  Reveal.initialize({
    width: 1200,
    height: 800,
    margin: 0.04,
    center: false,
    hash: true,
    controls: true,
    progress: true,
    slideNumber: 'h.v',
    transition: reducedMotion ? 'none' : 'slide',
    autoAnimate: !reducedMotion,
    autoAnimateDuration: 0.7,
    backgroundTransition: 'fade',
    plugins: [RevealHighlight, RevealMenu, RevealNotes],
    menu: {
      side: 'left',
      numbers: false,
      titleSelector: 'h1, h2',
      loadIcons: false,
    },
    pdfSeparateFragments: false,
  }).then(() => {
    syncProtocol();
    location(Reveal.getCurrentSlide());
    document
      .querySelector('.slide-menu-button a')
      ?.setAttribute('aria-label', 'Abrir as seções da aula');
  });
})();
