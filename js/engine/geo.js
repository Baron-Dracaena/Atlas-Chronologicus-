/* ============================================================
   GEO — spherical helpers (d3-geo does the real math).
   Atlas rings are [lon,lat], open, of either winding; on a sphere
   winding decides which side is "inside", so every ring is
   closed and oriented here before anything draws or tests it.
   ============================================================ */
window.IMP = window.IMP || {};
IMP.Geo = (function () {
  const D2R = Math.PI / 180;

  function closeRing(ring) {
    const r = ring.map(p => [+p[0], +p[1]]);
    const a = r[0], b = r[r.length - 1];
    if (a[0] !== b[0] || a[1] !== b[1]) r.push([a[0], a[1]]);
    return r;
  }

  /* One Atlas `poly` (a list of separate rings) → GeoJSON MultiPolygon,
     each ring oriented so that it encloses the small side of the sphere. */
  function multiFromRings(rings) {
    const coords = rings.map(ring => {
      let r = closeRing(ring);
      if (d3.geoArea({ type: 'Polygon', coordinates: [r] }) > 2 * Math.PI) r = r.slice().reverse();
      return [r];
    });
    return densifyGeometry({ type: 'MultiPolygon', coordinates: coords });
  }

  /* Insert points so no edge is longer than maxDeg. A long straight
     border (Egypt–Sudan on 22°N) is otherwise one chord whose cap
     triangles sag below the sphere at slab altitude. Interpolation is
     linear in lon/lat: Natural Earth draws such borders as parallels
     and meridians, and a great-circle fill would bow them. */
  function densifyRing(ring, maxDeg) {
    const out = [];
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i], b = ring[i + 1];
      out.push(a);
      if (Math.abs(b[0] - a[0]) > 180) continue;   // antimeridian seam: leave as is
      const d = d3.geoDistance(a, b) / D2R;
      if (d > maxDeg) {
        const n = Math.ceil(d / maxDeg);
        for (let k = 1; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
    }
    out.push(ring[ring.length - 1]);
    return out;
  }
  function densifyGeometry(g, maxDeg = 1.5) {
    if (g.type === 'Polygon') return { type: 'Polygon', coordinates: g.coordinates.map(r => densifyRing(r, maxDeg)) };
    if (g.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: g.coordinates.map(p => p.map(r => densifyRing(r, maxDeg))) };
    return g;
  }

  function featureCenter(f) {
    const c = d3.geoCentroid(f);
    return { lng: c[0], lat: c[1] };
  }

  /* Great-circle distance in degrees. */
  const distDeg = (lat1, lng1, lat2, lng2) => d3.geoDistance([lng1, lat1], [lng2, lat2]) / D2R;

  /* Bounding box [lonMin, latMin, lonMax, latMax] → camera point-of-view.
     The altitude fits the box's larger angular side into the strip of
     globe left visible between the two side panels; clamped between a
     regional look and the whole hemisphere. */
  function povForBox(b) {
    let [x0, y0, x1, y1] = b;
    if (x1 < x0) x1 += 360;
    const lat = (y0 + y1) / 2, lng = ((x0 + x1) / 2 + 540) % 360 - 180;
    const w = (x1 - x0) * Math.cos(Math.min(Math.abs(lat), 70) * D2R), h = y1 - y0;
    const span = Math.max(w, h * 1.25);
    const altitude = Math.max(0.55, Math.min(2.5, span / 26));
    return { lat, lng, altitude };
  }

  function bboxOfFeature(f) {
    const [[x0, y0], [x1, y1]] = d3.geoBounds(f);
    return [x0, y0, x1, y1];
  }

  function bboxOfPoints(pts) {
    let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
    pts.forEach(([lo, la]) => { a = Math.min(a, lo); b = Math.min(b, la); c = Math.max(c, lo); d = Math.max(d, la); });
    return [a, b, c, d];
  }

  /* Make a polyline's longitudes continuous (no ±360 jumps) so it can be
     smoothed; the globe accepts longitudes outside [-180,180]. */
  function unwrap(pts) {
    const out = [pts[0].slice()];
    for (let i = 1; i < pts.length; i++) {
      let lon = pts[i][0];
      const prev = out[i - 1][0];
      while (lon - prev > 180) lon -= 360;
      while (lon - prev < -180) lon += 360;
      out.push([lon, pts[i][1]]);
    }
    return out;
  }

  /* Catmull-Rom densification (the Atlas routes were drawn as
     Catmull-Rom curves; this keeps their shape on the sphere). */
  function smooth(pts, per = 8) {
    const P = unwrap(pts);
    if (P.length < 3) return P;
    const out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let s = 0; s < per; s++) {
        const t = s / per, t2 = t * t, t3 = t2 * t;
        const f = k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
        out.push([f(0), f(1)]);
      }
    }
    out.push(P[P.length - 1]);
    return out;
  }

  return { closeRing, multiFromRings, densifyGeometry, featureCenter, distDeg, povForBox, bboxOfFeature, bboxOfPoints, unwrap, smooth };
})();
