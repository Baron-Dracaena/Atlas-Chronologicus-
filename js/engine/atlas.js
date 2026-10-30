/* ============================================================
   ATLAS ADAPTER — turns the Atlas Chronologicus arrays (globals
   POLITIES, ROUTES, CITIES, EVENTS, ERAS, VIEWS, CAT, RCAT) and
   the IMPERIUM epochs into one normalized catalogue the globe,
   panels and audit all read. Nothing downstream touches the raw
   arrays, so the data files stay exactly as editable as before.
   ============================================================ */
window.IMP = window.IMP || {};
IMP.Atlas = (function () {
  const C = IMP.Chronos, G = IMP.Geo;
  const HANDOFF = IMP.HANDOFF;

  /* Atlas colours were mixed for parchment; these are the same
     families lifted for an obsidian ground. Keys are Atlas's. */
  const CAT_DARK = {
    sahel: '#e0a336', forest: '#5fb35a', central: '#9a7ad6', east: '#2fb3a3', south: '#d46aa0',
    nafrica: '#b8b84a', europe: '#6f97e3', samerica: '#e0703d', easia: '#e2566e', steppe: '#9cc43a',
    sasia: '#b867c4', colonial: '#a89d88'
  };
  const RCAT_DARK = { explore: '#d4af37', slave: '#c4553a', caravan: '#d9a54a', monsoon: '#3fb6c9', steam: '#9fb3c8' };

  /* Atlas id → ledger power, from each empire's `atlas` list (plus overlay `power`). */
  const POWER_OF = {};
  Object.values(IMP.EMPIRES).forEach(emp => (emp.atlas || []).forEach(id => { POWER_OF[id] = emp.id; }));

  const SUPERSEDED = new Set(IMP.ATLAS_SUPERSEDED);
  const EXTEND = IMP.ATLAS_EXTEND;

  function normPolity(p, overlay) {
    const power = p.power || POWER_OF[p.id] || null;
    const start = p.s2 || p.s;
    let end = p.e, superseded = false, extended = false;
    if (SUPERSEDED.has(p.id) && p.e >= HANDOFF) { end = HANDOFF - 1; superseded = true; }
    else if (EXTEND[p.id] && p.e === 1914) { end = EXTEND[p.id]; extended = true; }
    const geometry = G.multiFromRings(p.poly);
    const feature = { type: 'Feature', geometry, properties: { id: p.id } };
    const area = d3.geoArea(feature);
    const color = power ? IMP.EMPIRES[power].color : (p.col || CAT_DARK[p.cat] || '#a89d88');
    const bbox = G.bboxOfFeature(feature);
    const lbl = p.lbl ? { lng: p.lbl[0], lat: p.lbl[1] } : G.featureCenter(feature);
    return {
      kind: 'polity', id: p.id, n: p.n, cat: p.cat, s: start, e: end, rawE: p.e, cap: p.cap, note: p.note,
      peoples: !!p.peoples, power, color, overlay: !!overlay, superseded, extended,
      horizon: !superseded && !extended && p.e === 1914,
      feature, area, bbox, lbl, lz: p.lz || 1, pz: p.pz || (area < 0.0025 ? 1.25 : 0),
      __kind: 'atlas'
    };
  }

  const polities = POLITIES.map(p => normPolity(p, false)).concat(IMP.LEDGER_OVERLAYS.map(p => normPolity(p, true)));
  polities.forEach(p => { p.feature.__ref = p; });
  /* Smaller shapes ride higher so a kingdom inside an empire stays visible. */
  const areas = polities.map(p => p.area).sort((a, b) => a - b);
  polities.forEach(p => { p.areaRank = areas.indexOf(p.area) / Math.max(1, areas.length - 1); });

  const routes = ROUTES.map(r => {
    const segs = (r.segs || [r.pts]).map(seg => G.smooth(seg, 8));
    const all = (r.segs || [r.pts]).flat();
    return {
      kind: 'route', id: r.id, n: r.n, cat: r.cat, s: r.s, e: r.e, note: r.note, dash: !!r.dash, arrow: r.arrow,
      color: RCAT_DARK[r.cat] || '#d4af37', segs, bbox: G.bboxOfPoints(all), raw: all
    };
  });

  const cities = CITIES.map(c => ({ kind: 'city', n: c.n, lng: c.ll[0], lat: c.ll[1], s: c.s, e: c.e, star: !!c.star, cz: c.cz || 0 }));

  const events = EVENTS.map(ev => ({ y: ev.y, t: C.bound(ev.y, 'start'), d: String(ev.y), n: ev.n, lng: ev.ll && ev.ll[0], lat: ev.ll && ev.ll[1], src: 'atlas' }))
    .concat(IMP.EVENTS_MODERN.map(ev => ({ y: C.yearOf(C.bound(ev.d, 'start')), t: C.bound(ev.d, 'start'), d: ev.d, n: ev.n, lng: ev.ll[0], lat: ev.ll[1], src: 'ledger' })))
    .sort((a, b) => a.t - b.t);

  /* Treaty meridians — Tordesillas (Atlas) and its Pacific twin Zaragoza. */
  const meridians = [
    { n: 'Tordesillas · 1494', lon: TORDESILLAS.lon, s: TORDESILLAS.s, e: TORDESILLAS.e },
    { n: 'Zaragoza · 1529', lon: 142.5, s: 1529, e: 1750 }
  ];

  /* One era list spanning 800 → 1957: Atlas eras until the handoff,
     IMPERIUM epochs after it. */
  const eras = ERAS.filter(e => e.y < HANDOFF).map(e => ({ t: e.y, y: e.y, n: e.n, title: e.n, badge: String(e.y), src: 'atlas' }))
    .concat(IMP.EPOCHS.map(e => ({ t: e.start, y: e.start, n: e.title, title: e.title, badge: e.badge, desc: e.desc, src: 'ledger' })));

  const views = VIEWS.map(v => ({ n: v.n.replace('⤢ ', ''), b: v.b }));

  const byId = {};
  polities.forEach(p => { byId['polity:' + p.id] = p; });
  routes.forEach(r => { byId['route:' + r.id] = r; });

  const yearOfT = t => C.yearOf(t);
  const polityActive = (p, t) => { const y = yearOfT(t); return y >= p.s && y <= p.e; };
  const routeActive = (r, t) => { const y = yearOfT(t); return y >= r.s && y <= r.e; };
  const routeGhost = (r, t) => { const y = yearOfT(t); return y > r.e && y <= r.e + 40; };
  const cityActive = (c, t) => { const y = yearOfT(t); return y >= c.s && y <= c.e; };
  const nestedAt = (p, t) => p.overlay || yearOfT(t) >= HANDOFF;

  function eraAt(t) {
    let era = eras[0];
    for (const e of eras) if (t >= e.t) era = e;
    return era;
  }
  function lastEventBefore(t) {
    let best = null;
    for (const ev of events) { if (ev.t <= t) best = ev; else break; }
    return best;
  }

  const CATN = Object.fromEntries(Object.entries(CAT).map(([k, v]) => [k, v.n]));
  const RCATN = Object.fromEntries(Object.entries(RCAT).map(([k, v]) => [k, v.n]));

  return {
    polities, routes, cities, events, meridians, eras, views, byId, POWER_OF,
    CAT_DARK, RCAT_DARK, CATN, RCATN,
    polityActive, routeActive, routeGhost, cityActive, nestedAt, eraAt, lastEventBefore
  };
})();
