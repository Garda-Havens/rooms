/* ==========================================================================
   CALENDARIO – Garda Havens
   Sostituisce il calendario del browser con uno nello stile del sito.
   Usato nella pagina Camere (prezzi) e nel modulo Prenota (check-in/out).

   GHCalendar.attach(input, opzioni) trasforma un <input type="date"> in un
   pulsante con calendario. L'input resta nel modulo (nascosto) e contiene
   sempre la data in formato AAAA-MM-GG, quindi il resto del codice non cambia.

   opzioni:
     theme:       "dark" | "light"
     placeholder: testo quando non c'è data
     min():       prima data scegliibile (default oggi)
     range():     [inizio, fine] da evidenziare (es. check-in → check-out)
     marks(iso):  true = puntino dorato (alta stagione / festività)
     dim(iso):    true = giorno più chiaro (es. oltre il listino)
     legend:      testo della legenda del puntino (vuoto = niente legenda)
     onChange(iso)
   ========================================================================== */
(function (root) {
  var IT = (document.documentElement.lang || "").indexOf("it") === 0;
  var MONTHS = IT
    ? ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var WDAYS = IT ? ["L","M","M","G","V","S","D"] : ["M","T","W","T","F","S","S"];
  var WDAYS_LONG = IT ? ["dom","lun","mar","mer","gio","ven","sab"] : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoOf(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }
  function todayISO() { var t = new Date(); return isoOf(t.getFullYear(), t.getMonth(), t.getDate()); }
  function label(iso) {
    var p = iso.split("-").map(Number);
    var wd = WDAYS_LONG[new Date(p[0], p[1] - 1, p[2]).getDay()];
    return IT ? wd + " " + p[2] + " " + MONTHS[p[1] - 1] + " " + p[0]
              : wd + ", " + MONTHS[p[1] - 1] + " " + p[2] + ", " + p[0];
  }

  var all = [];
  function closeAll(except) { all.forEach(function (c) { if (c !== except) c.close(); }); }
  document.addEventListener("click", function () { closeAll(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(null); });

  function attach(input, o) {
    o = o || {};
    var min = o.min || todayISO;
    var theme = o.theme || "light";

    // Struttura: <div.gh-date> <button.gh-date-btn> <div.gh-cal> + input nascosto
    var wrap = document.createElement("div");
    wrap.className = "gh-date gh-date--" + theme;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gh-date-btn";
    btn.id = (input.id || "gh-date") + "-btn";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    var box = document.createElement("div");
    box.className = "gh-cal";
    box.hidden = true;
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(btn);
    wrap.appendChild(box);
    wrap.appendChild(input);
    var required = input.required;
    input.type = "hidden";
    input.required = false;
    if (input.id) {
      var lbl = document.querySelector('label[for="' + input.id + '"]');
      if (lbl) lbl.htmlFor = btn.id;
    }

    var shown = null; // { y, m }

    function paintBtn() {
      btn.innerHTML = '<i class="far fa-calendar-alt"></i> ' +
        (input.value ? label(input.value) : '<span class="gh-date-ph">' + (o.placeholder || "") + "</span>");
      wrap.classList.toggle("gh-date--empty", !input.value);
    }

    function render() {
      var y = shown.y, m = shown.m, lo = min(), rg = o.range ? o.range() : null;
      var offset = (new Date(y, m, 1).getDay() + 6) % 7; // lunedì = 0
      var days = new Date(y, m + 1, 0).getDate();
      var prevOff = isoOf(y, m, 1).slice(0, 7) <= lo.slice(0, 7);
      var h = "";
      for (var i = 0; i < offset; i++) h += "<span></span>";
      for (var d = 1; d <= days; d++) {
        var iso = isoOf(y, m, d), cls = ["gh-cal-day"], off = iso < lo;
        if (off) cls.push("past");
        else if (o.dim && o.dim(iso)) cls.push("later");
        else if (o.marks && o.marks(iso)) cls.push("peak");
        if (iso === todayISO()) cls.push("today");
        if (rg && rg[0] && rg[1] && iso > rg[0] && iso < rg[1]) cls.push("in-range");
        if (rg && (iso === rg[0] || iso === rg[1])) cls.push("edge");
        if (iso === input.value) cls.push("sel");
        h += '<button type="button" class="' + cls.join(" ") + '" data-d="' + iso + '"' + (off ? " disabled" : "") + ">" + d + "</button>";
      }
      for (var j = offset + days; j < 42; j++) h += "<span></span>"; // sempre 6 righe: altezza fissa
      box.innerHTML =
        '<div class="gh-cal-head">' +
          '<button type="button" class="gh-cal-nav" data-nav="-1"' + (prevOff ? " disabled" : "") + ' aria-label="' + (IT ? "Mese precedente" : "Previous month") + '">&#8249;</button>' +
          "<span>" + MONTHS[m] + " " + y + "</span>" +
          '<button type="button" class="gh-cal-nav" data-nav="1" aria-label="' + (IT ? "Mese successivo" : "Next month") + '">&#8250;</button>' +
        "</div>" +
        '<div class="gh-cal-grid">' + WDAYS.map(function (w) { return '<span class="gh-cal-wd">' + w + "</span>"; }).join("") + h + "</div>" +
        (o.legend ? '<div class="gh-cal-legend"><span class="gh-cal-dot"></span>' + o.legend + "</div>" : "");
    }

    var api = {
      input: input,
      button: btn,
      get value() { return input.value; },
      set: function (iso, silent) {
        input.value = iso || "";
        paintBtn();
        if (!silent && o.onChange) o.onChange(input.value);
      },
      open: function (iso) {
        closeAll(api);
        var start = (iso || input.value || min()).split("-").map(Number);
        shown = { y: start[0], m: start[1] - 1 };
        render();
        box.hidden = false;
        btn.setAttribute("aria-expanded", "true");
      },
      close: function () {
        if (box.hidden) return;
        box.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      },
      isOpen: function () { return !box.hidden; },
      required: required
    };

    btn.addEventListener("click", function (e) { e.stopPropagation(); api.isOpen() ? api.close() : api.open(); });
    box.addEventListener("click", function (e) {
      e.stopPropagation();
      var nav = e.target.closest("[data-nav]");
      if (nav && !nav.disabled) {
        var d = new Date(shown.y, shown.m + Number(nav.dataset.nav), 1);
        shown = { y: d.getFullYear(), m: d.getMonth() };
        render();
        return;
      }
      var day = e.target.closest("[data-d]");
      if (day && !day.disabled) { api.close(); api.set(day.dataset.d); }
    });

    paintBtn();
    all.push(api);
    return api;
  }

  root.GHCalendar = { attach: attach, closeAll: function () { closeAll(null); }, today: todayISO };
})(window);
