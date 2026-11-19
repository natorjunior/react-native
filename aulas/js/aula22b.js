(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateLocation = (slide) => {
    document.getElementById('lesson-location').textContent =
      slide?.dataset.location ?? 'Aula 22b';
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
    backgroundTransition: 'fade',
    plugins: [RevealHighlight, RevealMenu, RevealNotes],
    menu: { side: 'left', numbers: false, titleSelector: 'h1, h2', loadIcons: false },
    pdfSeparateFragments: false,
  }).then(() => {
    updateLocation(Reveal.getCurrentSlide());
    document.querySelector('.slide-menu-button a')
      ?.setAttribute('aria-label', 'Abrir as seções da aula');
  });
})();
