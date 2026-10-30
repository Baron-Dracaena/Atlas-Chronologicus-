/* ============================================================
   APP — one state object, one render pipeline.
     setTime / select / setEmpire / toggles  →  state  →  schedule()
     schedule() batches into a single animation frame:
       header telemetry · epoch banner · era bar · index · dossier · globe
   Deep links:  #t=1947.62&sel=territory:356&emp=UK
   ============================================================ */
window.IMP = window.IMP || {};
IMP.App = (function () {
  const C = IMP.Chronos, A = IMP.Atlas, L = IMP.Ledger, E = IMP.EMPIRES, GV = IMP.GlobeView, P = IMP.Panels;
  const HANDOFF = IMP.HANDOFF, MIN = C.MIN_YEAR, MAX = C.END;
  const $ = s => document.querySelector(s);

  const state = {
    t: C.sampleOfYear(800), sel: null, empire: null, view: null,
    tab: 'year', phase: 'ALL', query: '', arcs: innerWidth > 760, routes: true, spinning: false, playing: false
  };
  const app = { state, audit: [] };

  /* ---------- scheduling ---------- */
  let queued = false, lastGlobe = 0, lastPanels = 0, lastEra = null;
  const diag = { renders: 0, ms: 0 };
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const a = performance.now();
      renderChrome();
      /* while playing, the panels (heavier, and under the pointer) refresh at
         ~4 Hz and the globe at ~11 Hz; the final frame always renders both */
      let deferred = false;
      if (!state.playing || a - lastPanels > 250) { lastPanels = a; P.renderIndex(); P.renderDossier(); } else deferred = true;
      if (!state.playing || a - lastGlobe > 90) { lastGlobe = a; GV.render(); } else deferred = true;
      if (deferred) setTimeout(schedule, 95);
      diag.renders++; diag.ms = performance.now() - a;
      syncHash();
      if (!$('#diag').classList.contains('hidden')) renderDiag();
    });
  }

  /* D — health readout (from the earlier Atlas.js engine): these must not climb. */
  function renderDiag() {
    let meshes = 0; GV.globe.scene().traverse(o => { if (o.__globeObjType === 'polygon') meshes++; });
    $('#diag').textContent =
      `renders    ${diag.renders}\nlast frame ${diag.ms.toFixed(1)} ms\nDOM nodes  ${document.getElementsByTagName('*').length}\n` +
      `polygons   ${GV.globe.polygonsData().length} (${meshes} meshes)\nlabels     ${document.querySelectorAll('#labelLayer .gl').length}\n` +
      `zoom       ${GV.zoomK().toFixed(2)}×\naudit      ${app.audit.length} findings`;
  }

  /* ↑/↓ — step through the polities alive this year (Atlas.js). */
  function stepPolity(dir) {
    const live = A.polities.filter(p => A.polityActive(p, state.t));
    if (!live.length) return;
    const at = state.sel && state.sel.type === 'polity' ? live.findIndex(p => p.id === state.sel.id) : -1;
    const next = live[(at + dir + live.length) % live.length];
    select({ type: 'polity', id: next.id });
    openPanel('dossierPanel');
  }

  /* ---------- time ---------- */
  function setTime(t) {
    const prevY = C.yearOf(state.t);
    state.t = Math.max(MIN, Math.min(MAX, t));
    const y = C.yearOf(state.t);
    if (prevY < HANDOFF && y >= HANDOFF) GV.startWave();
    schedule();
  }
  const stepYears = n => setTime(C.sampleOfYear(Math.min(1957, Math.max(MIN, C.yearOf(state.t) + n))));

  /* Playback with time dilation: centuries race, the dense
     twentieth-century record slows to a readable pace. */
  function speedAt(t) {
    if (t >= HANDOFF) return 2.2;
    return 6 + 24 / (1 + Math.exp((t - 1700) / 70));
  }
  let raf = null, lastT = 0;
  function togglePlay(force) {
    state.playing = force !== undefined ? force : !state.playing;
    $('#playIcon').textContent = state.playing ? '⏸' : '▶';
    $('#playLbl').textContent = state.playing ? 'PAUSE' : 'CHRONO PLAY';
    cancelAnimationFrame(raf);
    if (state.playing) {
      if (state.t >= MAX - 1e-6) state.t = C.sampleOfYear(800);
      lastT = performance.now();
      const step = now => {
        if (!state.playing) return;
        const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
        const next = state.t + dt * speedAt(state.t);
        if (next >= MAX) { setTime(MAX); togglePlay(false); return; }
        setTime(next);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    } else schedule();
  }

  /* ---------- selection ---------- */
  function select(sel, opts = {}) {
    state.view = null;
    if (!sel) { state.sel = null; schedule(); return; }
    state.sel = sel;
    if (sel.type === 'polity') {
      const p = A.byId['polity:' + sel.id];
      if (!p) { state.sel = null; return schedule(); }
      if (!A.polityActive(p, state.t) && opts.travel !== false) setTime(C.sampleOfYear(Math.min(p.e, p.s + 1)));
      if (opts.fly !== false) GV.flyToBox(p.bbox, 900);
    } else if (sel.type === 'route') {
      const r = A.byId['route:' + sel.id];
      if (!r) { state.sel = null; return schedule(); }
      if (!A.routeActive(r, state.t) && opts.travel !== false) setTime(C.sampleOfYear(Math.min(r.e, r.s + 1)));
      if (opts.fly !== false) GV.flyToBox(r.bbox, 900);
    } else if (sel.type === 'territory') {
      if (C.yearOf(state.t) < HANDOFF && opts.travel !== false) setTime(C.sampleOfYear(HANDOFF));
      if (opts.fly !== false) GV.flyToFeatureKey(sel.id);
    }
    schedule();
  }
  function setEmpire(id, opts = {}) {
    state.view = null; state.sel = null;
    state.empire = id && state.empire !== id ? id : (opts.keep && id ? id : null);
    if (state.empire && opts.fly !== false) { const c = E[state.empire].capital; GV.flyTo(c.lat * 0.65, c.lng, 1.95, 1100); }
    schedule();
  }
  function clearAll() { state.sel = null; state.empire = null; state.view = null; schedule(); }

  /* ---------- chrome ---------- */
  const fmtUp = t => C.formatDate(t).toUpperCase();
  function renderChrome() {
    const t = state.t, y = C.yearOf(t), ledger = y >= HANDOFF;
    const slider = $('#slider');
    if (document.activeElement !== slider || state.playing) slider.value = Math.min(1957, y);
    $('#badgeYear').textContent = y;
    $('#mDate').textContent = fmtUp(t);
    $('#dateReadout').textContent = fmtUp(t);
    $('#liveDot').classList.toggle('sketch', !ledger);
    $('#mLayer').textContent = ledger ? 'LEDGER · 1:110M' : 'ATLAS SKETCH';
    if (ledger) {
      const tl = L.tally(t);
      $('#mAK').textContent = 'COLONIAL EMPIRES'; $('#mA').textContent = `${tl.empiresActive} ACTIVE`;
      $('#mBK').textContent = 'COLONIZED POLYGONS'; $('#mB').textContent = `${tl.colonized} TERRITORIES`;
      $('#mCK').textContent = 'NEWLY SOVEREIGN'; $('#mC').textContent = `${tl.decolonized} NATIONS`;
    } else {
      $('#mAK').textContent = 'POLITIES ON MAP'; $('#mA').textContent = A.polities.filter(p => A.polityActive(p, t)).length;
      $('#mBK').textContent = 'ROUTES ACTIVE'; $('#mB').textContent = A.routes.filter(r => A.routeActive(r, t)).length;
      $('#mCK').textContent = 'EVENTS TO DATE'; $('#mC').textContent = A.events.filter(ev => ev.t <= t).length;
    }
    const era = A.eraAt(t), ev = A.lastEventBefore(t);
    $('#epBadge').textContent = era.badge;
    $('#epTitle').textContent = era.title;
    $('#epDesc').textContent = era.desc || (ev ? `${C.formatBound(ev.d)} · ${ev.n}` : '');
    if (lastEra !== era) { if (lastEra) { const el = $('#epochToast'); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } lastEra = era; }
    document.querySelectorAll('#eraBar button').forEach(b => b.classList.toggle('on', b.dataset.key === (t >= MAX - 1e-6 ? 'end' : String(era.t) + era.src)));
    const tick = $('#ticker');
    if (ev) { tick.textContent = `${C.formatBound(ev.d)} · ${ev.n}`; tick.classList.toggle('fresh', t - ev.t < (ev.t < HANDOFF ? 8 : 1.5)); }
    $('#btnArcs').classList.toggle('on', state.arcs);
    $('#btnRoutes').classList.toggle('on', state.routes);
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab));
    const ab = $('#auditBadge'), errs = app.audit.filter(x => x.level === 'error').length, warns = app.audit.filter(x => x.level === 'warn').length;
    ab.textContent = errs ? `AUDIT ✕ ${errs}` : `AUDIT ✓${warns ? ' · ' + warns + ' warn' : ''}`;
    ab.className = 'audit-badge ' + (errs ? 'err' : 'ok');
  }

  function buildTimeline() {
    const pct = t => ((t - MIN) / (1957 - MIN)) * 100;
    const ticks = $('#evTicks');
    ticks.innerHTML = A.events.map(ev => `<i class="${ev.src === 'ledger' ? 'ledger' : ''}" style="left:${Math.min(100, pct(ev.t)).toFixed(2)}%"></i>`).join('');
    const hp = pct(HANDOFF);
    /* the thumb's travel is inset by its radius; keep the marker on the true 1899 */
    $('#handoffMark').style.left = `calc(10px + (100% - 20px) * ${(hp / 100).toFixed(4)})`;
    $('#slider').style.setProperty('--track', `linear-gradient(90deg, rgba(212,175,55,.18) 0%, rgba(212,175,55,.42) ${hp}%, rgba(52,211,153,.45) ${hp}%, rgba(251,191,36,.7) 100%)`);
    const bar = $('#eraBar');
    bar.innerHTML = A.eras.filter(e => e.t < 1957).map(e => `<button data-key="${e.t}${e.src}" data-t="${C.sampleOfYear(e.y)}" class="${e.src === 'ledger' ? 'ledger' : ''}">${e.y} · ${P.esc(e.n)}</button>`).join('')
      + `<button data-key="end" data-t="${MAX}" class="star">★ 6 Mar 1957: Ghana</button>`;
    bar.querySelectorAll('button').forEach(b => { b.onclick = () => { togglePlay(false); setTime(+b.dataset.t); }; });
    const sel = $('#selTheatre');
    sel.innerHTML = '<option value="">Theatres…</option>' + A.views.map((v, i) => `<option value="${i}">${P.esc(v.n)}</option>`).join('');
    sel.onchange = () => { if (sel.value !== '') GV.flyToBox(A.views[+sel.value].b, 1100); sel.value = ''; };
  }

  /* ---------- wiring ---------- */
  function wire() {
    const slider = $('#slider');
    slider.addEventListener('input', () => { togglePlay(false); setTime(C.sampleOfYear(+slider.value)); });
    $('#btnPlay').onclick = () => togglePlay();
    $('#btnAccra').onclick = accra;
    $('#btnArcs').onclick = () => { state.arcs = !state.arcs; schedule(); };
    $('#btnRoutes').onclick = () => { state.routes = !state.routes; schedule(); };
    $('#btnSpin').onclick = () => {
      state.spinning = !state.spinning; GV.globe.controls().autoRotate = state.spinning;
      $('#spinLbl').textContent = state.spinning ? 'Spin: ON' : 'Spin: OFF'; $('#btnSpin').classList.toggle('on', state.spinning);
    };
    $('#btnReset').onclick = () => { clearAll(); GV.flyTo(18, 14, 2.15, 1000); };
    $('#btnClear').onclick = clearAll;
    $('#auditBadge').onclick = () => { state.view = 'audit'; openPanel('dossierPanel'); schedule(); };
    document.querySelectorAll('.tabs button').forEach(b => { b.onclick = () => { state.tab = b.dataset.tab; schedule(); }; });
    const search = $('#search');
    search.addEventListener('input', () => { state.query = search.value; if (state.query && state.tab === 'year' && C.yearOf(state.t) < HANDOFF) state.tab = 'all'; schedule(); });
    search.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const first = $('#indexBody [data-act]'); if (first) first.click(); search.blur(); }
      if (e.key === 'Escape') { search.value = ''; state.query = ''; schedule(); search.blur(); }
    });
    document.querySelectorAll('.mobile-toggles button').forEach(b => { b.onclick = () => openPanel(b.dataset.panel, true); });

    /* one delegated handler for every data-act element in both panels */
    const onAct = e => {
      const el = e.target.closest('[data-act]');
      if (!el) return;
      const act = el.dataset.act;
      if (act === 'sel') { select({ type: el.dataset.type, id: el.dataset.id }); openPanel('dossierPanel'); }
      else if (act === 'empire') { setEmpire(el.dataset.id, { keep: true }); openPanel('dossierPanel'); }
      else if (act === 'time') { togglePlay(false); setTime(+el.dataset.t); }
      else if (act === 'phase') { state.phase = el.dataset.id === 'ALL' ? 'ALL' : +el.dataset.id; schedule(); }
      else if (act === 'clear') clearAll();
      else if (act === 'accra') accra();
    };
    ['#indexPanel', '#dossierPanel'].forEach(s => {
      $(s).addEventListener('click', onAct);
      $(s).addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[data-act]')) onAct(e); });
    });

    document.addEventListener('keydown', e => {
      if ((e.target.tagName === 'INPUT' && e.target.type !== 'range') || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); togglePlay(false);
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        if (e.altKey) setTime(C.addMonths(state.t, dir));
        else stepYears(dir * (e.shiftKey ? 10 : 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); stepPolity(e.key === 'ArrowDown' ? 1 : -1); }
      else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'Escape') clearAll();
      else if (e.key === '/') { e.preventDefault(); search.focus(); }
      else if (e.key === '0') { clearAll(); GV.flyTo(18, 14, 2.15, 1000); }
      else if (e.key === 'd' || e.key === 'D') { $('#diag').classList.toggle('hidden'); renderDiag(); }
    });
    GV.globe.controls().addEventListener('change', IMP.Labels.poke);
  }

  function openPanel(id, toggle) {
    if (innerWidth > 1100) return;
    const el = document.getElementById(id), other = document.getElementById(id === 'indexPanel' ? 'dossierPanel' : 'indexPanel');
    other.classList.remove('open');
    if (toggle) el.classList.toggle('open'); else el.classList.add('open');
  }

  function accra() {
    togglePlay(false);
    state.empire = null; state.view = null;
    setTime(MAX);
    state.sel = { type: 'territory', id: '288' };
    GV.flyTo(6.5, -0.5, 1.45, 1350);
    openPanel('dossierPanel');
    schedule();
  }

  /* ---------- deep links ---------- */
  let hashT = null;
  function syncHash() {
    clearTimeout(hashT);
    hashT = setTimeout(() => {
      const parts = [`t=${state.t.toFixed(3)}`];
      if (state.sel) parts.push(`sel=${state.sel.type}:${encodeURIComponent(state.sel.id)}`);
      if (state.empire) parts.push(`emp=${state.empire}`);
      try { history.replaceState(null, '', '#' + parts.join('&')); } catch (e) { /* file:// in some browsers */ }
    }, 300);
  }
  function readHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    const t = parseFloat(h.get('t') || h.get('y'));
    if (isFinite(t)) state.t = Math.max(MIN, Math.min(MAX, Number.isInteger(t) ? C.sampleOfYear(t) : t));
    const sel = h.get('sel');
    /* validate before trusting: a stale link (renamed id) would otherwise
       make every dossier render throw and stall the whole frame */
    if (sel && sel.includes(':')) {
      const i = sel.indexOf(':'), type = sel.slice(0, i), id = decodeURIComponent(sel.slice(i + 1));
      const ok = type === 'territory' ? !!L.records[id] : (type === 'polity' || type === 'route') && !!A.byId[type + ':' + id];
      if (ok) state.sel = { type, id };
    }
    const emp = h.get('emp');
    if (emp && E[emp]) state.empire = emp;
  }

  /* ---------- frontispiece ---------- */
  function frontis() {
    const fr = $('#frontis');
    let seen = false; try { seen = localStorage.getItem('imperium_atlas_seen') === '1'; } catch (e) { }
    if (seen) { fr.remove(); return; }
    $('#frEnter').onclick = () => {
      try { if ($('#frSkip').checked) localStorage.setItem('imperium_atlas_seen', '1'); } catch (e) { }
      fr.classList.add('gone'); setTimeout(() => fr.remove(), 600);
    };
  }

  /* ---------- boot ---------- */
  async function boot() {
    frontis();
    /* the header wraps on narrower screens; panels sit below whatever height it takes */
    const hud = $('#hud'), place = () => document.documentElement.style.setProperty('--below-hud', Math.round(hud.getBoundingClientRect().bottom + 8) + 'px');
    new ResizeObserver(place).observe(hud); place();
    readHash();
    let world;
    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json');
      const topo = await res.json();
      world = topojson.feature(topo, topo.objects.countries).features;
    } catch (err) {
      const box = $('#loadErr');
      box.textContent = 'Could not load the 1:110m country polygons (world-atlas@2.0.2). The console needs a network connection for its base geometry. ' + err;
      box.classList.remove('hidden');
      world = [];
    }
    const g = GV.init(document.getElementById('globeViz'), world);
    IMP.Labels.init(document.getElementById('labelLayer'), g);
    app.audit = IMP.Audit(GV.features);
    const errs = app.audit.filter(x => x.level !== 'info');
    if (errs.length) console.groupCollapsed(`[IMPERIUM audit] ${errs.length} findings`), errs.forEach(x => console[x.level === 'error' ? 'error' : 'warn'](x.msg)), console.groupEnd();
    buildTimeline();
    wire();
    if (state.sel && state.sel.type === 'territory') GV.flyToFeatureKey(state.sel.id);
    schedule();
  }

  return Object.assign(app, { setTime, select, setEmpire, togglePlay, clearAll, boot, schedule });
})();

window.addEventListener('DOMContentLoaded', () => IMP.App.boot());
