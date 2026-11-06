/* ==========================================================================
   LOGO DI STAGIONE – Garda Havens
   In base alla data di oggi mette il logo di Natale, Halloween o Pasqua
   nel corpo della pagina (home e pagine di ringraziamento), non nel menu.
   Fuori da questi periodi resta il logo normale.
   Per provarlo: aggiungi ?logo=natale (o halloween, pasqua, normale) all'indirizzo.
   ========================================================================== */
(function () {
  // Periodi: "MM-GG" vale tutti gli anni; Pasqua si calcola da sola
  var PERIODI = [
    { logo: "natale",    from: "12-01", to: "01-06" },   // 1 dicembre → Epifania
    { logo: "halloween", from: "10-01", to: "11-02" }    // ottobre (Magic Halloween a Gardaland) → 2 novembre
  ];
  var PASQUA_GIORNI_PRIMA = 14; // logo di Pasqua da 2 settimane prima fino a Pasquetta

  var FILES = {
    natale:    "logo_natale-400.png",
    halloween: "logo_halloween-400.png",
    pasqua:    "logo_pasqua-400.png"
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // Domenica di Pasqua (calendario gregoriano)
  function pasqua(Y) {
    var a = Y % 19, b = Math.floor(Y / 100), c = Y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
        M = Math.floor((h + l - 7 * m + 114) / 31), D = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Y, M - 1, D);
  }

  function logoDiOggi(oggi) {
    var md = pad(oggi.getMonth() + 1) + "-" + pad(oggi.getDate());
    for (var i = 0; i < PERIODI.length; i++) {
      var p = PERIODI[i];
      var dentro = p.from <= p.to ? (md >= p.from && md <= p.to) : (md >= p.from || md <= p.to);
      if (dentro) return p.logo;
    }
    var ps = pasqua(oggi.getFullYear());
    var inizio = new Date(ps.getFullYear(), ps.getMonth(), ps.getDate() - PASQUA_GIORNI_PRIMA);
    var fine = new Date(ps.getFullYear(), ps.getMonth(), ps.getDate() + 1); // Pasquetta
    var t = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
    if (t >= inizio && t <= fine) return "pasqua";
    return null;
  }

  var forza = (location.search.match(/[?&]logo=([a-z]+)/) || [])[1];
  var logo = forza ? (FILES[forza] ? forza : null) : logoDiOggi(new Date());
  if (!logo) return;

  // Cartella delle immagini relativa a questo script (funziona da qualsiasi pagina)
  var me = document.currentScript && document.currentScript.src;
  var dir = me ? me.replace(/[^\/]*$/, "") + "../img/loghi/" : "static/img/loghi/";
  var url = dir + FILES[logo];

  // Solo il logo nel corpo della home (riquadro WhatsApp); quello nel menu resta normale
  var css = document.createElement("style");
  css.textContent = '.wa-strip-logo .brand-logo{background-image:url("' + url + '") !important;}';
  document.head.appendChild(css);
  document.documentElement.setAttribute("data-logo", logo);

  // Logo come immagine (pagine di ringraziamento)
  document.addEventListener("DOMContentLoaded", function () {
    var imgs = document.querySelectorAll("img.thanks-logo");
    for (var i = 0; i < imgs.length; i++) imgs[i].src = url;
  });
})();
