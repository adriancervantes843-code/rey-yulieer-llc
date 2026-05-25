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

// ─── PORTFOLIO FILTER ───
function pFilter(cat, btn) {
  document.querySelectorAll('.pf').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.pi').forEach(item => {
    const show = cat === 'all' || item.dataset.cat === cat;
    item.style.opacity      = show ? '1'    : '0.2';
    item.style.transform    = show ? 'scale(1)' : 'scale(.97)';
    item.style.transition   = 'opacity .35s, transform .35s';
    item.style.pointerEvents = show ? 'auto' : 'none';
  });
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
function doSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const body = [
    'SOLICITUD DE COTIZACIÓN - REY YULIEER LLC', '',
    'INFORMACIÓN PERSONAL',
    'Nombre: '      + f.nombre.value,
    'Teléfono: '    + f.telefono.value,
    'Email: '       + f.email.value,
    'Ubicación: '   + f.ubicacion.value, '',
    'INFORMACIÓN DEL PROYECTO',
    'Servicio: '    + f.servicio.value,
    'Fecha inicio: '+ f.fecha.value,
    'Presupuesto: ' + f.presupuesto.value,
    'Descripción: ' + f.descripcion.value,
    'Comentarios: ' + f.comentarios.value
  ].join('\n');
  window.location.href =
    'mailto:reyreyyulieer_construction@yahoo.com' +
    '?subject=Solicitud%20de%20Cotizaci%C3%B3n%20-%20REY%20YULIEER%20LLC' +
    '&body=' + encodeURIComponent(body);
  document.getElementById('fsuccess').style.display = 'block';
  f.reset();
  setTimeout(() => { document.getElementById('fsuccess').style.display = 'none'; }, 6000);
}

// ─── TESTIMONIALS CAROUSEL ───
const testCards = [
  {
    stars: '★★★★★',
    text:  '"REY YULIEER LLC transformó mi cocina por completo. La calidad de la madera y los acabados son excepcionales. Entregaron antes del plazo y dentro del presupuesto."',
    init:  'MR', name: 'María Rodríguez', role: 'Boston, MA · Cocina Renovada'
  },
  {
    stars: '★★★★★',
    text:  '"Renovamos toda la estructura de nuestra casa. El equipo fue profesional, puntual y el resultado final superó todo lo que esperábamos."',
    init:  'JL', name: 'James López', role: 'Cambridge, MA · Remodelación'
  },
  {
    stars: '★★★★★',
    text:  '"Los closets que fabricaron para mi dormitorio son perfectamente aprovechados. Arte y funcionalidad en un mismo trabajo magistral."',
    init:  'AS', name: 'Ana Sánchez', role: 'Somerville, MA · Closets'
  },
  {
    stars: '★★★★★',
    text:  '"Excelente trabajo en el deck exterior de nuestra casa. Madera de primera calidad e instalación impecable. La familia lo disfruta cada día."',
    init:  'CP', name: 'Carlos Pérez', role: 'Medford, MA · Deck Exterior'
  },
  {
    stars: '★★★★★',
    text:  '"La planificación y ejecución del proyecto comercial fue perfecta. Dentro del presupuesto y antes del tiempo estimado. Altamente recomendados."',
    init:  'LM', name: 'Laura Martínez', role: 'Malden, MA · Proyecto Comercial'
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
