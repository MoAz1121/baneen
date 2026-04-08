// ── Stars (sky canvas) ──────────────────────────────────────────────────────
(function drawSky() {
  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 0.9 + 0.2,
        a: Math.random() * 0.55 + 0.1,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.35, 0,
      canvas.width * 0.5, canvas.height * 0.35, canvas.width * 0.65
    );
    grad.addColorStop(0, 'rgba(20, 35, 72, 0.55)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
      ctx.fill();
    }
    t += 0.016;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ── Particle burst ──────────────────────────────────────────────────────────
const pCanvas = document.getElementById('particles');
const pCtx = pCanvas.getContext('2d');
let particles = [];
let pFrame;

function resizeParticles() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

function spawnBurst(x, y, count = 22) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.2 + 0.4;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed * 0.7,
      vy: Math.sin(angle) * speed - 1.2,
      r: Math.random() * 1.6 + 0.4,
      life: 1,
      decay: Math.random() * 0.012 + 0.005,
      color: `hsl(${210 + Math.random() * 50}, 80%, ${65 + Math.random() * 25}%)`
    });
  }
  if (!pFrame) animParticles();
}

function animParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = p.color;
    pCtx.globalAlpha = p.life * 0.85;
    pCtx.fill();
    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= p.decay;
  }
  pCtx.globalAlpha = 1;
  if (particles.length > 0) {
    pFrame = requestAnimationFrame(animParticles);
  } else {
    pFrame = null;
  }
}

// ── Intro animation ─────────────────────────────────────────────────────────
const intro       = document.getElementById('intro');
const nameWrap    = document.getElementById('name-wrap');
const tagline     = document.getElementById('tagline');
const tapHint     = document.getElementById('tap-hint');
const mainScene   = document.getElementById('mainScene');
const letters     = document.querySelectorAll('.b-letter');

let introPlayed = false;
let introDone   = false;

const letterDelays = [0, 280, 510, 720, 910, 1080];

function playIntro() {
  if (introPlayed) return;
  introPlayed = true;

  letters.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('lit');

      // burst at letter center
      const rect = el.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    }, letterDelays[i]);
  });

  // tagline fades in after last letter
  setTimeout(() => tagline.classList.add('show'), 1500);

  // hint appears
  setTimeout(() => tapHint.classList.add('show'), 2000);
}

function revealCard() {
  if (introDone) return;
  introDone = true;

  // big burst in center
  spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 55);

  intro.classList.add('fade-away');
  setTimeout(() => {
    intro.style.display = 'none';
    mainScene.classList.add('visible');
  }, 1200);
}

// Auto-play intro on load
window.addEventListener('load', () => {
  setTimeout(playIntro, 400);
});

// First tap on intro plays animation; second tap reveals card
intro.addEventListener('click', () => {
  if (!introPlayed) { playIntro(); return; }
  if (introDone) return;
  // only allow reveal after name is done
  if (introPlayed) revealCard();
});

// ── Main card logic ─────────────────────────────────────────────────────────
const reasons = [
  "I love the way you let me yap",
  "I love how your presence alone is enough to make me forget all my worries",
  "I love how you make the best come out of me",
  "I love how happy I am whenever I am with you",
  "I love how sweet you are",
  "I love how kind you are",
  "I love how incredibly gorgeous you are (straight up divine)",
  "I love the way you love me",
  "I love how full of love you are",
  "I love how blessed I feel to be with you",
  "I love how safe I feel when I am with you",
  "I love how comfortable you make me feel",
  "I love how you do not rush me",
  "I love how being around you feels so natural",
  "I love how nothing feels forced",
  "I love how you make me feel understood without judgement"
];

const glows = [
  "110, 160, 255","130, 180, 245","100, 150, 240","120, 170, 255",
  "90, 155, 235","140, 185, 255","105, 165, 250","125, 175, 245",
  "115, 158, 240","135, 182, 255","100, 160, 248","118, 172, 252",
  "128, 178, 255","112, 168, 246","122, 176, 250","108, 162, 244"
];

let index = -1;
let transitioning = false;

const label   = document.getElementById('label');
const reason  = document.getElementById('reason');
const btn     = document.getElementById('btn');
const counter = document.getElementById('counter');
const card    = document.getElementById('card');

function setGlow(i) {
  const color = i >= 0 && i < glows.length ? glows[i] : "130, 170, 255";
  card.style.setProperty('--glow-color', color);
  document.documentElement.style.setProperty('--glow-color', color);
}

function setReason(text, labelText, counterText, btnText, glowIndex) {
  if (transitioning) return;
  transitioning = true;
  reason.classList.add('fade-out');
  setTimeout(() => {
    label.textContent   = labelText   || '';
    reason.textContent  = text;
    counter.textContent = counterText || '';
    btn.textContent     = btnText     || 'next';
    if (glowIndex !== undefined) setGlow(glowIndex);
    reason.classList.remove('fade-out');
    reason.classList.add('fade-in');
    setTimeout(() => { reason.classList.remove('fade-in'); transitioning = false; }, 500);
  }, 350);
}

function next() {
  if (transitioning) return;
  if (index === -1) {
    index = 0;
    setReason(reasons[0], 'For my princess❤️', `1 of ${reasons.length}`, 'next', 0);
    return;
  }
  if (index < reasons.length - 1) {
    index++;
    const isLast = index === reasons.length - 1;
    setReason(
      reasons[index], 'For my princess❤️',
      `${index + 1} of ${reasons.length}`,
      isLast ? 'one more thing' : 'next', index
    );
    return;
  }
  index = -1;
  setReason('I could go on forever.', '', '', 'start over');
  document.documentElement.style.setProperty('--glow-color', '130, 170, 255');
}

btn.addEventListener('click', next);

let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45 && introDone) next();
}, { passive: true });
