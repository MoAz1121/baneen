const reasons = [
  "The way you laugh without holding anything back.",
  "How you make ordinary moments feel like they matter.",
  "The patience you have, even when I'm difficult.",
  "The way you think — quietly, carefully, honestly.",
  "How safe I feel when I'm with you.",
  "The small things you notice that nobody else does.",
  "How you love the things you love, fully and without apology.",
  "The warmth you carry into every room.",
  "How you always know what to say, or when to say nothing.",
  "The way you look at me like I'm enough.",
  "Your kindness — it's genuine, not performed.",
  "How you make me want to be more present.",
  "The fact that you exist, and somehow you're here.",
];

let index = -1;
let transitioning = false;

const label = document.getElementById('label');
const reason = document.getElementById('reason');
const btn = document.getElementById('btn');
const counter = document.getElementById('counter');

function setReason(text, labelText, counterText, btnText) {
  if (transitioning) return;
  transitioning = true;

  reason.classList.add('fade-out');

  setTimeout(() => {
    label.textContent = labelText || '';
    reason.textContent = text;
    counter.textContent = counterText || '';
    btn.textContent = btnText || 'next';

    reason.classList.remove('fade-out');
    reason.classList.add('fade-in');

    setTimeout(() => {
      reason.classList.remove('fade-in');
      transitioning = false;
    }, 500);
  }, 350);
}

btn.addEventListener('click', () => {
  if (transitioning) return;

  if (index === -1) {
    index = 0;
    setReason(
      reasons[0],
      'reasons why i love you',
      `1 of ${reasons.length}`,
      'next'
    );
    return;
  }

  if (index < reasons.length - 1) {
    index++;
    const isLast = index === reasons.length - 1;
    setReason(
      reasons[index],
      'reasons why i love you',
      `${index + 1} of ${reasons.length}`,
      isLast ? 'one more thing' : 'next'
    );
    return;
  }

  index = -1;
  setReason(
    'I could go on forever.',
    '',
    '',
    'start over'
  );
});

(function drawSky() {
  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
    draw();
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
})();
