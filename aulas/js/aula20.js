(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const turnLabels = {
    conceito: 'CONCEITOS · CONVERSA COM A TURMA',
    demo: 'MINHA VEZ · DEMONSTRAÇÃO',
    alunos: 'BOLA COM VOCÊS · HORA DE IMPLEMENTAR',
    retomada: 'VAMOS CONFERIR · RETOMADA',
  };
  const updateLocation = (slide) => {
    document.getElementById('lesson-location').textContent =
      'AULA 20 / ' + (slide?.dataset.location ?? 'Persistência com SQLite');
    document.getElementById('lesson-turn').textContent =
      turnLabels[slide?.dataset.teachingRole] ?? '→ SEÇÕES · ↓ PASSOS';
  };
  Reveal.on('slidechanged', ({ currentSlide }) => updateLocation(currentSlide));
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
    autoAnimateDuration: 0.8,
    autoAnimateEasing: 'ease-in-out',
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
    updateLocation(Reveal.getCurrentSlide());
    document.querySelector('.slide-menu-button a')
      ?.setAttribute('aria-label', 'Abrir as seções da aula');
  });
})();
