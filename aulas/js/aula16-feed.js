/* Simulação didática: dados persistentes e instâncias de componentes de um feed. */
(() => {
  const dialog = document.getElementById('feed-lifecycle-modal');
  const opener = document.querySelector('#flatlist-rolagem [data-open-feed]');
  if (!dialog || !opener) return;

  const ROW_HEIGHT = 224;
  const VISIBLE_POSTS = 2;
  const INITIAL_BATCH = 2;
  const BUFFER = 1;
  const seed = [
    ['Ana Lima', 'AL', 'Um intervalo entre as aulas para olhar o campus com calma.', 'Vida no campus'],
    ['Bruno Costa', 'BC', 'Meu primeiro componente em React Native saiu do papel!', 'Hello, React'],
    ['Clara Alves', 'CA', 'Quixadá tem um pôr do sol diferente a cada dia.', 'Fim de tarde'],
    ['Diego Melo', 'DM', 'Café e uma boa conversa para começar o projeto.', 'Pausa para o café'],
    ['Elisa Rocha', 'ER', 'Hoje foi dia de desenhar as telas do nosso aplicativo.', 'Ideias em construção'],
    ['Rafa Santos', 'RS', 'Nossa equipe colocou a primeira versão do app para rodar.', 'Pequenas conquistas'],
    ['Gabi Sousa', 'GS', 'Uma trilha curta, muita conversa e novas ideias.', 'Além da tela'],
    ['Hugo Reis', 'HR', 'Testando uma nova paleta para o projeto da disciplina.', 'Cores e formas'],
    ['Iara Nunes', 'IN', 'Aprender junto faz o caminho ficar mais interessante.', 'Troca de ideias'],
    ['João Silva', 'JS', 'Últimos ajustes antes de apresentar o aplicativo.', 'Dia de demo'],
    ['Lia Martins', 'LM', 'O melhor lugar para anotar a próxima ideia.', 'Caderno aberto'],
    ['Mateus Dias', 'MD', 'Mais uma semana de código, testes e descobertas.', 'Até a próxima'],
  ];
  const scenes = [
    { label: 'Dados', title: 'Primeiro, os registros.', text: 'Os 12 posts já estão no array. Ainda não criamos os componentes que desenham os cards.', start: null },
    { label: 'Montar', title: 'O feed ganha seus primeiros cards.', text: 'Os posts 01 e 02 aparecem na tela. O post 03 é preparado como margem. Cada card recebe sua primeira instância.', start: 0 },
    { label: 'Rolar', title: 'Entram novos posts.', text: 'Ao descer, montamos os posts 04 e 05. Os posts 01 e 02 continuam montados por pertencerem ao lote inicial deste modelo.', start: 2 },
    { label: 'Desmontar', title: 'Longe da janela, o card sai.', text: 'Agora vemos os posts 06 e 07. Os componentes dos posts 03 e 04 foram desmontados. Seus registros continuam no array à esquerda.', start: 5 },
    { label: 'Curtir', title: 'Uma curtida muda os dados.', text: 'Curtimos o post 06 e guardamos esse valor no array. O card é atualizado na mesma instância: atualizar não exige desmontar.', start: 5, like: 5 },
    { label: 'Voltar', title: 'O post 03 é construído de novo.', text: 'Voltamos aos posts 03 e 04. Eles recebem novas instâncias. O post 06 é desmontado, mas sua curtida continua guardada no array.', start: 2 },
    { label: 'Reconstruir', title: 'Nova instância. Curtida preservada.', text: 'Ao voltar ao post 06, seu componente é montado novamente. O coração continua marcado porque a curtida vem dos dados, fora do card.', start: 5 },
  ];

  const viewport = dialog.querySelector('.social-feed-viewport');
  const track = dialog.querySelector('.social-feed-track');
  const placeholder = dialog.querySelector('.feed-before-mount');
  const dataList = dialog.querySelector('.feed-data-list');
  const eventLog = dialog.querySelector('.feed-event-log');
  const steps = dialog.querySelector('.feed-steps');
  const previous = dialog.querySelector('[data-feed-previous]');
  const next = dialog.querySelector('[data-feed-next]');
  const up = dialog.querySelector('[data-feed-up]');
  const down = dialog.querySelector('[data-feed-down]');
  const mounted = new Map();
  let posts;
  let mounts;
  let events;
  let currentStep = 0;
  let started = false;
  let firstVisible = 0;
  let scrollFrame = 0;
  let presentationSettings;
  let returnFocus;
  let lastProgrammaticScroll = null;

  const postNumber = index => String(index + 1).padStart(2, '0');

  seed.forEach((post, index) => {
    const row = document.createElement('li');
    row.dataset.recordId = String(index);
    row.innerHTML = `<span class="feed-record-id">${postNumber(index)}</span><span class="feed-record-person">${post[0]}</span><span class="feed-record-state"></span><span class="feed-record-like" aria-hidden="true">♡</span>`;
    dataList.appendChild(row);
  });
  scenes.forEach((scene, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.feedStep = String(index);
    button.innerHTML = `<span>${index + 1}</span>${scene.label}`;
    button.addEventListener('click', () => jumpTo(index));
    steps.appendChild(button);
  });

  function recordEvent(kind, text) {
    events.unshift({ kind, text });
    events.length = Math.min(events.length, 5);
  }

  function updateLike(index) {
    const card = mounted.get(index);
    if (!card) return;
    const button = card.querySelector('[data-feed-like]');
    button.setAttribute('aria-pressed', String(posts[index].liked));
    button.innerHTML = `<span aria-hidden="true">${posts[index].liked ? '♥' : '♡'}</span> ${posts[index].liked ? 'Curtido' : 'Curtir'}`;
    card.querySelector('.post-like-count').textContent = `${posts[index].baseLikes + Number(posts[index].liked)} curtidas`;
  }

  function mountPost(index) {
    mounts[index] += 1;
    const post = posts[index];
    const slot = document.createElement('div');
    slot.className = `social-post-slot${mounts[index] > 1 ? ' is-rebuilt' : ''}`;
    slot.dataset.postIndex = String(index);
    slot.dataset.instance = String(mounts[index]);
    slot.style.top = `${index * ROW_HEIGHT}px`;
    slot.innerHTML = `<article class="social-post" aria-label="Post ${postNumber(index)} de ${post.author}">
      <header class="social-post-author"><span class="post-avatar post-color-${index % 4}">${post.initials}</span><div><strong>${post.author}</strong><span>Campus · agora</span></div><span class="post-instance">${mounts[index] > 1 ? 'Remontado' : 'Montado'} · #${mounts[index]}</span></header>
      <p class="social-post-caption">${post.caption}</p>
      <div class="post-art post-art-${index % 3}" aria-hidden="true"><i></i><span>${post.tag}</span></div>
      <footer class="social-post-actions"><button type="button" data-feed-like="${index}" aria-label="Curtir post ${postNumber(index)}" aria-pressed="false"></button><span class="post-like-count"></span><span class="post-id">post_${postNumber(index)}</span></footer>
    </article>`;
    mounted.set(index, slot);
    track.appendChild(slot);
    updateLike(index);
    recordEvent(mounts[index] > 1 ? 'rebuild' : 'mount', `${mounts[index] > 1 ? 'Remontar' : 'Montar'} post ${postNumber(index)} · instância #${mounts[index]}`);
  }

  function visibleIndices() {
    const first = Math.floor(viewport.scrollTop / ROW_HEIGHT);
    const last = Math.min(posts.length - 1, Math.ceil((viewport.scrollTop + viewport.clientHeight) / ROW_HEIGHT) - 1);
    return { first, last };
  }

  function renderPanels() {
    const visible = started ? visibleIndices() : { first: -1, last: -1 };
    dataList.querySelectorAll('li').forEach((row, index) => {
      const isVisible = started && index >= visible.first && index <= visible.last;
      const state = isVisible ? 'visible' : mounted.has(index) ? index < INITIAL_BATCH ? 'retained' : 'buffer' : 'unmounted';
      row.dataset.state = state;
      row.querySelector('.feed-record-state').textContent = isVisible ? 'na tela' : mounted.has(index) ? index < INITIAL_BATCH ? 'inicial' : 'margem' : 'dados';
      row.querySelector('.feed-record-like').textContent = posts[index].liked ? '♥' : '♡';
      row.classList.toggle('is-liked', posts[index].liked);
      row.setAttribute('aria-label', `Post ${postNumber(index)}, ${posts[index].author}: ${isVisible ? 'visível' : mounted.has(index) ? 'montado fora da tela' : 'sem componente montado'}${posts[index].liked ? ', curtido' : ''}`);
    });
    dialog.querySelector('[data-feed-count="data"]').textContent = posts.length;
    dialog.querySelector('[data-feed-count="mounted"]').textContent = mounted.size;
    dialog.querySelector('[data-feed-count="rebuilt"]').textContent = mounts.reduce((sum, count) => sum + Math.max(0, count - 1), 0);
    eventLog.replaceChildren();
    events.forEach(event => {
      const li = document.createElement('li');
      li.dataset.event = event.kind;
      li.textContent = event.text;
      eventLog.appendChild(li);
    });
    dialog.querySelector('.feed-visible-label').textContent = started ? `Posts ${postNumber(visible.first)}–${postNumber(visible.last)} na tela` : 'Aguardando montagem';
    up.disabled = !started || viewport.scrollTop < 1;
    down.disabled = !started || viewport.scrollTop >= viewport.scrollHeight - viewport.clientHeight - 1;
  }

  function updateWindow() {
    if (!started) return;
    const { first, last } = visibleIndices();
    firstVisible = first;
    const wanted = new Set(Array.from({ length: INITIAL_BATCH }, (_, index) => index));
    for (let index = Math.max(0, first - BUFFER); index <= Math.min(posts.length - 1, last + BUFFER); index++) wanted.add(index);
    for (const [index, card] of mounted) {
      if (!wanted.has(index)) {
        if (card.contains(document.activeElement)) viewport.focus({ preventScroll: true });
        card.remove();
        mounted.delete(index);
        recordEvent('unmount', `Desmontar post ${postNumber(index)} · registro preservado`);
      }
    }
    for (const index of [...wanted].sort((a, b) => a - b)) if (!mounted.has(index)) mountPost(index);
    renderPanels();
  }

  function setDescription(title, text, label) {
    dialog.querySelector('.feed-scene-index').textContent = label;
    dialog.querySelector('#feed-scene-title').textContent = title;
    dialog.querySelector('.feed-scene-description').textContent = text;
  }

  function refreshStep() {
    steps.querySelectorAll('button').forEach((button, index) => {
      button.setAttribute('aria-current', index === currentStep ? 'step' : 'false');
      button.classList.toggle('is-done', index < currentStep);
    });
    previous.disabled = currentStep === 0;
    next.disabled = currentStep === scenes.length - 1;
    const scene = scenes[currentStep];
    setDescription(scene.title, scene.text, `ETAPA ${currentStep + 1} / ${scenes.length}`);
  }

  function moveTo(start) {
    started = true;
    if (placeholder.contains(document.activeElement)) viewport.focus({ preventScroll: true });
    placeholder.hidden = true;
    viewport.classList.add('has-posts');
    const top = Math.max(0, Math.min(posts.length - VISIBLE_POSTS, start)) * ROW_HEIGHT;
    lastProgrammaticScroll = top;
    viewport.scrollTop = top;
    updateWindow();
  }

  function applyScene(index) {
    const scene = scenes[index];
    if (scene.start !== null) moveTo(scene.start);
    if (scene.like !== undefined) {
      posts = posts.map((post, i) => i === scene.like ? { ...post, liked: true } : post);
      updateLike(scene.like);
      recordEvent('data', `Atualizar post ${postNumber(scene.like)} · curtida salva no array`);
      renderPanels();
    }
    currentStep = index;
    refreshStep();
  }

  function resetState() {
    cancelAnimationFrame(scrollFrame);
    if (track.contains(document.activeElement)) viewport.focus({ preventScroll: true });
    mounted.clear();
    track.replaceChildren();
    track.style.height = `${seed.length * ROW_HEIGHT}px`;
    posts = seed.map(([author, initials, caption, tag], index) => ({ author, initials, caption, tag, liked: false, baseLikes: 12 + index * 3 }));
    mounts = seed.map(() => 0);
    events = [{ kind: 'data', text: '12 registros recebidos · nenhum componente montado' }];
    started = false;
    firstVisible = 0;
    lastProgrammaticScroll = 0;
    viewport.scrollTop = 0;
    viewport.classList.remove('has-posts');
    placeholder.hidden = false;
    currentStep = 0;
    refreshStep();
    renderPanels();
  }

  function jumpTo(index) {
    if (index < 0 || index >= scenes.length) return;
    // Avançar preserva as instâncias existentes, incluindo o lote inicial.
    if (index > currentStep) {
      for (let sceneIndex = currentStep + 1; sceneIndex <= index; sceneIndex++) applyScene(sceneIndex);
      return;
    }
    // Rever uma etapa anterior reconstitui o ponto correspondente da história.
    resetState();
    for (let sceneIndex = 1; sceneIndex <= index; sceneIndex++) applyScene(sceneIndex);
  }

  function restorePresentation() {
    cancelAnimationFrame(scrollFrame);
    document.body.classList.remove('feed-modal-open');
    if (presentationSettings) {
      const settings = presentationSettings;
      presentationSettings = null;
      Reveal.configure(settings);
    }
    returnFocus?.focus({ preventScroll: true });
  }

  function closeModal() {
    dialog.close();
    restorePresentation();
  }

  opener.addEventListener('click', () => {
    if (dialog.open) return;
    returnFocus = document.activeElement;
    const config = Reveal.getConfig();
    presentationSettings = { keyboard: config.keyboard, touch: config.touch, mouseWheel: config.mouseWheel };
    Reveal.configure({ keyboard: false, touch: false, mouseWheel: false });
    document.body.classList.add('feed-modal-open');
    dialog.showModal();
    resetState();
    dialog.querySelector('[data-feed-first]').focus({ preventScroll: true });
  });
  dialog.querySelector('[data-feed-close]').addEventListener('click', closeModal);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
  dialog.addEventListener('close', () => {
    if (!dialog.open) restorePresentation();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal();
    }
  });
  dialog.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')]
        .filter(element => element.getClientRects().length > 0 && !element.closest('[hidden]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!focusable.includes(document.activeElement) ||
          (!event.shiftKey && document.activeElement === last) ||
          (event.shiftKey && document.activeElement === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      jumpTo(currentStep + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.querySelector('[data-feed-first]').addEventListener('click', () => {
    jumpTo(1);
    viewport.focus({ preventScroll: true });
  });
  previous.addEventListener('click', () => jumpTo(currentStep - 1));
  next.addEventListener('click', () => jumpTo(currentStep + 1));
  dialog.querySelector('[data-feed-reset]').addEventListener('click', resetState);
  up.addEventListener('click', () => {
    moveTo(Math.ceil(viewport.scrollTop / ROW_HEIGHT) - 1);
    setDescription('Voltando pelo feed.', 'Posts que foram desmontados ganham novas instâncias ao retornar. Veja o número no canto de cada card.', 'EXPLORAÇÃO LIVRE');
  });
  down.addEventListener('click', () => {
    moveTo(Math.floor(viewport.scrollTop / ROW_HEIGHT) + 1);
    setDescription('Avançando pelo feed.', 'Montamos os posts próximos da tela e removemos componentes distantes. O lote inicial de 2 posts permanece montado.', 'EXPLORAÇÃO LIVRE');
  });
  viewport.addEventListener('scroll', () => {
    if (!dialog.open || !started) return;
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      if (lastProgrammaticScroll !== null && Math.abs(viewport.scrollTop - lastProgrammaticScroll) < 1) {
        lastProgrammaticScroll = null;
        return;
      }
      lastProgrammaticScroll = null;
      const moved = Math.floor(viewport.scrollTop / ROW_HEIGHT) !== firstVisible;
      updateWindow();
      if (moved) setDescription('A janela acompanha seu movimento.', 'Os cards verdes na coluna de dados estão na tela. Margens são preparadas; os posts 01 e 02 ficam preservados como lote inicial.', 'EXPLORAÇÃO LIVRE');
    });
  }, { passive: true });
  track.addEventListener('click', event => {
    const button = event.target.closest('[data-feed-like]');
    if (!button) return;
    const index = Number(button.dataset.feedLike);
    posts = posts.map((post, i) => i === index ? { ...post, liked: !post.liked } : post);
    updateLike(index);
    recordEvent('data', `Atualizar post ${postNumber(index)} · mesma instância #${mounts[index]}`);
    renderPanels();
    setDescription('O dado muda. O card se atualiza.', `A curtida do post ${postNumber(index)} está no array. A instância #${mounts[index]} continua a mesma. Role para longe e volte para conferir a reconstrução.`, 'INTERAÇÃO / ATUALIZAÇÃO');
  });
  Reveal.on('slidechanged', () => { if (dialog.open) closeModal(); });
  resetState();
})();
