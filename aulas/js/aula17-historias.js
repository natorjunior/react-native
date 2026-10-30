/* Ilustrações controladas por fragments: a animação acompanha o ritmo da aula. */
(() => {
  const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plots = {
    stack: [
      { label: 'A rota inicial', screen: 'Feed', stack: ['Feed'], bridge: 'rota inicial', title: 'A pilha começa com Feed.', code: "['Feed']", caption: 'Registramos duas rotas, mas só Feed ocupa a pilha inicial. Toque no post de Bruno para abrir os detalhes.' },
      { label: 'Avançar', screen: 'Detalhes', stack: ['Feed', 'Detalhes'], bridge: 'navigate', title: 'Detalhes entra no topo.', code: "navigate('Detalhes')", caption: 'A rota Detalhes fica ativa. Feed continua abaixo dela no histórico. Neste primeiro exemplo, ainda não enviamos parâmetros.', animate: 'push' },
      { label: 'Retornar', screen: 'Feed', stack: ['Feed'], bridge: 'goBack', title: 'O topo sai da pilha.', code: 'navigation.goBack()', caption: 'goBack remove a rota do topo. Feed volta a ser a tela ativa. O caminho de retorno vem do histórico.', animate: 'pop' },
    ],
    parametros: [
      { label: 'Escolher o post', screen: 'Feed', selected: '2', bridge: 'clique no post 2', title: 'Um registro conhecido.', code: "item.id === '2'", caption: 'Bruno é o registro de ID 2 no array local. Vamos abrir os detalhes desse post, sem copiar o objeto inteiro para a rota.' },
      { label: 'Enviar o identificador', screen: 'Feed', selected: '2', params: true, bridge: 'navigate', title: 'O parâmetro acompanha a ação.', code: "{ postId: '2' }", caption: 'O segundo argumento de navigate contém postId. A animação destaca a informação que será recebida na próxima tela.', animate: 'packet' },
      { label: 'Ler no destino', screen: 'Detalhes', selected: '2', params: true, bridge: 'route.params', title: 'Encontrar o post pelo ID.', code: "posts.find(post => post.id === postId)", caption: 'Detalhes lê route.params.postId e encontra Bruno no array. Agora a tela mostra o conteúdo do post escolhido.', animate: 'push' },
    ],
    tabs: [
      { label: 'O feed já tem histórico', screen: 'Detalhes', tab: 'Feed', bridge: 'aba Feed', title: 'Um Stack dentro da aba.', code: "FeedStack: ['Feed', 'Detalhes']", caption: 'O post 2 já está aberto. A aba Feed contém um Stack com duas rotas; Favoritos é outro destino das abas.' },
      { label: 'Trocar de área', screen: 'Favoritos', tab: 'Favoritos', bridge: 'troca de aba', title: 'A aba Favoritos fica ativa.', code: "aba ativa: 'Favoritos'", caption: 'Trocar de aba muda a área visível. A rota Detalhes continua no histórico do Stack que está na aba Feed.', animate: 'tab' },
      { label: 'Voltar à aba Feed', screen: 'Detalhes', tab: 'Feed', bridge: 'troca de aba', title: 'O histórico do feed permanece.', code: "FeedStack: ['Feed', 'Detalhes']", caption: 'Ao retornar de Favoritos à aba Feed, encontramos os detalhes abertos. Cada navegador gerencia seu próprio estado.', animate: 'tab' },
      { label: 'Voltar dentro do Stack', screen: 'Feed', tab: 'Feed', bridge: 'goBack', title: 'Agora retornamos dentro do feed.', code: "FeedStack: ['Feed']", caption: 'goBack atua no Stack do feed e retorna à lista. A aba selecionada continua sendo Feed.', animate: 'pop' },
    ],
    drawer: [
      { label: 'O Campus está ativo', screen: 'Feed', tab: 'Feed', drawer: false, bridge: 'Campus → abas', title: 'Uma área contém as outras.', code: 'Drawer → CampusTabs → FeedStack', caption: 'O Drawer tem Campus e Perfil. Campus mantém as abas e o Stack que já construímos. Toque em Menu para abrir o painel.' },
      { label: 'Abrir o menu', screen: 'Feed', tab: 'Feed', drawer: true, bridge: 'openDrawer', title: 'O painel aparece sobre o conteúdo.', code: 'navigation.openDrawer()', caption: 'Abrir o menu não registra outra tela nem abre um post. O Drawer exibe os destinos disponíveis sobre a área atual.', animate: 'drawer' },
      { label: 'Escolher Perfil', screen: 'Perfil', drawer: false, bridge: 'destino Perfil', title: 'Perfil vira o destino ativo.', code: "rota do Drawer: 'Perfil'", caption: 'Selecionar Perfil muda o destino do Drawer e fecha o painel. O Campus continua sendo a outra área do navegador.', animate: 'tab' },
      { label: 'Reabrir o painel', screen: 'Perfil', drawer: true, bridge: 'openDrawer', title: 'O mesmo menu, outro destino.', code: 'navigation.openDrawer()', caption: 'A tela Perfil também oferece um botão Menu. Agora podemos selecionar Campus para retornar às abas.', animate: 'drawer' },
      { label: 'Retornar ao Campus', screen: 'Feed', tab: 'Feed', drawer: false, bridge: 'destino Campus', title: 'As camadas trabalham juntas.', code: 'CampusTabs → FeedStack → Feed', caption: 'Voltamos à área Campus. O menu lateral escolhe a área, as abas escolhem a seção e o Stack organiza os detalhes.', animate: 'tab' },
    ],
  };

  const posts = [
    { id: '1', autor: 'Ana', texto: 'Bom dia, campus!' },
    { id: '2', autor: 'Bruno', texto: 'Meu primeiro app!' },
  ];
  const safe = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  function phoneContent(kind, beat, step) {
    const canSelect = (kind === 'stack' || kind === 'parametros') && step === 0;
    let screen = '';
    if (beat.screen === 'Feed') {
      screen = `<h3>Feed do campus</h3>${posts.map(post => `<button type="button" class="nav-post ${beat.selected === post.id ? 'is-selected' : ''}" data-nav-action="post" ${!canSelect || post.id !== '2' ? 'disabled' : ''}><span class="nav-post-avatar">${post.autor[0]}</span><span><strong>${post.autor}</strong><span>${post.texto}</span></span><small>id: ${post.id}</small></button>`).join('')}<p class="nav-screen-tip">${canSelect ? 'Toque no post de Bruno →' : 'Uma lista. Dois registros locais.'}</p>`;
    } else if (beat.screen === 'Detalhes') {
      const withParams = kind !== 'stack';
      screen = `<button type="button" class="nav-screen-back" data-nav-action="back" ${kind === 'stack' && step === 1 || kind === 'tabs' && step === 2 ? '' : 'disabled'}>← Voltar</button><h3>${withParams ? 'Post 2' : 'Detalhes'}</h3><div class="nav-detail-card"><span class="nav-detail-label">${withParams ? 'postId: 2' : 'Sem parâmetros ainda'}</span><strong>${withParams ? 'Bruno' : 'Uma segunda tela'}</strong><p>${withParams ? 'Meu primeiro app!' : 'Aqui vamos mostrar um post.'}</p><div class="nav-detail-art" aria-hidden="true"><span>campus</span></div></div>`;
    } else if (beat.screen === 'Favoritos') {
      screen = '<h3>Favoritos</h3><div class="nav-favorite-card"><span>♥</span><strong>Ana</strong><p>Bom dia, campus!</p></div><p class="nav-screen-tip">Posts marcados no array local.</p>';
    } else {
      screen = '<h3>Meu perfil</h3><div class="nav-profile-avatar">EU</div><strong class="nav-profile-name">Estudante do campus</strong><p class="nav-screen-tip">Um destino do Drawer.</p>';
    }
    const menu = kind === 'drawer' ? `<button class="nav-screen-menu" type="button" data-nav-action="menu" ${step === 0 || step === 2 ? '' : 'disabled'}>☰ Menu</button>` : '';
    const tabs = beat.tab ? `<div class="nav-phone-tabs"><button type="button" data-nav-action="tab-feed" class="${beat.tab === 'Feed' ? 'is-active' : ''}" ${kind === 'tabs' && step === 1 ? '' : 'disabled'}>▤ Feed</button><button type="button" data-nav-action="tab-favorites" class="${beat.tab === 'Favoritos' ? 'is-active' : ''}" ${kind === 'tabs' && step === 0 ? '' : 'disabled'}>♡ Favoritos</button></div>` : '';
    const panel = kind === 'drawer' ? `<div class="nav-drawer-scrim ${beat.drawer ? 'is-open' : ''}"></div><div class="nav-drawer-panel ${beat.drawer ? 'is-open' : ''}" ${beat.drawer ? '' : 'inert'}><p>campus / menu</p><h4>Para onde vamos?</h4><button type="button" data-nav-action="campus" ${step === 3 ? '' : 'disabled'} class="${beat.screen !== 'Perfil' ? 'is-active' : ''}">▤ Campus</button><button type="button" data-nav-action="profile" ${step === 1 ? '' : 'disabled'} class="${beat.screen === 'Perfil' ? 'is-active' : ''}">○ Perfil</button></div>` : '';
    return `<div class="nav-phone-content ${beat.animate && motion ? 'is-entering' : ''}">${menu}${screen}</div>${tabs}${panel}`;
  }

  function statePicture(kind, beat, step) {
    if (kind === 'stack') {
      return `<div class="nav-stack-tray">${beat.stack.map((route, index) => `<div class="nav-stack-route ${index === beat.stack.length - 1 ? 'is-top' : ''}" style="--route-level:${index}"><span>${String(index + 1).padStart(2, '0')} / ${index === beat.stack.length - 1 ? 'ATIVA' : 'NO HISTÓRICO'}</span><strong>${route}</strong></div>`).join('')}</div>`;
    }
    if (kind === 'parametros') {
      return `<div class="nav-params-source"><span>posts / dados locais</span>${posts.map(post => `<div class="${post.id === beat.selected ? 'is-selected' : ''}"><code>id: '${post.id}'</code><strong>${post.autor}</strong></div>`).join('')}</div><div class="nav-params-value"><span>route.params</span><code>${beat.params ? "{ postId: '2' }" : 'Ainda não enviado'}</code></div>`;
    }
    if (kind === 'tabs') {
      return `<div class="nav-tab-state ${beat.tab === 'Feed' ? 'is-active' : ''}"><span>ABA FEED / STACK</span><strong>${step === 3 ? 'Feed' : 'Feed → Detalhes'}</strong><small>${beat.tab === 'Feed' ? 'Área visível' : 'Histórico preservado'}</small></div><div class="nav-tab-state ${beat.tab === 'Favoritos' ? 'is-active' : ''}"><span>ABA FAVORITOS</span><strong>FavoritosScreen</strong><small>${beat.tab === 'Favoritos' ? 'Área visível' : 'Outro destino das abas'}</small></div>`;
    }
    return `<div class="nav-drawer-state"><span>DRAWER / ${beat.drawer ? 'ABERTO' : 'FECHADO'}</span><div class="${beat.screen !== 'Perfil' ? 'is-active' : ''}"><strong>Campus</strong><small>Tabs → FeedStack e Favoritos</small></div><div class="${beat.screen === 'Perfil' ? 'is-active' : ''}"><strong>Perfil</strong><small>PerfilScreen</small></div></div>`;
  }

  function sync(slide, animate = false) {
    if (!slide?.matches('[data-nav-story]')) return;
    const kind = slide.dataset.navStory;
    const plot = plots[kind];
    const step = Math.min(slide.querySelectorAll('.nav-story-cue.visible').length, plot.length - 1);
    const beat = plot[step];
    const phoneHadFocus = slide.querySelector('.nav-phone-stage').contains(document.activeElement);
    slide.dataset.navBeat = String(step);
    slide.querySelector('.nav-beat-label').textContent = beat.label;
    slide.querySelector('.nav-beat-count').textContent = `${step + 1} / ${plot.length}`;
    slide.querySelectorAll('.nav-story-dots i').forEach((dot, index) => dot.className = index === step ? 'is-current' : index < step ? 'is-done' : '');
    slide.querySelector('.nav-phone-context').textContent = beat.screen;
    slide.querySelector('.nav-phone-stage').innerHTML = phoneContent(kind, { ...beat, animate: animate ? beat.animate : null }, step);
    slide.querySelector('.nav-state-kicker').textContent = { stack: 'Histórico do Stack', parametros: 'O identificador da rota', tabs: 'Estado por navegador', drawer: 'Áreas do aplicativo' }[kind];
    slide.querySelector('.nav-state-title').textContent = beat.title;
    slide.querySelector('.nav-state-picture').innerHTML = statePicture(kind, beat, step);
    slide.querySelector('.nav-state-code').textContent = beat.code;
    slide.querySelector('.nav-story-narration').textContent = beat.caption;
    slide.querySelector('.nav-bridge-label').textContent = beat.bridge;
    const token = slide.querySelector('.nav-travel-token');
    token.textContent = kind === 'parametros' ? "{ postId: '2' }" : beat.bridge;
    token.className = 'nav-travel-token';
    if (animate && beat.animate && motion) {
      void token.offsetWidth;
      token.classList.add('is-flying');
    }
    slide.querySelector('.nav-bridge-arrow').textContent = beat.animate === 'pop' ? '←' : '→';
    slide.querySelector('[data-nav-previous]').disabled = step === 0;
    slide.querySelector('[data-nav-next]').hidden = step === plot.length - 1;
    slide.querySelector('[data-nav-replay]').hidden = step !== plot.length - 1;
    if (phoneHadFocus) {
      slide.querySelector(step === plot.length - 1 ? '[data-nav-replay]' : '[data-nav-next]').focus({ preventScroll: true });
    }
    slide.querySelector('.nav-story-dots').setAttribute('aria-label', `Etapa ${step + 1} de ${plot.length}: ${beat.label}`);
  }

  document.querySelectorAll('[data-nav-story]').forEach(slide => {
    sync(slide);
    slide.querySelector('[data-nav-previous]').addEventListener('click', () => Reveal.prevFragment());
    slide.querySelector('[data-nav-next]').addEventListener('click', () => Reveal.nextFragment());
    slide.querySelector('[data-nav-replay]').addEventListener('click', () => {
      const i = Reveal.getIndices(slide);
      Reveal.slide(i.h, i.v, -1);
      sync(slide);
      slide.querySelector('[data-nav-next]').focus({ preventScroll: true });
    });
    slide.querySelector('.nav-phone-stage').addEventListener('click', event => {
      if (event.target.closest('button[data-nav-action]:not(:disabled)')) Reveal.nextFragment();
    });
  });
  Reveal.on('ready', event => sync(event.currentSlide));
  Reveal.on('slidechanged', event => sync(event.currentSlide));
  Reveal.on('fragmentshown', () => sync(Reveal.getCurrentSlide(), true));
  Reveal.on('fragmenthidden', () => sync(Reveal.getCurrentSlide(), true));
})();
