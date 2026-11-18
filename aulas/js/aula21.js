(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateLocation = (slide) => {
    document.getElementById('lesson-location').textContent =
      slide?.dataset.location ?? 'Aula 21';
  };
  const focusCode = (slide) => {
    const code = slide?.querySelector('pre[data-id] code[data-line-numbers]');
    if (code) {
      Reveal.getPlugin('highlight').scrollHighlightedLineIntoView(code, {}, true);
    }
  };
  Reveal.on('slidechanged', ({ currentSlide }) => {
    updateLocation(currentSlide);
    focusCode(currentSlide);
  });
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
    menu: { side: 'left', numbers: false, titleSelector: 'h1, h2', loadIcons: false },
    pdfSeparateFragments: false,
  }).then(() => {
    updateLocation(Reveal.getCurrentSlide());
    focusCode(Reveal.getCurrentSlide());
    document.querySelector('.slide-menu-button a')
      ?.setAttribute('aria-label', 'Abrir as seções da aula');
  });
})();
