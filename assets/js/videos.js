
(() => {
  const boxes = Array.from(document.querySelectorAll('.yt'));
  boxes.forEach(b => {
    const iframe = b.querySelector('iframe[data-yt="1"]');
    iframe?.addEventListener('error', () => b.classList.add('no-embed'));
  });
})();
