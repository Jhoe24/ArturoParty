/* ═══════════════════════════════════════════════
   ARTURO MATTEL® — main.js
   Lógica: pantallas, carrusel, countdown, confetti
═══════════════════════════════════════════════ */

// ── COLORES por slide (fondo dinámico) ──────────
const SLIDE_COLORS = [
  '#C8102E',   // Técnico — rojo industrial
  '#0057A8',   // Mecánico — azul Mattel
  '#111111',   // Karateka — negro
  '#2C1A0E',   // Barbero — marrón oscuro
  '#C8102E',   // Chef — rojo
  '#5B3A8C',   // Costurero — morado
  '#FF0090',   // Final — pink Barbie
];

// ── ESTADO ──────────────────────────────────────
let currentSlide   = 0;
let totalSlides    = 0;
let autoplayTimer  = null;
let countdownTimer = null;

// ── PANTALLAS ────────────────────────────────────
const screenBox        = document.getElementById('screen-box');
const screenShowcase   = document.getElementById('screen-showcase');
const screenInvitation = document.getElementById('screen-invitation');

function activateScreen(from, to) {
  from.classList.add('exit');
  setTimeout(() => {
    from.classList.remove('active', 'exit');
    to.classList.add('active');
  }, 500);
}

// ── INIT ─────────────────────────────────────────
window.addEventListener('load', () => {
  buildDots();
  updateBg(0);
  updateDots(0);
  startCountdown();

  // Registrar Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('✅ SW registrado'))
      .catch(err => console.warn('SW error:', err));
  }
});

// ── SCREEN 1 → 2: abrir caja ────────────────────
function startShowcase() {
  const box = document.getElementById('toyBox');
  box.style.transform = 'scale(1.05) rotateY(8deg)';
  box.style.transition = 'transform .3s ease';

  setTimeout(() => {
    activateScreen(screenBox, screenShowcase);
    startAutoplay();
  }, 350);
}

// ── CARRUSEL ─────────────────────────────────────
function buildDots() {
  const track = document.getElementById('slideTrack');
  const dots  = document.getElementById('dotsContainer');
  totalSlides = track.querySelectorAll('.slide').length;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);
  }
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  const track = document.getElementById('slideTrack');
  track.style.transform = `translateX(-${currentSlide * 100}vw)`;

  // Re-trigger doll animation
  const slides = track.querySelectorAll('.slide');
  const activeDoll = slides[currentSlide].querySelector('.slide-doll img');
  if (activeDoll) {
    activeDoll.style.animation = 'none';
    requestAnimationFrame(() => {
      activeDoll.style.animation = '';
    });
  }

  updateBg(currentSlide);
  updateDots(currentSlide);
  resetAutoplay();
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  else showInvitation();
}

function prevSlide() {
  if (currentSlide > 0) goToSlide(currentSlide - 1);
}

function updateBg(index) {
  const bg = document.getElementById('showcaseBg');
  const color = SLIDE_COLORS[index] ?? '#FF0090';
  bg.style.backgroundColor = color;
}

function updateDots(index) {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function startAutoplay() {
  autoplayTimer = setInterval(() => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else {
      clearInterval(autoplayTimer);
    }
  }, 3200);
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  startAutoplay();
}

// Swipe en móvil
let touchStartX = 0;
document.getElementById('slideTrack').addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
document.getElementById('slideTrack').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
});

// Teclado
document.addEventListener('keydown', e => {
  if (screenShowcase.classList.contains('active')) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft')  prevSlide();
  }
  if (e.key === 'Escape') closeAny();
});

// ── SCREEN 2 → 3: mostrar invitación ─────────────
function showInvitation() {
  clearInterval(autoplayTimer);
  activateScreen(screenShowcase, screenInvitation);
  launchConfetti();
}

function goBack() {
  activateScreen(screenInvitation, screenShowcase);
  goToSlide(0);
  startAutoplay();
  // limpiar confetti
  document.getElementById('confettiLayer').innerHTML = '';
}

function closeAny() {
  if (screenInvitation.classList.contains('active')) goBack();
}

// ── CONFETTI ─────────────────────────────────────
function launchConfetti() {
  const layer  = document.getElementById('confettiLayer');
  layer.innerHTML = '';
  const colors = ['#FF0090','#FFD700','#0057A8','#FF66C4','#ffffff','#C8102E','#5B3A8C'];
  const shapes = ['4px','6px','3px 8px','8px 3px'];

  for (let i = 0; i < 120; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';

    const color    = colors[Math.floor(Math.random() * colors.length)];
    const shape    = shapes[Math.floor(Math.random() * shapes.length)];
    const duration = (Math.random() * 3 + 2.5).toFixed(2) + 's';
    const delay    = (Math.random() * 2).toFixed(2) + 's';
    const left     = (Math.random() * 100).toFixed(1) + '%';

    p.style.cssText = `
      background: ${color};
      border-radius: ${shape};
      left: ${left};
      animation-duration: ${duration};
      animation-delay: ${delay};
    `;
    layer.appendChild(p);
  }

  // Limpiar confetti después de 8 segundos
  setTimeout(() => { layer.innerHTML = ''; }, 8000);
}

// ── COUNTDOWN ────────────────────────────────────
function startCountdown() {
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const eventDate = new Date('2026-04-13T18:00:00');
  const now = new Date();
  const diff = eventDate - now;

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  if (!cdDays) return;

  if (diff <= 0) {
    const sameDay =
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth()    === now.getMonth()    &&
      eventDate.getDate()     === now.getDate();

    const msg = sameDay ? '¡HOY ES EL DÍA!' : '¡Fue un gran partido! 🎉';
    cdDays.textContent  = sameDay ? '🎂' : '✅';
    cdHours.textContent = sameDay ? '🎉' : '✅';
    cdMins.textContent  = sameDay ? '🥳' : '✅';
    cdSecs.textContent  = sameDay ? '🎊' : '✅';

    clearInterval(countdownTimer);
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  cdDays.textContent  = String(days).padStart(2, '0');
  cdHours.textContent = String(hours).padStart(2, '0');
  cdMins.textContent  = String(mins).padStart(2, '0');
  cdSecs.textContent  = String(secs).padStart(2, '0');
}