Reveal.initialize({
  controls: true,
  progress: true,
  slideNumber: "c/t",
  hash: true,
  transition: "slide",
  transitionSpeed: "default",
  backgroundTransition: "fade",
  plugins: [RevealHighlight],
  width: 1200,
  height: 700,
  margin: 0.1,
});

/* ========== ANIMACAO DIAGRAMA DE SEQUENCIA ========== */
(function initSeqDiagram() {
  const btn = document.getElementById("seqSendBtn");
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = "1";

  const canvas = document.getElementById("seqCanvas");
  const phone = document.getElementById("seqPhone");
  const svStatus = document.getElementById("seqSvStatus");
  const svLog = document.getElementById("seqServerLog");
  const phResult = document.getElementById("seqPhoneResult");

  const pkt1 = document.getElementById("pkt1");
  const pkt2 = document.getElementById("pkt2");
  const pkt3 = document.getElementById("pkt3");
  const pkt4 = document.getElementById("pkt4");

  const steps = [
    document.getElementById("ss1"),
    document.getElementById("ss2"),
    document.getElementById("ss3"),
    document.getElementById("ss4"),
    document.getElementById("ss5"),
    document.getElementById("ss6"),
  ];

  const cx = {
    client: () => canvas.offsetWidth * 0.15,
    server: () => canvas.offsetWidth * 0.5,
    db: () => canvas.offsetWidth * 0.85,
  };
  const packetY = 280;

  function resetAll() {
    [pkt1, pkt2, pkt3, pkt4].forEach((pkt) => {
      pkt.style.opacity = "0";
      pkt.style.transition = "none";
      pkt.style.left = "0px";
      pkt.style.top = packetY + "px";
    });
    steps.forEach((step) => {
      step.className = "seq-step-pill";
    });
    canvas.classList.remove("glow-client", "glow-server", "glow-db");
    svStatus.textContent = "💤 Aguardando";
    svLog.textContent = "";
    phResult.textContent = "";
    phResult.classList.remove("visible");
  }

  function activateStep(idx) {
    for (let i = 0; i < idx; i += 1) {
      steps[i].className = "seq-step-pill done";
    }
    steps[idx].className = "seq-step-pill active";
  }

  function animatePacket(pkt, fromX, toX, y, duration) {
    return new Promise((resolve) => {
      pkt.style.transition = "none";
      pkt.style.left = fromX + "px";
      pkt.style.top = y + "px";
      pkt.style.opacity = "1";
      void pkt.offsetWidth;
      pkt.style.transition =
        "left " + duration + "ms cubic-bezier(.4,.0,.2,1), top " + duration + "ms ease";
      pkt.style.left = toX + "px";
      setTimeout(() => {
        pkt.style.opacity = "0";
        resolve();
      }, duration);
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let running = false;

  async function runSequence() {
    if (running) return;
    running = true;
    btn.disabled = true;
    btn.textContent = "⏳ Processando...";
    resetAll();
    await sleep(300);

    activateStep(0);
    canvas.classList.add("glow-client");
    const phoneFrame = phone.querySelector(".seq-phone-frame");
    if (phoneFrame) phoneFrame.style.transform = "scale(1.02)";
    await sleep(900);
    canvas.classList.remove("glow-client");

    activateStep(1);
    await animatePacket(pkt1, cx.client(), cx.server() - 40, packetY - 20, 1200);

    canvas.classList.add("glow-server");
    svStatus.textContent = "⚡ Processando...";
    svLog.textContent = "ORM: findByPk(42)";
    await sleep(600);
    svLog.textContent = "Gerando SQL...";
    await sleep(500);

    activateStep(2);
    svLog.textContent = "SELECT * WHERE id=42";
    await animatePacket(pkt2, cx.server(), cx.db() - 40, packetY + 15, 1100);
    canvas.classList.remove("glow-server");

    canvas.classList.add("glow-db");
    activateStep(3);
    await sleep(1000);
    canvas.classList.remove("glow-db");

    await animatePacket(pkt3, cx.db() - 40, cx.server(), packetY + 50, 1100);

    canvas.classList.add("glow-server");
    svStatus.textContent = "📦 Mapeando objeto";
    svLog.textContent = "Row → Model instance";
    await sleep(700);
    svLog.textContent = "JSON.stringify ✓";
    canvas.classList.remove("glow-server");

    activateStep(4);
    await animatePacket(pkt4, cx.server() - 40, cx.client(), packetY + 80, 1200);

    activateStep(5);
    canvas.classList.add("glow-client");
    svStatus.textContent = "✅ Concluído";
    svLog.textContent = "200 OK (312ms)";
    phResult.textContent = '{"id":42,"nome":"Maria Silva","email":"maria@email.com"}';
    phResult.classList.add("visible");
    await sleep(1500);
    canvas.classList.remove("glow-client");

    steps.forEach((step) => {
      step.className = "seq-step-pill done";
    });

    btn.disabled = false;
    btn.textContent = "🔄 Buscar Novamente";
    running = false;
  }

  btn.addEventListener("click", runSequence);
})();
