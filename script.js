/* ══════════════════════════════════════════════
   REY YULIEER LLC — script.js
   Main interactive behaviour
══════════════════════════════════════════════ */

// ─── CURSOR ───
const cur  = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});
(function loop(){
  rx += (mx - rx) * .14;
  ry += (my - ry) * .14;
  cur2.style.left = rx + 'px';
  cur2.style.top  = ry + 'px';
  requestAnimationFrame(loop);
})();

// ─── SCROLL PROGRESS ───
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = p + '%';
});

// ─── NAV STICKY ───
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('s', window.scrollY > 60);
});

// ─── HAMBURGER MENU ───
const hamEl  = document.getElementById('ham');
const mobNav = document.getElementById('mobnav');
hamEl.addEventListener('click', () => mobNav.classList.toggle('open'));
function closeMob() { mobNav.classList.remove('open'); }

// ─── SCROLL REVEAL ───
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ─── ANIMATED COUNTERS ───
function countUp(el, target, suffix) {
  let v = 0;
  const step = target / 70;
  const t = setInterval(() => {
    v += step;
    if (v >= target) { v = target; clearInterval(t); }
    el.textContent = Math.floor(v) + suffix;
  }, 18);
}
const cntObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(el => {
        countUp(el, parseInt(el.dataset.target), el.dataset.suffix || '');
      });
      cntObs.disconnect();
    }
  });
}, { threshold: .5 });
const statsEl = document.getElementById('stats');
if (statsEl) cntObs.observe(statsEl);

// ─── PORTFOLIO FILTER (gallery mode) ───
function pFilter(cat, btn) {
  document.querySelectorAll('.pf').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');

  const grid  = document.getElementById('portGrid');
  const items = document.querySelectorAll('.pi');

  if (cat === 'all') {
    // restore masonry — remove filtered mode
    grid.classList.remove('filtered');
    items.forEach(item => {
      delete item.dataset.hidden;
      item.style.display = '';
      item.style.opacity = '';
      item.style.transform = '';
      item.style.pointerEvents = '';
    });
  } else {
    // gallery mode — show only matching items in uniform grid
    grid.classList.add('filtered');
    items.forEach(item => {
      const show = item.dataset.cat === cat;
      if (show) {
        delete item.dataset.hidden;
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.pointerEvents = 'auto';
      } else {
        item.dataset.hidden = 'true';
        item.style.display = 'none';
      }
    });
  }
}

// ─── LIGHTBOX ───
function openLb(item) {
  const img = item.querySelector('img');
  if (!img) return;
  document.getElementById('lb-img').src = img.src
    .replace(/w=\d+/, 'w=1400')
    .replace(/q=\d+/, 'q=90');
  document.getElementById('lb-img').alt = img.alt;
  document.getElementById('lb-cap').textContent =
    (img.dataset.title || img.alt) + ' — Rey Yulieer LLC';
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb(e) {
  if (!e || e.target === document.getElementById('lb') || e.currentTarget.classList.contains('lb-close')) {
    document.getElementById('lb').classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLb({ target: document.getElementById('lb') });
});

// ─── CONTACT FORM ───
const CONTACT_EMAIL = 'reyyulieer_construction@yahoo.com';

function doSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const body = [
    'QUOTE REQUEST - REY YULIEER LLC', '',
    'PERSONAL INFORMATION',
    'Name: '        + f.nombre.value,
    'Phone: '       + f.telefono.value,
    'Email: '       + f.email.value,
    'Location: '    + f.ubicacion.value, '',
    'PROJECT INFORMATION',
    'Service: '     + f.servicio.value,
    'Start date: '  + f.fecha.value,
    'Budget: '      + f.presupuesto.value,
    'Description: ' + f.descripcion.value,
    'Comments: '    + f.comentarios.value
  ].join('\n');
  window.location.href =
    'mailto:' + CONTACT_EMAIL +
    '?subject=Quote%20Request%20-%20REY%20YULIEER%20LLC' +
    '&body=' + encodeURIComponent(body);
  document.getElementById('fsuccess').style.display = 'block';
  f.reset();
  setTimeout(() => { document.getElementById('fsuccess').style.display = 'none'; }, 6000);
}

// ─── TESTIMONIALS CAROUSEL ───
const testCards = [
  {
    stars: '★★★★★',
    text:  '"REY YULIEER LLC completely transformed my kitchen. The quality of the wood and finishes is exceptional. They delivered ahead of schedule and within budget."',
    init:  'MR', name: 'Maria Rodriguez', role: 'Boston, MA · Kitchen Renovation'
  },
  {
    stars: '★★★★★',
    text:  '"We renovated our entire home structure with them. The team was professional, punctual and the final result exceeded all our expectations. Highly recommended."',
    init:  'JL', name: 'James Lopez', role: 'Cambridge, MA · Full Remodel'
  },
  {
    stars: '★★★★★',
    text:  '"The closets they built for my bedroom are exactly what I needed. Every inch perfectly utilized. Art and functionality in one masterful job."',
    init:  'AS', name: 'Ana Sanchez', role: 'Somerville, MA · Custom Closets'
  },
  {
    stars: '★★★★★',
    text:  '"Excellent work on our exterior deck. Top-quality wood and flawless installation. The whole family enjoys it every single day."',
    init:  'CP', name: 'Carlos Perez', role: 'Medford, MA · Exterior Deck'
  },
  {
    stars: '★★★★★',
    text:  '"The planning and execution of our commercial project was perfect. On budget and ahead of the estimated timeline. Highly recommended."',
    init:  'LM', name: 'Laura Martinez', role: 'Malden, MA · Commercial Project'
  },
];
let tIdx = 0;
function renderTests() {
  const g   = document.getElementById('testGrid');
  const set = [];
  for (let i = 0; i < 3; i++) set.push(testCards[(tIdx + i) % testCards.length]);
  g.innerHTML = set.map(c => `
    <div class="tc" style="animation:fadeUp .5s ease both">
      <div class="tc-stars">${c.stars}</div>
      <p class="tc-text">${c.text}</p>
      <div class="tc-author">
        <div class="tc-av">${c.init}</div>
        <div>
          <div class="tc-name">${c.name}</div>
          <div class="tc-role">${c.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}
function nextTest() { tIdx = (tIdx + 1) % testCards.length; renderTests(); }
function prevTest() { tIdx = (tIdx - 1 + testCards.length) % testCards.length; renderTests(); }

// ─── HERO PARALLAX ───
window.addEventListener('scroll', () => {
  const sy    = window.pageYOffset;
  const heroR = document.querySelector('.hero-right');
  if (heroR && sy < window.innerHeight) heroR.style.transform = `translateY(${sy * 0.08}px)`;
});

// ─── KEYFRAME: fadeUp (used by testimonials) ───
const st = document.createElement('style');
st.textContent = '@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(st);

// ─── PORTFOLIO STAGGERED ENTRANCE ───
// Waits for the grid to enter the viewport, then reveals each card
// with an ~88ms stagger for a cascade effect.
var grid = document.querySelector('.port-grid');
if (grid && 'IntersectionObserver' in window) {
  var fired = false;
  new IntersectionObserver(function(entries, obs) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !fired) {
        fired = true;
        [].forEach.call(document.querySelectorAll('.pi'), function(pi, i) {
          setTimeout(function() { pi.classList.add('vis'); }, i * 88);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.07 }).observe(grid);
}
