/* ============================================================
   CHRONOS — the single time model shared by every layer.

   Time is a decimal year T (1947.62 ≈ 15 Aug 1947). Data may give
   bounds as a year (1947), a month ('1947-08') or a day
   ('1947-08-15'); each bound is resolved against an EDGE so that
   ranges are inclusive the way historians write them:
     from:1947         → 1 Jan 1947 00:00
     to:1947           → 31 Dec 1947 24:00 (exclusive end)
     to:'1947-08-14'   → end of 14 Aug 1947
   A span is active when  start(from) <= T < end(to).

   The slider moves in whole years and samples each year at its
   last day ("as of 31 Dec"), so 1947 shows India independent and
   1899 shows the Boer War begun. The final stop is the threshold
   the IMPERIUM file was built around: 6 March 1957.
   ============================================================ */
window.IMP = window.IMP || {};
IMP.Chronos = (function () {
  const MIN_YEAR = 800;
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysIn = y => isLeap(y) ? 366 : 365;
  const MDAYS = (y) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  function dayOfYear(y, m, d) {           // m,d 1-based → 0-based day index
    const md = MDAYS(y); let n = d - 1;
    for (let i = 0; i < m - 1; i++) n += md[i];
    return n;
  }

  /* Parse a bound. Returns decimal year. edge: 'start' | 'end'. null → ±Infinity. */
  function bound(v, edge) {
    if (v === null || v === undefined) return edge === 'end' ? Infinity : -Infinity;
    if (typeof v === 'number') return edge === 'end' ? v + 1 : v;
    const m = /^(-?\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(String(v).trim());
    if (!m) throw new Error('Chronos: unparseable date "' + v + '"');
    const y = +m[1], mo = m[2] ? +m[2] : null, d = m[3] ? +m[3] : null;
    if (mo === null) return edge === 'end' ? y + 1 : y;
    if (d === null) {
      const doyStart = dayOfYear(y, mo, 1);
      const doyEnd = doyStart + MDAYS(y)[mo - 1];
      return y + (edge === 'end' ? doyEnd : doyStart) / daysIn(y);
    }
    const doy = dayOfYear(y, mo, d);
    return y + (edge === 'end' ? doy + 1 : doy) / daysIn(y);
  }

  /* Ghana's independence day, mid-morning: the closing frame. */
  const END = bound('1957-03-06', 'start') + 0.5 / 365;

  /* Slider year → sample instant (31 Dec of that year, or the 1957 threshold). */
  function sampleOfYear(y) {
    y = Math.round(y);
    if (y >= 1957) return END;
    return y + 1 - 0.5 / daysIn(y);
  }

  function toParts(t) {
    const y = Math.floor(t);
    let doy = Math.floor((t - y) * daysIn(y) + 1e-9);
    const md = MDAYS(y); let m = 0;
    while (m < 11 && doy >= md[m]) { doy -= md[m]; m++; }
    return { y, m: m + 1, d: doy + 1 };
  }

  const yearOf = t => Math.floor(t + 1e-9);

  /* "6 MAR 1957" style — the IMPERIUM header voice. */
  function formatDate(t) {
    const p = toParts(t);
    return `${p.d} ${MONTHS[p.m - 1]} ${p.y}`;
  }

  /* Human rendering of a raw data bound ('1947-08-15' → '15 Aug 1947'). */
  function formatBound(v) {
    if (v === null || v === undefined) return 'present';
    if (typeof v === 'number') return String(v);
    const [y, mo, d] = String(v).split('-');
    if (!mo) return y;
    const M = MONTHS[+mo - 1];
    const Mn = M[0] + M.slice(1).toLowerCase();
    return d ? `${+d} ${Mn} ${y}` : `${Mn} ${y}`;
  }

  function span(from, to) {
    return { start: bound(from, 'start'), end: bound(to, 'end') };
  }
  const inSpan = (s, t) => t >= s.start && t < s.end;

  /* Add months to an instant, landing on the same relative day. */
  function addMonths(t, n) {
    const p = toParts(t);
    let m = p.m - 1 + n, y = p.y + Math.floor(m / 12); m = ((m % 12) + 12) % 12;
    const d = Math.min(p.d, MDAYS(y)[m]);
    return y + (dayOfYear(y, m + 1, d) + 0.5) / daysIn(y);
  }

  return { MIN_YEAR, END, bound, span, inSpan, sampleOfYear, yearOf, toParts,
           formatDate, formatBound, addMonths, MONTHS };
})();
