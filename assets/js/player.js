
(() => {
  const audio = document.getElementById('audio');
  if (!audio) return;

  // Serve the audio file from /media so it works on the backend server
  audio.src = 'media/song.mp3';
  audio.preload = 'metadata';

  const playBig = document.getElementById('playBig');
  const miniPlay = document.getElementById('miniPlay');
  const seek = document.getElementById('seek');
  const vol = document.getElementById('vol');
  const tCur = document.getElementById('tCur');
  const tDur = document.getElementById('tDur');
  const timeBig = document.getElementById('timeBig');
  const wave = document.querySelector('.wave');

  const toMusic = document.getElementById('toMusic');
  const toHero = document.getElementById('toHero');
  const toVideos = document.getElementById('toVideos');

  const mainVert = document.getElementById('mainVert');
  const music = document.getElementById('music');
  const game = document.getElementById('game');
  const videos = document.getElementById('videos');

  const fmt = (s) => {
    s = Math.max(0, Math.floor(s || 0));
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const r = String(s%60).padStart(2,'0');
    return `${m}:${r}`;
  };

  const syncButtons = () => {
    const playing = !audio.paused;
    const icon = playing ? '❚❚' : '▶';
    if (playBig) playBig.textContent = icon;
    if (miniPlay) miniPlay.textContent = icon;
    wave?.classList.toggle('playing', playing);
  };

  const toggle = async () => {
    if (audio.paused) {
      try { await audio.play(); } catch(e) {}
    } else {
      audio.pause();
    }
    syncButtons();
  };

  playBig?.addEventListener('click', toggle);
  miniPlay?.addEventListener('click', toggle);

  // volume
  if (vol) audio.volume = Number(vol.value || 0.8);
  vol?.addEventListener('input', () => audio.volume = Number(vol.value));

  audio.addEventListener('loadedmetadata', () => {
    if (tDur) tDur.textContent = fmt(audio.duration);
    if (timeBig) timeBig.textContent = `${fmt(0)}–${fmt(audio.duration)}`;
  });

  audio.addEventListener('timeupdate', () => {
    const d = audio.duration || 0;
    const c = audio.currentTime || 0;
    const p = d ? (c / d) * 100 : 0;
    if (seek) seek.value = String(p);
    if (tCur) tCur.textContent = fmt(c);
    if (timeBig) timeBig.textContent = `${fmt(c)}–${fmt(d)}`;
  });

  seek?.addEventListener('input', () => {
    const d = audio.duration || 0;
    audio.currentTime = (Number(seek.value) / 100) * d;
  });

  audio.addEventListener('play', syncButtons);
  audio.addEventListener('pause', syncButtons);
  syncButtons();

  // Vertical scroll buttons
  toMusic?.addEventListener('click', () => mainVert?.scrollTo({ top: music?.offsetTop || mainVert.clientHeight, behavior: 'smooth' }));
  toHero?.addEventListener('click', () => mainVert?.scrollTo({ top: 0, behavior: 'smooth' }));
  toVideos?.addEventListener('click', () => mainVert?.scrollTo({ top: videos?.offsetTop || mainVert.clientHeight*3, behavior: 'smooth' }));

  // Ensure Music section has a ↓ Game button
  const musicCenter = document.querySelector('#music .music-center');
  if (musicCenter && !document.getElementById('toGame')) {
    const btn = document.createElement('button');
    btn.className = 'btn ghost down';
    btn.id = 'toGame';
    btn.type = 'button';
    btn.textContent = '↓ Game';
    musicCenter.appendChild(btn);
  }
  document.getElementById('toGame')?.addEventListener('click', () => {
    mainVert?.scrollTo({ top: game?.offsetTop || mainVert.clientHeight*2, behavior: 'smooth' });
  });

  document.getElementById('toMusic2')?.addEventListener('click', () => {
    mainVert?.scrollTo({ top: music?.offsetTop || mainVert.clientHeight, behavior: 'smooth' });
  });
  document.getElementById('toGame2')?.addEventListener('click', () => {
    mainVert?.scrollTo({ top: game?.offsetTop || mainVert.clientHeight*2, behavior: 'smooth' });
  });
  document.getElementById('toHero2')?.addEventListener('click', () => {
    mainVert?.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
