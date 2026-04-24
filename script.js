// ── SOBRE INTRO ──
function openEnvelope() {
  const wrap = document.getElementById('envelopeWrap');
  if (wrap.classList.contains('open')) return;
  wrap.classList.add('open');
  setTimeout(() => {
    document.getElementById('envEnterBtn').classList.add('visible');
  }, 900);
}
function enterSite() {
  document.getElementById('envelope-screen').classList.add('hide');
  document.body.style.overflow = '';
}
document.body.style.overflow = 'hidden';

// ── COUNTDOWN ──
const eventDate = new Date('2026-06-14T21:00:00-03:00');
function pad(n) { return String(n).padStart(2, '0'); }
function updateCountdown() {
  const diff = eventDate - new Date();
  if (diff <= 0) {
    document.getElementById('faltan-label').style.display = 'none';
    document.getElementById('es-hoy-label').style.display = 'block';
    document.getElementById('countdown').style.display = 'none';
    return;
  }
  document.getElementById('cd-d').textContent = pad(Math.floor(diff / 86400000));
  document.getElementById('cd-h').textContent = pad(Math.floor((diff % 86400000) / 3600000));
  document.getElementById('cd-m').textContent = pad(Math.floor((diff % 3600000) / 60000));
  document.getElementById('cd-s').textContent = pad(Math.floor((diff % 60000) / 1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── AUDIO TOCADISCOS ──
const audio = document.getElementById('bgAudio');
const disc = document.getElementById('disc');
const needle = document.getElementById('needle');
const label = document.getElementById('audio-label');
function toggleAudio() {
  if (audio.paused) {
    audio.play();
    disc.classList.add('spinning');
    needle.classList.add('playing');
    label.textContent = '♪♪♪';
  } else {
    audio.pause();
    disc.classList.remove('spinning');
    needle.classList.remove('playing');
    label.textContent = '¡Dale play al vinilo!';
  }
}

// ── REGALO ──
function toggleRegalo() {
  document.getElementById('regalo-details').classList.toggle('open');
}

// ── GALLERY MODAL ──
const photos = [
  'fotoscumpleañera/1.png',
  'fotoscumpleañera/2.png',
  'fotoscumpleañera/3.png',
  'fotoscumpleañera/4.png',
  'fotoscumpleañera/5.png',
  'fotoscumpleañera/6.png'
];
let currentPhoto = 0;
let isAnimating = false;

function openModal(index) {
  currentPhoto = index;
  const img = document.getElementById('modal-img');
  img.src = photos[currentPhoto];
  img.className = 'modal-img';
  updateDots();
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function updateDots() {
  const dots = document.getElementById('modal-dots');
  dots.innerHTML = photos.map((_, i) =>
    `<div class="modal-dot ${i === currentPhoto ? 'active' : ''}" onclick="goToPhoto(${i})"></div>`
  ).join('');
}

function animatePhoto(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const img = document.getElementById('modal-img');
  const enterClass = direction === 'next' ? 'enter-right' : 'enter-left';

  img.style.opacity = '0';

  setTimeout(() => {
    img.src = photos[currentPhoto];
    img.style.opacity = '1';
    img.classList.remove('enter-right', 'enter-left');
    void img.offsetWidth;
    img.classList.add(enterClass);
    updateDots();

    setTimeout(() => {
      img.classList.remove(enterClass);
      isAnimating = false;
    }, 320);
  }, 120);
}

function nextPhoto(e) {
  if (e) e.stopPropagation();
  currentPhoto = (currentPhoto + 1) % photos.length;
  animatePhoto('next');
}

function prevPhoto(e) {
  if (e) e.stopPropagation();
  currentPhoto = (currentPhoto - 1 + photos.length) % photos.length;
  animatePhoto('prev');
}

function goToPhoto(i) {
  if (i === currentPhoto) return;
  const dir = i > currentPhoto ? 'next' : 'prev';
  currentPhoto = i;
  animatePhoto(dir);
}

function handleModalClick(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

// Swipe táctil en mobile
let touchStartX = 0;
const modal = document.getElementById('modal');
modal.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, false);
modal.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextPhoto() : prevPhoto();
  }
}, false);

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
  if (e.key === 'Escape') closeModal();
});

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.stripe-a, .stripe-b, .countdown-section').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  obs.observe(el);
});