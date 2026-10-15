/* Árvore de componentes para explorar o caminho das props. */
(() => {
  const slide = document.querySelector('[data-props-tree]');
  if (!slide) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = JSON.parse(slide.querySelector('.props-tree-config').textContent);
  const byId = new Map(nodes.map(node => [node.id, node]));
  const elements = new Map([...slide.querySelectorAll('[data-node]')].map(node => [node.dataset.node, node]));
  const edges = new Map([...slide.querySelectorAll('[data-child]')].map(edge => [edge.dataset.child, edge]));
  const packet = slide.querySelector('.tree-packet');
  const feedback = slide.querySelector('.tree-feedback');
  let target = 'form';
  let theme = 'light';
  let animationFrame = 0;

  function chainTo(id) {
    const chain = [];
    for (let node = byId.get(id); node; node = byId.get(node.parent)) chain.unshift(node);
    return chain;
  }

  function stop() {
    cancelAnimationFrame(animationFrame);
    packet.setAttribute('visibility', 'hidden');
    edges.forEach(edge => edge.classList.remove('is-moving'));
    elements.forEach(element => element.classList.remove('is-arriving'));
  }

  function describe() {
    const chain = chainTo(target);
    const destination = byId.get(target);
    const relays = chain.filter(node => node.kind === 'relay').map(node => node.label);
    if (destination.kind === 'source') return 'App guarda o tema e fornece o valor aos seus filhos por props.';
    if (destination.kind === 'relay') return `${destination.label} recebe o tema e o repassa. Ele não usa o valor neste exemplo.`;
    if (!relays.length) return `${destination.label} usa o tema. Uma entrega direta, sem intermediários.`;
    const names = relays.length === 1 ? relays[0] : `${relays.slice(0, -1).join(', ')} e ${relays.at(-1)}`;
    return `${destination.label} usa o tema. ${names} ${relays.length === 1 ? 'só repassa' : 'só repassam'}.`;
  }

  function render() {
    const chain = chainTo(target);
    const ids = new Set(chain.map(node => node.id));
    const hops = chain.length - 1;
    const relays = chain.filter(node => node.kind === 'relay').length;
    const value = theme === 'light' ? 'claro' : 'escuro';
    slide.dataset.theme = theme;
    nodes.forEach(node => {
      const element = elements.get(node.id);
      element.classList.toggle('is-on-route', ids.has(node.id));
      element.classList.toggle('is-selected', node.id === target);
      element.setAttribute('aria-pressed', String(node.id === target));
      const label = node.kind === 'source' ? `userPreferences.isDarkMode = ${theme === 'dark'}` :
        `${node.kind === 'relay' ? 'repassa' : 'usa'} · ${value}`;
      element.querySelector('.tree-node-value').textContent = label;
      element.setAttribute('aria-label', `${node.label}: ${label}. Acompanhar o caminho até este componente.`);
    });
    edges.forEach((edge, child) => {
      const active = ids.has(child);
      edge.classList.toggle('is-on-route', active);
      edge.setAttribute('marker-end', active ? 'url(#props-tree-active-arrow)' : 'url(#props-tree-arrow)');
    });
    slide.querySelectorAll('[data-theme]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === theme)));
    slide.querySelector('.tree-hop-count').textContent = `${hops} ${hops === 1 ? 'passagem' : 'passagens'} por props`;
    slide.querySelector('.tree-relay-count').textContent = `${relays} ${relays === 1 ? 'intermediário' : 'intermediários'}`;
    slide.querySelector('.tree-route').textContent = chain.map(node => node.label).join(' → ');
    feedback.textContent = describe();
  }

  function play() {
    stop();
    const chain = chainTo(target);
    if (reducedMotion || chain.length < 2) {
      feedback.textContent = describe();
      return;
    }
    packet.querySelector('text').textContent = theme === 'light' ? 'tema: claro' : 'tema: escuro';
    const routes = chain.slice(1).map(node => edges.get(node.id));
    let started;
    let currentSegment = -1;
    function frame(now) {
      if (started === undefined) started = now;
      const elapsed = now - started;
      const segment = Math.floor(elapsed / 560);
      if (segment >= routes.length) {
        stop();
        feedback.textContent = describe();
        elements.get(target).classList.add('is-arriving');
        return;
      }
      if (segment !== currentSegment) {
        currentSegment = segment;
        edges.forEach(edge => edge.classList.remove('is-moving'));
        routes[segment].classList.add('is-moving');
        elements.forEach(element => element.classList.remove('is-arriving'));
        elements.get(chain[segment].id).classList.add('is-arriving');
        feedback.textContent = `${chain[segment].label} → ${chain[segment + 1].label}: passagem ${segment + 1} de ${routes.length}.`;
      }
      const progress = Math.min(1, (elapsed % 560) / 460);
      const eased = progress * progress * (3 - 2 * progress);
      const point = routes[segment].getPointAtLength(routes[segment].getTotalLength() * eased);
      packet.setAttribute('transform', `translate(${point.x} ${point.y})`);
      packet.setAttribute('visibility', 'visible');
      animationFrame = requestAnimationFrame(frame);
    }
    animationFrame = requestAnimationFrame(frame);
  }

  slide.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
    theme = button.dataset.theme;
    render();
    play();
  }));
  elements.forEach((element, id) => {
    function choose() {
      target = id;
      render();
      play();
    }
    element.addEventListener('click', choose);
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        choose();
      }
    });
  });
  slide.querySelector('.tree-play').addEventListener('click', play);
  Reveal.on('slidechanged', () => { stop(); render(); });
  render();
})();
