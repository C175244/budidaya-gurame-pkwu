// =========================================================
// BUDIDAYA GURAME — script.js
// Cursor ripple, klik ripple, scroll reveal, water gauge,
// nav scroll state, mobile menu, tabs olahan/jual
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. custom ripple cursor ---------- */
  const cursor = document.getElementById('rippleCursor');
  const dot = document.getElementById('rippleDot');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (cursor && dot && !isTouch) {
    let cx = 0, cy = 0, dx = 0, dy = 0;
    let shown = false;

    window.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      dx = e.clientX; dy = e.clientY;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      dot.style.transform = `translate(${dx}px, ${dy}px)`;
      if (!shown) {
        cursor.classList.add('active');
        dot.classList.add('active');
        shown = true;
      }
    });

    window.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      dot.classList.remove('active');
      shown = false;
    });

    const hoverTargets = 'a, button, [data-cursor], .gallery-card, .reason-card, .tl-card, .stat-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.remove('hovering');
    });

    window.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    window.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
  }

  /* ---------- 2. click ripple burst (water splash) ---------- */
  document.addEventListener('click', (e) => {
    const burst = document.createElement('span');
    burst.className = 'click-burst';
    burst.style.left = e.clientX + 'px';
    burst.style.top = e.clientY + 'px';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 650);
  });

  /* ---------- 3. water-level scroll gauge ---------- */
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeFish = document.getElementById('gaugeFish');

  function updateGauge() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(2, (scrollTop / docHeight) * 100)) : 2;
    if (gaugeFill) gaugeFill.style.height = pct + '%';
    if (gaugeFish) gaugeFish.style.bottom = pct + '%';
  }

  /* ---------- 4. nav scroll state + smooth scroll ---------- */
  const nav = document.getElementById('siteNav');
  function updateNav() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateGauge();
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateGauge();
  updateNav();

  /* ---------- 5. mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---------- 6. scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- 7. tabs: cara mengolah / cara menjual ---------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + target).classList.add('active');
    });
  });

});
