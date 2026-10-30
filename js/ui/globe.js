/* ============================================================
   GLOBE VIEW — every visible layer is a pure function of the
   app state (instant T, selection, filters):

     polygons   ledger countries (1899→) + Atlas sketches/overlays
     paths      Atlas routes & voyages, treaty meridians
     arcs       command arcs, capital → holding, in either era
     rings      chronicle events, IMPERIUM beacons, the handoff wave

   A style signature is diffed on each render so the GPU only
   rebuilds what actually changed — scrubbing stays smooth.
   ============================================================ */
window.IMP = window.IMP || {};
IMP.GlobeView = (function () {
  const A = IMP.Atlas, L = IMP.Ledger, C = IMP.Chronos, G = IMP.Geo, E = IMP.EMPIRES;
  const HANDOFF = IMP.HANDOFF;
  const PRETORIA = { lat: -25.75, lng: 28.23 };   // 11 Oct 1899: the ledger's first shot
  let globe = null, features = [], featByKey = {};
  let lastSig = { poly: '', path: '', arc: '', ring: '' };
  let style = new Map();
  let wave = null;

  /* ---------- colour helpers ---------- */
  function rgba(hex, a) {
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    return `rgba(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)},${a})`;
  }
  const KIND_ALPHA = { metropole: .9, dominion: .84, integral: .78, colony: .74, war: .78, occupation: .66, protectorate: .62, condominium: .6, mandate: .58, trust: .56, sphere: .42 };
  const KIND_ALT = { metropole: .020, dominion: .018, war: .022, occupation: .016, integral: .014, colony: .014, protectorate: .013, condominium: .012, mandate: .012, trust: .012, sphere: .010 };

  /* ---------- relevance (focus mode) ---------- */
  /* Focus mode (Atlas): selecting a polity, or filtering by a power, dims
     the rest of the world. A selected ledger polygon is only raised and
     outlined — its neighbours are the context you want to see. */
  function ledgerRelevant(st, key, s) {
    if (s.empire) return L.ownerOf(st) === s.empire;
    if (s.sel && s.sel.type === 'polity') return false;
    return true;
  }
  function polityRelevant(p, s) {
    if (s.sel && s.sel.type === 'polity') return s.sel.id === p.id;
    if (s.empire) return p.power === s.empire;
    return true;
  }
  const focusing = s => !!(s.empire || (s.sel && s.sel.type === 'polity'));

  function ledgerStyle(st, key, s) {
    const rel = ledgerRelevant(st, key, s), focus = focusing(s), sel = s.sel && s.sel.type === 'territory' && s.sel.id === key;
    let cap, alt = KIND_ALT[st.kind] || .012, stroke = 'rgba(212,175,55,0.32)';
    if (st.special === 'ghana') { cap = 'rgba(251,191,36,0.95)'; alt = .055; stroke = '#fbbf24'; }
    else if (st.power === 'SOVEREIGN') {
      if (L.isDecolonized(st)) cap = rel || !focus ? 'rgba(251,191,36,0.72)' : 'rgba(251,191,36,0.16)';
      else cap = st.postEmpire ? 'rgba(71,85,105,0.55)' : (rel || !focus ? 'rgba(64,77,102,0.55)' : 'rgba(32,39,54,0.3)');
      alt = .009;
    } else if (st.power === 'POST_EMPIRE') { cap = 'rgba(71,85,105,0.6)'; alt = .011; }
    else if (st.power === 'OTHER') { cap = rel || !focus ? 'rgba(150,118,128,0.55)' : 'rgba(150,118,128,0.14)'; alt = .011; }
    else {
      const emp = E[st.power];
      cap = rgba(emp.color, rel || !focus ? (KIND_ALPHA[st.kind] || .7) : .13);
      if (s.empire && rel) alt = .028;
    }
    if (st.kind === 'war' && st.special !== 'ghana') stroke = 'rgba(251,113,133,0.85)';
    if (sel) { alt += .03; stroke = '#fbbf24'; }
    return { cap, alt: Math.max(alt, .013), stroke, side: 'rgba(212,175,55,0.15)' };
  }

  function polityStyle(p, s, t) {
    const nested = A.nestedAt(p, t), rel = polityRelevant(p, s), focus = focusing(s);
    const sel = s.sel && s.sel.type === 'polity' && s.sel.id === p.id;
    let a = nested ? (p.peoples ? .10 : .16) : (p.cat === 'colonial' ? .30 : p.peoples ? .24 : .40);
    if (focus && !rel) a *= .3;
    if (sel) a = Math.min(.62, a + .2);
    const alt = (nested ? .036 + .012 * (1 - p.areaRank) : .013 + .016 * (1 - p.areaRank)) + (sel ? .02 : 0);
    return {
      cap: rgba(p.color, a), alt,
      stroke: sel ? '#fbbf24' : rgba(p.color, focus && !rel ? .3 : .95),
      side: rgba(p.color, nested ? .12 : .25)
    };
  }

  /* ---------- tooltips ---------- */
  function ledgerTip(f) {
    const st = L.stateAt(f.__key, IMP.App.state.t), rec = L.records[f.__key];
    const date = C.formatDate(IMP.App.state.t);
    if (!st) return `<div class="tip"><div class="tip-h"><span>${date}</span></div><b>${f.properties.name}</b><div class="r">No ledger record at this date.</div></div>`;
    return `<div class="tip"><div class="tip-h"><span>${date}</span>${IMP.Panels.powerPill(st)}</div>
      <b>${rec.name}</b><div class="r">${st.role}</div>
      <div class="f">${L.KIND_LABEL[st.kind] || st.kind} · click for the sovereignty log →</div></div>`;
  }
  function polityTip(p) {
    const t = IMP.App.state.t, nested = A.nestedAt(p, t);
    return `<div class="tip"><div class="tip-h"><span>${IMP.Panels.yrs(p)}</span>${p.power ? IMP.Panels.empPill(p.power) : `<span class="pill grey">${(A.CATN[p.cat] || '').toUpperCase()}</span>`}</div>
      <b>${p.n}</b><div class="r">${p.cap ? 'Capital: ' + p.cap : ''}</div>
      <div class="f">${nested ? 'Persists within the ledger polygon below' : 'Extent approximate (peak) — a zone, not a line'} →</div></div>`;
  }

  /* ---------- layer builders ---------- */
  function buildPolygons(s) {
    const t = s.t, y = C.yearOf(t), out = [];
    const radius = wave ? waveRadius() : 999;
    style = new Map();
    if (y >= HANDOFF) {
      features.forEach(f => {
        const st = L.stateAt(f.__key, t);
        if (!st) return;
        if (wave && f.__dist > radius) return;
        out.push(f); style.set(f, ledgerStyle(st, f.__key, s));
      });
    }
    A.polities.forEach(p => {
      let on = A.polityActive(p, t);
      if (!on && wave && p.superseded && A.polityActive(p, HANDOFF - 0.5) && p.__dist > radius) on = true;
      if (!on) return;
      const st = polityStyle(p, s, t);
      /* A nested overlay must ride above its host polygon, whatever that
         polygon's altitude (Ghana at 6 Mar 1957 is .055, +.03 when selected).
         Otherwise the cap sits inside the host slab and fails the depth test. */
      if (A.nestedAt(p, t)) {
        if (p.__host === undefined) p.__host = IMP.Panels.territoryAt(p.lbl.lat, p.lbl.lng);
        const hs = p.__host && style.get(featByKey[p.__host]);
        if (hs) st.alt = Math.max(st.alt, hs.alt + .01 + .006 * (1 - p.areaRank));
      }
      out.push(p.feature); style.set(p.feature, st);
    });
    return out;
  }

  function buildPaths(s) {
    if (!s.routes) return [];
    const t = s.t, out = [];
    A.routes.forEach(r => {
      const on = A.routeActive(r, t), ghost = !on && A.routeGhost(r, t);
      if (!on && !ghost) return;
      const sel = s.sel && s.sel.type === 'route' && s.sel.id === r.id;
      const dimmed = focusing(s) && !sel && !(s.sel && s.sel.type === 'polity' && IMP.Panels.routeTouches(r, A.byId['polity:' + s.sel.id]));
      r.segs.forEach((seg, i) => out.push({ r, seg, key: r.id + ':' + i, ghost, sel, dimmed }));
    });
    A.meridians.forEach(m => {
      const y = C.yearOf(t);
      if (y < m.s || y > m.e) return;
      const seg = []; for (let la = -74; la <= 74; la += 4) seg.push([m.lon, la]);
      out.push({ m, seg, key: 'mer:' + m.n });
    });
    return out;
  }

  function buildArcs(s) {
    if (!s.arcs) return [];
    const t = s.t, y = C.yearOf(t), out = [];
    const push = (emp, lat, lng, label, colors) => {
      if (G.distDeg(emp.capital.lat, emp.capital.lng, lat, lng) < 7) return;
      out.push({ startLat: emp.capital.lat, startLng: emp.capital.lng, endLat: lat, endLng: lng, color: colors || [rgba(emp.color, .95), 'rgba(212,175,55,0.85)'], label });
    };
    if (y >= HANDOFF) {
      Object.values(L.records).forEach(rec => {
        if (!rec.key || rec.lat === undefined) return;
        const st = L.stateAt(rec.code, t);
        if (!st) return;
        if (st.special === 'ghana') {
          if (!s.empire || s.empire === 'UK') push(E.UK, rec.lat, rec.lng, 'Sovereignty transfer: London → Accra (6 Mar 1957)', ['#e11d48', '#fbbf24']);
          return;
        }
        if (!L.isColonial(st)) return;
        if (s.empire && st.power !== s.empire) return;
        push(E[st.power], rec.lat, rec.lng, `${E[st.power].shortName} (${E[st.power].capital.name}) → ${rec.name}`);
      });
    }
    A.polities.forEach(p => {
      if (!p.power || !A.polityActive(p, t)) return;
      if (p.cat !== 'colonial' && !p.overlay) return;
      if (s.empire && p.power !== s.empire) return;
      const emp = E[p.power];
      push(emp, p.lbl.lat, p.lbl.lng, `${emp.shortName} → ${p.n}`);
    });
    return out;
  }

  function buildRings(s) {
    const t = s.t, y = C.yearOf(t), out = [];
    A.events.forEach(ev => {
      if (ev.lat === undefined) return;
      const win = ev.t < HANDOFF ? 12 : 3.5, age = t - ev.t;
      if (age < 0 || age > win) return;
      out.push({ lat: ev.lat, lng: ev.lng, color: '#d4af37', maxR: 3.2, speed: 1.4, period: 1600, alpha: 1 - age / win, key: 'ev:' + ev.n });
    });
    if (y >= HANDOFF) IMP.BEACONS.forEach(b => {
      if (y < b.years[0] || y > b.years[1]) return;
      const accra = b.id === 'accra' && t >= C.END - 0.01;
      out.push({ lat: b.lat, lng: b.lng, color: b.color, maxR: accra ? 9 : 4.5, speed: accra ? 3.2 : 1.8, period: accra ? 650 : 1200, alpha: 1, key: 'bc:' + b.id + accra });
    });
    if (wave) out.push({ lat: PRETORIA.lat, lng: PRETORIA.lng, color: '#6ee7b7', maxR: 180, speed: 180 / (wave.dur / 1000), period: wave.dur * 3, alpha: 1, key: 'wave' });
    return out;
  }

  /* All polygon meshes sit at the origin, so three.js cannot depth-sort
     the transparent ones by distance: an overlay drawn first would write
     depth and cut a hole in the ledger cap beneath it. Draw ledger, then
     sketches, then nested overlays — and let overlays never write depth. */
  function fixLayering(polys, t) {
    const set = new Set(polys);
    globe.scene().traverse(o => {
      /* three-globe wraps each (sub-)polygon: o.__data = { data: feature, … } */
      const f = o.__globeObjType === 'polygon' && o.__data && o.__data.data;
      if (!f || !set.has(f)) return;
      const p = f.__ref, nested = !!(p && A.nestedAt(p, t));
      const order = !p ? 1 : nested ? 3 : 2;
      o.traverse(c => {
        c.renderOrder = order;
        if (c.material) [].concat(c.material).forEach(m => { m.depthWrite = !nested; });
      });
    });
  }

  /* ---------- render ---------- */
  function render() {
    if (!globe) return;
    const s = IMP.App.state;

    const polys = buildPolygons(s);
    const psig = polys.map(f => { const st = style.get(f); return (f.__key || f.properties.id) + st.cap + st.alt + st.stroke; }).join('|');
    if (psig !== lastSig.poly) {
      lastSig.poly = psig;
      globe.polygonsData(polys)
        .polygonCapColor(f => style.get(f).cap)
        .polygonSideColor(f => style.get(f).side)
        .polygonStrokeColor(f => style.get(f).stroke)
        .polygonAltitude(f => style.get(f).alt);
      /* three-globe builds meshes on its own (debounced) update tick */
      setTimeout(() => fixLayering(polys, s.t), 80);
    }

    const paths = buildPaths(s);
    const pathSig = paths.map(p => p.key + (p.ghost ? 'g' : '') + (p.sel ? 's' : '') + (p.dimmed ? 'd' : '')).join('|');
    if (pathSig !== lastSig.path) {
      lastSig.path = pathSig;
      globe.pathsData(paths)
        .pathColor(p => {
          if (p.m) return ['rgba(212,175,55,0.0)', 'rgba(212,175,55,0.55)', 'rgba(212,175,55,0.0)'];
          const a = p.ghost ? .22 : p.dimmed ? .12 : p.sel ? 1 : .85;
          return rgba(p.r.color, a);
        })
        .pathStroke(p => (p.sel ? 1.3 : null))
        .pathDashLength(p => (p.m ? .01 : p.r.dash ? .012 : p.r.cat === 'slave' ? .05 : 1))
        .pathDashGap(p => (p.m ? .012 : p.r.dash ? .008 : p.r.cat === 'slave' ? .02 : 0))
        .pathDashAnimateTime(p => (p.m ? 0 : p.r.dash ? 24000 : p.r.cat === 'slave' ? 16000 : 0));
    }

    const arcs = buildArcs(s);
    const asig = arcs.map(a => a.label).join('|');
    if (asig !== lastSig.arc) { lastSig.arc = asig; globe.arcsData(arcs); }

    const rings = buildRings(s);
    const rsig = rings.map(r => r.key + Math.round(r.alpha * 10)).join('|');
    if (rsig !== lastSig.ring) { lastSig.ring = rsig; globe.ringsData(rings); }

    IMP.Labels.setCandidates(labelCandidates(s));
  }

  function labelCandidates(s) {
    const t = s.t, y = C.yearOf(t), out = [];
    A.polities.forEach(p => {
      if (!A.polityActive(p, t)) return;
      const nested = A.nestedAt(p, t);
      const rel = !focusing(s) || polityRelevant(p, s);
      out.push({ key: 'p:' + p.id, text: p.n, cls: 'polity' + (nested ? ' nested' : ''), lat: p.lbl.lat, lng: p.lbl.lng,
        color: p.color, minK: Math.max(p.lz, p.pz || 0) * (nested ? 1.25 : 1), prio: 60 + 40 * p.areaRank - (nested ? 15 : 0) + (rel ? 0 : -50),
        alpha: rel ? 1 : .35 });
    });
    A.cities.forEach(c => {
      if (!A.cityActive(c, t)) return;
      out.push({ key: 'c:' + c.n, text: c.n, cls: 'city' + (c.star ? ' star' : ''), lat: c.lat, lng: c.lng, minK: Math.max(c.star ? 1.5 : 2.2, c.cz || 0), prio: c.star ? 45 : 20 });
    });
    if (y >= HANDOFF) {
      Object.values(E).forEach(emp => {
        if (y < emp.activeYears[0] || y > emp.activeYears[1]) return;
        if (s.empire && s.empire !== emp.id) return;
        out.push({ key: 'k:' + emp.id, text: emp.capital.name.toUpperCase(), cls: 'capital', lat: emp.capital.lat, lng: emp.capital.lng, minK: 1.1, prio: 70 });
      });
      IMP.BEACONS.forEach(b => {
        if (y < b.years[0] || y > b.years[1]) return;
        const accra = b.id === 'accra' && t >= C.END - 0.01;
        if (!accra && Math.abs(y - b.highlightYear) > 2) return;
        out.push({ key: 'b:' + b.id, text: accra ? '★ ACCRA: GHANA INDEPENDENCE (6 MAR 1957)' : b.name, cls: 'beacon', lat: b.lat, lng: b.lng, color: b.color, minK: 0, prio: accra ? 200 : 110 });
      });
    }
    if (s.routes) {
      A.routes.forEach(r => {
        if (!r.arrow || !A.routeActive(r, t)) return;
        const seg = r.segs[r.segs.length - 1], end = seg[seg.length - 1];
        out.push({ key: 'r:' + r.id, text: r.arrow, cls: 'route', lat: end[1], lng: end[0], minK: 1.2, prio: 15, dy: -12 });
      });
      A.meridians.forEach(m => {
        if (y < m.s || y > m.e) return;
        out.push({ key: 'm:' + m.n, text: m.n, cls: 'meridian', lat: -38, lng: m.lon, minK: 0.9, prio: 30, dx: 8 });
      });
    }
    return out;
  }

  /* ---------- the handoff wave (1899) ----------
     The precise ledger rises out of Pretoria — where its record opens
     on 11 Oct 1899 — at the same speed as the ring that carries it,
     and each Atlas sketch it supersedes dissolves as the front passes. */
  function waveRadius() { return 180 * Math.min(1, (performance.now() - wave.t0) / wave.dur); }
  function startWave() {
    if (wave || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    wave = { t0: performance.now(), dur: 2200 };
    (function tick() {
      if (!wave) return;
      if (performance.now() - wave.t0 >= wave.dur) { wave = null; render(); return; }
      render();
      setTimeout(tick, 70);
    })();
  }

  /* ---------- camera ---------- */
  const flyTo = (lat, lng, altitude, ms = 1000) => globe && globe.pointOfView({ lat, lng, altitude }, ms);
  const flyToBox = (b, ms = 1000) => { const v = G.povForBox(b); flyTo(v.lat, v.lng, v.altitude, ms); };
  function flyToFeatureKey(key) {
    const rec = L.records[key], f = featByKey[key];
    if (f) flyToBox(G.bboxOfFeature(f), 950);
    else if (rec && rec.lat !== undefined) flyTo(rec.lat, rec.lng, 1.5, 950);
  }
  const zoomK = () => globe ? 2.3 / Math.max(0.05, globe.pointOfView().altitude) : 1;

  /* ---------- init ---------- */
  function init(container, world) {
    features = world.map(f => {
      f.__key = f.id !== undefined && f.id !== null ? String(f.id).padStart(3, '0') : 'N:' + f.properties.name;
      f.__kind = 'ledger';
      f.geometry = G.densifyGeometry(f.geometry);
      const c = G.featureCenter(f); f.__dist = G.distDeg(c.lat, c.lng, PRETORIA.lat, PRETORIA.lng);
      featByKey[f.__key] = f;
      return f;
    }).filter(f => f.__key !== '010');
    A.polities.forEach(p => { p.__dist = G.distDeg(p.lbl.lat, p.lbl.lng, PRETORIA.lat, PRETORIA.lng); });

    globe = Globe({ animateIn: true })(container)
      .width(innerWidth).height(innerHeight)
      .backgroundColor('#08090c')
      .showAtmosphere(true).atmosphereColor('#d4af37').atmosphereAltitude(0.16)
      .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-dark.jpg')
      .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-topology.png')
      .polygonsTransitionDuration(450)
      /* fine cap tessellation: long straight borders (Sahara, Canada)
         otherwise make chords that sag beneath the sphere */
      .polygonCapCurvatureResolution(1.5)
      .polygonLabel(f => (f.__kind === 'ledger' ? ledgerTip(f) : polityTip(f.__ref)))
      .onPolygonHover(f => { container.style.cursor = f ? 'pointer' : 'grab'; })
      .onPolygonClick(f => {
        if (!f) return;
        if (f.__kind === 'ledger') IMP.App.select({ type: 'territory', id: f.__key }, { fly: true });
        else IMP.App.select({ type: 'polity', id: f.__ref.id }, { fly: false });
      })
      .onGlobeClick(() => IMP.App.select(null))
      .pathPoints('seg').pathPointLat(p => p[1]).pathPointLng(p => p[0]).pathPointAlt(0.004)
      .pathResolution(2).pathTransitionDuration(1400)
      .pathLabel(p => p.r ? `<div class="tip"><div class="tip-h"><span>${p.r.s}–${p.r.e}</span><span class="pill grey">${(A.RCATN[p.r.cat] || '').toUpperCase()}</span></div><b>${p.r.n}</b><div class="f">click for the route dossier →</div></div>` : `<div class="tip"><b>${p.m.n}</b><div class="r">Treaty meridian dividing the Iberian claims.</div></div>`)
      .onPathClick(p => { if (p && p.r) IMP.App.select({ type: 'route', id: p.r.id }, { fly: false }); })
      .onPathHover(p => { container.style.cursor = p ? 'pointer' : 'grab'; })
      .arcColor('color').arcDashLength(0.45).arcDashGap(0.2).arcDashAnimateTime(2200).arcStroke(0.5)
      .arcAltitudeAutoScale(0.35).arcLabel('label').arcsTransitionDuration(600)
      .ringColor(d => tt => rgba(d.color, (1 - tt) * d.alpha))
      .ringMaxRadius('maxR').ringPropagationSpeed('speed').ringRepeatPeriod('period');

    /* Slabs ride ~1.3 units over a radius-100 sphere; with the default
       near plane the depth buffer can't separate them at world view and
       the caps speckle. The camera never comes closer than 18 units. */
    const cam = globe.camera();
    cam.near = 4; cam.far = 3000; cam.updateProjectionMatrix();

    const controls = globe.controls();
    controls.autoRotate = false; controls.autoRotateSpeed = 0.45;
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.minDistance = 118; controls.maxDistance = 520;
    globe.pointOfView({ lat: 18, lng: 14, altitude: 2.15 }, 0);
    addEventListener('resize', () => globe.width(innerWidth).height(innerHeight));
    return globe;
  }

  return {
    init, render, startWave, flyTo, flyToBox, flyToFeatureKey, zoomK, rgba,
    get globe() { return globe; }, get features() { return features; }, featByKey: k => featByKey[k]
  };
})();
