
// Memory Game (matches the provided design)
(() => {
  const grid = document.getElementById('mgGrid');
  if (!grid) return;

  const difficulty = document.getElementById('mgDifficulty');
  const btnStart = document.getElementById('mgStart');
  const btnPause = document.getElementById('mgPause');
  const btnRestart = document.getElementById('mgRestart');

  const elMoves = document.getElementById('mgMoves');
  const elMatches = document.getElementById('mgMatches');
  const elTotal = document.getElementById('mgTotalPairs');
  const elTime = document.getElementById('mgTime');
  const elBest = document.getElementById('mgBest');
  const elWin = document.getElementById('mgWin');

  const layouts = {
    easy: { cols: 4, rows: 3 },     // 12 cards => 6 pairs
    medium: { cols: 4, rows: 4 },   // 16 cards => 8 pairs
    hard: { cols: 6, rows: 4 },     // 24 cards => 12 pairs
  };

  // Simple icon set (inline SVG paths)
  const ICONS = [
    { key: 'git', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M12 2.5 4 10.5l1.9 1.9a2.2 2.2 0 0 0 3 0l.6-.6a2.2 2.2 0 0 0 0-3L12 6.3l3.3 3.3a2.2 2.2 0 0 0 0 3l.6.6a2.2 2.2 0 0 0 3 0L20 10.5 12 2.5Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
    { key: 'db', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6.5" rx="7" ry="3.5" stroke="rgba(255,255,255,.92)" stroke-width="1.8"/><path d="M5 6.5v5c0 1.93 3.13 3.5 7 3.5s7-1.57 7-3.5v-5" stroke="rgba(255,255,255,.92)" stroke-width="1.8"/><path d="M5 11.5v6c0 1.93 3.13 3.5 7 3.5s7-1.57 7-3.5v-6" stroke="rgba(255,255,255,.92)" stroke-width="1.8"/></svg>` },
    { key: 'cloud', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M7.5 18.5h9.2a4.3 4.3 0 0 0 .4-8.6A5.8 5.8 0 0 0 6.2 9.3 3.7 3.7 0 0 0 7.5 18.5Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
    { key: 'doc', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M7 3.5h7l3 3v14A2 2 0 0 1 15 22H7a2 2 0 0 1-2-1.5V5.5A2 2 0 0 1 7 3.5Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3.5v4h4" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12h6M9 15h6M9 18h4" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round"/></svg>` },
    { key: 'code', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M8.5 9 5 12l3.5 3" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 9 19 12l-3.5 3" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5 8 10.5 16" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round"/></svg>` },
    { key: 'chip', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M9 9h6v6H9V9Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8"/><path d="M7 6h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round"/></svg>` },
    { key: 'wifi', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M4.5 9.5a12 12 0 0 1 15 0" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round"/><path d="M7.5 12.5a8 8 0 0 1 9 0" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 15.5a4 4 0 0 1 3 0" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round"/><path d="M12 19h0" stroke="rgba(255,255,255,.92)" stroke-width="3.2" stroke-linecap="round"/></svg>` },
    { key: 'bolt', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M13 2 5 14h7l-1 8 8-12h-7l1-8Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
    { key: 'shield', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M12 3 20 6v7c0 5-3.4 8.6-8 9.8C7.4 21.6 4 18 4 13V6l8-3Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12.5 11 14.5 15.5 10" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
    { key: 'cam', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M6.5 7.5h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8"/><path d="M9 7.5 10.4 5.6h3.2L15 7.5" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="13.5" r="3" stroke="rgba(255,255,255,.92)" stroke-width="1.8"/></svg>` },
    { key: 'star', svg: `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="m12 3 2.6 6.1 6.6.6-5 4.4 1.5 6.5-5.7-3.4-5.7 3.4 1.5-6.5-5-4.4 6.6-.6L12 3Z" stroke="rgba(255,255,255,.92)" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
  ];

  const state = {
    started: false,
    paused: false,
    busy: false,
    first: null,
    second: null,
    moves: 0,
    matches: 0,
    totalPairs: 0,
    time: 0,
    timer: null,
    layout: layouts.easy,
    cards: [],
  };

  function fmtTime(s) {
    s = Math.max(0, Math.floor(s));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function bestKey(mode){ return `mg_best_${mode}`; }

  function loadBest(mode){
    const raw = localStorage.getItem(bestKey(mode));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
  function saveBest(mode, data){
    localStorage.setItem(bestKey(mode), JSON.stringify(data));
  }

  function updateBestUI(){
    const mode = difficulty.value;
    const b = loadBest(mode);
    if (!b) { elBest.textContent = '—'; return; }
    elBest.textContent = `${b.moves} moves • ${fmtTime(b.time)}`;
  }

  function updateStats() {
    elMoves.textContent = String(state.moves);
    elMatches.textContent = String(state.matches);
    elTotal.textContent = String(state.totalPairs);
    elTime.textContent = fmtTime(state.time);
    updateBestUI();
  }

  function setWin(show){
    elWin.classList.toggle('show', show);
  }

  function stopTimer(){
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function startTimer(){
    stopTimer();
    state.timer = setInterval(() => {
      if (!state.started || state.paused) return;
      state.time += 1;
      elTime.textContent = fmtTime(state.time);
    }, 1000);
  }

  function setGridColumns(cols){
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0,1fr))`;
  }

  function buildDeck(mode) {
    const { cols, rows } = layouts[mode];
    state.layout = { cols, rows };
    setGridColumns(cols);

    const total = cols * rows;
    const pairs = total / 2;
    state.totalPairs = pairs;

    const pool = ICONS.slice();
    shuffle(pool);
    const chosen = pool.slice(0, pairs);

    const deck = [];
    chosen.forEach((ico) => {
      deck.push({ id: `${ico.key}-a`, key: ico.key, svg: ico.svg });
      deck.push({ id: `${ico.key}-b`, key: ico.key, svg: ico.svg });
    });
    shuffle(deck);

    state.cards = deck;
  }

  function resetState(keepLayout=false) {
    stopTimer();
    state.started = false;
    state.paused = false;
    state.busy = false;
    state.first = null;
    state.second = null;
    state.moves = 0;
    state.matches = 0;
    state.time = 0;
    btnPause.disabled = true;
    btnPause.textContent = 'Pause';
    setWin(false);
    updateStats();

    if (!keepLayout) buildDeck(difficulty.value);
    render();
  }

  function render() {
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    state.cards.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = 'card3d';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'card');
      btn.dataset.key = c.key;
      btn.dataset.idx = String(idx);

      btn.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-back"></div>
          <div class="card-face card-front">${c.svg}</div>
        </div>
      `;

      btn.addEventListener('click', () => onFlip(btn));
      frag.appendChild(btn);
    });

    grid.appendChild(frag);
  }

  function flip(btn, on=true){
    btn.classList.toggle('flipped', on);
  }
  function lock(btn, matched=false){
    btn.disabled = true;
    if (matched) btn.classList.add('matched');
  }

  function allButtons(){
    return Array.from(grid.querySelectorAll('.card3d'));
  }

  function onFlip(btn) {
    if (!state.started || state.paused || state.busy) return;
    if (btn.disabled || btn.classList.contains('flipped')) return;

    flip(btn, true);

    if (!state.first) {
      state.first = btn;
      return;
    }

    state.second = btn;
    state.moves += 1;
    updateStats();

    const a = state.first.dataset.key;
    const b = state.second.dataset.key;

    if (a === b) {
      // match
      lock(state.first, true);
      lock(state.second, true);
      state.first = null;
      state.second = null;
      state.matches += 1;
      updateStats();

      if (state.matches === state.totalPairs) {
        finish();
      }
      return;
    }

    // mismatch
    state.busy = true;
    setTimeout(() => {
      flip(state.first, false);
      flip(state.second, false);
      state.first = null;
      state.second = null;
      state.busy = false;
    }, 700);
  }

  function finish(){
    stopTimer();
    setWin(true);
    state.started = false;
    btnPause.disabled = true;

    const mode = difficulty.value;
    const best = loadBest(mode);
    const cur = { moves: state.moves, time: state.time };

    const better = (!best) || (cur.moves < best.moves) || (cur.moves === best.moves && cur.time < best.time);
    if (better) saveBest(mode, cur);

    updateStats();
  }

  function startGame(){
    if (state.started) return;
    state.started = true;
    state.paused = false;
    setWin(false);
    btnPause.disabled = false;
    btnPause.textContent = 'Pause';
    startTimer();
  }

  function togglePause(){
    if (!state.started) return;
    state.paused = !state.paused;
    btnPause.textContent = state.paused ? 'Resume' : 'Pause';
  }

  // Events
  btnStart.addEventListener('click', () => startGame());
  btnPause.addEventListener('click', () => togglePause());
  btnRestart.addEventListener('click', () => resetState(false));

  difficulty.addEventListener('change', () => {
    resetState(false);
    updateBestUI();
  });

  // Initial
  buildDeck('easy');
  resetState(true);
  updateBestUI();
})();
