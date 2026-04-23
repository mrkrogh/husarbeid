// ═══════════════════════════════════════════════════════
//  HUSARBEIDSPLAN — FELLES DATAKILDEFIL
//  Rediger kun denne filen for å oppdatere datoer.
//  Både index.html og logg.html henter data herfra.
// ═══════════════════════════════════════════════════════

const HUSPLAN = {

  // ── HANDLE PÅ GRØNLAND ──
  // start: første dato i serien (DD.MM.YYYY)
  // interval: antall dager mellom hver gang
  gronland: {
    isaac:   { start: '01.05.2026', interval: 14 },
    lucy:    { start: '08.05.2026', interval: 14 },
    sabela:  { start: '08.05.2026', interval: 14 },
    genesis: { start: '01.05.2026', interval: 14 },
  },

  // ── VASKE BADET ──
  // start: første dato i serien (DD.MM.YYYY)
  // interval: antall dager mellom hver gang (28 = annenhver uke med partner)
  // firstLabel: oppgaven den FØRSTE gangen ("dusjen" eller "speilet")
  //             Neste gang blir automatisk den andre, så veksler det i all evighet.
  bad: {
    isaac:   { start: '26.04.2026', interval: 28, firstLabel: 'dusjen'  },
    lucy:    { start: '26.04.2026', interval: 28, firstLabel: 'speilet' },
    sabela:  { start: '10.05.2026', interval: 28, firstLabel: 'speilet' },
    genesis: { start: '10.05.2026', interval: 28, firstLabel: 'dusjen'  },
  },

  // ── LESBARE NAVN ──
  navn: {
    isaac:   'Isaac',
    lucy:    'Lucy',
    sabela:  'Sabela',
    genesis: 'Genesis',
  },

  // ── OPPGAVEBESKRIVELSER ──
  labels: {
    dusjen:  'Dusjen osv.',
    speilet: 'Speilet osv.',
  },
};


// ═══════════════════════════════════════════════════════
//  HJELPEFUNKSJONER — brukes av både index.html og logg.html
// ═══════════════════════════════════════════════════════

function parseDate(str) {
  const [d, m, y] = str.split('.').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function formatDate(date) {
  return String(date.getUTCDate()).padStart(2, '0') + '.' +
         String(date.getUTCMonth() + 1).padStart(2, '0') + '.' +
         date.getUTCFullYear();
}

function getToday() {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate(), 12, 0, 0));
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

// Generates all bad-entries for a person from start and onwards,
// up to (but not including) `untilDate`. If untilDate is null, generates forever
// until `maxCount` entries.
function generateBadEntries(person, untilDate, maxCount) {
  const cfg = HUSPLAN.bad[person];
  const labels = ['dusjen', 'speilet'];
  const firstIdx = labels.indexOf(cfg.firstLabel);

  let cursor = parseDate(cfg.start);
  let i = 0;
  const entries = [];

  while (true) {
    if (untilDate && cursor >= untilDate) break;
    if (!untilDate && entries.length >= maxCount) break;

    entries.push({
      date: new Date(cursor),
      dateStr: formatDate(cursor),
      label: labels[(firstIdx + i) % 2],
    });

    cursor = addDays(cursor, cfg.interval);
    i++;
  }
  return entries;
}

// Generates all gronland-entries for a person from start up to untilDate,
// or maxCount entries if untilDate is null.
function generateGronlandEntries(person, untilDate, maxCount) {
  const cfg = HUSPLAN.gronland[person];
  let cursor = parseDate(cfg.start);
  const entries = [];

  while (true) {
    if (untilDate && cursor >= untilDate) break;
    if (!untilDate && entries.length >= maxCount) break;

    entries.push({
      date: new Date(cursor),
      dateStr: formatDate(cursor),
    });

    cursor = addDays(cursor, cfg.interval);
  }
  return entries;
}
