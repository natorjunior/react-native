/* Transições, navegação e exemplos interativos da aula 15. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function matchLessonElements(fromSlide, toSlide) {
    const pairs = this.getAutoAnimatePairs(fromSlide, toSlide);
    return pairs.map(pair => {
      if (pair.to.matches('.hljs-ln-code, .hljs-ln-numbers')) {
        pair.options = {
          ...pair.options,
          scale: false,
          styles: ['opacity'],
          measure: element => element.getBoundingClientRect(),
        };
      } else {
        // O painel e os títulos não mudam de tamanho quando o código cresce.
        pair.options = {
          translate: false,
          scale: false,
          styles: ['opacity', 'color', 'background-color', 'border-color'],
        };
      }
      return pair;
    });
  }

  let snackScript;
  const storyPlots = new WeakMap();
  let packetFrame = 0;

  function getStoryPlot(slide) {
    if (!storyPlots.has(slide)) {
      storyPlots.set(slide, JSON.parse(slide.querySelector('.story-script').textContent));
    }
    return storyPlots.get(slide);
  }

  function setStoryValues(slide, beat) {
    for (const actor of slide.querySelectorAll('[data-actor]')) {
      const value = beat.values[actor.dataset.actor] || '';
      const chip = actor.querySelector('.actor-value');
      chip.setAttribute('visibility', value && !chip.dataset.hideValue ? 'visible' : 'hidden');
      chip.querySelector('text').textContent = value;
    }
    const boardValue = slide.querySelector('.board-value');
    if (boardValue) boardValue.textContent = beat.boardValue || 'Aguardando valor';
  }

  function animateStoryPacket(slide, beat) {
    const packet = slide.querySelector('.story-packet');
    const routes = beat.travel.map(name => slide.querySelector(`[data-route="${name}"]`));
    let started;
    packet.querySelector('text').textContent = beat.packet;
    // O professor decide quando avançar; apenas a entrega se anima sozinha.
    function frame(now) {
      if (started === undefined) started = now;
      const elapsed = now - started;
      const segment = Math.floor(elapsed / 920);
      if (segment >= routes.length) {
        packet.setAttribute('visibility', 'hidden');
        setStoryValues(slide, beat);
        packetFrame = 0;
        return;
      }
      const progress = Math.min(1, (elapsed % 920) / 780);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      const point = routes[segment].getPointAtLength(routes[segment].getTotalLength() * eased);
      packet.setAttribute('transform', `translate(${point.x} ${point.y})`);
      packet.setAttribute('visibility', 'visible');
      packetFrame = requestAnimationFrame(frame);
    }
    packetFrame = requestAnimationFrame(frame);
  }

  function syncStory(slide, animate = false) {
    cancelAnimationFrame(packetFrame);
    document.querySelectorAll('.story-packet').forEach(packet => packet.setAttribute('visibility', 'hidden'));
    if (!slide.matches('[data-story]')) return;
    const plot = getStoryPlot(slide);
    const step = slide.querySelectorAll('.story-cue.visible').length;
    const previousStep = Number(slide.dataset.storyStep ?? -1);
    const beat = plot[step];
    const moving = animate && !reducedMotion && step === previousStep + 1 && beat.travel.length > 0;
    slide.dataset.storyStep = String(step);
    slide.querySelector('.story-beat-label').textContent = beat.label;
    slide.querySelector('.story-count').textContent = `${step + 1} / ${plot.length}`;
    slide.querySelector('.story-progress').setAttribute('aria-label', `Etapa ${step + 1} de ${plot.length}: ${beat.label}`);
    slide.querySelectorAll('.story-dot').forEach((dot, index) => {
      dot.classList.toggle('is-done', index < step);
      dot.classList.toggle('is-current', index === step);
    });
    slide.querySelector('.story-narration').textContent = beat.caption;
    for (const actor of slide.querySelectorAll('[data-actor]')) {
      const name = actor.dataset.actor;
      const lines = beat.dialogs[name] || [];
      actor.classList.toggle('is-speaking', lines.length > 0);
      actor.classList.toggle('is-reading', beat.moods[name] === 'reading');
      actor.classList.toggle('is-stressed', beat.moods[name] === 'stressed');
      actor.querySelector('.actor-dialog').setAttribute('visibility', lines.length ? 'visible' : 'hidden');
      actor.querySelectorAll('.bubble-text tspan').forEach((line, index) => {
        line.textContent = lines[index] || '';
      });
      actor.querySelector('.actor-right-arm').setAttribute('d',
        beat.moods[name] === 'reading' ? 'M0 267 L29 249' :
        beat.moods[name] === 'stressed' ? 'M0 267 L23 252 L13 239' : 'M0 267 L29 287');
    }
    for (const link of slide.querySelectorAll('[data-link]')) {
      const visible = beat.paths.includes(link.dataset.link);
      const newlyVisible = visible && link.getAttribute('visibility') !== 'visible';
      link.setAttribute('visibility', visible ? 'visible' : 'hidden');
      if (animate && !reducedMotion && newlyVisible) {
        const path = link.querySelector('path');
        const length = path.getTotalLength();
        path.animate([{ strokeDasharray: `${length}`, strokeDashoffset: `${length}` },
          { strokeDasharray: `${length}`, strokeDashoffset: '0' }], { duration: 480, easing: 'ease-out' });
      }
    }
    slide.querySelectorAll('.scene-provider, .scene-board').forEach(element =>
      element.setAttribute('visibility', beat.board ? 'visible' : 'hidden'));
    slide.querySelector('.scene-extras').setAttribute('visibility', beat.extras ? 'visible' : 'hidden');
    const code = slide.querySelector('.story-code');
    const question = slide.querySelector('.story-question');
    code.hidden = Boolean(beat.question);
    code.textContent = beat.code || '';
    question.hidden = !beat.question;
    slide.querySelector('.story-replay').hidden = step !== plot.length - 1;
    if (beat.question) {
      question.querySelector('p').textContent = beat.question.prompt;
      question.querySelectorAll('button').forEach((button, index) => {
        button.textContent = beat.question.choices[index];
        button.classList.remove('is-correct', 'is-incorrect');
        button.setAttribute('aria-pressed', 'false');
      });
    }
    if (moving) {
      setStoryValues(slide, plot[previousStep]);
      animateStoryPacket(slide, beat);
    } else setStoryValues(slide, beat);
  }

  document.querySelectorAll('[data-story]').forEach(slide => {
    syncStory(slide);
    slide.querySelector('.story-replay').addEventListener('click', () => {
      const index = Reveal.getIndices(slide);
      Reveal.slide(index.h, index.v, -1);
      syncStory(slide);
    });
    slide.querySelector('.story-answers').addEventListener('click', event => {
      const button = event.target.closest('button[data-answer]');
      if (!button) return;
      const question = getStoryPlot(slide)[Number(slide.dataset.storyStep)].question;
      if (!question) return;
      const answer = Number(button.dataset.answer);
      slide.querySelectorAll('.story-answers button').forEach(option => {
        option.classList.remove('is-correct', 'is-incorrect');
        option.setAttribute('aria-pressed', String(option === button));
      });
      button.classList.add(answer === question.correct ? 'is-correct' : 'is-incorrect');
      slide.querySelector('.story-narration').textContent = question.feedback[answer];
    });
  });

  function showScrollHint(slide) {
    const editor = slide.querySelector('.editor');
    const code = editor && editor.querySelector('code');
    if (code && code.scrollHeight > code.clientHeight + 2 && !editor.querySelector('.scroll-hint')) {
      const hint = document.createElement('span');
      hint.className = 'scroll-hint';
      hint.textContent = 'Role para explorar o código';
      editor.appendChild(hint);
    }
  }

  function syncSlide(event) {
    const slide = event.currentSlide;
    syncStory(slide);
    document.body.classList.toggle('dark-slide', slide.matches('.lesson-cover, .chapter-slide'));
    // Carrega o embed original uma única vez, quando um exemplo for aberto.
    if (slide.querySelector('[data-snack-id]') && !snackScript) {
      snackScript = document.createElement('script');
      snackScript.src = 'https://snack.expo.dev/embed.js';
      snackScript.async = true;
      document.body.appendChild(snackScript);
    }
    requestAnimationFrame(() => showScrollHint(slide));
  }

  Reveal.on('ready', syncSlide);
  Reveal.on('slidechanged', syncSlide);
  Reveal.on('fragmentshown', () => syncStory(Reveal.getCurrentSlide(), true));
  Reveal.on('fragmenthidden', () => syncStory(Reveal.getCurrentSlide()));
  Reveal.initialize({
    width: 1280,
    height: 800,
    margin: 0.04,
    center: false,
    hash: true,
    history: true,
    respondToHashChanges: true,
    controls: true,
    controlsTutorial: false,
    progress: true,
    slideNumber: 'c/t',
    transition: reducedMotion ? 'none' : 'fade',
    transitionSpeed: 'fast',
    backgroundTransition: reducedMotion ? 'none' : 'fade',
    autoAnimate: !reducedMotion,
    autoAnimateDuration: 0.48,
    autoAnimateEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    autoAnimateMatcher: matchLessonElements,
    scrollActivationWidth: null,
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMenu],
    markdown: { smartypants: true },
    menu: {
      side: 'left',
      width: 320,
      numbers: true,
      titleSelector: 'h2, h6',
      loadIcons: false,
      themes: false,
      transitions: false,
    },
  }).then(() => {
    const menuButton = document.querySelector('.slide-menu-button a');
    if (menuButton) menuButton.setAttribute('aria-label', 'Abrir menu de slides');
    showScrollHint(Reveal.getCurrentSlide());
  });
})();
