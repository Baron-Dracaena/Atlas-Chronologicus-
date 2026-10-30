/* ============================================================
   LEDGER — the sovereignty resolver for 1899 → 1957.
   Compiles IMP.TERRITORIES spans to numeric intervals once, then
   answers "who holds polygon X at instant T, and how?"
   ============================================================ */
window.IMP = window.IMP || {};
IMP.Ledger = (function () {
  const C = IMP.Chronos;
  const E = IMP.EMPIRES;
  const PSEUDO = { SOVEREIGN: 1, POST_EMPIRE: 1, OTHER: 1 };

  const records = {};
  Object.entries(IMP.TERRITORIES).forEach(([code, rec]) => {
    const spans = rec.spans.map((s, i) => Object.assign({}, s, {
      i, start: C.bound(s.from, 'start'), end: C.bound(s.to, 'end'), openEnd: s.to === null || s.to === undefined
    })).sort((a, b) => a.start - b.start);
    /* An open-ended span closes where the next one begins. */
    for (let i = 0; i < spans.length - 1; i++) if (spans[i].openEnd) spans[i].end = spans[i + 1].start;
    records[code] = Object.assign({}, rec, { code, spans });
  });

  function stateAt(code, t) {
    const r = records[code];
    if (!r) return null;
    for (const s of r.spans) if (t >= s.start && t < s.end) return s;
    return null;
  }

  /* The power a span "belongs to" for filtering: the ruler, or for an
     independent state the empire it left. */
  const ownerOf = s => !s ? null : (E[s.power] ? s.power : (s.prev || null));
  const isDecolonized = s => s && s.power === 'SOVEREIGN' && !!s.prev && !s.quiet;
  const isColonial = s => s && E[s.power] && s.kind !== 'metropole' && s.kind !== 'dominion';
  const isMetropole = s => s && E[s.power] && (s.kind === 'metropole' || s.kind === 'dominion');

  function powerLabel(s) {
    if (!s) return 'No record';
    if (E[s.power]) return E[s.power].shortName;
    if (s.power === 'SOVEREIGN') return s.state || 'Sovereign';
    if (s.power === 'POST_EMPIRE') return s.by || 'Allied occupation';
    if (s.power === 'OTHER') return s.by || 'Other power';
    return s.power;
  }

  const KIND_LABEL = {
    metropole: 'Metropole', integral: 'Integral territory', colony: 'Colony', protectorate: 'Protectorate',
    mandate: 'League mandate', trust: 'UN trust territory', condominium: 'Condominium', dominion: 'Dominion',
    occupation: 'Military occupation', sphere: 'Informal empire / client', war: 'Contested by war', independent: 'Independent'
  };

  /* Ledger-wide counters at T (header telemetry, roster). */
  function tally(t) {
    let colonized = 0, decolonized = 0, contested = 0;
    const perPower = {};
    Object.keys(records).forEach(code => {
      const s = stateAt(code, t);
      if (!s) return;
      if (isDecolonized(s)) decolonized++;
      if (isColonial(s)) { colonized++; perPower[s.power] = (perPower[s.power] || 0) + 1; }
      if (s.kind === 'war') contested++;
    });
    const empiresActive = Object.values(E).filter(emp => {
      const y = C.yearOf(t); return y >= emp.activeYears[0] && y <= emp.activeYears[1];
    }).length;
    return { colonized, decolonized, contested, perPower, empiresActive };
  }

  function knownPower(p) { return !!(E[p] || PSEUDO[p]); }

  return { records, stateAt, ownerOf, isDecolonized, isColonial, isMetropole, powerLabel, KIND_LABEL, tally, knownPower };
})();
