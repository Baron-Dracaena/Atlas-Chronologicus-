/* IMPERIUM dataset — the colonial powers of 1899–1957, carried over from
   imperium_1899_1957_geopolitical_globe.html. Extended below with the three
   contiguous empires the 1899 map cannot be read without (Ottoman, Habsburg,
   Qing) and with `atlas` links naming each power's Atlas-era predecessors. */
window.IMP = window.IMP || {};

IMP.EMPIRES = {
  UK: {
    id: 'UK',
    name: 'United Kingdom (British Empire)',
    shortName: 'United Kingdom',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#e11d48', // Imperial Crimson
    capital: { name: 'London', lat: 51.5074, lng: -0.1278, iso: '826' },
    peakArea: '35.5M km² (Largest in history)',
    activeYears: [1899, 1957],
    summary: 'The preeminent global superpower at the turn of the 20th century. Beginning this era with the brutal Second Boer War (1899–1902), Britain expanded further after WWI via League of Nations mandates before granting independence to India, Pakistan, Burma, and Ceylon (1947–48). Yet throughout the 1950s, Whitehall fiercely defended its strategic African and Southeast Asian holdings.',
    conflicts: [
      'Second Boer War (1899–1902) — Scorched-earth & concentration camps in South Africa',
      'Amritsar Massacre & Indian Independence Struggles (1919–1947)',
      'Malayan Emergency (1948–1960) — Counter-insurgency in British Malaya',
      'Mau Mau Uprising in Kenya (1952–1960) — State of emergency & detention camps',
      'Suez Crisis (1956) & Cyprus Emergency (1955–1959)'
    ],
    status1957: 'On March 6, 1957, Britain transfers sovereignty to the Gold Coast, creating independent Ghana—yet still rules Nigeria, Kenya, Uganda, Tanganyika, Sierra Leone, the Rhodesias, Malaya, and Caribbean/Pacific dependencies.',
    keyTerritories: 'India, Pakistan, Burma, Ceylon, Gold Coast (Ghana), Nigeria, Kenya, Egypt, Sudan, Uganda, Tanganyika, Northern & Southern Rhodesia, Bechuanaland, Malaya, British Guiana.'
  },
  FRANCE: {
    id: 'FRANCE',
    name: 'French Republic (Empire Colonial Français)',
    shortName: 'France',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#2563eb', // Republic Cobalt
    capital: { name: 'Paris', lat: 48.8566, lng: 2.3522, iso: '250' },
    peakArea: '13.5M km² (Second-largest overseas empire)',
    activeYears: [1899, 1957],
    summary: 'Administered vast contiguous blocks across French West Africa (AOF), French Equatorial Africa (AEF), the Maghreb, Madagascar, and French Indochina. After World War II, reorganized as the "French Union" (1946) and waged two massive colonial wars to prevent the dissolution of its empire.',
    conflicts: [
      'Rif War in Morocco (1921–1926) & Great Syrian Revolt (1925–1927)',
      'Sétif & Guelma Massacres in Algeria (1945)',
      'First Indochina War (1946–1954) — Culminating in defeat at Dien Bien Phu',
      'Malagasy Uprising in Madagascar (1947–1949)',
      'Algerian War of Independence (1954–1962) — In full swing on March 6, 1957'
    ],
    status1957: 'Having lost Indochina (1954) and granted independence to Morocco and Tunisia (1956), France is entrenched in the Algerian War while ruling over 14 sub-Saharan African territories adjacent to newly independent Ghana.',
    keyTerritories: 'Algeria, French West Africa (Senegal, Mali, Ivory Coast, Niger, Guinea, Dahomey, Upper Volta, Mauritania), French Equatorial Africa (Chad, Congo, Gabon, Oubangui-Chari), Indochina (Vietnam, Laos, Cambodia), Madagascar, Syria & Lebanon (Mandates).'
  },
  BELGIUM: {
    id: 'BELGIUM',
    name: 'Kingdom of Belgium',
    shortName: 'Belgium',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#d97706', // Congo Amber
    capital: { name: 'Brussels', lat: 50.8503, lng: 4.3517, iso: '056' },
    peakArea: '2.4M km² (Heart of Central Africa)',
    activeYears: [1899, 1957],
    summary: 'Initially ruled as King Leopold II’s personal extractive fiefdom (Congo Free State) until international outcry forced annexation by the Belgian state in 1908. Following WWI, Belgium acquired the League of Nations mandate over Ruanda-Urundi, operating a paternalistic, corporate-state "trinity" of administration, Church, and mining monopolies (Union Minière).',
    conflicts: [
      'Congo Free State Rubber Atrocities (1885–1908)',
      'East African Campaign in German East Africa (1916–1918)',
      '1941 Elisabethville Miners’ Strike Suppression',
      'Institutionalized ethno-caste stratification in Ruanda-Urundi'
    ],
    status1957: 'Firmly in control of the Belgian Congo and Ruanda-Urundi in March 1957; Belgian authorities envision a "30-year plan" for emancipation, unaware independence will arrive abruptly in 1960.',
    keyTerritories: 'Belgian Congo (modern DR Congo), Ruanda-Urundi (modern Rwanda and Burundi).'
  },
  NETHERLANDS: {
    id: 'NETHERLANDS',
    name: 'Kingdom of the Netherlands',
    shortName: 'Netherlands',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#ea580c', // Nassau Orange
    capital: { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, iso: '528' },
    peakArea: '2.1M km² (Dutch East Indies & Caribbean)',
    activeYears: [1899, 1957],
    summary: 'Consolidated control over the vast Indonesian archipelago (completing the Aceh War in the early 1900s). After Japanese occupation during WWII, the Netherlands launched major military "Politionele Acties" (1945–1949) to crush the Indonesian Republic before transferring sovereignty in December 1949.',
    conflicts: [
      'Aceh War (1873–1904) & Dutch intervention in Bali (1906–1908)',
      'Indonesian National Revolution & "Police Actions" (1945–1949)',
      'West New Guinea Dispute (1950–1962)'
    ],
    status1957: 'Having lost Indonesia in 1949, the Netherlands retains Dutch New Guinea (West Papua), Suriname (Dutch Guiana), and the Netherlands Antilles.',
    keyTerritories: 'Dutch East Indies (Indonesia), Dutch New Guinea, Suriname, Curaçao and Dependencies.'
  },
  PORTUGAL: {
    id: 'PORTUGAL',
    name: 'Portuguese Republic / Estado Novo',
    shortName: 'Portugal',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#10b981', // Lusitanian Emerald
    capital: { name: 'Lisbon', lat: 38.7223, lng: -9.1393, iso: '620' },
    peakArea: '2.1M km² (Lusophone Africa & Asia)',
    activeYears: [1899, 1957],
    summary: 'Europe’s oldest continuous colonial empire. Under António de Oliveira Salazar’s authoritarian Estado Novo regime, Lisbon rejected post-WWII decolonization entirely, legally reclassifying its colonies in 1951 as "Overseas Provinces" (Províncias Ultramarinas) integral to metropolitan Portugal.',
    conflicts: [
      'Pacification Campaigns in Angola & Mozambique (1895–1917)',
      'Batepá Massacre in São Tomé (1953)',
      'Preparation for the Portuguese Colonial Wars (erupting 1961–1974)'
    ],
    status1957: 'Categorically refuses any path to independence; retains Angola, Mozambique, Portuguese Guinea, Cape Verde, São Tomé & Príncipe, Portuguese India (Goa), Macau, and Portuguese Timor.',
    keyTerritories: 'Angola, Mozambique, Portuguese Guinea (Guinea-Bissau), Cape Verde, Goa, East Timor.'
  },
  SPAIN: {
    id: 'SPAIN',
    name: 'Kingdom of Spain / Francoist State',
    shortName: 'Spain',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#eab308', // Castilian Gold/Ochre
    capital: { name: 'Madrid', lat: 40.4168, lng: -3.7038, iso: '724' },
    peakArea: '0.35M km² (North & West African Possessions)',
    activeYears: [1899, 1957],
    summary: 'After losing Cuba, Puerto Rico, and the Philippines to the United States in 1898, Spain pivoted its imperial ambitions toward Northwest and Equatorial Africa, fighting the fierce Rif War in the 1920s and retaining Sahara and Guinea under Francisco Franco.',
    conflicts: [
      'Rif War in Spanish Morocco (1920–1927) — Heavy use of chemical weapons',
      'Ifni War (1957–1958) — Colonial conflict in Spanish Sahara & Ifni'
    ],
    status1957: 'Relinquished its northern Moroccan protectorate in 1956, but holds Spanish Sahara (Western Sahara), Spanish Guinea (Equatorial Guinea), and Ifni.',
    keyTerritories: 'Spanish Sahara (Western Sahara), Spanish Guinea (Equatorial Guinea), Spanish Protectorate in Morocco.'
  },
  USA: {
    id: 'USA',
    name: 'United States of America',
    shortName: 'United States',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Power',
    color: '#06b6d4', // Pacific Cyan
    capital: { name: 'Washington, D.C.', lat: 38.9072, lng: -77.0369, iso: '840' },
    peakArea: '9.8M km² + Pacific & Caribbean Dependencies',
    activeYears: [1899, 1957],
    summary: 'Entered overseas colonial administration following the Spanish-American War (1898). From 1899 to 1902, the U.S. waged the Philippine-American War to establish sovereignty over the Philippines, while administering Puerto Rico, Guam, Hawaii, American Samoa, the Panama Canal Zone, and post-WWII Pacific Trust Territories.',
    conflicts: [
      'Philippine-American War (1899–1902) & Moro Rebellion (1899–1913)',
      'Banana Wars & Caribbean Protectorate Occupations (Cuba, Haiti, Dominican Republic, Nicaragua, 1899–1934)'
    ],
    status1957: 'Granted independence to the Philippines on July 4, 1946; retains Puerto Rico, Guam, US Virgin Islands, Panama Canal Zone, and UN Trust Territory of the Pacific Islands.',
    keyTerritories: 'Philippines (until 1946), Puerto Rico, Cuba (Protectorate 1899–1902), Panama Canal Zone, Guam, Pacific Trust Territories.'
  },
  JAPAN: {
    id: 'JAPAN',
    name: 'Empire of Japan (Dai-Nippon Teikoku)',
    shortName: 'Empire of Japan',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#f43f5e', // Rising Sun Vermilion
    capital: { name: 'Tokyo', lat: 35.6762, lng: 139.6503, iso: '392' },
    peakArea: '7.4M km² (1942 Greater East Asia Co-Prosperity Sphere)',
    activeYears: [1899, 1945],
    summary: 'The only non-Western industrial empire of the era. Already ruling Taiwan (1895), Japan annexed Korea (1910), gained German Pacific islands at Versailles (1919), seized Manchuria (1931), and between 1941 and 1945 displaced Western empires across Southeast Asia before total defeat in August 1945.',
    conflicts: [
      'Russo-Japanese War (1904–1905) & Annexation of Korea (1910)',
      'Invasion of Manchuria (1931) & Second Sino-Japanese War (1937–1945)',
      'Pacific Theater & Occupation of SE Asia (1941–1945)'
    ],
    status1957: 'Stripped of all overseas colonial possessions in 1945 via the Potsdam Declaration and Treaty of San Francisco (1951).',
    keyTerritories: 'Taiwan (Formosa), Korea, Manchukuo, South Seas Mandate, and wartime occupation of Philippines, Dutch East Indies, Malaya, Burma, Indochina (1942–1945).'
  },
  ITALY: {
    id: 'ITALY',
    name: 'Kingdom of Italy / Trust Administration',
    shortName: 'Italy',
    phase: 1,
    phaseLabel: 'Phase 1: Major Global Colonial Empire',
    color: '#8b5cf6', // Savoy Purple
    capital: { name: 'Rome', lat: 41.9028, lng: 12.4964, iso: '380' },
    peakArea: '3.8M km² (1939 Italian Empire)',
    activeYears: [1899, 1957],
    summary: 'Held Eritrea and Italian Somaliland in 1899, seized Libya from the Ottomans (1911–12), and under Benito Mussolini invaded and annexed Ethiopia (1935–36) to proclaim Italian East Africa. Stripped of its empire in WWII, Italy was uniquely granted a 10-year UN Trusteeship over Somalia (1950–1960).',
    conflicts: [
      'Italo-Turkish War (1911–1912) & Senussi Pacification in Libya (1923–1932)',
      'Second Italo-Ethiopian War (1935–1937) — Mustard gas & Addis Ababa reprisals',
      'Invasion of Albania (1939)'
    ],
    status1957: 'Lost Libya, Eritrea, and Ethiopia after WWII, but in March 1957 actively administers the Trust Territory of Somaliland under UN mandate (until 1960).',
    keyTerritories: 'Libya, Eritrea, Italian Somaliland (Somalia), Ethiopia (1936–1941), Albania (1939–1943).'
  },
  SOUTH_AFRICA: {
    id: 'SOUTH_AFRICA',
    name: 'Union of South Africa',
    shortName: 'Union of South Africa',
    phase: 2,
    phaseLabel: 'Phase 2: Dominion & Settler-Colonial Participant',
    color: '#fb7185', // Dominion Rose-Coral
    capital: { name: 'Pretoria', lat: -25.7479, lng: 28.2293, iso: '710' },
    peakArea: '2.04M km² (including South West Africa)',
    activeYears: [1910, 1957],
    summary: 'Formed in 1910 out of the British Cape/Natal colonies and defeated Boer republics. Operated an internal minority settler-colonial regime (codified as Apartheid in 1948) and ruled former German South West Africa (Namibia) as a Class C Mandate, defying the UN to annex it de facto.',
    conflicts: [
      'Bambatha Rebellion (1906) & Rand Rebellion (1922)',
      'South West Africa Campaign (1914–1915) & Bondelswarts Uprising (1922)',
      'Codification of Apartheid & Defiance Campaign Suppression (1948–1957)'
    ],
    status1957: 'Entrenched Apartheid state within the British Commonwealth, maintaining colonial rule over South West Africa (Namibia).',
    keyTerritories: 'Union of South Africa (Internal Settler-Colonial State), South West Africa (Namibia Mandate).'
  },
  AUSTRALIA: {
    id: 'AUSTRALIA',
    name: 'Commonwealth of Australia',
    shortName: 'Australia',
    phase: 2,
    phaseLabel: 'Phase 2: Dominion & Settler-Colonial Participant',
    color: '#f97316', // Southern Ochre
    capital: { name: 'Canberra', lat: -35.2809, lng: 149.1300, iso: '036' },
    peakArea: '8.15M km² (including Papua & New Guinea)',
    activeYears: [1901, 1957],
    summary: 'Federated as a self-governing British Dominion in 1901. Assumed colonial administration over British New Guinea (Territory of Papua) in 1906 and seized German New Guinea in 1914, governing the eastern half of New Guinea and Nauru under League of Nations and UN Trusteeship.',
    conflicts: [
      'Boer War Contingent Participation (1899–1902)',
      'Occupation of German New Guinea (1914)',
      'Malayan Emergency Military Deployment (1950–1960)'
    ],
    status1957: 'Actively governs the Territory of Papua and New Guinea and co-administers Nauru under UN Trusteeship.',
    keyTerritories: 'Territory of Papua and New Guinea (Papua New Guinea), Nauru.'
  },
  NEW_ZEALAND: {
    id: 'NEW_ZEALAND',
    name: 'Dominion of New Zealand',
    shortName: 'New Zealand',
    phase: 2,
    phaseLabel: 'Phase 2: Dominion & Settler-Colonial Participant',
    color: '#38bdf8', // Tasman Sky
    capital: { name: 'Wellington', lat: -41.2866, lng: 174.7756, iso: '554' },
    peakArea: '0.27M km² (including Pacific Island Dependencies)',
    activeYears: [1901, 1957],
    summary: 'A self-governing British Dominion that annexed the Cook Islands and Niue (1901) and captured German Samoa in August 1914, administering Western Samoa as a League Mandate and UN Trust Territory until 1962.',
    conflicts: [
      'First overseas contingent deployed to the Second Boer War (1899)',
      'Suppression of the Mau Movement in Western Samoa ("Black Saturday", 1929)'
    ],
    status1957: 'Administers Western Samoa (UN Trust Territory), Cook Islands, Niue, and Tokelau.',
    keyTerritories: 'Western Samoa, Cook Islands, Niue, Tokelau.'
  },
  GERMANY: {
    id: 'GERMANY',
    name: 'German Empire / Third Reich',
    shortName: 'Germany',
    phase: 3,
    phaseLabel: 'Phase 3: Historical Stakes & Contiguous Ambitions',
    color: '#a855f7', // Prussian Violet
    capital: { name: 'Berlin', lat: 52.5200, lng: 13.4050, iso: '276' },
    peakArea: '3.2M km² (1914 Overseas Schutzgebiete)',
    activeYears: [1899, 1945],
    summary: 'Held the third-largest African empire in 1899–1914 (German East Africa, South West Africa, Kamerun, Togoland) plus Pacific holdings. Stripped of all overseas colonies via Article 119 of the Treaty of Versailles (1919). Under the Nazi regime (1933–1945), pursued a violent continental racial-colonial empire in Eastern Europe (Generalplan Ost).',
    conflicts: [
      'Herero and Nama Genocide in German South West Africa (1904–1908)',
      'Maji Maji Rebellion in German East Africa (1905–1907)',
      'Boxer Rebellion Expedition in China (1900–1901)',
      'WWII Continental Colonialism / Generalplan Ost (1939–1945)'
    ],
    status1957: 'Divided into West and East Germany; overseas colonies lost in 1919 and Nazi continental empire defeated in 1945.',
    keyTerritories: 'German East Africa (Tanganyika/Rwanda/Burundi), South West Africa (Namibia), Kamerun (Cameroon), Togoland, German New Guinea.'
  },
  RUSSIA_USSR: {
    id: 'RUSSIA_USSR',
    name: 'Tsarist Russia / Soviet Union',
    shortName: 'Russia / USSR',
    phase: 3,
    phaseLabel: 'Phase 3: Contiguous Empire & Geopolitical Alignment',
    color: '#991b1b', // Contiguous Carmine
    capital: { name: 'Moscow', lat: 55.7558, lng: 37.6173, iso: '643' },
    peakArea: '22.4M km² (Contiguous Eurasian Landmass)',
    activeYears: [1899, 1957],
    summary: 'Operated a vast contiguous continental empire across Central Asia, the Caucasus, and Siberia. While the post-1917 Soviet Union championed anti-colonial movements rhetorically to weaken Western empires, it re-integrated Tsarism’s Central Asian/Caucasian periphery and enforced imperial hegemony over its Eastern European satellite bloc (crushing the 1956 Hungarian Revolution).',
    conflicts: [
      'Russo-Japanese War over Manchuria & Korea (1904–1905)',
      'Central Asian Revolt of 1916 & Basmachi Movement (1916–1934)',
      'Soviet Annexation of Baltic States (1940) & Hungarian Intervention (1956)'
    ],
    status1957: 'Superpower patron of anti-Western decolonization in Asia/Africa while maintaining strict hegemony over Soviet Republics and Warsaw Pact satellites.',
    keyTerritories: 'Central Asia (Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, Tajikistan), Caucasus, Baltic States, Eastern Bloc Sphere.'
  },
  DENMARK: {
    id: 'DENMARK',
    name: 'Kingdom of Denmark',
    shortName: 'Denmark',
    phase: 3,
    phaseLabel: 'Phase 3: Historical Stakes & Realm Integration',
    color: '#14b8a6', // Nordic Teal
    capital: { name: 'Copenhagen', lat: 55.6761, lng: 12.5683, iso: '208' },
    peakArea: '2.2M km² (Greenland & North Atlantic)',
    activeYears: [1899, 1957],
    summary: 'Maintained colonial sovereignty over Greenland, Iceland (until 1918/1944), the Faroe Islands, and the Danish West Indies (sold to the United States in 1917 as the U.S. Virgin Islands). In 1953, Denmark amended its constitution to formally reclassify Greenland from a colony into an integrated county (amt) of the Danish Realm.',
    conflicts: [
      'Sale of Danish West Indies Treaty (1917)',
      'East Greenland Case vs. Norway at Permanent Court of International Justice (1933)'
    ],
    status1957: 'Maintains sovereignty over Greenland (integrated 1953) and the Faroe Islands.',
    keyTerritories: 'Greenland, Iceland (until 1944), Faroe Islands, Danish West Indies (until 1917).'
  }
};

IMP.EPOCHS = [
  {
    start: 1899,
    end: 1913,
    badge: '1899–1913',
    title: "The Last Gentleman's War & High Imperialism",
    desc: "Opening on Oct 11, 1899 with the Second Boer War in South Africa and the Philippine-American War, European powers, the U.S., and Japan partition almost the entire globe."
  },
  {
    start: 1914,
    end: 1918,
    badge: '1914–1918',
    title: "The Great War & Colonial Mobilization",
    desc: "Over 4 million colonial troops and laborers are mobilized across Africa, Asia, and the Middle East as Allied powers seize German colonies in Africa and the Pacific."
  },
  {
    start: 1919,
    end: 1936,
    badge: '1919–1936',
    title: "Treaty of Versailles & League of Nations Mandates",
    desc: "Germany and the Ottoman Empire are stripped of territories, which are partitioned as Class A, B, and C Mandates to Britain, France, Belgium, South Africa, Australia, New Zealand, and Japan."
  },
  {
    start: 1937,
    end: 1944,
    badge: '1937–1944',
    title: "Axis Expansion & Contested Global Empires",
    desc: "Imperial Japan sweeps across East and Southeast Asia, Mussolini's Italy occupies Ethiopia and Albania, and Nazi Germany attempts continental colonization in Eastern Europe."
  },
  {
    start: 1945,
    end: 1950,
    badge: '1945–1950',
    title: "Post-WWII Realignment & Asian Decolonization Wave",
    desc: "Japan and Italy lose their empires. The Philippines (1946), India & Pakistan (1947), Burma & Ceylon (1948), and Indonesia (1949) win independence while Europe clings tightly to Africa."
  },
  {
    start: 1951,
    end: 1956,
    badge: '1951–1956',
    title: "Late Colonial Wars & The Bandung Spirit",
    desc: "France falls at Dien Bien Phu (1954) as the Algerian War and Kenyan Mau Mau Uprising rage. The 1955 Bandung Conference unites newly sovereign Asian and African nations."
  },
  {
    start: 1957,
    end: 1957,
    badge: 'MARCH 6, 1957',
    title: "The Ghana Threshold: Dawn of African Liberation",
    desc: "On March 6, 1957, the British Gold Coast becomes independent Ghana under Kwame Nkrumah—shattering the colonial seal in Sub-Saharan Africa while UK, France, Belgium, and Portugal still rule the continent."
  }
];

IMP.BEACONS = [
  {
    id: 'accra',
    name: 'ACCRA, GOLD COAST (GHANA)',
    lat: 5.5600,
    lng: -0.2057,
    years: [1899, 1957],
    highlightYear: 1957,
    color: '#fbbf24',
    note: 'March 6, 1957: Kwame Nkrumah proclaims the independence of Ghana—the symbolic floodgate of Sub-Saharan African decolonization.'
  },
  {
    id: 'pretoria',
    name: 'PRETORIA / WITWATERSRAND',
    lat: -25.7479,
    lng: 28.2293,
    years: [1899, 1910],
    highlightYear: 1899,
    color: '#e11d48',
    note: '1899–1902: Theater of the Second Boer War ("The Last Gentleman\'s War").'
  },
  {
    id: 'versailles',
    name: 'VERSAILLES / BERLIN',
    lat: 48.8049,
    lng: 2.1204,
    years: [1919, 1925],
    highlightYear: 1920,
    color: '#d4af37',
    note: '1919–1920: Article 22 of the League Covenant partitions German & Ottoman territories into Class A, B, and C Mandates.'
  },
  {
    id: 'delhi',
    name: 'NEW DELHI, INDIA',
    lat: 28.6139,
    lng: 77.2090,
    years: [1945, 1950],
    highlightYear: 1947,
    color: '#fbbf24',
    note: 'August 1947: End of the British Raj and birth of independent India and Pakistan.'
  },
  {
    id: 'jakarta',
    name: 'JAKARTA / BANDUNG, INDONESIA',
    lat: -6.9175,
    lng: 107.6191,
    years: [1945, 1957],
    highlightYear: 1955,
    color: '#fbbf24',
    note: '1949 Sovereignty & April 1955 Bandung Conference uniting 29 Asian and African nations against colonialism.'
  },
  {
    id: 'dienbienphu',
    name: 'ĐIỆN BIÊN PHỦ, INDOCHINA',
    lat: 21.3860,
    lng: 103.0230,
    years: [1946, 1956],
    highlightYear: 1954,
    color: '#2563eb',
    note: 'May 7, 1954: Decisive Viet Minh victory ends French colonial rule in Indochina.'
  },
  {
    id: 'algiers',
    name: 'ALGIERS, FRENCH ALGERIA',
    lat: 36.7538,
    lng: 3.0588,
    years: [1954, 1957],
    highlightYear: 1954,
    color: '#2563eb',
    note: '1954–1962: Epicenter of the Algerian War of Independence.'
  },
  {
    id: 'nairobi',
    name: 'NAIROBI, KENYA COLONY',
    lat: -1.2921,
    lng: 36.8219,
    years: [1952, 1957],
    highlightYear: 1954,
    color: '#e11d48',
    note: '1952–1960: British colonial counter-insurgency against the Mau Mau Uprising.'
  },
  {
    id: 'leopoldville',
    name: 'LÉOPOLDVILLE, BELGIAN CONGO',
    lat: -4.4419,
    lng: 15.2663,
    years: [1899, 1957],
    highlightYear: 1914,
    color: '#d97706',
    note: 'Administrative capital of the Belgian Congo throughout the early and mid-20th century.'
  }
];

/* ============================================================
   EXTENSIONS — contiguous empires of the 1899 map
   (no overseas colonies, but on 31 Dec 1899 they rule Iraq,
   Syria, Bosnia, Bohemia, Tibet's suzerain claim and more — a
   sovereignty layer that left them out would be wrong.)
   ============================================================ */
Object.assign(IMP.EMPIRES, {
  OTTOMAN: {
    id: 'OTTOMAN',
    name: 'Ottoman Empire (Devlet-i Âliye)',
    shortName: 'Ottoman Empire',
    phase: 3,
    phaseLabel: 'Phase 3: Contiguous Empire',
    color: '#8fb339',
    capital: { name: 'Constantinople', lat: 41.0082, lng: 28.9784, iso: '792' },
    peakArea: '~3.0M km² in 1899 (Anatolia, Levant, Mesopotamia, Hejaz, Tripolitania)',
    activeYears: [1899, 1922],
    summary: 'In 1899 still the largest Muslim state on earth, ruling Anatolia, the Arab provinces from Basra to Jerusalem, the Hejaz with Mecca and Medina, Albania and Macedonia, and Tripolitania. It lost Libya to Italy (1911–12), nearly all of Europe in the Balkan Wars (1912–13), and the Arab provinces in the First World War — whose partition became the League mandates. The sultanate was abolished on 1 November 1922.',
    conflicts: [
      'Italo-Turkish War (1911–1912) — loss of Tripolitania & Cyrenaica',
      'Balkan Wars (1912–1913) — loss of Macedonia, Albania, Thrace',
      'Armenian Genocide (1915–1917)',
      'Arab Revolt (1916–1918) & Sinai–Palestine and Mesopotamian campaigns'
    ],
    status1957: 'Dissolved in 1922; succeeded by the Republic of Turkey (proclaimed 29 October 1923). Its Arab provinces passed through British and French mandates to the independent states of 1932–1948.',
    keyTerritories: 'Anatolia, Iraq (Baghdad, Basra, Mosul vilayets), Syria, Lebanon, Palestine, Transjordan, Hejaz, Yemen, Tripolitania (to 1912), Albania & Macedonia (to 1912).'
  },
  AUSTRIA_HUNGARY: {
    id: 'AUSTRIA_HUNGARY',
    name: 'Austro-Hungarian Monarchy',
    shortName: 'Austria-Hungary',
    phase: 3,
    phaseLabel: 'Phase 3: Contiguous Empire',
    color: '#e879f9',
    capital: { name: 'Vienna', lat: 48.2082, lng: 16.3738, iso: '040' },
    peakArea: '~0.68M km² (1914)',
    activeYears: [1899, 1918],
    summary: 'The Dual Monarchy of 1867 ruled a dozen nationalities from Bohemia to Bosnia. It occupied Bosnia-Herzegovina in 1878 and annexed it in 1908, setting the stage for the assassination at Sarajevo (28 June 1914). It broke apart in October–November 1918 into Austria, Hungary, Czechoslovakia and the Kingdom of Serbs, Croats and Slovenes.',
    conflicts: [
      'Bosnian Annexation Crisis (1908–1909)',
      'July Crisis & the First World War (1914–1918)'
    ],
    status1957: 'Dissolved in 1918. Austria, under four-power occupation until the State Treaty of 1955, is a neutral republic; Hungary is a Soviet satellite whose 1956 revolution was crushed.',
    keyTerritories: 'Austria, Bohemia & Moravia, Slovakia & Hungary, Galicia, Transylvania, Croatia-Slavonia, Slovenia, Bosnia-Herzegovina (from 1878/1908).'
  },
  QING: {
    id: 'QING',
    name: 'Great Qing',
    shortName: 'Qing China',
    phase: 3,
    phaseLabel: 'Phase 3: Contiguous Empire',
    color: '#fde047',
    capital: { name: 'Beijing', lat: 39.9042, lng: 116.4074, iso: '156' },
    peakArea: '~11.4M km² (claimed, incl. Mongolia & Tibet)',
    activeYears: [1899, 1912],
    summary: 'A Manchu dynasty ruling China, Manchuria, Mongolia and Xinjiang and claiming Tibet — and simultaneously a target of informal empire: treaty ports, foreign concessions and leased territories (Hong Kong’s New Territories, Weihaiwei, Kiautschou, Kwantung). The Boxer War (1899–1901) ended in an indemnity; the Xinhai Revolution ended the dynasty on 12 February 1912.',
    conflicts: [
      'Boxer Rebellion & Eight-Nation intervention (1899–1901)',
      'Russian occupation of Manchuria (1900–1905)',
      'Xinhai Revolution (1911–1912)'
    ],
    status1957: 'Gone since 1912. The Republic of China, driven to Taiwan in 1949, faces the People’s Republic proclaimed in Beijing on 1 October 1949.',
    keyTerritories: 'China proper, Manchuria, Inner & Outer Mongolia (to 1911), Xinjiang, suzerainty over Tibet (to 1912).'
  }
});

/* Atlas-era predecessors of each power (ids in js/data/atlas.*.js).
   Drives colour continuity across the 1899 handoff, command arcs
   before 1899, and the "Before 1899" block of the empire dossier.
   Only list a polity here if it should wear the power's colour for its
   whole life — Scotland (843–1707) was a rival kingdom, so it is left out. */
Object.assign(IMP.EMPIRES.UK,            { atlas: ['england', 'cape_br', 'br_egypt', 'br_nigeria', 'goldcoast', 'braj', 'brmalaya', 'brburma', 'brna'] });
Object.assign(IMP.EMPIRES.FRANCE,        { atlas: ['france', 'stdomingue', 'fr_algeria', 'fwa', 'frindo'] });
Object.assign(IMP.EMPIRES.BELGIUM,       { atlas: ['cfs'] });
Object.assign(IMP.EMPIRES.NETHERLANDS,   { atlas: ['dutch', 'dutch_br', 'cape_nl', 'vocdei'] });
Object.assign(IMP.EMPIRES.PORTUGAL,      { atlas: ['portugal', 'brazil_col', 'pt_angola', 'pt_moz'] });
Object.assign(IMP.EMPIRES.SPAIN,         { atlas: ['spain', 'vr_peru', 'vr_ng', 'vr_rp', 'newspain', 'spphil'] });
Object.assign(IMP.EMPIRES.USA,           { atlas: ['usa', 'usphil'] });
Object.assign(IMP.EMPIRES.JAPAN,         { atlas: ['meiji', 'chosen'] });
Object.assign(IMP.EMPIRES.ITALY,         { atlas: ['sardinia'] });
Object.assign(IMP.EMPIRES.GERMANY,       { atlas: ['prussia', 'german_af'] });
Object.assign(IMP.EMPIRES.RUSSIA_USSR,   { atlas: ['muscovy', 'rusemp', 'rusalaska'] });
Object.assign(IMP.EMPIRES.OTTOMAN,       { atlas: ['ottoman', 'ottoman_na'] });
Object.assign(IMP.EMPIRES.AUSTRIA_HUNGARY,{ atlas: ['habsburg'] });
Object.assign(IMP.EMPIRES.QING,          { atlas: ['qing'] });

IMP.PHASES = {
  1: 'Phase 1: The major global colonial powers holding overseas empires across Africa, Asia, the Pacific & Caribbean.',
  2: 'Phase 2: Self-governing British Dominions maintaining domestic settler-colonial systems and external mandates.',
  3: 'Phase 3: Powers with pre-1919 colonial stakes, Axis continental ambitions, or contiguous Eurasian empires (Russia, Ottoman, Habsburg, Qing).'
};
