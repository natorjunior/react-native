/* Aula 17: mesma apresentação, transições e menu da aula 16. */
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
