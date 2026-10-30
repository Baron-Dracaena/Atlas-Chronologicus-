/* ============================================================
   PANELS — the Index (left) and the Dossier (right).
   Markup is rendered from state; every interactive element
   carries data-act/… attributes handled by one delegated
   listener in app.js, so re-rendering never leaks handlers.
   ============================================================ */
window.IMP = window.IMP || {};
IMP.Panels = (function () {
  const A = IMP.Atlas, L = IMP.Ledger, C = IMP.Chronos, E = IMP.EMPIRES;
  const HANDOFF = IMP.HANDOFF;
  const $ = s => document.querySelector(s);
  const esc = s => String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* Only touch the DOM when the markup actually changed. During playback the
     panels are asked to render every few frames; rebuilding identical rows
     would swap nodes under the pointer and swallow clicks (the Atlas.js
     'no DOM churn' rule). */
  function setHTML(el, html) { if (el._html !== html) { el._html = html; el.innerHTML = html; } }
  const GROUP_ORDER = ['sahel', 'forest', 'central', 'east', 'south', 'nafrica', 'europe', 'steppe', 'easia', 'sasia', 'samerica', 'colonial'];

  /* ---------- shared formatters ---------- */
  function yrs(p) {
    const a = p.s <= 800 ? 'by 800' : 'c. ' + p.s;
    const b = p.e >= 1957 ? 'present' : (p.extended ? p.e : 'c. ' + p.e);
    return `${a} – ${b}`;
  }
  const empPill = id => `<span class="pill" style="background:${E[id].color}">${esc(E[id].shortName.toUpperCase())}</span>`;
  function powerPill(st) {
    if (!st) return '<span class="pill grey">NO RECORD</span>';
    if (st.special === 'ghana') return '<span class="pill amber">★ INDEPENDENT GHANA</span>';
    if (L.isDecolonized(st)) return `<span class="pill soft">NEWLY SOVEREIGN · ${esc(C.formatBound(st.indep || st.from))}</span>`;
    if (st.power === 'SOVEREIGN') return `<span class="pill grey">${st.postEmpire ? 'EMPIRE STRIPPED' : 'SOVEREIGN'}</span>`;
    if (st.power === 'POST_EMPIRE') return '<span class="pill grey">ALLIED OCCUPATION</span>';
    if (st.power === 'OTHER') return `<span class="pill grey">${esc((st.by || 'OTHER').toUpperCase())}</span>`;
    return st.kind === 'war' ? `<span class="pill war">${esc(E[st.power].shortName.toUpperCase())} · WAR</span>` : empPill(st.power);
  }
  const fmtNow = t => C.formatDate(t).toUpperCase();
  const q = () => (IMP.App.state.query || '').trim().toLowerCase();
  const match = s => !q() || String(s).toLowerCase().includes(q());

  /* Does a route pass near a polity's bounding box? (Atlas focus logic) */
  function routeTouches(r, p) {
    if (!p) return false;
    const [x0, y0, x1, y1] = p.bbox, m = 3.5;
    return r.raw.some(([lo, la]) => lo >= x0 - m && lo <= x1 + m && la >= y0 - m && la <= y1 + m);
  }

  /* Ledger polygon containing a point (for nested polities). */
  function territoryAt(lat, lng) {
    const f = IMP.GlobeView.features.find(f => d3.geoContains(f, [lng, lat]));
    return f ? f.__key : null;
  }

  /* ---------- INDEX ---------- */
  function row({ act, type, id, t, sw, swCls = '', nm, sub, yrsTxt, yrsCls = '', cls = '', ph }) {
    const data = act === 'time' ? `data-act="time" data-t="${t}"` : `data-act="${act}" data-type="${type || ''}" data-id="${esc(id)}"`;
    return `<div class="row ${cls}" tabindex="0" ${data}>
      ${sw ? `<span class="sw ${swCls}" style="background:${sw};border-color:${sw}"></span>` : ''}
      <span class="nm">${esc(nm)}${ph ? `<span class="ph">P${ph}</span>` : ''}${sub ? `<span class="sub">${esc(sub)}</span>` : ''}</span>
      ${yrsTxt !== undefined ? `<span class="yrs ${yrsCls}">${esc(yrsTxt)}</span>` : ''}</div>`;
  }

  function empireRows(s, phase) {
    const t = s.t, y = C.yearOf(t), tally = L.tally(t);
    return Object.values(E).filter(emp => (phase === 'ALL' || emp.phase === phase) && (match(emp.name) || match(emp.shortName))).map(emp => {
      const active = y >= emp.activeYears[0] && y <= emp.activeYears[1];
      let count, unit;
      if (y >= HANDOFF) { count = tally.perPower[emp.id] || 0; unit = 'held'; }
      else { count = A.polities.filter(p => p.power === emp.id && A.polityActive(p, t)).length; unit = 'on map'; }
      const yrsTxt = y >= HANDOFF ? (active ? `${count} ${unit}` : 'dissolved') : (count ? `${count} ${unit}` : '—');
      return row({ act: 'empire', id: emp.id, sw: emp.color, nm: emp.shortName, ph: emp.phase, sub: 'Capital: ' + emp.capital.name,
        yrsTxt, yrsCls: y >= HANDOFF && !active ? 'dead' : '', cls: s.empire === emp.id ? 'sel' : (y >= HANDOFF && !active ? 'gone' : '') });
    }).join('');
  }

  function polityRows(list, s, showGone) {
    let html = '';
    GROUP_ORDER.forEach(cat => {
      const items = list.filter(p => p.cat === cat);
      if (!items.length) return;
      html += `<div class="grp-h"><span>${esc(A.CATN[cat])}</span><span>${items.length}</span></div>`;
      items.forEach(p => {
        const on = A.polityActive(p, s.t), nested = on && A.nestedAt(p, s.t);
        html += row({ act: 'sel', type: 'polity', id: p.id, sw: p.color, swCls: p.peoples || nested ? 'ring' : '', nm: p.n,
          sub: nested ? 'within the ledger' : (p.superseded && (showGone || C.yearOf(s.t) >= 1880) ? 'retires at the 1899 handoff' : ''),
          yrsTxt: `${p.s <= 800 ? '—' : p.s}–${p.e >= 1957 ? '…' : p.e}`,
          cls: (s.sel && s.sel.type === 'polity' && s.sel.id === p.id ? 'sel ' : '') + (showGone && !on ? 'gone' : '') });
      });
    });
    return html;
  }

  function routeRows(list, s, showGone) {
    if (!list.length) return '';
    return `<div class="grp-h"><span>Routes &amp; voyages</span><span>${list.length}</span></div>` + list.map(r => row({
      act: 'sel', type: 'route', id: r.id, sw: r.color, swCls: 'line', nm: r.n, yrsTxt: r.s,
      cls: (s.sel && s.sel.type === 'route' && s.sel.id === r.id ? 'sel ' : '') + (showGone && !A.routeActive(r, s.t) ? 'gone' : '')
    })).join('');
  }

  function territoryRows(s, all) {
    const t = s.t;
    const recs = Object.values(L.records).filter(r => match(r.name) && (all || L.stateAt(r.code, t)));
    if (!recs.length) return '';
    return `<div class="grp-h"><span>Ledger polygons</span><span>${recs.length}</span></div>` + recs.sort((a, b) => a.name.localeCompare(b.name)).map(r => {
      const st = L.stateAt(r.code, t);
      const sw = !st ? 'rgba(255,255,255,.15)' : E[st.power] ? E[st.power].color : L.isDecolonized(st) ? '#fbbf24' : '#56627a';
      return row({ act: 'sel', type: 'territory', id: r.code, sw, nm: r.name, sub: st ? L.powerLabel(st) : 'no record at this date', cls: !st ? 'gone' : '' });
    }).join('');
  }

  function renderIndex() {
    const s = IMP.App.state, t = s.t, y = C.yearOf(t);
    const body = $('#indexBody'), desc = $('#indexDesc');
    let html = '';
    if (s.tab === 'year') {
      setHTML(desc, esc(y >= HANDOFF
        ? `The ledger at ${C.formatDate(t)}: dated sovereignty for every polygon, with the kingdoms and peoples that persisted inside it.`
        : `The Atlas sketch for ${y}: polities at their approximate peak extent — borders were zones of influence, not lines.`));
      if (y >= HANDOFF && !q()) html += `<div class="grp-h"><span>Imperial powers</span><span>${fmtNow(t)}</span></div>` + empireRows(s, 'ALL');
      html += polityRows(A.polities.filter(p => A.polityActive(p, t) && match(p.n)), s, false);
      html += routeRows(s.routes ? A.routes.filter(r => A.routeActive(r, t) && match(r.n)) : [], s, false);
      if (q() && y >= HANDOFF) html += territoryRows(s, false);
    } else if (s.tab === 'powers') {
      const ph = s.phase || 'ALL';
      setHTML(desc, `<div class="chips" style="margin-bottom:5px">${['ALL', 1, 2, 3].map(p => `<button data-act="phase" data-id="${p}" class="${ph === p ? '' : 'dim'}">${p === 'ALL' ? 'ALL' : 'PHASE ' + p}</button>`).join('')}</div>` +
        esc(ph === 'ALL' ? `All ${Object.keys(E).length} powers of the 1899–1957 ledger. Before 1899 each counts its Atlas-era predecessors on the map.` : IMP.PHASES[ph]));
      html += empireRows(s, ph);
    } else {
      setHTML(desc, 'Every polity, route, polygon and event in the file. Faded rows are not active at the current date — click one to travel there.');
      html += polityRows(A.polities.filter(p => match(p.n)), s, true);
      html += routeRows(A.routes.filter(r => match(r.n)), s, true);
      html += territoryRows(s, true);
      const evs = A.events.filter(ev => match(ev.n));
      if (evs.length) html += `<div class="grp-h"><span>Chronicle of events</span><span>${evs.length}</span></div>` + evs.map(ev =>
        row({ act: 'time', t: ev.t, nm: ev.n, yrsTxt: C.formatBound(ev.d), cls: 'ev' + (ev.t > t ? ' gone' : '') })).join('');
    }
    setHTML(body, html || '<div class="empty">No matches.</div>');
    $('#btnClear').classList.toggle('hidden', !s.sel && !s.empire);
    $('#indexTitle').textContent = y >= HANDOFF ? 'Powers, Polities & Polygons' : 'Polities & Powers';
  }

  /* ---------- DOSSIER ---------- */
  function head(sub, title, badge) { $('#dSub').textContent = sub; $('#dTitle').textContent = title; $('#dBadge').textContent = badge; }

  function overview(s) {
    const t = s.t, y = C.yearOf(t), era = A.eraAt(t), ev = A.lastEventBefore(t);
    head(`ARCHIVAL BRIEFING // ${fmtNow(t)}`, era.title, era.badge);
    const ledger = y >= HANDOFF;
    let h = `<div class="card brass"><div class="lbl-k">HISTORICAL CONTEXT (${esc(era.badge)})</div>
      <p>${esc(era.desc || (ev ? `Most recent in the chronicle: ${ev.n} (${C.formatBound(ev.d)}).` : 'The chronicle opens in 800 with Charlemagne’s coronation.'))}</p></div>`;
    h += `<div class="card ${ledger ? '' : 'dark'}"><div class="lbl-k ${ledger ? '' : 'ivory'}">THE RECORD AT THIS DATE</div>
      <p>${ledger
        ? 'The <b>Ledger</b> (1899 → 6 Mar 1957): every country polygon carries a dated chain of rulers, each tagged by the form of rule — colony, protectorate, mandate, occupation, war. Kingdoms and peoples that persisted within those borders are drawn as outlined overlays.'
        : 'The <b>Atlas sketch</b> (800–1898): each polity is drawn at its approximate peak extent. Precolonial borders were zones of tribute and influence, so these shapes are interpretations, not surveys. The precise ledger takes over on 1 Jan 1899.'}</p></div>`;
    if (ev) h += `<div class="card"><div class="lbl-k ivory">LATEST IN THE CHRONICLE</div><p><span class="meta">${esc(C.formatBound(ev.d))}</span> · ${esc(ev.n)}</p></div>`;
    if (ledger) h += `<div><div class="lbl-k ivory">THREE PHASES OF COLONIAL PARTICIPATION</div>
      ${[1, 2, 3].map(p => `<div class="card" style="margin-top:6px"><div class="lbl-k">Phase ${p} · ${Object.values(E).filter(e => e.phase === p).length} powers</div><p style="font-size:11px">${esc(Object.values(E).filter(e => e.phase === p).map(e => e.shortName).join(', '))}</p></div>`).join('')}</div>`;
    h += `<div class="card amber"><div class="lbl-k amber">THE 6 MARCH 1957 THRESHOLD <button class="chip-btn" data-act="accra">Fly to Accra →</button></div>
      <p style="font-size:11px">Click any polity, polygon or route on the globe — or any row in the index — for its dossier: rulers, dates, wars, and what it became.</p></div>`;
    return h;
  }

  function polityDossier(p, s) {
    const t = s.t, on = A.polityActive(p, t), nested = on && A.nestedAt(p, t);
    head(`${(A.CATN[p.cat] || '').toUpperCase()} // ${p.overlay ? 'LEDGER OVERLAY' : 'ATLAS CHRONOLOGICUS'}`, p.n, on ? (nested ? 'NESTED' : 'ON MAP') : 'NOT IN ' + C.yearOf(t));
    let h = `<div class="card dark"><div class="lbl-k"><span>${esc(yrs(p))}</span>${p.power ? empPill(p.power) : ''}</div>
      ${p.cap ? `<div class="meta">Capital · ${esc(p.cap)}</div>` : ''}</div>`;
    h += `<p class="note">${esc(p.note)}</p>`;
    if (on) {
      const rel = A.routes.filter(r => A.routeActive(r, t) && routeTouches(r, p));
      const cx = (p.bbox[0] + p.bbox[2]) / 2, cy = (p.bbox[1] + p.bbox[3]) / 2;
      const near = A.polities.filter(q => q !== p && A.polityActive(q, t))
        .map(q => [Math.hypot((q.bbox[0] + q.bbox[2]) / 2 - cx, ((q.bbox[1] + q.bbox[3]) / 2 - cy) * 1.3), q])
        .sort((a, b) => a[0] - b[0]).slice(0, 4).map(x => x[1]);
      if (rel.length) h += `<div><div class="lbl-k ivory">CONNECTED BY</div><div class="chips">${rel.map(r => `<button data-act="sel" data-type="route" data-id="${r.id}">${esc(r.n)}</button>`).join('')}</div></div>`;
      if (near.length) h += `<div><div class="lbl-k ivory">NEIGHBOURS IN ${C.yearOf(t)}</div><div class="chips">${near.map(q => `<button data-act="sel" data-type="polity" data-id="${q.id}">${esc(q.n)}</button>`).join('')}</div></div>`;
    }
    if (p.superseded) {
      h += `<div class="card brass"><div class="lbl-k">AT THE 1899 HANDOFF</div><p style="font-size:11px">This sketch retires on 1 Jan 1899: the ledger draws ${p.power ? esc(E[p.power].shortName) : 'this state'} from then on with dated, polygon-precise sovereignty.</p>
        ${p.power ? `<div class="chips" style="margin-top:6px"><button data-act="empire" data-id="${p.power}">Open the ${esc(E[p.power].shortName)} dossier →</button></div>` : ''}</div>`;
    } else if (nested) {
      const key = territoryAt(p.lbl.lat, p.lbl.lng), st = key && L.stateAt(key, t);
      h += `<div class="card"><div class="lbl-k ivory">WITHIN THE LEDGER</div><p style="font-size:11px">${key && st
        ? `Persists inside <b>${esc(L.records[key].name)}</b>, held on ${C.formatDate(t)} by ${esc(L.powerLabel(st))} (${esc(L.KIND_LABEL[st.kind] || st.kind)}).`
        : 'Persists beneath the precise ledger.'}${p.extended ? ` The Atlas file stops at 1914 by scope; this polity is carried to ${p.e} because it endured.` : ''}</p>
        ${key ? `<div class="chips" style="margin-top:6px"><button data-act="sel" data-type="territory" data-id="${esc(key)}">Open ${esc(L.records[key].name)} →</button></div>` : ''}</div>`;
    } else if (!on) {
      h += `<div class="chips"><button data-act="time" data-t="${C.sampleOfYear(Math.min(p.e, Math.max(p.s, p.s + 1)))}">Travel to ${Math.min(p.e, p.s + 1)} →</button></div>`;
    }
    h += `<div class="meta" style="text-transform:uppercase;letter-spacing:.1em;font-size:10px">${p.peoples ? 'Peoples / decentralized' : 'Extent approximate (peak)'} · ${esc(A.CATN[p.cat] || '')}</div>`;
    h += `<button class="btn-wide" data-act="clear">← Return to Global Overview</button>`;
    return h;
  }

  function routeDossier(r, s) {
    const t = s.t, on = A.routeActive(r, t);
    head(`${(A.RCATN[r.cat] || '').toUpperCase()} // ROUTE`, r.n, on ? 'ACTIVE' : 'INACTIVE');
    const touch = A.polities.filter(p => A.polityActive(p, t) && routeTouches(r, p)).slice(0, 12);
    let h = `<div class="card dark"><div class="lbl-k"><span>${r.s}${r.e > r.s + 5 ? ' – ' + r.e : ''}</span><span class="pill" style="background:${r.color};color:#08090c">${esc((A.RCATN[r.cat] || '').toUpperCase())}</span></div></div>
      <p class="note">${esc(r.note)}</p>`;
    if (touch.length) h += `<div><div class="lbl-k ivory">POLITIES ALONG THE WAY (${C.yearOf(t)})</div><div class="chips">${touch.map(p => `<button data-act="sel" data-type="polity" data-id="${p.id}">${esc(p.n)}</button>`).join('')}</div></div>`;
    if (!on) h += `<div class="chips"><button data-act="time" data-t="${C.sampleOfYear(r.s)}">Travel to ${r.s} →</button></div>`;
    h += `<button class="btn-wide" data-act="clear">← Return to Global Overview</button>`;
    return h;
  }

  function territoryDossier(code, s) {
    const t = s.t, rec = L.records[code], st = L.stateAt(code, t);
    const f = IMP.GlobeView.featByKey(code), name = rec ? rec.name : (f ? f.properties.name : code);
    head(`TERRITORY INTELLIGENCE // ${code.startsWith('N:') ? 'NO ISO CODE' : 'ISO ' + code}`, name, fmtNow(t));
    if (!rec) return `<div class="card"><p>No ledger record for this polygon.</p></div><button class="btn-wide" data-act="clear">← Return to Global Overview</button>`;
    let h = `<div class="card ${st && st.kind === 'war' ? 'war' : 'dark'}"><div class="lbl-k"><span>STATUS ON ${fmtNow(t)}</span>${powerPill(st)}</div>
      <p>${st ? esc(st.role) : (C.yearOf(t) < HANDOFF ? 'The ledger opens on 1 Jan 1899 — before then this ground belongs to the Atlas sketch.' : 'No record at this date.')}</p>
      ${st ? `<div class="meta" style="margin-top:5px">${esc(L.KIND_LABEL[st.kind] || st.kind)} · since ${esc(C.formatBound(st.from))}${st.co ? ' · jointly with ' + esc(E[st.co].shortName) : ''}</div>` : ''}</div>`;
    const nestedHere = A.polities.filter(p => A.polityActive(p, t) && A.nestedAt(p, t) && f && d3.geoContains(f, [p.lbl.lng, p.lbl.lat]));
    if (nestedHere.length) h += `<div><div class="lbl-k ivory">POLITIES PERSISTING WITHIN</div><div class="chips">${nestedHere.map(p => `<button data-act="sel" data-type="polity" data-id="${p.id}">${esc(p.n)}</button>`).join('')}</div></div>`;
    h += `<div><div class="lbl-k ivory">SOVEREIGNTY LOG (1899 → 6 MAR 1957)</div><div class="log">${rec.spans.map(sp => {
      const now = t >= sp.start && t < sp.end;
      const who = E[sp.power] ? E[sp.power].shortName : L.powerLabel(sp);
      const toTxt = !sp.openEnd ? C.formatBound(sp.to)
        : sp.end === Infinity ? '6 Mar 1957'
        : C.formatDate(sp.end - 0.5 / 365).replace(/ (\w)(\w+) /, (m, a, b) => ` ${a}${b.toLowerCase()} `);
      return `<div class="card ${now ? 'now' : ''}" data-act="time" data-t="${Math.max(sp.start + 0.001, Math.min(C.END, sp.end - 0.002))}" style="cursor:pointer">
        <div class="log-h"><b>${esc(C.formatBound(sp.from))} – ${esc(toTxt)}</b><span>${esc(who)}</span></div>
        <div class="k">${esc(L.KIND_LABEL[sp.kind] || sp.kind)}</div><div style="font-size:11px;margin-top:2px">${esc(sp.role)}</div></div>`;
    }).join('')}</div></div>`;
    h += '<div class="btn-row">';
    if (st && E[st.power]) h += `<button class="btn-wide brass" data-act="empire" data-id="${st.power}">Inspect governing power: ${esc(E[st.power].shortName)} →</button>`;
    else if (st && st.prev) h += `<button class="btn-wide" data-act="empire" data-id="${st.prev}">Former ruler: ${esc(E[st.prev].shortName)} →</button>`;
    h += `<button class="btn-wide" data-act="clear">← Return to Global Overview</button></div>`;
    return h;
  }

  function empireDossier(emp, s) {
    const t = s.t, y = C.yearOf(t);
    head(emp.phaseLabel.toUpperCase(), emp.name, 'PHASE ' + emp.phase);
    const held = [], freed = [];
    Object.values(L.records).forEach(r => {
      const st = L.stateAt(r.code, t);
      if (!st) return;
      if (st.power === emp.id && st.kind !== 'metropole') held.push({ r, st });
      else if (st.power === 'SOVEREIGN' && st.prev === emp.id) freed.push({ r, st });
    });
    const preds = (emp.atlas || []).map(id => A.byId['polity:' + id]).filter(Boolean);
    let h = `<div class="card dark" style="display:flex;justify-content:space-between;gap:10px">
      <div style="display:flex;gap:9px;align-items:center"><span class="sw" style="width:15px;height:15px;border-radius:3px;background:${emp.color};display:inline-block"></span>
      <div><div class="meta">METROPOLE CAPITAL</div><div style="font:700 12px var(--mono)">${esc(emp.capital.name)} (${emp.capital.lat.toFixed(1)}°, ${emp.capital.lng.toFixed(1)}°)</div></div></div>
      <div style="text-align:right"><div class="meta">PEAK EXTENT</div><div style="font:600 11px var(--mono);color:var(--brass)">${esc(emp.peakArea)}</div></div></div>`;
    h += `<div><div class="lbl-k">IMPERIAL ARCHITECTURE (1899–1957)</div><p>${esc(emp.summary)}</p></div>`;
    h += `<div class="card brass"><div class="lbl-k">STATUS ON 6 MARCH 1957</div><p style="font-size:11px">${esc(emp.status1957)}</p></div>`;
    h += `<div><div class="lbl-k rose">MAJOR COLONIAL WARS & SUPPRESSIONS</div><ul class="list">${emp.conflicts.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>`;
    if (y >= HANDOFF) {
      h += `<div><div class="lbl-k ivory"><span>HELD ON ${fmtNow(t)} (${held.length})</span><span>click to fly</span></div>${held.length
        ? `<div class="chips">${held.map(x => `<button data-act="sel" data-type="territory" data-id="${esc(x.r.code)}" title="${esc(L.KIND_LABEL[x.st.kind])}">${esc(x.r.name)}</button>`).join('')}</div>`
        : `<p class="meta" style="font-style:italic">No holdings in the ledger at this date.</p>`}</div>`;
      if (freed.length) h += `<div><div class="lbl-k amber">INDEPENDENT FROM ${esc(emp.shortName.toUpperCase())} BY ${fmtNow(t)}</div><div class="chips">${freed.map(x =>
        `<button class="amber" data-act="sel" data-type="territory" data-id="${esc(x.r.code)}">★ ${esc(x.r.name)} (${esc(C.formatBound(x.st.indep || x.st.from))})</button>`).join('')}</div></div>`;
    } else {
      h += `<div class="card"><div class="lbl-k ivory">BEFORE THE LEDGER</div><p style="font-size:11px">Precise holdings begin on 1 Jan 1899. <button class="chip-btn" data-act="time" data-t="${C.sampleOfYear(1899)}">Go to 1899 →</button></p></div>`;
    }
    if (preds.length) h += `<div><div class="lbl-k ivory">ATLAS-ERA PREDECESSORS</div><div class="chips">${preds.map(p =>
      `<button class="${A.polityActive(p, t) ? '' : 'dim'}" data-act="sel" data-type="polity" data-id="${p.id}">${esc(p.n)} · ${p.s <= 800 ? '800' : p.s}–${p.e}</button>`).join('')}</div></div>`;
    h += `<button class="btn-wide" data-act="clear">← Return to Global Overview</button>`;
    return h;
  }

  function auditDossier() {
    const list = IMP.App.audit || [];
    head('DATA AUDIT // INTEGRITY OF THE RECORD', 'Audit of the file', `${list.filter(x => x.level === 'error').length} ERR`);
    const by = lv => list.filter(x => x.level === lv);
    const sec = (lv, title, cls) => by(lv).length ? `<div><div class="lbl-k ${cls}">${title} (${by(lv).length})</div><ul class="list audit-list">${by(lv).map(x => `<li class="${lv}">${esc(x.msg)}</li>`).join('')}</ul></div>` : '';
    return `<p style="font-size:11px">Checks run on every load: overlapping or inverted spans, unknown powers, gaps inside a record, dead links between the Atlas and the ledger, malformed rings, and polygons with no record.</p>`
      + (sec('error', 'ERRORS', 'rose') + sec('warn', 'WARNINGS', 'amber') + sec('info', 'KNOWN LIMITS', 'ivory') || '<div class="card"><p>No findings.</p></div>')
      + `<button class="btn-wide" data-act="clear">← Return to Global Overview</button>`;
  }

  function renderDossier() {
    const s = IMP.App.state, body = $('#dBody');
    let h;
    if (s.view === 'audit') h = auditDossier();
    else if (s.sel && s.sel.type === 'polity') h = polityDossier(A.byId['polity:' + s.sel.id], s);
    else if (s.sel && s.sel.type === 'route') h = routeDossier(A.byId['route:' + s.sel.id], s);
    else if (s.sel && s.sel.type === 'territory') h = territoryDossier(s.sel.id, s);
    else if (s.empire) h = empireDossier(E[s.empire], s);
    else h = overview(s);
    setHTML(body, h);
  }

  return { renderIndex, renderDossier, yrs, empPill, powerPill, routeTouches, territoryAt, esc };
})();
