/* ==========================================================================
   LISTINO UNICO – Garda Havens
   Usato dalla pagina Camere (rooms.html / rooms-it.html) e dal generatore.
   Per cambiare i prezzi modifica SOLO la parte "LISTINO" qui sotto.

   Come si calcola il prezzo di una notte:
     1. prezzo base della camera per quel numero di ospiti (bambini inclusi);
     2. se la notte cade in una DATA SPECIALE o in ALTA STAGIONE: prezzo base;
     3. altrimenti (bassa stagione) si applica lo sconto.
   Ogni periodo può avere  eur: -10  (€ in meno a notte, numeri tondi)
   oppure  pct: -10  (percentuale, arrotondata ai 5 €). Senza nessuno dei
   due = prezzo base.
   La "notte" è quella che inizia nel giorno indicato
   (check-in 24/12, check-out 26/12 = notti del 24 e del 25).

   Date: "MM-GG" vale tutti gli anni, "AAAA-MM-GG" vale solo quell'anno
   (utile per Pasqua, che cambia ogni anno). Un periodo può scavalcare
   l'anno, es. from "12-23" to "01-06".
   ========================================================================== */

(function (root) {

  /* ======================= LISTINO ======================= */
  var LISTINO = {

    // Prezzo base a notte (alta stagione e festività) – camera: { ospiti: € }
    rooms: {
      1: { 1: 80, 2: 90,  3: 120, 4: 150 },
      2: { 1: 90, 2: 100, 3: 120, 4: 150, 5: 170, 6: 190 },
      3: { 1: 80, 2: 90,  3: 120, 4: 150 },
      4: { 1: 80, 2: 90,  3: 120 },
      5: { 1: 80, 2: 90,  3: 120, 4: 140 },
      6: { 1: 80, 2: 90,  3: 120, 4: 140 }
    },

    rounding: 5, // arrotonda ai 5 €

    // Ultima notte prenotabile con questo listino. Dopo: "contattaci".
    validUntil: "2027-12-31",

    // Stagioni. Alta = prezzo base; bassa = sconto a notte per camera.
    seasons: [
      { it: "Alta stagione",  en: "High season", from: "06-10", to: "09-15" },
      { it: "Bassa stagione", en: "Low season",  from: "09-16", to: "06-09", eur: -20 }
    ],

    // Festività e ponti: vincono sulla stagione e applicano il prezzo base.
    // Le date indicano le NOTTI (l'ultima notte è quella prima della partenza).
    // Se due periodi si sovrappongono vale il primo dell'elenco.
    special: [
      // ---- 2026 ----
      { it: "Ponte dell'Immacolata", en: "Immaculate Conception weekend", from: "2026-12-05", to: "2026-12-08" }, // sab 5 → mar 8 compreso
      { it: "Natale e Capodanno",    en: "Christmas & New Year",          from: "2026-12-23", to: "2027-01-06" }, // fino all'Epifania (mer 6) compresa

      // ---- 2027 ----
      { it: "Pasqua",                en: "Easter",                        from: "2027-03-26", to: "2027-03-29" }, // ven 26 → lun 29 (Pasquetta) compreso
      { it: "Ponte del 25 aprile",   en: "Liberation Day weekend",        from: "2027-04-23", to: "2027-04-25" }, // 25 aprile (domenica) compreso
      { it: "Ponte del 1° maggio",   en: "May Day weekend",               from: "2027-04-30", to: "2027-05-01" }, // 1 maggio (sabato) compreso
      { it: "Ascensione",            en: "Ascension Day",                 from: "2027-05-06", to: "2027-05-08" }, // gio 6 compreso → sab 8, festa in DE/AT/CH
      { it: "Pentecoste",            en: "Whitsun / Pentecost",           from: "2027-05-14", to: "2027-05-17" }, // ven 14 → lun 17 compreso, festa in DE/AT/CH
      { it: "Corpus Domini e 2 giugno", en: "Corpus Christi & Republic Day", from: "2027-05-27", to: "2027-06-02" }, // gio 27 (DE/AT) → mer 2 giugno compreso
      { it: "Ferragosto",            en: "Ferragosto (mid-August)",       from: "2027-08-13", to: "2027-08-15" }, // 15 agosto (domenica) compreso
      { it: "Halloween e Ognissanti", en: "Halloween & All Saints",       from: "2027-10-29", to: "2027-11-01" }, // ven 29 → lun 1 novembre compreso
      { it: "Ponte dell'Immacolata", en: "Immaculate Conception weekend", from: "2027-12-04", to: "2027-12-08" }, // sab 4 → mer 8 compreso
      { it: "Natale e Capodanno",    en: "Christmas & New Year",          from: "2027-12-23", to: "2027-12-31" }  // dal 2028: "contattaci"
    ],

    // Promo a tempo: valgono per chi PRENOTA tra bookFrom e bookTo (date complete),
    // solo sulle notti tra stayFrom e stayTo (se omessi: tutte le notti).
    // pct negativo = sconto sul totale di quelle notti. active:false = spenta.
    promos: [
      // Esempio, spento: metti active: true e aggiorna le date per usarlo
      { it: "Black Friday", en: "Black Friday", active: false,
        bookFrom: "2026-11-27", bookTo: "2026-11-30",
        stayFrom: "2027-01-07", stayTo: "2027-06-14", pct: -15 }
    ]

    // Sconto più notti – INATTIVO. Per attivarlo togli i // dalla riga sotto.
    // , longStay: { minNights: 2, perNight: 10 }   // € in meno a notte per camera
  };
  /* ===================== FINE LISTINO ===================== */


  /* ---------- motore di calcolo (non serve toccarlo) ---------- */

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function parse(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function today() { var d = new Date(); return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); }

  // La data (AAAA-MM-GG) è dentro il periodo from–to?
  function inPeriod(dateISO, from, to) {
    if (from.length === 10) return dateISO >= from && dateISO <= to;
    var md = dateISO.slice(5);
    return from <= to ? (md >= from && md <= to) : (md >= from || md <= to);
  }

  function find(list, dateISO) {
    for (var i = 0; i < (list || []).length; i++) {
      if (inPeriod(dateISO, list[i].from, list[i].to)) return list[i];
    }
    return null;
  }

  function round(v) { var r = LISTINO.rounding || 1; return Math.round(v / r) * r; }

  function maxGuests(roomId) {
    var p = LISTINO.rooms[roomId];
    return p ? Math.max.apply(null, Object.keys(p).map(Number)) : 0;
  }

  // Prezzo di una notte. Ritorna null se la camera non ospita quel numero.
  function nightly(roomId, guests, dateISO) {
    var room = LISTINO.rooms[roomId];
    if (dateISO > LISTINO.validUntil) return { date: dateISO, contact: true };
    var base = room && room[guests];
    if (base == null) return null;
    var rule = find(LISTINO.special, dateISO) || find(LISTINO.seasons, dateISO);
    var price = base;
    if (rule && rule.eur) price = base + rule.eur;
    else if (rule && rule.pct) price = round(base * (1 + rule.pct / 100));
    return { date: dateISO, base: base, price: price, rule: rule };
  }

  // Preventivo per una camera.
  // opts: { roomId, guests, checkin "AAAA-MM-GG", checkout, bookedOn (default oggi) }
  function quote(opts) {
    var nights = [], d = parse(opts.checkin), end = parse(opts.checkout);
    while (d < end) {
      var n = nightly(opts.roomId, opts.guests, iso(d));
      if (!n) return { error: "guests" };       // la camera non ospita quel numero
      if (n.contact) return { error: "contact" }; // date oltre il listino

      nights.push(n);
      d = new Date(d.getTime() + 86400000);
    }
    var subtotal = nights.reduce(function (s, n) { return s + n.price; }, 0);
    var discounts = [];

    var booked = opts.bookedOn || iso(today());
    (LISTINO.promos || []).forEach(function (p) {
      if (!p.active || booked < p.bookFrom || booked > p.bookTo) return;
      var eligible = nights.filter(function (n) {
        return !p.stayFrom || inPeriod(n.date, p.stayFrom, p.stayTo);
      });
      var amount = round(eligible.reduce(function (s, n) { return s + n.price; }, 0) * -p.pct / 100);
      if (amount > 0) discounts.push({ kind: "promo", it: p.it, en: p.en, pct: p.pct, nights: eligible.length, amount: amount });
    });

    var ls = LISTINO.longStay;
    if (ls && nights.length >= ls.minNights) {
      discounts.push({ kind: "longStay", perNight: ls.perNight, it: "Sconto soggiorno lungo", en: "Long-stay discount",
                       nights: nights.length, amount: ls.perNight * nights.length });
    }

    var discount = discounts.reduce(function (s, x) { return s + x.amount; }, 0);
    return { roomId: opts.roomId, guests: opts.guests, nights: nights,
             subtotal: subtotal, discounts: discounts, total: subtotal - discount };
  }

  // Prezzi di una camera in una certa data (per la pagina Camere): { ospiti: € }
  function table(roomId, dateISO) {
    if (dateISO > LISTINO.validUntil) return null; // oltre il listino: contattaci
    var out = {}, room = LISTINO.rooms[roomId];
    Object.keys(room || {}).forEach(function (g) { out[g] = nightly(roomId, +g, dateISO).price; });
    return out;
  }

  // Elenco dei periodi (stagioni + date speciali) per mostrarli in pagina.
  function periods() {
    return (LISTINO.seasons || []).map(function (s) { return Object.assign({ kind: "season" }, s); })
      .concat((LISTINO.special || []).map(function (s) { return Object.assign({ kind: "special" }, s); }));
  }

  // Promo attive oggi (per eventuale avviso in pagina).
  function activePromos(dateISO) {
    var t = dateISO || iso(today());
    return (LISTINO.promos || []).filter(function (p) { return p.active && t >= p.bookFrom && t <= p.bookTo; });
  }

  root.GHPrices = { data: LISTINO, nightly: nightly, quote: quote, table: table,
                    maxGuests: maxGuests, periods: periods, rule: function (d) { return find(LISTINO.special, d) || find(LISTINO.seasons, d); }, activePromos: activePromos, today: function () { return iso(today()); } };
  if (typeof module !== "undefined") module.exports = root.GHPrices;

})(typeof window !== "undefined" ? window : globalThis);
