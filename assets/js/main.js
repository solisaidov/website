(() => {
  const rail = document.getElementById('rail');
  const navLinks = Array.from(document.querySelectorAll('.navlink'));
  const navIndicator = document.querySelector('.nav-indicator');
  const goButtons = Array.from(document.querySelectorAll('[data-go]'));
  const year = document.getElementById('year');
  const hintBtn = document.getElementById('hintBtn');

  const pills = Array.from(document.querySelectorAll('.pill'));
  const cards = Array.from(document.querySelectorAll('.card'));

  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const toast = document.getElementById('toast');

  if (year) year.textContent = String(new Date().getFullYear());

  // Pages map: left=contact, center=main, right=portfolio
  const map = { contact: 0, main: 1, portfolio: 2 };
  let current = 'main';

  function showToast(text){
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  function setActive(name){
    current = name;
    navLinks.forEach(b => b.classList.toggle('active', b.dataset.go === name));
    // indicator position
    if (navIndicator){
      const active = navLinks.find(b => b.dataset.go === name);
      if (active){
        const navRect = active.parentElement.getBoundingClientRect();
        const r = active.getBoundingClientRect();
        const x = r.left - navRect.left;
        navIndicator.style.transform = `translateX(${x}px)`;
        navIndicator.style.width = `${r.width}px`;
      }
    }
    // bottom dots
    const dots = Array.from(document.querySelectorAll('.dots .dot'));
    dots.forEach(d => d.classList.remove('active','active2'));
    const left = dots[0], mid = dots[1], right = dots[2];
    if (name === 'contact'){ left.classList.add('active2'); mid.classList.add('active'); right.classList.add('active'); }
    if (name === 'main'){ mid.classList.add('active2'); left.classList.add('active'); right.classList.add('active'); }
    if (name === 'portfolio'){ right.classList.add('active2'); left.classList.add('active'); mid.classList.add('active'); }
  }

  function slideTo(name, opts={}) {
    if (!rail || !(name in map)) return;
    const idx = map[name];
    // translateX(-idx * 100vw)
    rail.style.transform = `translateX(-${idx * 100}vw)`;
    setActive(name);

    if (!opts.silent){
      if (name === 'contact') showToast('Contact');
      if (name === 'main') showToast('Main');
      if (name === 'portfolio') showToast('Portfolio');
    }

    const target = document.querySelector(`[data-page="${name}"]`);
    target?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Wire buttons
  goButtons.forEach(b => b.addEventListener('click', () => {
    const name = b.dataset.go;
    if (name) slideTo(name);
  }));

  // Initial indicator sizing after layout
  window.addEventListener('load', () => {
    setActive('main');
    slideTo('main', { silent: true });
  });

  window.addEventListener('resize', () => setActive(current));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') slideTo('contact');
    if (e.key === 'ArrowRight') slideTo('portfolio');
    if (e.key === 'Home') slideTo('main');
    if (e.key === 'Escape') closeModal();
  });

  // Drag / swipe (Craftivo feel)
  let isDown = false;
  let startX = 0;
  let baseX = 0;
  let currentIdx = map[current];

  const getRailX = () => -currentIdx * window.innerWidth;

  function pointerDown(e){
    // only left click / touch
    isDown = true;
    startX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
    currentIdx = map[current];
    baseX = getRailX();
    rail.style.transition = 'none';
  }

  function pointerMove(e){
    if (!isDown) return;
    const x = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
    const dx = x - startX;
    // resistance at edges
    const maxLeft = 0;
    const maxRight = -2 * window.innerWidth;
    let next = baseX + dx;
    if (next > maxLeft) next = maxLeft + (next - maxLeft) * 0.25;
    if (next < maxRight) next = maxRight + (next - maxRight) * 0.25;
    rail.style.transform = `translateX(${next}px)`;
  }

  function pointerUp(e){
    if (!isDown) return;
    isDown = false;
    const x = e.clientX ?? (e.changedTouches?.[0]?.clientX ?? 0);
    const dx = x - startX;
    rail.style.transition = 'transform 650ms cubic-bezier(.2,.9,.2,1)';
    // threshold
    if (dx > 90) slideTo('contact');
    else if (dx < -90) slideTo('portfolio');
    else slideTo(current, { silent: true });
  }

  // Attach swipe handlers to viewport (not header/footer)
  const viewport = document.querySelector('.viewport');
  viewport?.addEventListener('mousedown', pointerDown);
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);

  viewport?.addEventListener('touchstart', pointerDown, { passive: true });
  viewport?.addEventListener('touchmove', pointerMove, { passive: true });
  viewport?.addEventListener('touchend', pointerUp, { passive: true });

  // Contact form demo
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formMsg) formMsg.textContent = '✅ Demo only (not sent). Connect to backend later.';
    form.reset();
  });

  // Portfolio filter
  function applyFilter(cat){
    cards.forEach(c => {
      const own = c.getAttribute('data-cat') || '';
      const show = (cat === 'all') || (own === cat);
      c.style.display = show ? '' : 'none';
    });
  }
  pills.forEach(p => p.addEventListener('click', () => {
    pills.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    applyFilter(p.dataset.filter || 'all');
  }));

  // Modal preview
  function openModal(title, body){
    if (!modal) return;
    modalTitle.textContent = title || 'Preview';
    modalBody.textContent = body || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeModal(){
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow = '';
  }
  window.closeModal = closeModal;

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    if (t.closest('[data-open]')){
      const el = t.closest('[data-open]');
      const title = el.getAttribute('data-open') || 'Project';
      openModal(title, 'This is a demo preview. Next step: I can make each project open a full page or a PDF/links.');
    }
    if (t.getAttribute('data-close') === '1' || t.closest('[data-close="1"]')){
      closeModal();
    }
  });

  // Help hint
  hintBtn?.addEventListener('click', () => {
    openModal('How to use', 'Use Main / Portfolio / Contact in the top bar. You can also swipe/drag left/right. Arrow keys work too.');
  });
})();

// --- Scroll from music to game (vertical) ---
(() => {
  const mainVert = document.getElementById('mainVert');
  const game = document.getElementById('game');
  const music = document.getElementById('music');
  const toMusic2 = document.getElementById('toMusic2');

  // Add a "↓ Game" quick button inside music section (create if not exists)
  const musicCenter = document.querySelector('#music .music-center');
  if (musicCenter && !document.getElementById('toGame')) {
    const btn = document.createElement('button');
    btn.className = 'btn ghost down';
    btn.id = 'toGame';
    btn.type = 'button';
    btn.textContent = '↓ Game';
    musicCenter.appendChild(btn);
    btn.addEventListener('click', () => {
      mainVert?.scrollTo({ top: game?.offsetTop || mainVert.clientHeight * 2, behavior: 'smooth' });
    });
  }

  toMusic2?.addEventListener('click', () => {
    mainVert?.scrollTo({ top: music?.offsetTop || mainVert.clientHeight, behavior: 'smooth' });
  });
})();


