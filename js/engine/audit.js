/* ============================================================
   AUDIT — integrity checks run on every load. A history engine
   should say where its own record is thin; findings are listed
   in the dossier (footer badge) and in the console.
     error   the data contradicts itself (overlap, unknown power)
     warn    likely mistake (a gap inside a record, a dead link)
     info    a known limit (polygon with no record, horizon clamp)
   ============================================================ */
window.IMP = window.IMP || {};
IMP.Audit = function (features) {
  const out = [];
  const add = (level, msg) => out.push({ level, msg });
  const L = IMP.Ledger, A = IMP.Atlas, C = IMP.Chronos, E = IMP.EMPIRES;

  /* --- ledger --- */
  Object.values(L.records).forEach(r => {
    r.spans.forEach((s, i) => {
      if (!L.knownPower(s.power)) add('error', `${r.name}: unknown power "${s.power}" (${C.formatBound(s.from)})`);
      if (s.prev && !E[s.prev]) add('error', `${r.name}: unknown prev "${s.prev}"`);
      if (!(s.end > s.start)) add('error', `${r.name}: span ${C.formatBound(s.from)}–${C.formatBound(s.to)} ends before it starts`);
      if (s.power === 'OTHER' && !s.by) add('warn', `${r.name}: OTHER span without "by"`);
      const n = r.spans[i + 1];
      if (!n) return;
      if (n.start < s.end - 1e-9) add('error', `${r.name}: ${C.formatBound(s.from)}–${C.formatBound(s.to)} overlaps the span from ${C.formatBound(n.from)}`);
      else if (n.start - s.end > 1.5 / 365) add('warn', `${r.name}: unrecorded gap ${C.formatBound(s.to)} → ${C.formatBound(n.from)}`);
    });
  });
  if (features) {
    const keys = new Set(features.map(f => f.__key));
    features.forEach(f => { if (!L.records[f.__key] && f.__key !== '010') add('info', `No ledger record for polygon ${f.__key} (${f.properties.name})`); });
    Object.keys(L.records).forEach(k => { if (!keys.has(k)) add('warn', `Ledger record ${k} (${L.records[k].name}) matches no 1:110m polygon`); });
  }

  /* --- empires & links --- */
  Object.values(E).forEach(emp => (emp.atlas || []).forEach(id => {
    if (!A.byId['polity:' + id]) add('warn', `${emp.shortName}: atlas predecessor "${id}" not found`);
  }));
  IMP.ATLAS_SUPERSEDED.forEach(id => { if (!A.byId['polity:' + id]) add('warn', `ATLAS_SUPERSEDED: unknown polity "${id}"`); });
  Object.keys(IMP.ATLAS_EXTEND).forEach(id => {
    const p = A.byId['polity:' + id];
    if (!p) add('warn', `ATLAS_EXTEND: unknown polity "${id}"`);
    else if (p.rawE !== 1914) add('warn', `ATLAS_EXTEND: "${id}" ends ${p.rawE}, not at the 1914 horizon — extension ignored`);
  });

  /* --- atlas geometry & time --- */
  const seen = {};
  A.polities.forEach(p => {
    if (seen[p.id]) add('error', `Duplicate polity id "${p.id}"`);
    seen[p.id] = 1;
    if (p.s > p.rawE) add('error', `${p.n}: starts ${p.s} after it ends ${p.rawE}`);
    if (!A.CATN[p.cat]) add('error', `${p.n}: unknown category "${p.cat}"`);
    p.feature.geometry.coordinates.forEach(poly => { if (poly[0].length < 4) add('error', `${p.n}: ring with fewer than 3 points`); });
    /* a ring wound the wrong way encloses most of the sphere */
    if (p.area > 2 * Math.PI) add('error', `${p.n}: polygon covers ${(p.area / (4 * Math.PI) * 100).toFixed(1)}% of the globe — check ring order`);
    if (p.horizon) add('info', `${p.n}: ends at the Atlas 1914 horizon (not superseded or extended)`);
  });
  A.routes.forEach(r => { if (r.s > r.e) add('error', `${r.n}: starts after it ends`); });

  /* --- coordinates (ported from compiler.py) ---
     [lon, lat] swapped is the most common data error here. Out-of-range
     values are errors; a swap that stays in range shows up as an
     implausibly wide polity, so that is a warning (not for routes — the
     Manila galleon legitimately circles the globe). */
  const checkPts = (pts, where, span) => {
    const lons = [], lats = [];
    pts.forEach(([lo, la]) => {
      if (!(lo >= -180 && lo <= 180)) add('error', `${where}: longitude out of range [${lo}, ${la}]`);
      if (!(la >= -90 && la <= 90)) add('error', `${where}: latitude out of range [${lo}, ${la}] — lon/lat swapped?`);
      lons.push(lo); lats.push(la);
    });
    if (span && lons.length) {
      const w = Math.max(Math.max(...lons) - Math.min(...lons), Math.max(...lats) - Math.min(...lats));
      if (w > 175) add('warn', `${where}: bounding box spans ${w.toFixed(0)}° — swapped pair or stray vertex?`);
    }
  };
  const isYear = v => Number.isInteger(v);
  POLITIES.concat(IMP.LEDGER_OVERLAYS).forEach(p => {
    checkPts(p.poly.flat(), p.n, true);
    if (p.lbl) checkPts([p.lbl], p.n + ' (label)', false);
    if (!isYear(p.s) || !isYear(p.e)) add('error', `${p.n}: start/end must be integer years`);
  });
  ROUTES.forEach(r => checkPts((r.segs || [r.pts]).flat(), r.n, false));
  CITIES.forEach(c => checkPts([c.ll], c.n, false));
  IMP.EVENTS_MODERN.forEach(ev => {
    checkPts([ev.ll], ev.n, false);
    try { C.bound(ev.d, 'start'); } catch (e) { add('error', `${ev.n}: ${e.message}`); }
  });
  Object.values(L.records).forEach(r => {
    if (r.lat !== undefined && (Math.abs(r.lat) > 90 || Math.abs(r.lng) > 180)) add('error', `${r.name}: anchor out of range`);
  });
  A.events.forEach(ev => {
    if (ev.lat === undefined || Math.abs(ev.lat) > 90) add('warn', `Event "${ev.n}" has no valid location`);
  });
  /* same year, same place (within 5°): almost always one event entered twice
     by two data files with different wording */
  A.events.forEach((ev, i) => A.events.slice(i + 1).forEach(o => {
    if (o.y === ev.y && ev.lat !== undefined && o.lat !== undefined && IMP.Geo.distDeg(ev.lat, ev.lng, o.lat, o.lng) < 5)
      add('warn', `Possible duplicate event ${ev.y}: "${ev.n}" / "${o.n}"`);
  }));

  out.sort((a, b) => ({ error: 0, warn: 1, info: 2 }[a.level] - { error: 0, warn: 1, info: 2 }[b.level]));
  return out;
};
