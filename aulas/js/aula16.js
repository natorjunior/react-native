/* Navegação e transições da aula 16, seguindo a aula 15. */
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
      } else if (pair.to.matches('[data-list-motion]')) {
        pair.options = {
          ...pair.options,
          translate: true,
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

  // Prévia em HTML da mesma atualização imutável mostrada no exemplo nativo.
  document.querySelectorAll('[data-task-demo]').forEach(demo => {
    const initialTasks = ['Estudar React', 'Praticar props', 'Revisar estado']
      .map((titulo, index) => ({ id: String(index + 1), titulo, concluida: false }));
    let tasks = initialTasks;
    const search = demo.querySelector('input');
    const items = demo.querySelector('.task-demo-items');
    const status = demo.querySelector('.task-demo-status');

    function renderTasks() {
      const visible = tasks.filter(item =>
        item.titulo.toLowerCase().includes(search.value.toLowerCase()));
      items.replaceChildren();
      if (visible.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'task-demo-empty';
        empty.textContent = 'Nenhuma tarefa.';
        items.appendChild(empty);
      }
      visible.forEach(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'task-demo-item';
        button.dataset.taskId = item.id;
        button.setAttribute('aria-pressed', String(item.concluida));
        const mark = document.createElement('span');
        mark.textContent = item.concluida ? '✓' : '○';
        mark.setAttribute('aria-hidden', 'true');
        const title = document.createElement('span');
        title.textContent = item.titulo;
        button.append(mark, title);
        items.appendChild(button);
      });
      status.textContent = `${visible.length} de ${tasks.length} tarefas · ${tasks.filter(item => item.concluida).length} concluídas`;
    }

    search.addEventListener('input', renderTasks);
    items.addEventListener('click', event => {
      const button = event.target.closest('[data-task-id]');
      if (!button) return;
      tasks = tasks.map(item => item.id === button.dataset.taskId
        ? { ...item, concluida: !item.concluida } : item);
      renderTasks();
      items.querySelector(`[data-task-id="${button.dataset.taskId}"]`)?.focus({ preventScroll: true });
    });
    demo.querySelector('.task-demo-reset').addEventListener('click', () => {
      tasks = initialTasks;
      search.value = '';
      renderTasks();
    });
    renderTasks();
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
    document.body.classList.toggle('dark-slide', slide.matches('.lesson-cover, .chapter-slide'));
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
