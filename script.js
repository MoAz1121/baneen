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
const intro    = document.getElementById('intro');
const tagline  = document.getElementById('tagline');
const tapHint  = document.getElementById('tap-hint');
const letters  = document.querySelectorAll('.b-letter');

let introPlayed = false;
let introDone   = false;

const letterDelays = [0, 280, 510, 720, 910, 1080];

function playIntro() {
  if (introPlayed) return;
  introPlayed = true;

  letters.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('lit');
      const rect = el.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    }, letterDelays[i]);
  });

  setTimeout(() => tagline.classList.add('show'), 1500);
  setTimeout(() => tapHint.classList.add('show'), 2000);
}

window.addEventListener('load', () => {
  setTimeout(playIntro, 400);
});
