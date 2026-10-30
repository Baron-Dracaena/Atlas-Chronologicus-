/* ============================================================
   LABELS — a cartographer's overlay in HTML, so names can be set
   in Playfair and JetBrains Mono rather than bitmap text.
   Each frame the camera moved: project every candidate, drop the
   ones on the far hemisphere or below their zoom threshold (Atlas
   `lz`), then place greedily by priority, skipping any label whose
   box would collide with one already placed.
   ============================================================ */
window.IMP = window.IMP || {};
IMP.Labels = (function () {
  let layer, globe, cands = [], candKeys = new Set(), dirty = true, lastCam = '';
  const pool = new Map();     // key → element
  const widthCache = new Map();

  function setCandidates(list) {
    cands = list.sort((a, b) => b.prio - a.prio);
    candKeys = new Set(cands.map(c => c.key));
    dirty = true;
  }

  function el(c) {
    let e = pool.get(c.key);
    if (!e) {
      e = document.createElement('div');
      e.className = 'gl ' + c.cls;
      e.textContent = c.text;
      e.style.opacity = '0';
      layer.appendChild(e);
      pool.set(c.key, e);
    }
    if (e.textContent !== c.text) { e.textContent = c.text; widthCache.delete(c.key); }
    if (c.color && (c.cls.startsWith('polity') || c.cls === 'beacon')) e.style.color = tint(c.color);
    return e;
  }
  /* Lift a polity colour toward parchment so names stay legible on dark land. */
  const tintCache = {};
  function tint(hex) {
    if (tintCache[hex]) return tintCache[hex];
    const h = hex.replace('#', ''), n = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
    const m = n.map(v => Math.round(v + (242 - v) * 0.35));
    return (tintCache[hex] = `rgb(${m[0]},${m[1]},${m[2]})`);
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!globe) return;
    const cam = globe.camera().position;
    const camKey = cam.x.toFixed(2) + ',' + cam.y.toFixed(2) + ',' + cam.z.toFixed(2);
    if (!dirty && camKey === lastCam) return;
    dirty = false; lastCam = camKey;

    const k = IMP.GlobeView.zoomK();
    const W = innerWidth, H = innerHeight;
    const cl = cam.length(), cx = cam.x / cl, cy = cam.y / cl, cz = cam.z / cl;
    const placed = [];
    const live = new Set();

    for (const c of cands) {
      if (k < c.minK) continue;
      const p = globe.getCoords(c.lat, c.lng, 0.01);
      const pl = Math.hypot(p.x, p.y, p.z);
      /* facing test: angle between point normal and camera direction */
      const facing = (p.x * cx + p.y * cy + p.z * cz) / pl;
      if (facing < 0.18) continue;
      const sc = globe.getScreenCoords(c.lat, c.lng, 0.01);
      if (!sc || sc.x < -50 || sc.y < -20 || sc.x > W + 50 || sc.y > H + 20) continue;
      const e = el(c);
      let w = widthCache.get(c.key);
      if (w === undefined) { w = e.offsetWidth || c.text.length * 7; widthCache.set(c.key, w); }
      const h = 14;
      const centered = c.cls.startsWith('polity') || c.cls === 'beacon' || c.cls === 'route';
      const x = sc.x + (c.dx || 0) - (centered ? w / 2 : 3), y = sc.y + (c.dy || 0) - h / 2;
      const box = [x - 3, y - 2, x + w + 3, y + h + 2];
      if (placed.some(b => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
      placed.push(box);
      live.add(c.key);
      e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      /* fade toward the limb so names don't snap at the horizon */
      const edge = Math.min(1, (facing - 0.18) / 0.22);
      e.style.opacity = String(((c.alpha === undefined ? 1 : c.alpha) * edge).toFixed(2));
    }
    pool.forEach((e, key) => {
      if (live.has(key)) return;
      if (!candKeys.has(key)) { e.remove(); pool.delete(key); widthCache.delete(key); }
      else e.style.opacity = '0';
    });
  }

  function init(container, g) { layer = container; globe = g; requestAnimationFrame(frame); }
  return { init, setCandidates, poke: () => { dirty = true; } };
})();
