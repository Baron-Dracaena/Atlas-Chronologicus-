# Atlas Chronologicus v3.0

**Live:** https://baron-dracaena.github.io/Atlas-Chronologicus-/

A 3D globe running from 800 to 6 March 1957. Version 3.0 rebuilds the project as one program from two earlier ones:

- **Atlas Chronologicus** (800–1914): about 260 hand-drawn polities, plus routes, cities and a chronicle of events.
- **The IMPERIUM ledger** (1899–1957): the colonial powers and the dossiers for their territories, worked out border by border.

### Version history

| Version | What changed |
|---|---|
| 1.x | Single-file HTML atlas. Internal builds V1–V7 grew it from a prototype to 282 polities, 44 routes, 94 cities and 127 events. |
| 2.x | A refactor began toward GeoJSON sources with a Python compile pipeline. It never shipped and was folded into 3.0. |
| **3.0** | The Atlas and IMPERIUM merged into one modular program: a 3D globe, a dated sovereignty ledger and the 1899 handoff. |

## Running it

Open `index.html` in a browser. It also works from `file://`. The libraries, the earth textures and the 1:110m country polygons load from jsDelivr, so the page needs a network connection.

You can also serve it locally: `python -m http.server 8766` (the port `launch.json` uses)

## Two records, one clock

| Period | Layer | What you see |
|---|---|---|
| 800 – 1898 | **Atlas sketch** | Polities drawn at their approximate peak extent. Borders were zones, not lines. |
| 1 Jan 1899 → 6 Mar 1957 | **Ledger** | Each Natural Earth country polygon has a dated chain of rulers. Kingdoms that lasted inside those borders are drawn as outlined overlays. |

**The handoff (1899).** When time crosses into 1899, the precise polygons rise out of Pretoria, where the ledger opens on 11 Oct 1899. They rise behind a ring moving at the same speed. Each Atlas sketch they replace dissolves as the front passes over it. The rules for each polity are in `js/data/atlas.links.js`:

- **Superseded**: the polity *is* a ledger state, so its sketch retires.
- **Nested**: the polity persisted *inside* a ledger polygon (for example Dagbon, Sokoto, Tibet), so it stays as an overlay.
- **Extended**: Atlas cut everything off at 1914 to limit its scope. For polities that actually lasted longer, this list gives the real end date.

**Time model** (`js/engine/chronos.js`). Time is a decimal year. A data bound can be a year, `YYYY-MM` or `YYYY-MM-DD`, and every range is inclusive. The slider shows each year as of 31 December, so 1947 already shows India independent.

## Layout

```
index.html                  shell (IMPERIUM war-room chrome)
css/imperium.css            the aesthetic: obsidian, brass, Playfair / JetBrains Mono / Inter
js/data/
  atlas.core.js             Atlas dataset, verbatim (POLITIES, ROUTES, CITIES, EVENTS, ERAS, VIEWS)
  atlas.eurasia.js          Atlas Eurasia/Pacific expansion, verbatim
  atlas.links.js            1899 handoff rules + ledger-era overlays (Manchukuo, Darfur, Spanish Morocco…)
  imperium.empires.js       18 powers (IMPERIUM's 15 + Ottoman, Austria-Hungary, Qing) with Atlas predecessors
  sovereignty.js            THE LEDGER: one dated record per 1:110m polygon
  events.modern.js          chronicle 1899–1957, dated to the day
js/engine/
  chronos.js  geo.js  atlas.js (normalizer)  ledger.js (resolver)  audit.js
js/ui/
  globe.js (layers, diffed per render)  labels.js (HTML label placement)  panels.js
js/app.js                   state, timeline, time-dilated playback, keys, deep links
```

## Editing the record

Add a ledger span:

```js
S('1940-06-22', '1944-08-24', 'GERMANY', 'occupation', 'Armistice of 22 June 1940 …')
```

- `power` is either an empire id, or one of `SOVEREIGN`, `POST_EMPIRE` or `OTHER` (use `by:` to name who).
- `kind` is one of: metropole, integral, colony, protectorate, mandate, trust, condominium, dominion, occupation, sphere, war, independent.

Atlas content uses the original Atlas schema, so you add it to the arrays the same way as before.

**Audit.** Integrity checks run every time the page loads. They catch overlapping or inverted spans, unknown powers, gaps inside a record, dead links between Atlas and the ledger, and badly wound rings. Click the **AUDIT** badge at the bottom left to read the results. They are also logged to the console.

## Controls

| Input | Effect |
|---|---|
| ← / → | Step one year |
| Shift + ← / → | Step ten years |
| Alt + ← / → | Step one month |
| Space | Play or pause. Play runs about 30 yr/s in 800 and slows to 2.2 yr/s in the ledger era. |
| ↑ / ↓ | Step through the polities alive this year |
| Esc | Clear the selection |
| `/` | Search |
| `0` | Reset the view |
| `D` | Health readout: renders, DOM nodes, polygons, labels. These numbers must not keep climbing. |

## Lineage

v3.0 carries forward fixes from the earlier builds: two data corrections (Liberia, Morocco), coordinate sanity checks from the old compiler (now part of the audit), and the old engine's rule against rebuilding unchanged DOM, along with its ↑/↓, `0` and `D` keys. The last single-file build is preserved under the `v2-legacy` tag.

**Deep links** look like this: `#t=1947.62&sel=territory:356&emp=UK`
