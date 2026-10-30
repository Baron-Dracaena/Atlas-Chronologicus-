/* ============================================================
   SOVEREIGNTY LEDGER · 1899 → 6 MARCH 1957
   One record per Natural Earth 1:110m polygon (world-atlas@2,
   keyed by ISO-3166 numeric; the three id-less features are keyed
   'N:<name>'). Supersedes IMPERIUM's year-granular TERRITORY_DATA.

   span = S(from, to, power, kind, role, extra?)
     from/to  year | 'YYYY-MM' | 'YYYY-MM-DD' — inclusive (see chronos.js);
              to:null runs to the end of the record (6 Mar 1957)
     power    an IMP.EMPIRES id, or
                SOVEREIGN   an independent state     extra.state names it
                            prev/indep mark decolonization; quiet:true for
                            constitutional evolution (e.g. Canada 1931)
                POST_EMPIRE a defeated empire under Allied control
                OTHER       an actor outside the roster; extra.by names it
     kind     metropole · integral · colony · protectorate · mandate ·
              trust · condominium · dominion · occupation · sphere ·
              war (control contested by arms) · independent
   The polygon is a modern outline: where a 1900s unit covered only
   part of it, the role says so. No record before a polygon's first
   span means "no precise record" — the Atlas layer speaks there.
   ============================================================ */
window.IMP = window.IMP || {};
(function () {
  const S = (from, to, power, kind, role, extra) => Object.assign({ from, to, power, kind, role }, extra || {});
  const IND = (from, state, extra) => S(from, null, 'SOVEREIGN', 'independent', state, Object.assign({ state }, extra || {}));
  const T = {};
  const R = (code, name, ll, opts, spans) => { T[code] = Object.assign({ name, lat: ll && ll[0], lng: ll && ll[1], spans }, opts || {}); };

  /* ================= METROPOLES & THE CONTIGUOUS EMPIRES ================= */
  R('826', 'United Kingdom', [54.0, -2.0], {}, [
    S(1899, null, 'UK', 'metropole', 'Imperial Metropole (London) — Great Britain & Northern Ireland')]);
  R('250', 'France', [46.6, 2.4], {}, [
    S(1899, '1940-06-21', 'FRANCE', 'metropole', 'Imperial Metropole (Paris) — the polygon also carries French Guiana'),
    S('1940-06-22', '1944-08-24', 'GERMANY', 'occupation', 'Armistice of 22 June 1940: north & Atlantic coast occupied, Vichy État français in the south; the whole country occupied from 11 Nov 1942'),
    S('1944-08-25', null, 'FRANCE', 'metropole', 'Liberated Paris (25 Aug 1944) → Fourth Republic (1946), metropole of the French Union')]);
  R('056', 'Belgium', [50.6, 4.6], {}, [
    S(1899, '1914-08-19', 'BELGIUM', 'metropole', 'Imperial Metropole (Brussels)'),
    S('1914-08-20', '1918-11-11', 'GERMANY', 'occupation', 'German occupation of Belgium (all but the Yser strip), First World War'),
    S('1918-11-12', '1940-05-27', 'BELGIUM', 'metropole', 'Imperial Metropole (Brussels)'),
    S('1940-05-28', '1944-09-03', 'GERMANY', 'occupation', 'German occupation (capitulation of 28 May 1940)'),
    S('1944-09-04', null, 'BELGIUM', 'metropole', 'Imperial Metropole (Brussels)')]);
  R('528', 'Netherlands', [52.2, 5.5], {}, [
    S(1899, '1940-05-14', 'NETHERLANDS', 'metropole', 'Imperial Metropole (Amsterdam / The Hague)'),
    S('1940-05-15', '1945-05-05', 'GERMANY', 'occupation', 'German occupation; government in exile in London'),
    S('1945-05-06', null, 'NETHERLANDS', 'metropole', 'Imperial Metropole (Amsterdam / The Hague)')]);
  R('620', 'Portugal', [39.6, -8.0], {}, [S(1899, null, 'PORTUGAL', 'metropole', 'Imperial Metropole (Lisbon) — monarchy to 1910, First Republic, Estado Novo from 1933')]);
  R('724', 'Spain', [40.2, -3.6], {}, [S(1899, null, 'SPAIN', 'metropole', 'Imperial Metropole (Madrid) — Civil War 1936–1939, Francoist State thereafter')]);
  R('840', 'United States', [39.5, -98.5], {}, [S(1899, null, 'USA', 'metropole', 'Imperial Metropole (Washington, D.C.) — the polygon includes Alaska')]);
  R('392', 'Japan', [36.5, 138.0], {}, [
    S(1899, '1945-09-01', 'JAPAN', 'metropole', 'Imperial Metropole (Tokyo)'),
    S('1945-09-02', '1952-04-27', 'POST_EMPIRE', 'occupation', 'Allied (U.S.-led) Occupation of Japan — empire stripped by the Potsdam terms', { by: 'SCAP (United States)' }),
    S('1952-04-28', null, 'SOVEREIGN', 'independent', 'Sovereign Japan (Treaty of San Francisco in force, 28 Apr 1952)', { state: 'Japan', postEmpire: true })]);
  R('380', 'Italy', [42.8, 12.6], {}, [
    S(1899, '1943-09-08', 'ITALY', 'metropole', 'Imperial Metropole (Rome) — Liberal kingdom, Fascist from 1922'),
    S('1943-09-09', '1945-05-02', 'ITALY', 'war', 'Divided Italy: Allied-occupied south & the royal government vs. the German-occupied Italian Social Republic'),
    S('1945-05-03', null, 'ITALY', 'metropole', 'Republic (2 Jun 1946); UN trust administration of Somalia from 1950')]);
  R('276', 'Germany', [51.1, 10.4], {}, [
    S(1899, '1945-05-08', 'GERMANY', 'metropole', 'Metropole — German Empire, Weimar Republic (1919), Third Reich (1933)'),
    S('1945-05-09', '1949-05-22', 'POST_EMPIRE', 'occupation', 'Four-power Allied occupation (US, UK, France, USSR)', { by: 'Allied Control Council' }),
    S('1949-05-23', null, 'SOVEREIGN', 'independent', 'Partitioned: Federal Republic (23 May 1949) & German Democratic Republic (7 Oct 1949)', { state: 'FRG & GDR', postEmpire: true })]);
  R('643', 'Russia / USSR', [61.5, 96.0], {}, [S(1899, null, 'RUSSIA_USSR', 'metropole', 'Contiguous Eurasian Metropole — Russian Empire, RSFSR (1917), USSR (30 Dec 1922)')]);
  R('208', 'Denmark', [56.0, 9.5], {}, [
    S(1899, '1940-04-08', 'DENMARK', 'metropole', 'Metropole (Copenhagen)'),
    S('1940-04-09', '1945-05-05', 'GERMANY', 'occupation', 'German occupation (Operation Weserübung)'),
    S('1945-05-06', null, 'DENMARK', 'metropole', 'Metropole (Copenhagen)')]);
  R('792', 'Ottoman Empire / Turkey', [39.0, 35.0], {}, [
    S(1899, '1922-10-31', 'OTTOMAN', 'metropole', 'Imperial core (Constantinople & Anatolia); Allied occupation of the capital from Nov 1918; Ankara government from 1920'),
    IND('1922-11-01', 'Republic of Turkey', { role: 'Sultanate abolished 1 Nov 1922; Republic of Turkey proclaimed 29 Oct 1923' })]);
  R('040', 'Austria', [47.6, 14.1], {}, [
    S(1899, '1918-11-11', 'AUSTRIA_HUNGARY', 'metropole', 'Imperial Metropole (Vienna) of the Dual Monarchy'),
    IND('1918-11-12', 'Republic of Austria', { role: 'First Austrian Republic', until: true }),
    S('1938-03-12', '1945-04-26', 'GERMANY', 'integral', 'Annexed to the Reich (Anschluss, 12–13 Mar 1938)'),
    S('1945-04-27', '1955-07-26', 'POST_EMPIRE', 'occupation', 'Four-power Allied occupation of Austria', { by: 'Allied Commission' }),
    IND('1955-07-27', 'Republic of Austria', { role: 'Sovereign & neutral (State Treaty in force 27 Jul 1955)' })]);
  R('348', 'Hungary', [47.2, 19.4], {}, [
    S(1899, '1918-10-31', 'AUSTRIA_HUNGARY', 'metropole', 'Kingdom of Hungary — co-metropole of the Dual Monarchy (Budapest)'),
    IND('1918-11-01', 'Hungary', { role: 'Republic, Soviet Republic (1919), then Horthy’s regency' }),
    S('1944-03-19', '1945-04-04', 'GERMANY', 'occupation', 'German occupation (Operation Margarethe)'),
    IND('1945-04-05', 'Hungary (Soviet satellite)', { role: 'Soviet-occupied; People’s Republic 1949; revolution crushed Nov 1956' })]);
  R('156', 'China', [35.0, 104.0], {}, [
    S(1899, '1912-02-12', 'QING', 'metropole', 'Great Qing — Boxer War 1899–1901; treaty ports, concessions and leased territories under foreign control'),
    IND('1912-02-13', 'Republic of China', { role: 'Republic of China — warlord era, Nationalist unification (1928); Japanese invasion of Manchuria (1931) and China proper (1937–45, see overlay)' }),
    IND('1949-10-01', 'People’s Republic of China', { role: 'People’s Republic proclaimed 1 Oct 1949; ROC government on Taiwan' })]);

  /* ================= EUROPE: STATES MADE AND UNMADE ================= */
  R('372', 'Ireland', [53.2, -8.0], {}, [
    S(1899, '1922-12-05', 'UK', 'integral', 'Part of the United Kingdom of Great Britain and Ireland; War of Independence 1919–1921'),
    S('1922-12-06', '1937-12-28', 'UK', 'dominion', 'Irish Free State — a British dominion'),
    IND('1937-12-29', 'Éire / Ireland', { prev: 'UK', indep: '1922-12-06', role: 'Constitution of 1937; Republic of Ireland Act in force 18 Apr 1949' })]);
  R('578', 'Norway', [64.5, 11.5], {}, [
    IND(1899, 'Kingdom of Norway (union with Sweden)', { role: 'Norway in personal union with Sweden until 7 Jun 1905' }),
    S('1940-06-10', '1945-05-08', 'GERMANY', 'occupation', 'German occupation (invaded 9 Apr 1940; capitulation 10 Jun)'),
    IND('1945-05-09', 'Kingdom of Norway')]);
  R('752', 'Sweden', [62.0, 15.0], {}, [IND(1899, 'Kingdom of Sweden')]);
  R('756', 'Switzerland', [46.8, 8.2], {}, [IND(1899, 'Swiss Confederation')]);
  R('442', 'Luxembourg', [49.8, 6.1], {}, [
    IND(1899, 'Grand Duchy of Luxembourg'),
    S('1914-08-02', '1918-11-11', 'GERMANY', 'occupation', 'German occupation, First World War'),
    IND('1918-11-12', 'Grand Duchy of Luxembourg'),
    S('1940-05-10', '1944-09-10', 'GERMANY', 'occupation', 'German occupation; annexed de facto 1942'),
    IND('1944-09-11', 'Grand Duchy of Luxembourg')]);
  R('246', 'Finland', [64.0, 26.0], {}, [
    S(1899, '1917-12-05', 'RUSSIA_USSR', 'integral', 'Grand Duchy of Finland within the Russian Empire (Russification from 1899)'),
    IND('1917-12-06', 'Republic of Finland', { prev: 'RUSSIA_USSR', indep: '1917-12-06' })]);
  R('233', 'Estonia', [58.6, 25.0], {}, [
    S(1899, '1918-02-23', 'RUSSIA_USSR', 'integral', 'Governorate of Estonia, Russian Empire'),
    S('1918-02-24', '1918-11-11', 'GERMANY', 'occupation', 'Independence declared 24 Feb 1918; German occupation the next day'),
    IND('1918-11-12', 'Republic of Estonia', { prev: 'RUSSIA_USSR', indep: '1918-02-24' }),
    S('1940-08-06', '1941-08-27', 'RUSSIA_USSR', 'integral', 'Soviet annexation — Estonian SSR'),
    S('1941-08-28', '1944-09-21', 'GERMANY', 'occupation', 'German occupation (Reichskommissariat Ostland)'),
    S('1944-09-22', null, 'RUSSIA_USSR', 'integral', 'Estonian SSR (Soviet reconquest)')]);
  R('428', 'Latvia', [56.9, 24.6], {}, [
    S(1899, '1917-09-02', 'RUSSIA_USSR', 'integral', 'Governorates of Livonia & Courland, Russian Empire (Courland occupied by Germany from 1915)'),
    S('1917-09-03', '1918-11-17', 'GERMANY', 'occupation', 'German occupation (Riga taken 3 Sep 1917)'),
    IND('1918-11-18', 'Republic of Latvia', { prev: 'RUSSIA_USSR', indep: '1918-11-18' }),
    S('1940-08-05', '1941-07-09', 'RUSSIA_USSR', 'integral', 'Soviet annexation — Latvian SSR'),
    S('1941-07-10', '1944-10-13', 'GERMANY', 'occupation', 'German occupation (Courland pocket held to May 1945)'),
    S('1944-10-14', null, 'RUSSIA_USSR', 'integral', 'Latvian SSR (Soviet reconquest of Riga 13 Oct 1944)')]);
  R('440', 'Lithuania', [55.2, 23.9], {}, [
    S(1899, '1915-09-18', 'RUSSIA_USSR', 'integral', 'Governorates of Vilna & Kovno, Russian Empire'),
    S('1915-09-19', '1918-11-11', 'GERMANY', 'occupation', 'German occupation (Ober Ost); independence declared 16 Feb 1918'),
    IND('1918-11-12', 'Republic of Lithuania', { prev: 'RUSSIA_USSR', indep: '1918-02-16' }),
    S('1940-08-03', '1941-06-23', 'RUSSIA_USSR', 'integral', 'Soviet annexation — Lithuanian SSR'),
    S('1941-06-24', '1944-07-13', 'GERMANY', 'occupation', 'German occupation (Reichskommissariat Ostland)'),
    S('1944-07-14', null, 'RUSSIA_USSR', 'integral', 'Lithuanian SSR (Vilnius retaken 13 Jul 1944)')]);
  R('616', 'Poland', [52.0, 19.4], {}, [
    S(1899, '1915-08-04', 'RUSSIA_USSR', 'integral', 'Congress Poland under Russia (the polygon also spans the Prussian & Austrian partitions)'),
    S('1915-08-05', '1918-11-10', 'GERMANY', 'occupation', 'Central Powers occupation (Warsaw taken 5 Aug 1915)'),
    IND('1918-11-11', 'Second Polish Republic', { prev: 'RUSSIA_USSR', indep: '1918-11-11' }),
    S('1939-09-28', '1945-01-16', 'GERMANY', 'occupation', 'Partitioned by Germany & the USSR (1939); wholly German-occupied 1941–44 — General Government, Generalplan Ost, the Holocaust'),
    IND('1945-01-17', 'Poland (Soviet satellite)', { role: 'Warsaw liberated 17 Jan 1945; People’s Republic 1952' })]);
  R('112', 'Belarus', [53.7, 27.95], {}, [
    S(1899, '1918-02-20', 'RUSSIA_USSR', 'integral', 'Russian Empire (North-Western Krai)'),
    S('1918-02-21', '1918-12-09', 'GERMANY', 'occupation', 'German occupation under Brest-Litovsk; Belarusian People’s Republic declared'),
    S('1918-12-10', '1941-06-27', 'RUSSIA_USSR', 'integral', 'Byelorussian SSR (western Belarus Polish 1921–39)'),
    S('1941-06-28', '1944-07-03', 'GERMANY', 'occupation', 'German occupation (Minsk fell 28 Jun 1941) — Generalplan Ost'),
    S('1944-07-04', null, 'RUSSIA_USSR', 'integral', 'Byelorussian SSR (Operation Bagration)')]);
  R('804', 'Ukraine', [48.4, 31.2], {}, [
    S(1899, '1918-03-02', 'RUSSIA_USSR', 'integral', 'Russian Empire (Galicia was Austrian); Ukrainian People’s Republic declared 1917–18'),
    S('1918-03-03', '1918-11-11', 'GERMANY', 'occupation', 'German & Austro-Hungarian occupation under Brest-Litovsk (Hetmanate)'),
    S('1918-11-12', '1920-12-31', 'RUSSIA_USSR', 'war', 'Ukrainian War of Independence & Russian Civil War'),
    S('1921-01-01', '1941-09-18', 'RUSSIA_USSR', 'integral', 'Ukrainian SSR — Holodomor 1932–33 (western Ukraine Polish 1921–39)'),
    S('1941-09-19', '1944-04-09', 'GERMANY', 'occupation', 'German occupation (Reichskommissariat Ukraine) — Generalplan Ost'),
    S('1944-04-10', null, 'RUSSIA_USSR', 'integral', 'Ukrainian SSR (Soviet reconquest)')]);
  R('498', 'Moldova (Bessarabia)', [47.2, 28.5], {}, [
    S(1899, '1918-04-08', 'RUSSIA_USSR', 'integral', 'Bessarabia Governorate, Russian Empire'),
    S('1918-04-09', '1940-06-27', 'OTHER', 'integral', 'United with the Kingdom of Romania', { by: 'Romania' }),
    S('1940-06-28', '1941-07-25', 'RUSSIA_USSR', 'integral', 'Soviet occupation — Moldavian SSR'),
    S('1941-07-26', '1944-08-23', 'OTHER', 'occupation', 'Retaken by Axis Romania', { by: 'Romania' }),
    S('1944-08-24', null, 'RUSSIA_USSR', 'integral', 'Moldavian SSR')]);
  R('203', 'Czechia (Bohemia–Moravia)', [49.8, 15.5], {}, [
    S(1899, '1918-10-27', 'AUSTRIA_HUNGARY', 'integral', 'Kingdom of Bohemia & Margraviate of Moravia (Austrian crown lands)'),
    IND('1918-10-28', 'Czechoslovakia', { prev: 'AUSTRIA_HUNGARY', indep: '1918-10-28' }),
    S('1939-03-15', '1945-05-09', 'GERMANY', 'protectorate', 'Protectorate of Bohemia and Moravia (Sudetenland annexed Oct 1938)'),
    IND('1945-05-10', 'Czechoslovakia', { role: 'Restored; Communist coup Feb 1948' })]);
  R('703', 'Slovakia', [48.7, 19.7], {}, [
    S(1899, '1918-10-29', 'AUSTRIA_HUNGARY', 'integral', 'Upper Hungary — Kingdom of Hungary'),
    IND('1918-10-30', 'Czechoslovakia', { prev: 'AUSTRIA_HUNGARY', indep: '1918-10-28' }),
    S('1939-03-14', '1945-04-03', 'GERMANY', 'sphere', 'Slovak Republic — a German client state'),
    IND('1945-04-04', 'Czechoslovakia')]);
  R('705', 'Slovenia', [46.1, 14.8], {}, [
    S(1899, '1918-10-28', 'AUSTRIA_HUNGARY', 'integral', 'Carniola & southern Styria (Austrian crown lands)'),
    IND('1918-10-29', 'Kingdom of Serbs, Croats & Slovenes → Yugoslavia', { prev: 'AUSTRIA_HUNGARY', indep: '1918-10-29' }),
    S('1941-04-17', '1945-05-09', 'GERMANY', 'occupation', 'Partitioned: German north, Italian Ljubljana (German after 1943), Hungarian Prekmurje'),
    IND('1945-05-10', 'Yugoslavia')]);
  R('191', 'Croatia', [45.1, 15.2], {}, [
    S(1899, '1918-10-28', 'AUSTRIA_HUNGARY', 'integral', 'Kingdom of Croatia-Slavonia (Hungarian crown) & Austrian Dalmatia'),
    IND('1918-10-29', 'Kingdom of Serbs, Croats & Slovenes → Yugoslavia', { prev: 'AUSTRIA_HUNGARY', indep: '1918-10-29' }),
    S('1941-04-10', '1945-05-08', 'GERMANY', 'sphere', 'Independent State of Croatia — Axis puppet (Ustaše); Italian zone on the coast'),
    IND('1945-05-09', 'Yugoslavia')]);
  R('070', 'Bosnia and Herzegovina', [44.2, 17.8], {}, [
    S(1899, '1908-10-05', 'AUSTRIA_HUNGARY', 'occupation', 'Occupied by Austria-Hungary since 1878 under nominal Ottoman sovereignty'),
    S('1908-10-06', '1918-10-28', 'AUSTRIA_HUNGARY', 'integral', 'Annexed 1908 (Bosnian Crisis); Sarajevo, 28 Jun 1914'),
    IND('1918-10-29', 'Kingdom of Serbs, Croats & Slovenes → Yugoslavia', { prev: 'AUSTRIA_HUNGARY', indep: '1918-10-29' }),
    S('1941-04-15', '1945-04-06', 'GERMANY', 'sphere', 'Part of the Axis Independent State of Croatia'),
    IND('1945-04-07', 'Yugoslavia')]);
  R('688', 'Serbia', [44.0, 20.9], {}, [
    IND(1899, 'Kingdom of Serbia'),
    S('1915-11-25', '1918-11-01', 'AUSTRIA_HUNGARY', 'occupation', 'Central Powers occupation after the Great Retreat'),
    IND('1918-11-02', 'Kingdom of Serbs, Croats & Slovenes → Yugoslavia'),
    S('1941-04-17', '1944-10-20', 'GERMANY', 'occupation', 'German military occupation (Nedić regime)'),
    IND('1944-10-21', 'Yugoslavia (Tito)')]);
  R('499', 'Montenegro', [42.8, 19.3], {}, [
    IND(1899, 'Principality (Kingdom 1910) of Montenegro'),
    S('1916-01-25', '1918-11-01', 'AUSTRIA_HUNGARY', 'occupation', 'Austro-Hungarian occupation'),
    IND('1918-11-02', 'Kingdom of Serbs, Croats & Slovenes → Yugoslavia', { role: 'Liberated Nov 1918; the Podgorica Assembly votes union with Serbia on 26 Nov 1918' }),
    S('1941-04-17', '1943-09-08', 'ITALY', 'occupation', 'Italian governorate of Montenegro'),
    S('1943-09-09', '1944-12-15', 'GERMANY', 'occupation', 'German occupation'),
    IND('1944-12-16', 'Yugoslavia')]);
  R('807', 'North Macedonia', [41.6, 21.7], {}, [
    S(1899, '1912-11-30', 'OTTOMAN', 'integral', 'Ottoman Macedonia — Ilinden Uprising 1903; First Balkan War 1912'),
    IND('1912-12-01', 'Kingdom of Serbia (Vardar Macedonia)'),
    S('1915-10-22', '1918-09-29', 'OTHER', 'occupation', 'Bulgarian occupation', { by: 'Bulgaria' }),
    IND('1918-09-30', 'Kingdom of Serbs, Croats & Slovenes → Yugoslavia'),
    S('1941-04-19', '1944-11-13', 'OTHER', 'occupation', 'Bulgarian (Axis) occupation; Italian-Albanian west', { by: 'Bulgaria' }),
    IND('1944-11-14', 'Yugoslavia (People’s Republic of Macedonia)')]);
  R('N:Kosovo', 'Kosovo', [42.6, 20.9], {}, [
    S(1899, '1912-11-30', 'OTTOMAN', 'integral', 'Kosovo Vilayet, Ottoman Empire'),
    IND('1912-12-01', 'Kingdom of Serbia'),
    S('1915-11-25', '1918-10-31', 'AUSTRIA_HUNGARY', 'occupation', 'Austro-Hungarian & Bulgarian occupation'),
    IND('1918-11-01', 'Kingdom of Serbs, Croats & Slovenes → Yugoslavia'),
    S('1941-04-17', '1943-09-08', 'ITALY', 'occupation', 'Annexed to Italian-ruled Albania'),
    S('1943-09-09', '1944-11-21', 'GERMANY', 'occupation', 'German occupation'),
    IND('1944-11-22', 'Yugoslavia')]);
  R('008', 'Albania', [41.15, 20.16], {}, [
    S(1899, '1912-11-27', 'OTTOMAN', 'integral', 'Ottoman vilayets of Scutari & Janina'),
    IND('1912-11-28', 'Principality of Albania', { prev: 'OTTOMAN', indep: '1912-11-28' }),
    S('1916-01-23', '1918-10-31', 'AUSTRIA_HUNGARY', 'occupation', 'Austro-Hungarian occupation of the north (Italian & French zones in the south)'),
    S('1918-11-01', '1920-08-02', 'ITALY', 'occupation', 'Italian occupation, ended by the Vlora War'),
    IND('1920-08-03', 'Albania', { role: 'Principality, Republic (1925), Kingdom of Zog (1928)' }),
    S('1939-04-07', '1943-09-08', 'ITALY', 'protectorate', 'Italian invasion (7 Apr 1939); personal union with the Italian crown'),
    S('1943-09-09', '1944-11-28', 'GERMANY', 'occupation', 'German occupation'),
    IND('1944-11-29', 'People’s Republic of Albania')]);
  R('300', 'Greece', [39.1, 22.0], {}, [
    IND(1899, 'Kingdom of Greece'),
    S('1941-04-27', '1944-10-12', 'GERMANY', 'occupation', 'Triple occupation — German, Italian, Bulgarian; the Great Famine'),
    IND('1944-10-13', 'Kingdom of Greece', { role: 'Civil War 1946–1949' })]);
  R('100', 'Bulgaria', [42.7, 25.5], {}, [
    IND(1899, 'Principality of Bulgaria', { role: 'Autonomous principality under nominal Ottoman suzerainty' }),
    IND('1908-10-05', 'Tsardom of Bulgaria', { prev: 'OTTOMAN', indep: '1908-10-05', quiet: true }),
    IND('1944-09-09', 'Bulgaria (Soviet satellite)', { role: 'Soviet occupation & Fatherland Front coup; People’s Republic 1946' })]);
  R('642', 'Romania', [45.9, 24.9], {}, [
    IND(1899, 'Kingdom of Romania'),
    S('1916-12-06', '1918-11-10', 'GERMANY', 'occupation', 'Central Powers occupation of Wallachia (Bucharest, 6 Dec 1916)'),
    IND('1918-11-11', 'Kingdom of Romania (Greater Romania)'),
    IND('1944-08-31', 'Romania (Soviet satellite)', { role: 'Red Army enters Bucharest; People’s Republic 1947' })]);
  R('352', 'Iceland', [64.96, -19.02], {}, [
    S(1899, '1918-11-30', 'DENMARK', 'colony', 'Danish dependency (home rule 1904)'),
    IND('1918-12-01', 'Kingdom of Iceland (personal union with Denmark)', { quiet: true }),
    S('1940-05-10', '1941-07-06', 'UK', 'occupation', 'British invasion & occupation'),
    S('1941-07-07', '1944-06-16', 'USA', 'occupation', 'United States garrison replaces the British'),
    IND('1944-06-17', 'Republic of Iceland', { prev: 'DENMARK', indep: '1944-06-17' })]);
  R('196', 'Cyprus', [35.12, 33.42], {}, [
    S(1899, '1914-11-04', 'UK', 'protectorate', 'British administration under nominal Ottoman sovereignty (Cyprus Convention, 1878)'),
    S('1914-11-05', null, 'UK', 'colony', 'Annexed 1914; Crown Colony 1925; EOKA emergency from 1955')]);
  R('N:N. Cyprus', 'Northern Cyprus', [35.25, 33.6], {}, [
    S(1899, '1914-11-04', 'UK', 'protectorate', 'British administration under nominal Ottoman sovereignty'),
    S('1914-11-05', null, 'UK', 'colony', 'Crown Colony of Cyprus (the island was undivided until 1974)')]);

  /* ================= AMERICAS & ATLANTIC ================= */
  R('124', 'Canada', [56.1, -106.3], {}, [
    S(1899, '1931-12-10', 'UK', 'dominion', 'Dominion of Canada — self-governing; contributed troops to the Boer War & both World Wars'),
    IND('1931-12-11', 'Dominion of Canada (Statute of Westminster)', { prev: 'UK', quiet: true, role: 'Legislative independence under the Statute of Westminster (11 Dec 1931); Newfoundland joins 1949' })]);
  R('304', 'Greenland', [71.7, -42.6], { key: true }, [S(1899, null, 'DENMARK', 'colony', 'Danish Colony of Greenland (U.S. bases from 1941; integrated into the Danish Realm in 1953)')]);
  R('484', 'Mexico', [23.6, -102.5], {}, [IND(1899, 'United Mexican States', { role: 'Porfiriato; Revolution 1910–1920; U.S. occupation of Veracruz, 1914' })]);
  R('320', 'Guatemala', [15.8, -90.2], {}, [IND(1899, 'Republic of Guatemala', { role: 'United Fruit country; CIA-backed coup, 1954' })]);
  R('222', 'El Salvador', [13.8, -88.9], {}, [IND(1899, 'Republic of El Salvador')]);
  R('340', 'Honduras', [14.8, -86.6], {}, [IND(1899, 'Republic of Honduras', { role: 'The original "banana republic"; repeated U.S. landings 1903–1925' })]);
  R('558', 'Nicaragua', [12.9, -85.2], {}, [
    IND(1899, 'Republic of Nicaragua'),
    S('1912-08-04', '1933-01-02', 'USA', 'occupation', 'U.S. Marine occupation (Banana Wars); Sandino’s rebellion 1927–1933'),
    IND('1933-01-03', 'Republic of Nicaragua', { role: 'Somoza dictatorship from 1936' })]);
  R('188', 'Costa Rica', [9.75, -83.75], {}, [IND(1899, 'Republic of Costa Rica')]);
  R('591', 'Panama', [8.53, -80.78], {}, [
    IND(1899, 'Colombia (Department of Panama)', { role: 'Province of Colombia; Thousand Days’ War 1899–1902' }),
    S('1903-11-03', '1939-07-26', 'USA', 'sphere', 'Republic of Panama under U.S. protectorate (Hay–Bunau-Varilla Treaty); Panama Canal Zone under U.S. jurisdiction'),
    IND('1939-07-27', 'Republic of Panama (U.S. Canal Zone)', { prev: 'USA', quiet: true, role: 'Protectorate ended by the Hull–Alfaro Treaty (in force 1939); the Canal Zone stays American' })]);
  R('084', 'British Honduras (Belize)', [17.18, -88.49], {}, [S(1899, null, 'UK', 'colony', 'Crown Colony of British Honduras')]);
  R('192', 'Cuba', [21.52, -77.78], {}, [
    S(1899, '1902-05-19', 'USA', 'occupation', 'U.S. Military Government of Cuba'),
    S('1902-05-20', '1934-05-28', 'USA', 'sphere', 'Republic of Cuba under the Platt Amendment protectorate (re-occupied 1906–1909)'),
    IND('1934-05-29', 'Republic of Cuba', { prev: 'USA', indep: '1902-05-20', quiet: true, role: 'Platt Amendment abrogated 1934; Batista; Guantánamo leased' })]);
  R('332', 'Haiti', [19.0, -72.7], {}, [
    IND(1899, 'Republic of Haiti'),
    S('1915-07-28', '1934-08-15', 'USA', 'occupation', 'U.S. occupation of Haiti'),
    IND('1934-08-16', 'Republic of Haiti')]);
  R('214', 'Dominican Republic', [18.7, -70.2], {}, [
    IND(1899, 'Dominican Republic', { role: 'U.S. customs receivership from 1905' }),
    S('1916-05-15', '1924-07-12', 'USA', 'occupation', 'U.S. occupation of the Dominican Republic'),
    IND('1924-07-13', 'Dominican Republic', { role: 'Trujillo dictatorship from 1930' })]);
  R('630', 'Puerto Rico', [18.22, -66.59], { key: true }, [S(1899, null, 'USA', 'colony', 'U.S. unincorporated territory (ceded 1898); citizenship 1917; Commonwealth 1952')]);
  R('388', 'Jamaica', [18.1, -77.29], {}, [S(1899, null, 'UK', 'colony', 'British Crown Colony of Jamaica')]);
  R('044', 'The Bahamas', [25.03, -77.39], {}, [S(1899, null, 'UK', 'colony', 'British Crown Colony of the Bahamas')]);
  R('780', 'Trinidad and Tobago', [10.69, -61.22], {}, [S(1899, null, 'UK', 'colony', 'British Crown Colony of Trinidad and Tobago')]);
  R('328', 'British Guiana (Guyana)', [4.86, -58.93], {}, [S(1899, null, 'UK', 'colony', 'Colony of British Guiana (constitution suspended 1953)')]);
  R('740', 'Suriname (Dutch Guiana)', [3.91, -56.02], { key: true }, [
    S(1899, '1954-12-14', 'NETHERLANDS', 'colony', 'Colony of Surinam'),
    S('1954-12-15', null, 'NETHERLANDS', 'integral', 'Constituent country of the Kingdom of the Netherlands (Charter of 1954)')]);
  R('238', 'Falkland Islands', [-51.8, -59.5], {}, [S(1899, null, 'UK', 'colony', 'British Crown Colony (claimed by Argentina)')]);
  R('862', 'Venezuela', [6.4, -66.6], {}, [IND(1899, 'United States of Venezuela', { role: 'Anglo-German-Italian naval blockade 1902–03; oil from 1914' })]);
  R('170', 'Colombia', [4.6, -74.3], {}, [IND(1899, 'Republic of Colombia', { role: 'Thousand Days’ War 1899–1902; Panama secedes 1903; La Violencia from 1948' })]);
  R('218', 'Ecuador', [-1.8, -78.2], {}, [IND(1899, 'Republic of Ecuador')]);
  R('604', 'Peru', [-9.2, -75.0], {}, [IND(1899, 'Republic of Peru')]);
  R('068', 'Bolivia', [-16.3, -63.6], {}, [IND(1899, 'Republic of Bolivia', { role: 'Acre War 1899–1903; Chaco War 1932–1935; Revolution of 1952' })]);
  R('152', 'Chile', [-35.7, -71.5], {}, [IND(1899, 'Republic of Chile')]);
  R('032', 'Argentina', [-38.4, -63.6], {}, [IND(1899, 'Argentine Republic', { role: 'Perón 1946–1955' })]);
  R('858', 'Uruguay', [-32.5, -55.8], {}, [IND(1899, 'Oriental Republic of Uruguay')]);
  R('600', 'Paraguay', [-23.4, -58.4], {}, [IND(1899, 'Republic of Paraguay', { role: 'Chaco War 1932–1935' })]);
  R('076', 'Brazil', [-14.2, -51.9], {}, [IND(1899, 'Republic of the United States of Brazil', { role: 'First Republic; Vargas era 1930–1945 & 1951–1954' })]);

  /* ================= BRITISH EMPIRE: AFRICA ================= */
  R('710', 'South Africa', [-29.0, 24.0], {}, [
    S(1899, '1899-10-10', 'UK', 'colony', 'British Cape Colony & Natal beside the Boer South African Republic and Orange Free State'),
    S('1899-10-11', '1902-05-31', 'UK', 'war', 'Second Boer War — British Cape & Natal against the Boer republics; scorched earth and concentration camps'),
    S('1902-06-01', '1910-05-30', 'UK', 'colony', 'Four British colonies: Cape, Natal, Transvaal, Orange River (Treaty of Vereeniging)'),
    S('1910-05-31', null, 'SOUTH_AFRICA', 'dominion', 'Union of South Africa — self-governing dominion & settler-colonial state (Apartheid codified 1948)')]);
  R('288', 'Gold Coast → Ghana', [7.9465, -1.0232], { key: true }, [
    S(1899, '1957-03-05', 'UK', 'colony', 'Gold Coast Colony; Ashanti annexed 1901, the Northern Territories (with western Dagbon) 1902; British Togoland trust from 1922'),
    IND('1957-03-06', 'Ghana', { prev: 'UK', indep: '1957-03-06', special: 'ghana', role: 'HISTORIC MILESTONE: first sub-Saharan colony to independence, 6 March 1957, under Prime Minister Kwame Nkrumah' })]);
  R('566', 'Nigeria', [9.08, 8.67], { key: true }, [S(1899, null, 'UK', 'colony', 'Royal Niger Company territories → Northern & Southern Protectorates (1900) → amalgamated Colony & Protectorate (1914); independent 1960')]);
  R('404', 'Kenya', [-0.02, 37.9], { key: true }, [
    S(1899, '1920-07-22', 'UK', 'protectorate', 'East Africa Protectorate'),
    S('1920-07-23', null, 'UK', 'colony', 'Kenya Colony — Emergency against the Mau Mau rising from 20 Oct 1952')]);
  R('800', 'Uganda', [1.37, 32.29], {}, [S(1899, null, 'UK', 'protectorate', 'Uganda Protectorate (Buganda Agreement 1900); independent 1962')]);
  R('818', 'Egypt', [26.82, 30.8], { key: true }, [
    S(1899, '1914-12-17', 'UK', 'occupation', 'British occupation (since 1882) of the Khedivate under nominal Ottoman suzerainty — the "veiled protectorate"'),
    S('1914-12-18', '1922-02-27', 'UK', 'protectorate', 'Sultanate of Egypt — formal British protectorate; Revolution of 1919'),
    IND('1922-02-28', 'Kingdom of Egypt → Republic (1953)', { prev: 'UK', indep: '1922-02-28', role: 'Nominal independence (1922) with British "reserved points"; Canal Zone garrison until 13 Jun 1956; Suez nationalized 26 Jul 1956' })]);
  R('729', 'Sudan', [15.5, 32.55], {}, [
    S('1899-01-19', '1955-12-31', 'UK', 'condominium', 'Anglo-Egyptian Sudan — condominium of 19 Jan 1899, British-run (Darfur independent to 1916)'),
    IND('1956-01-01', 'Republic of the Sudan', { prev: 'UK', indep: '1956-01-01' })]);
  R('728', 'South Sudan', [6.87, 31.3], {}, [
    S('1899-01-19', '1955-12-31', 'UK', 'condominium', 'Southern provinces of the Anglo-Egyptian Sudan (Torit mutiny 1955)'),
    IND('1956-01-01', 'Republic of the Sudan (southern provinces)', { prev: 'UK', indep: '1956-01-01' })]);
  R('716', 'Southern Rhodesia (Zimbabwe)', [-19.01, 29.15], { key: true }, [
    S(1899, '1923-09-30', 'UK', 'colony', 'Administered by the British South Africa Company'),
    S('1923-10-01', null, 'UK', 'colony', 'Self-governing settler colony; Federation of Rhodesia & Nyasaland from 1953')]);
  R('894', 'Northern Rhodesia (Zambia)', [-13.13, 27.84], {}, [
    S(1899, '1924-03-31', 'UK', 'colony', 'British South Africa Company rule'),
    S('1924-04-01', null, 'UK', 'protectorate', 'Protectorate of Northern Rhodesia (Copperbelt); Federation from 1953')]);
  R('454', 'Nyasaland (Malawi)', [-13.25, 34.3], {}, [S(1899, null, 'UK', 'protectorate', 'British Central Africa → Nyasaland Protectorate (1907); Chilembwe rising 1915')]);
  R('072', 'Bechuanaland (Botswana)', [-22.32, 24.68], {}, [S(1899, null, 'UK', 'protectorate', 'Bechuanaland Protectorate')]);
  R('426', 'Basutoland (Lesotho)', [-29.6, 28.23], {}, [S(1899, null, 'UK', 'protectorate', 'Basutoland — British High Commission territory; the Basotho kingdom endures beneath it')]);
  R('748', 'Swaziland (Eswatini)', [-26.52, 31.46], {}, [
    S(1899, '1899-10-10', 'OTHER', 'protectorate', 'Protectorate of the Boer South African Republic (1894)', { by: 'South African Republic' }),
    S('1899-10-11', '1902-05-31', 'UK', 'war', 'Second Boer War'),
    S('1902-06-01', null, 'UK', 'protectorate', 'British protectorate — High Commission territory from 1906')]);
  R('694', 'Sierra Leone', [8.46, -11.77], {}, [S(1899, null, 'UK', 'colony', 'Colony and Protectorate of Sierra Leone (Hut Tax War, 1898)')]);
  R('270', 'The Gambia', [13.44, -15.31], {}, [S(1899, null, 'UK', 'colony', 'Gambia Colony and Protectorate')]);
  R('706', 'Somalia', [5.15, 46.19], { key: true }, [
    S(1899, '1941-02-25', 'ITALY', 'colony', 'Italian Somaliland (part of Italian East Africa from 1936)'),
    S('1941-02-26', '1950-03-31', 'UK', 'occupation', 'British Military Administration'),
    S('1950-04-01', null, 'ITALY', 'trust', 'UN Trust Territory of Somaliland under Italian administration (to 1960)')]);
  R('N:Somaliland', 'British Somaliland', [9.6, 46.0], {}, [
    S(1899, '1940-08-18', 'UK', 'protectorate', 'British Somaliland Protectorate — the Dervish State of Mohammed Abdullah Hassan resists to 1920'),
    S('1940-08-19', '1941-03-16', 'ITALY', 'occupation', 'Italian conquest of British Somaliland'),
    S('1941-03-17', null, 'UK', 'protectorate', 'British Somaliland Protectorate (to 1960)')]);
  R('834', 'Tanganyika (Tanzania)', [-6.36, 34.88], { key: true }, [
    S(1899, '1914-08-07', 'GERMANY', 'colony', 'German East Africa — Maji Maji War 1905–07'),
    S('1914-08-08', '1917-11-25', 'GERMANY', 'war', 'East African campaign — Lettow-Vorbeck’s Schutztruppe against British, Belgian & Portuguese forces'),
    S('1917-11-26', '1920-07-21', 'UK', 'occupation', 'British occupation after the Schutztruppe crossed into Mozambique'),
    S('1920-07-22', null, 'UK', 'mandate', 'Tanganyika Territory — League mandate, UN trust territory from 1946')]);
  R('646', 'Ruanda (Rwanda)', [-1.94, 29.87], {}, [
    S(1899, '1916-05-05', 'GERMANY', 'colony', 'German East Africa (Kingdom of Rwanda under indirect rule)'),
    S('1916-05-06', '1922-07-19', 'BELGIUM', 'occupation', 'Belgian occupation (Kigali taken 6 May 1916)'),
    S('1922-07-20', null, 'BELGIUM', 'mandate', 'Ruanda-Urundi — Belgian mandate / UN trust territory')]);
  R('108', 'Urundi (Burundi)', [-3.37, 29.91], {}, [
    S(1899, '1916-06-05', 'GERMANY', 'colony', 'German East Africa (Kingdom of Burundi under indirect rule)'),
    S('1916-06-06', '1922-07-19', 'BELGIUM', 'occupation', 'Belgian occupation (Usumbura taken June 1916)'),
    S('1922-07-20', null, 'BELGIUM', 'mandate', 'Ruanda-Urundi — Belgian mandate / UN trust territory')]);
  R('516', 'South West Africa (Namibia)', [-22.95, 18.49], { key: true }, [
    S(1899, '1914-09-14', 'GERMANY', 'colony', 'German South West Africa — Herero & Nama genocide 1904–1908'),
    S('1914-09-15', '1915-07-09', 'GERMANY', 'war', 'South West Africa campaign — Union forces invade'),
    S('1915-07-10', '1920-12-16', 'SOUTH_AFRICA', 'occupation', 'South African military occupation (German surrender at Khorab, 9 Jul 1915)'),
    S('1920-12-17', null, 'SOUTH_AFRICA', 'mandate', 'Class C mandate administered by the Union of South Africa (UN trusteeship refused)')]);
  R('120', 'Kamerun (Cameroon)', [7.36, 12.35], { key: true }, [
    S(1899, '1914-09-26', 'GERMANY', 'colony', 'German Kamerun'),
    S('1914-09-27', '1916-02-18', 'GERMANY', 'war', 'Kamerun campaign (Duala falls 27 Sep 1914; Mora holds to Feb 1916)'),
    S('1916-02-19', '1922-07-19', 'FRANCE', 'occupation', 'Anglo-French occupation and partition (1916)'),
    S('1922-07-20', null, 'FRANCE', 'mandate', 'French Cameroun mandate / trust territory (British Cameroons strip in the west); UPC insurgency from 1955')]);
  R('768', 'Togoland (Togo)', [8.61, 0.82], {}, [
    S(1899, '1914-08-26', 'GERMANY', 'colony', 'German Togoland — it took eastern Dagbon (Yendi) in 1899'),
    S('1914-08-27', '1922-07-19', 'FRANCE', 'occupation', 'Anglo-French occupation (Kamina surrendered 26 Aug 1914)'),
    S('1922-07-20', null, 'FRANCE', 'mandate', 'French Togoland mandate / trust territory (British Togoland joined Ghana in 1957)')]);
  R('598', 'Papua New Guinea', [-6.31, 143.95], { key: true }, [
    S(1899, '1914-09-16', 'GERMANY', 'colony', 'German New Guinea (Kaiser-Wilhelmsland) in the north; British New Guinea — Australian Papua from 1906 — in the south'),
    S('1914-09-17', '1921-05-08', 'AUSTRALIA', 'occupation', 'Australian occupation (German surrender at Toma, 17 Sep 1914)'),
    S('1921-05-09', '1942-01-22', 'AUSTRALIA', 'mandate', 'Territory of New Guinea (mandate) & Territory of Papua'),
    S('1942-01-23', '1945-09-12', 'JAPAN', 'war', 'Japanese invasion (Rabaul 23 Jan 1942); Kokoda Track; much of New Guinea contested to 1945'),
    S('1945-09-13', null, 'AUSTRALIA', 'trust', 'Territory of Papua and New Guinea — UN trusteeship')]);

  /* ================= BRITISH EMPIRE: ASIA & PACIFIC ================= */
  R('356', 'British Raj / India', [21.0, 78.0], { key: true }, [
    S(1899, '1947-08-14', 'UK', 'colony', 'The Indian Empire — British provinces and some 560 princely states'),
    IND('1947-08-15', 'Dominion of India → Republic (1950)', { prev: 'UK', indep: '1947-08-15' })]);
  R('586', 'Pakistan (West Pakistan)', [30.37, 69.34], {}, [
    S(1899, '1947-08-13', 'UK', 'colony', 'Punjab, Sind, NWFP & Baluchistan in British India'),
    IND('1947-08-14', 'Dominion of Pakistan → Islamic Republic (1956)', { prev: 'UK', indep: '1947-08-14' })]);
  R('050', 'East Bengal (Bangladesh)', [23.68, 90.35], {}, [
    S(1899, '1947-08-13', 'UK', 'colony', 'Bengal Presidency (partitioned 1905–1911)'),
    IND('1947-08-14', 'East Bengal → East Pakistan (1955)', { prev: 'UK', indep: '1947-08-14' })]);
  R('104', 'Burma (Myanmar)', [21.91, 95.95], {}, [
    S(1899, '1942-04-30', 'UK', 'colony', 'Province of British India; separate colony from 1 Apr 1937'),
    S('1942-05-01', '1945-05-02', 'JAPAN', 'occupation', 'Japanese occupation (State of Burma, 1943)'),
    S('1945-05-03', '1948-01-03', 'UK', 'colony', 'Restored British administration'),
    IND('1948-01-04', 'Union of Burma', { prev: 'UK', indep: '1948-01-04' })]);
  R('144', 'Ceylon (Sri Lanka)', [7.87, 80.77], {}, [
    S(1899, '1948-02-03', 'UK', 'colony', 'British Crown Colony of Ceylon'),
    IND('1948-02-04', 'Dominion of Ceylon', { prev: 'UK', indep: '1948-02-04' })]);
  R('458', 'British Malaya & Borneo (Malaysia)', [4.21, 101.97], { key: true }, [
    S(1899, '1942-01-30', 'UK', 'colony', 'Straits Settlements, Federated & Unfederated Malay States; British North Borneo & Brooke Sarawak'),
    S('1942-01-31', '1945-09-11', 'JAPAN', 'occupation', 'Japanese occupation (Singapore falls 15 Feb 1942)'),
    S('1945-09-12', null, 'UK', 'colony', 'Federation of Malaya (1948) — Malayan Emergency from 1948; Merdeka on 31 Aug 1957, five months after Ghana')]);
  R('096', 'Brunei', [4.5, 114.7], {}, [
    S(1899, '1941-12-15', 'UK', 'protectorate', 'British protectorate (1888)'),
    S('1941-12-16', '1945-06-10', 'JAPAN', 'occupation', 'Japanese occupation'),
    S('1945-06-11', null, 'UK', 'protectorate', 'British protectorate')]);
  R('242', 'Fiji', [-17.71, 178.06], {}, [S(1899, null, 'UK', 'colony', 'British Colony of Fiji')]);
  R('090', 'Solomon Islands', [-9.64, 160.15], {}, [
    S(1899, '1942-05-02', 'UK', 'protectorate', 'British Solomon Islands Protectorate'),
    S('1942-05-03', '1943-02-09', 'JAPAN', 'war', 'Japanese occupation; Guadalcanal campaign (Aug 1942 – Feb 1943)'),
    S('1943-02-10', null, 'UK', 'protectorate', 'British Solomon Islands Protectorate')]);
  R('548', 'New Hebrides (Vanuatu)', [-15.4, 166.9], {}, [
    S(1899, '1906-10-19', 'UK', 'condominium', 'Anglo-French Joint Naval Commission (1887)'),
    S('1906-10-20', null, 'UK', 'condominium', 'Anglo-French Condominium of the New Hebrides (shared with France)')]);
  R('036', 'Australia', [-25.0, 133.0], {}, [
    S(1899, 1900, 'UK', 'colony', 'Six self-governing British colonies'),
    S('1901-01-01', null, 'AUSTRALIA', 'dominion', 'Commonwealth of Australia — dominion administering Papua & New Guinea')]);
  R('554', 'New Zealand', [-41.0, 174.0], {}, [
    S(1899, '1907-09-25', 'UK', 'colony', 'Self-governing Colony of New Zealand (annexes the Cook Islands, 1901)'),
    S('1907-09-26', null, 'NEW_ZEALAND', 'dominion', 'Dominion of New Zealand — administering Western Samoa, the Cook Islands, Niue & Tokelau')]);

  /* ================= MIDDLE EAST ================= */
  R('368', 'Iraq', [33.22, 43.67], {}, [
    S(1899, '1917-03-10', 'OTTOMAN', 'integral', 'Vilayets of Baghdad, Basra & Mosul (Basra taken by Britain, Nov 1914)'),
    S('1917-03-11', '1920-04-24', 'UK', 'occupation', 'British occupation (Baghdad, 11 Mar 1917); revolt of 1920'),
    S('1920-04-25', '1932-10-02', 'UK', 'mandate', 'British Mandate for Mesopotamia (San Remo, 1920); Kingdom of Iraq from 1921'),
    IND('1932-10-03', 'Kingdom of Iraq', { prev: 'UK', indep: '1932-10-03', until: true }),
    S('1941-05-31', '1947-10-26', 'UK', 'occupation', 'British re-occupation after the Anglo-Iraqi War'),
    IND('1947-10-27', 'Kingdom of Iraq', { prev: 'UK', indep: '1932-10-03', role: 'Hashemite kingdom (RAF bases until 1955; Baghdad Pact)' })]);
  R('760', 'Syria', [34.8, 38.99], {}, [
    S(1899, '1918-09-30', 'OTTOMAN', 'integral', 'Vilayets of Damascus & Aleppo'),
    IND('1918-10-01', 'Arab Kingdom of Syria', { role: 'Faisal’s Arab government in Damascus (OETA East)', until: true }),
    S('1920-07-25', '1946-04-16', 'FRANCE', 'mandate', 'French Mandate for Syria — Maysalun (1920), Great Syrian Revolt (1925–27)'),
    IND('1946-04-17', 'Syrian Republic', { prev: 'FRANCE', indep: '1946-04-17' })]);
  R('422', 'Lebanon', [33.85, 35.86], {}, [
    S(1899, '1918-10-07', 'OTTOMAN', 'integral', 'Mount Lebanon Mutasarrifate & Beirut Vilayet'),
    S('1918-10-08', '1920-08-31', 'FRANCE', 'occupation', 'French military occupation (OETA West)'),
    S('1920-09-01', '1943-11-21', 'FRANCE', 'mandate', 'French Mandate — State of Greater Lebanon'),
    IND('1943-11-22', 'Lebanese Republic', { prev: 'FRANCE', indep: '1943-11-22' })]);
  R('376', 'Palestine / Israel', [31.04, 34.85], {}, [
    S(1899, '1917-12-08', 'OTTOMAN', 'integral', 'Mutasarrifate of Jerusalem & Beirut Vilayet'),
    S('1917-12-09', '1920-06-30', 'UK', 'occupation', 'British military administration (Jerusalem, 9 Dec 1917)'),
    S('1920-07-01', '1948-05-14', 'UK', 'mandate', 'British Mandate for Palestine'),
    IND('1948-05-15', 'State of Israel', { prev: 'UK', indep: '1948-05-14' })]);
  R('275', 'West Bank & Gaza', [31.9, 35.2], {}, [
    S(1899, '1917-12-08', 'OTTOMAN', 'integral', 'Mutasarrifate of Jerusalem'),
    S('1917-12-09', '1920-06-30', 'UK', 'occupation', 'British military administration'),
    S('1920-07-01', '1948-05-14', 'UK', 'mandate', 'British Mandate for Palestine'),
    S('1948-05-15', null, 'OTHER', 'occupation', 'West Bank held (annexed 1950) by Jordan; Gaza under Egyptian administration — the Nakba', { by: 'Jordan & Egypt' })]);
  R('400', 'Transjordan (Jordan)', [30.58, 36.23], {}, [
    S(1899, '1918-09-30', 'OTTOMAN', 'integral', 'Syria Vilayet; Hejaz Railway'),
    IND('1918-10-01', 'Arab government of Damascus', { until: true }),
    S('1921-04-11', '1946-05-24', 'UK', 'mandate', 'Emirate of Transjordan under the British Mandate'),
    IND('1946-05-25', 'Hashemite Kingdom of Jordan', { prev: 'UK', indep: '1946-05-25' })]);
  R('682', 'Arabia (Saudi Arabia)', [23.9, 45.1], {}, [
    S(1899, '1916-06-09', 'OTTOMAN', 'sphere', 'Ottoman Hejaz & al-Hasa; Rashidi Ha’il; Ibn Saud retakes Riyadh in 1902'),
    IND('1916-06-10', 'Kingdom of Hejaz & Sultanate of Nejd', { prev: 'OTTOMAN', indep: '1916-06-10', role: 'Arab Revolt (1916); Saudi conquest of the Hejaz 1924–25' }),
    IND('1932-09-23', 'Kingdom of Saudi Arabia', { role: 'Unified 23 Sep 1932; oil at Dammam 1938' })]);
  R('887', 'Aden & Yemen', [15.55, 48.51], {}, [S(1899, null, 'UK', 'colony', 'Aden Colony & Protectorate (the north was Ottoman Yemen, then the Mutawakkilite Kingdom from 1918)')]);
  R('512', 'Muscat and Oman', [21.47, 55.97], {}, [S(1899, null, 'UK', 'sphere', 'Sultanate under informal British protection')]);
  R('784', 'Trucial States (UAE)', [23.42, 53.84], {}, [S(1899, null, 'UK', 'protectorate', 'Trucial States — British protectorate (Exclusive Agreement 1892)')]);
  R('414', 'Kuwait', [29.31, 47.48], {}, [S('1899-01-23', null, 'UK', 'protectorate', 'British protectorate (Anglo-Kuwaiti Agreement, 23 Jan 1899)')]);
  R('634', 'Qatar', [25.35, 51.18], {}, [
    S(1899, '1916-11-02', 'OTTOMAN', 'sphere', 'Ottoman kaza under Al Thani sheikhs (garrison withdrawn 1915)'),
    S('1916-11-03', null, 'UK', 'protectorate', 'British protectorate (treaty of 3 Nov 1916)')]);
  R('364', 'Persia / Iran', [32.4, 53.7], {}, [
    IND(1899, 'Qajar Persia', { role: 'Constitutional Revolution 1905–11; Anglo-Russian spheres from 1907; Pahlavi dynasty 1925; "Iran" from 1935', until: true }),
    S('1941-08-25', '1946-05-09', 'UK', 'occupation', 'Anglo-Soviet occupation (Soviet north, British south)', { co: 'RUSSIA_USSR' }),
    IND('1946-05-10', 'Imperial State of Iran', { role: 'Mosaddegh nationalizes oil 1951; coup 1953' })]);
  R('004', 'Afghanistan', [33.9, 67.7], {}, [
    S(1899, '1919-08-18', 'UK', 'sphere', 'Emirate under British control of its foreign relations'),
    IND('1919-08-19', 'Kingdom of Afghanistan', { prev: 'UK', indep: '1919-08-19', quiet: true })]);

  /* ================= RUSSIA / USSR: CENTRAL ASIA & CAUCASUS ================= */
  R('398', 'Kazakhstan', [48.01, 66.92], { key: true }, [S(1899, null, 'RUSSIA_USSR', 'integral', 'Steppe Krai of the Russian Empire → Kazakh SSR (1936); revolt of 1916, famine of 1930–33')]);
  R('860', 'Uzbekistan', [41.37, 64.58], {}, [S(1899, null, 'RUSSIA_USSR', 'integral', 'Russian Turkestan with the Bukharan & Khivan protectorates (to 1920) → Uzbek SSR')]);
  R('795', 'Turkmenistan', [38.96, 59.55], {}, [S(1899, null, 'RUSSIA_USSR', 'integral', 'Transcaspian Oblast → Turkmen SSR')]);
  R('417', 'Kyrgyzstan', [41.2, 74.76], {}, [S(1899, null, 'RUSSIA_USSR', 'integral', 'Semirechye & Fergana oblasts → Kirghiz SSR')]);
  R('762', 'Tajikistan', [38.86, 71.27], {}, [S(1899, null, 'RUSSIA_USSR', 'integral', 'Emirate of Bukhara (Russian protectorate) → Tajik SSR (1929)')]);
  R('268', 'Georgia', [42.31, 43.35], {}, [
    S(1899, '1918-05-25', 'RUSSIA_USSR', 'integral', 'Tiflis & Kutais governorates'),
    IND('1918-05-26', 'Democratic Republic of Georgia', { prev: 'RUSSIA_USSR', indep: '1918-05-26', until: true }),
    S('1921-02-25', null, 'RUSSIA_USSR', 'integral', 'Red Army invasion → Georgian SSR')]);
  R('051', 'Armenia', [40.06, 45.03], {}, [
    S(1899, '1918-05-27', 'RUSSIA_USSR', 'integral', 'Erivan Governorate'),
    IND('1918-05-28', 'First Republic of Armenia', { prev: 'RUSSIA_USSR', indep: '1918-05-28', until: true }),
    S('1920-12-02', null, 'RUSSIA_USSR', 'integral', 'Sovietization → Armenian SSR')]);
  R('031', 'Azerbaijan', [40.14, 47.57], {}, [
    S(1899, '1918-05-27', 'RUSSIA_USSR', 'integral', 'Baku & Elisabethpol governorates — the oil of Baku'),
    IND('1918-05-28', 'Azerbaijan Democratic Republic', { prev: 'RUSSIA_USSR', indep: '1918-05-28', until: true }),
    S('1920-04-28', null, 'RUSSIA_USSR', 'integral', 'Red Army invasion → Azerbaijan SSR')]);
  R('496', 'Mongolia', [46.9, 103.8], {}, [
    S(1899, '1911-12-28', 'QING', 'integral', 'Outer Mongolia under the Qing'),
    IND('1911-12-29', 'Bogd Khanate of Mongolia', { prev: 'QING', indep: '1911-12-29', until: true }),
    S('1919-11-22', '1921-02-03', 'OTHER', 'occupation', 'Chinese reoccupation', { by: 'Republic of China' }),
    S('1921-02-04', '1921-07-10', 'OTHER', 'war', 'Ungern-Sternberg’s White Russian regime; Soviet–Mongol counter-offensive', { by: 'Ungern-Sternberg' }),
    S('1921-07-11', null, 'RUSSIA_USSR', 'sphere', 'Mongolian People’s Republic (1924) — Soviet satellite')]);

  /* ================= EAST & SOUTHEAST ASIA ================= */
  R('158', 'Taiwan (Formosa)', [23.69, 120.96], { key: true }, [
    S(1899, '1945-10-24', 'JAPAN', 'colony', 'Japanese colony of Taiwan (ceded 1895)'),
    IND('1945-10-25', 'Republic of China (Taiwan)', { prev: 'JAPAN', indep: '1945-10-25', role: 'Returned to the Republic of China; 228 Incident 1947; seat of the ROC government from 1949' })]);
  R('410', 'South Korea', [35.9, 127.76], { key: true }, [
    IND(1899, 'Korean Empire', { role: 'Daehan Jeguk (1897)', until: true }),
    S('1905-11-17', '1910-08-28', 'JAPAN', 'protectorate', 'Japanese protectorate (Eulsa Treaty)'),
    S('1910-08-29', '1945-09-08', 'JAPAN', 'colony', 'Annexed — Japanese colony of Chōsen; March 1st Movement 1919'),
    S('1945-09-09', '1948-08-14', 'USA', 'occupation', 'U.S. Army Military Government in Korea'),
    IND('1948-08-15', 'Republic of Korea', { prev: 'JAPAN', indep: '1945-08-15', role: 'Korean War 1950–1953' })]);
  R('408', 'North Korea', [40.33, 127.51], {}, [
    IND(1899, 'Korean Empire', { until: true }),
    S('1905-11-17', '1910-08-28', 'JAPAN', 'protectorate', 'Japanese protectorate'),
    S('1910-08-29', '1945-08-23', 'JAPAN', 'colony', 'Japanese colony of Chōsen'),
    S('1945-08-24', '1948-09-08', 'RUSSIA_USSR', 'occupation', 'Soviet Civil Administration'),
    IND('1948-09-09', 'Democratic People’s Republic of Korea', { prev: 'JAPAN', indep: '1945-08-15', role: 'Korean War 1950–1953' })]);
  R('764', 'Siam / Thailand', [15.9, 101.0], {}, [IND(1899, 'Kingdom of Siam → Thailand (1939)', { role: 'Never colonized — ceded Laos (1893–1907) and northern Malay states (1909); allied to Japan 1941–45' })]);
  R('704', 'French Indochina / Vietnam', [14.05, 108.27], { key: true }, [
    S(1899, '1940-09-21', 'FRANCE', 'colony', 'Tonkin, Annam & Cochinchina (French Indochina)'),
    S('1940-09-22', '1945-03-08', 'JAPAN', 'occupation', 'Japanese military occupation; Vichy French administration left in place'),
    S('1945-03-09', '1945-09-01', 'JAPAN', 'occupation', 'Japanese coup (9 Mar 1945) — Empire of Vietnam; famine'),
    S('1945-09-02', '1954-07-20', 'FRANCE', 'war', 'DRV proclaimed 2 Sep 1945; First Indochina War — ends at Điện Biên Phủ (7 May 1954)'),
    IND('1954-07-21', 'North & South Vietnam', { prev: 'FRANCE', indep: '1954-07-21', role: 'Partitioned at the 17th parallel by the Geneva Accords' })]);
  R('418', 'Laos', [19.85, 102.49], {}, [
    S(1899, '1945-03-08', 'FRANCE', 'protectorate', 'French protectorate of Laos (Japanese garrison from 1941)'),
    S('1945-03-09', '1946-04-23', 'JAPAN', 'occupation', 'Japanese coup; Lao Issara government (Oct 1945)'),
    S('1946-04-24', '1953-10-21', 'FRANCE', 'protectorate', 'French reoccupation; Associated State of the French Union (1949)'),
    IND('1953-10-22', 'Kingdom of Laos', { prev: 'FRANCE', indep: '1953-10-22' })]);
  R('116', 'Cambodia', [12.56, 104.99], {}, [
    S(1899, '1945-03-08', 'FRANCE', 'protectorate', 'French protectorate of Cambodia (Japanese garrison from 1941)'),
    S('1945-03-09', '1945-10-15', 'JAPAN', 'occupation', 'Japanese coup; Kingdom of Kampuchea'),
    S('1945-10-16', '1953-11-08', 'FRANCE', 'protectorate', 'French return'),
    IND('1953-11-09', 'Kingdom of Cambodia', { prev: 'FRANCE', indep: '1953-11-09' })]);
  R('360', 'Dutch East Indies (Indonesia)', [-2.54, 118.01], { key: true }, [
    S(1899, '1942-03-08', 'NETHERLANDS', 'colony', 'Dutch East Indies — Aceh War to 1904, Bali 1906–08'),
    S('1942-03-09', '1945-08-16', 'JAPAN', 'occupation', 'Japanese occupation (Dutch surrender at Kalijati, 8–9 Mar 1942)'),
    S('1945-08-17', '1949-12-26', 'NETHERLANDS', 'war', 'Republic proclaimed 17 Aug 1945; Indonesian National Revolution & Dutch "police actions"'),
    IND('1949-12-27', 'Republic of Indonesia', { prev: 'NETHERLANDS', indep: '1949-12-27', role: 'Sovereignty transferred; host of Bandung, 1955 (the polygon includes West New Guinea, Dutch until 1962)' })]);
  R('626', 'Portuguese Timor', [-8.87, 125.72], {}, [
    S(1899, '1942-02-19', 'PORTUGAL', 'colony', 'Colony of Portuguese Timor'),
    S('1942-02-20', '1945-09-05', 'JAPAN', 'occupation', 'Japanese occupation; Australian guerrilla campaign'),
    S('1945-09-06', null, 'PORTUGAL', 'colony', 'Overseas Province of Portuguese Timor')]);
  R('608', 'Philippine Islands', [12.87, 121.77], { key: true }, [
    S(1899, '1902-07-04', 'USA', 'war', 'Philippine-American War (Moro resistance to 1913)'),
    S('1902-07-05', '1942-05-05', 'USA', 'colony', 'U.S. insular government; Commonwealth of the Philippines from 1935'),
    S('1942-05-06', '1945-07-04', 'JAPAN', 'occupation', 'Japanese occupation (Corregidor falls 6 May 1942)'),
    S('1945-07-05', '1946-07-03', 'USA', 'colony', 'Restored Commonwealth'),
    IND('1946-07-04', 'Republic of the Philippines', { prev: 'USA', indep: '1946-07-04' })]);
  R('524', 'Nepal', [28.4, 84.1], {}, [IND(1899, 'Kingdom of Nepal', { role: 'Rana regime; British-protected but never ruled (treaty of 1923); revolution of 1951' })]);
  R('064', 'Bhutan', [27.5, 90.4], {}, [
    IND(1899, 'Bhutan', { until: true }),
    S('1910-01-08', '1949-08-07', 'UK', 'sphere', 'Treaty of Punakha — foreign relations guided by Britain'),
    IND('1949-08-08', 'Kingdom of Bhutan', { prev: 'UK', quiet: true })]);

  /* ================= FRENCH, BELGIAN, PORTUGUESE, SPANISH, ITALIAN AFRICA ================= */
  R('012', 'French Algeria', [28.03, 1.65], { key: true }, [
    S(1899, '1954-10-31', 'FRANCE', 'integral', 'Three départements of France; Sétif & Guelma massacres, May 1945'),
    S('1954-11-01', null, 'FRANCE', 'war', 'Algerian War of Independence (from 1 Nov 1954) — the Battle of Algiers rages in March 1957')]);
  R('504', 'Morocco', [31.79, -7.09], {}, [
    IND(1899, 'Sultanate of Morocco', { role: 'Independent Alaouite sultanate — Tangier & Agadir crises', until: true }),
    S('1912-03-30', '1956-03-01', 'FRANCE', 'protectorate', 'French protectorate (Treaty of Fez) with a Spanish zone in the north; Rif War 1921–26'),
    IND('1956-03-02', 'Kingdom of Morocco', { prev: 'FRANCE', indep: '1956-03-02' })]);
  R('788', 'Tunisia', [33.88, 9.53], {}, [
    S(1899, '1942-11-08', 'FRANCE', 'protectorate', 'French protectorate of Tunisia (since 1881)'),
    S('1942-11-09', '1943-05-13', 'GERMANY', 'occupation', 'Axis bridgehead — Tunisian campaign'),
    S('1943-05-14', '1956-03-19', 'FRANCE', 'protectorate', 'French protectorate restored'),
    IND('1956-03-20', 'Kingdom of Tunisia', { prev: 'FRANCE', indep: '1956-03-20' })]);
  R('434', 'Libya', [26.33, 17.22], { key: true }, [
    S(1899, '1911-10-04', 'OTTOMAN', 'integral', 'Ottoman Tripolitania & Cyrenaica'),
    S('1911-10-05', '1912-10-18', 'ITALY', 'war', 'Italo-Turkish War'),
    S('1912-10-19', '1943-01-22', 'ITALY', 'colony', 'Italian Libya — Senussi resistance crushed 1923–1932 (Omar Mukhtar)'),
    S('1943-01-23', '1951-12-23', 'UK', 'occupation', 'British (and French, in Fezzan) military administration'),
    IND('1951-12-24', 'United Kingdom of Libya', { prev: 'ITALY', indep: '1951-12-24' })]);
  R('231', 'Ethiopia (Abyssinia)', [9.14, 40.48], { key: true }, [
    IND(1899, 'Ethiopian Empire', { role: 'Victor of Adwa (1896) — never colonized', until: true }),
    S('1936-05-05', '1941-05-04', 'ITALY', 'occupation', 'Italian East Africa — conquest with mustard gas; Yekatit 12 massacre (1937)'),
    IND('1941-05-05', 'Ethiopian Empire', { role: 'Haile Selassie restored, 5 May 1941' })]);
  R('232', 'Eritrea', [15.17, 39.78], {}, [
    S(1899, '1941-03-31', 'ITALY', 'colony', 'Colony of Italian Eritrea'),
    S('1941-04-01', '1952-09-14', 'UK', 'occupation', 'British Military Administration'),
    S('1952-09-15', null, 'OTHER', 'integral', 'Federated with Ethiopia by UN resolution', { by: 'Ethiopia' })]);
  R('262', 'French Somaliland (Djibouti)', [11.82, 42.59], {}, [S(1899, null, 'FRANCE', 'colony', 'Côte française des Somalis')]);
  R('732', 'Spanish Sahara', [24.21, -12.88], { key: true }, [S(1899, null, 'SPAIN', 'colony', 'Río de Oro & Saguia el-Hamra — effective occupation of the interior only from 1934')]);
  R('226', 'Spanish Guinea', [1.65, 10.26], { key: true }, [S(1899, null, 'SPAIN', 'colony', 'Fernando Po & Río Muni (mainland occupied 1926)')]);
  R('686', 'Senegal', [14.49, -14.45], { key: true }, [S(1899, null, 'FRANCE', 'colony', 'Seat of French West Africa (AOF) — Dakar')]);
  R('466', 'French Sudan (Mali)', [17.57, -3.99], {}, [S(1899, null, 'FRANCE', 'colony', 'Upper Senegal & Niger → French Sudan (1920)')]);
  R('384', 'Ivory Coast', [7.54, -5.54], {}, [S(1899, null, 'FRANCE', 'colony', 'Colony of Côte d’Ivoire (Baoulé resistance to 1915)')]);
  R('324', 'French Guinea', [9.94, -9.69], {}, [S(1899, null, 'FRANCE', 'colony', 'Colony of French Guinea')]);
  R('854', 'Upper Volta (Burkina Faso)', [12.23, -1.56], {}, [S(1899, null, 'FRANCE', 'colony', 'Mossi lands — Upper Senegal-Niger, Upper Volta (1919–32, partitioned 1932–47, restored 1947)')]);
  R('562', 'Niger', [17.6, 8.08], {}, [S(1899, null, 'FRANCE', 'colony', 'Military Territory of Niger (conquest 1899–1906; Kaocen’s Tuareg revolt 1916–17)')]);
  R('204', 'Dahomey (Benin)', [9.3, 2.31], {}, [S(1899, null, 'FRANCE', 'colony', 'Colony of Dahomey (French West Africa)')]);
  R('478', 'Mauritania', [21.0, -10.94], {}, [
    IND(1899, 'Moorish emirates (Trarza, Brakna, Adrar, Tagant)', { until: true }),
    S('1903-05-12', null, 'FRANCE', 'colony', 'French protectorate (1903) → colony (1920); Adrar conquered 1909')]);
  R('148', 'Chad', [15.45, 18.73], {}, [
    S(1899, '1900-04-22', 'FRANCE', 'war', 'French conquest against Rabih az-Zubayr (killed at Kousséri, 22 Apr 1900); Wadai & Baguirmi'),
    S('1900-04-23', null, 'FRANCE', 'colony', 'Colony of Chad (French Equatorial Africa) — first to rally to Free France, Aug 1940')]);
  R('140', 'Oubangui-Chari (CAR)', [6.61, 20.93], {}, [S(1899, null, 'FRANCE', 'colony', 'Oubangui-Chari (French Equatorial Africa) — concession-company terror; Kongo-Wara rebellion 1928–31')]);
  R('178', 'Middle Congo', [-0.22, 15.82], { key: true }, [S(1899, null, 'FRANCE', 'colony', 'Moyen-Congo — Brazzaville, capital of French Equatorial Africa & of Free France (1940)')]);
  R('266', 'Gabon', [-0.8, 11.6], {}, [S(1899, null, 'FRANCE', 'colony', 'Colony of Gabon (French Equatorial Africa)')]);
  R('450', 'Madagascar', [-18.76, 46.86], { key: true }, [
    S(1899, '1942-05-04', 'FRANCE', 'colony', 'Colony of Madagascar (annexed 1896)'),
    S('1942-05-05', '1943-01-07', 'UK', 'occupation', 'British invasion of Vichy Madagascar (Operation Ironclad)'),
    S('1943-01-08', null, 'FRANCE', 'colony', 'Free French administration; Malagasy Uprising suppressed 1947–49')]);
  R('540', 'New Caledonia', [-20.9, 165.61], {}, [S(1899, null, 'FRANCE', 'colony', 'French colony in the Pacific (Kanak revolt 1917)')]);
  R('260', 'French Southern Lands', [-49.3, 69.5], {}, [S(1899, null, 'FRANCE', 'colony', 'Kerguelen & the southern islands — attached to Madagascar 1924')]);
  R('180', 'Congo Free State / Belgian Congo', [-4.03, 21.75], { key: true }, [
    S(1899, '1908-11-14', 'BELGIUM', 'colony', 'Congo Free State — personal possession of Leopold II; the red-rubber terror'),
    S('1908-11-15', null, 'BELGIUM', 'colony', 'Belgian Congo — annexed by the Belgian state, 15 Nov 1908')]);
  R('024', 'Angola', [-11.2, 17.87], { key: true }, [S(1899, null, 'PORTUGAL', 'colony', 'Portuguese West Africa → Overseas Province (1951); "pacification" to 1917')]);
  R('508', 'Mozambique', [-18.66, 35.52], { key: true }, [S(1899, null, 'PORTUGAL', 'colony', 'Portuguese East Africa (chartered companies) → Overseas Province (1951)')]);
  R('624', 'Portuguese Guinea', [11.8, -15.18], {}, [S(1899, null, 'PORTUGAL', 'colony', 'Colony / Overseas Province (Bijagós resisted to 1936)')]);
  R('430', 'Liberia', [6.4, -9.4], {}, [IND(1899, 'Republic of Liberia', { role: 'With Ethiopia, one of two African states never colonized — under heavy U.S. and Firestone influence' })]);

  IMP.TERRITORIES = T;
})();
