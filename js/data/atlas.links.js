/* ============================================================
   ATLAS ↔ LEDGER LINKS — what happens at the 1899 handoff.

   Before HANDOFF the globe shows Atlas Chronologicus: hand-drawn,
   approximate peak extents. From HANDOFF (1 Jan 1899, the start
   of the sovereignty ledger) the precise 1:110m polygons take the
   ground. Every Atlas polity still alive at that moment must say
   what it is relative to that ledger:

   SUPERSEDED  the state *is* a ledger power or ledger polygon
               (France, Qing, Ethiopia…) — its sketch retires at
               the handoff so the precise border can speak.
   NESTED      everything else: a kingdom, confederacy or people
               that persisted *inside* a colonial or sovereign
               polygon (Dagbon under Britain and Germany, Sokoto to
               1903, Tibet to 1951). Drawn as an outlined overlay
               above the ledger, coloured by its own category.

   Atlas ends in 1914 by scope, not by history. EXTEND gives the
   true end for polities whose `e:1914` is only that horizon; any
   other polity keeps its own end date.
   ============================================================ */
window.IMP = window.IMP || {};
IMP.HANDOFF = 1899;

IMP.ATLAS_SUPERSEDED = [
  // European metropoles & settler states
  'england', 'france', 'portugal', 'spain', 'dutch', 'usa', 'mexico', 'rusemp', 'habsburg', 'prussia', 'bohemia',
  // the colonial claims Atlas sketched for 1880–1914
  'cape_br', 'fr_algeria', 'br_egypt', 'fwa', 'br_nigeria', 'goldcoast', 'cfs', 'german_af', 'pt_angola', 'pt_moz',
  'braj', 'usphil', 'vocdei', 'frindo', 'brmalaya', 'brburma', 'chosen', 'brna',
  // sovereign states the ledger carries
  'ottoman', 'morocco', 'ethiopia', 'liberia', 'haiti', 'qing', 'roc', 'meiji', 'siam', 'qajar', 'joseon', 'nepal_kingdom', 'bhutan'
];

/* id → true end year (replaces an e:1914 horizon clamp). */
IMP.ATLAS_EXTEND = {
  dagbon: 1957,        // the Ya Naa's paramountcy continues to this day
  mamprugu: 1957,      // the Nayiri still holds seniority among the Gbewaa states
  haudenosaunee: 1957, // the Grand Council at Onondaga never dissolved
  threefires: 1957, haida: 1957, tlingit: 1957, guarani: 1957,
  ternate: 1957,       // sultanate continues under the Dutch, then Indonesia
  sotho: 1957,         // the Basotho crown beneath British Basutoland
  mysore: 1947,        // princely state until accession to India
  kongo: 1914,         // a true end: the crown abolished by Portugal after the 1913–14 revolt
  tibetgp: 1951        // de facto independent 1912–1950; PLA enters Lhasa 1951
};

/* Overlays the ledger cannot draw with country polygons:
   sub-national regimes of 1899–1957, same schema as POLITIES. */
IMP.LEDGER_OVERLAYS = [
  {id:'darfur_ali', n:'Sultanate of Darfur (restored)', cat:'sahel', s:1898, e:1916, cap:'El Fasher',
   note:'Ali Dinar reclaimed his ancestors’ throne after Omdurman (1898) and ruled Darfur as an independent sultanate inside the nominal borders of the Anglo-Egyptian Sudan — until he sided with the Ottomans in 1915 and an Anglo-Egyptian column killed him in November 1916.',
   poly:[[[22.5,15.5],[25.5,16.5],[27.5,14.5],[27,11],[24.5,9.8],[22.5,11.5]]], lbl:[24.8,13.2], lz:1.4},
  {id:'sp_morocco', n:'Spanish Protectorate in Morocco', cat:'colonial', power:'SPAIN', s:1912, e:1956, cap:'Tetuán',
   note:'The northern strip of Morocco — the Rif and Jebala — assigned to Spain by the 1912 Franco-Spanish convention. Here Abd el-Krim’s Rif Republic destroyed a Spanish army at Annual (1921) and held out until 1926, defeated by a Franco-Spanish force using chemical weapons. Franco launched his 1936 coup from Tetuán with Moroccan troops. Returned to Morocco in April 1956.',
   poly:[[[-6.2,35.8],[-5.3,35.9],[-4.2,35.25],[-2.9,35.3],[-2,35.1],[-3.2,34.7],[-4.8,34.85],[-6,35.05]]], lbl:[-4.3,35.3], lz:2},
  {id:'rif_rep', n:'Republic of the Rif', cat:'nafrica', s:1921, e:1926, cap:'Ajdir',
   note:'Abd el-Krim’s Berber republic — the first modern war of decolonization in Africa. Its victory at Annual (July 1921) killed some 8–10,000 Spanish soldiers; it took 1925–26 joint operations by Spain and France under Pétain, with mustard gas, to end it.',
   poly:[[[-4.8,35.3],[-3.4,35.35],[-3,34.9],[-4,34.65],[-4.9,34.85]]], lbl:[-3.9,35.0], lz:2.2},
  {id:'manchukuo', n:'Manchukuo', cat:'colonial', power:'JAPAN', s:1932, e:1945, cap:'Hsinking (Changchun)',
   note:'Japan’s puppet empire in Manchuria, carved out after the Mukden Incident (Sept 1931) and proclaimed 1 March 1932 with the last Qing emperor, Puyi, as figurehead. A laboratory of colonial planning — and of Unit 731. Overrun by the Soviet invasion of August 1945.',
   poly:[[[119.5,42],[121,40.8],[124.3,40],[126,41.5],[129,42.5],[131,43],[134.5,48],[131,47.8],[127.5,49.8],[125,53],[121,53.2],[119.5,49.5],[116,47.5],[118.5,45]]], lbl:[125.5,45.5], lz:1.2},
  {id:'jp_china', n:'Japanese-occupied China', cat:'colonial', power:'JAPAN', s:1938, e:1945, cap:'Nanjing (Wang Jingwei regime)',
   note:'From the Marco Polo Bridge (July 1937) Japan seized the coast, the great cities and the railways — Beijing, Shanghai, Nanjing (the massacre of Dec 1937), Wuhan and Guangzhou by late 1938 — ruling through puppet regimes. The Nationalists held the interior from Chongqing; Communist base areas spread behind Japanese lines. Shown at its approximate 1938–44 extent; surrendered September 1945.',
   poly:[[[117.5,40.8],[119.5,40],[122,37.5],[120.5,36],[121.9,31],[121.5,28],[119.5,25.5],[117,23.5],[113.5,22.2],[112.5,23.8],[114,26],[113.2,29.5],[111.5,30.5],[112,34.7],[110.5,37],[112.5,40],[115,41]]], lbl:[116,33], lz:1.2}
];
