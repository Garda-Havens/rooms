// ── Photo sets — add or remove a path to change what appears in each room ──
const ROOM_PHOTOS = {
  1: [
    'static/img/camere/1/1.jpeg',
    'static/img/camere/1/2.jpeg',
    'static/img/camere/1/3.jpeg',
    'static/img/camere/1/4.jpeg',
    'static/img/camere/1/5.jpeg',
    'static/img/camere/1/6.jpeg',
    'static/img/camere/1/7.jpeg',
    'static/img/camere/1/8.jpeg',
    'static/img/camere/1/9.jpeg',
    'static/img/camere/1/10.jpeg',
    'static/img/camere/1/11.jpeg',
    'static/img/camere/1/12.jpeg',
    'static/img/camere/1/13.jpeg',
  ],
  2: [
    'static/img/camere/2/1.jpeg',
    'static/img/camere/2/2.jpeg',
    'static/img/camere/2/3.jpeg',
    'static/img/camere/2/4.jpeg',
    'static/img/camere/2/5.jpeg',
    'static/img/camere/2/6.jpeg',
    'static/img/camere/2/7.jpeg',
    'static/img/camere/2/8.jpeg',
    'static/img/camere/2/9.jpeg',
  ],
  3: [
    'static/img/camere/3/1.jpeg',
    'static/img/camere/3/2.jpeg',
    'static/img/camere/3/3.jpeg',
    'static/img/camere/3/4.jpeg',
    'static/img/camere/3/5.jpeg',
    'static/img/camere/3/6.jpeg',
    'static/img/camere/3/7.jpeg',
    'static/img/camere/3/8.jpeg',
    'static/img/camere/3/9.jpeg',
    'static/img/camere/3/10.jpeg',
    'static/img/camere/3/11.jpeg',
    'static/img/camere/3/12.jpeg',
  ],
  4: [
    'static/img/camere/4/1.jpeg',
    'static/img/camere/4/2.jpeg',
    'static/img/camere/4/3.jpeg',
    'static/img/camere/4/4.jpeg',
    'static/img/camere/4/5.jpeg',
    'static/img/camere/4/6.jpeg',
    'static/img/camere/4/7.jpeg',
    'static/img/camere/4/8.jpeg',
    'static/img/camere/4/9.jpeg',
    'static/img/camere/4/10.jpeg',
    'static/img/camere/4/11.jpeg',
    'static/img/camere/4/12.jpeg',
  ],
  5: [
    'static/img/camere/5/1.jpeg',
    'static/img/camere/5/2.jpeg',
    'static/img/camere/5/3.jpeg',
    'static/img/camere/5/4.jpeg',
    'static/img/camere/5/7.jpeg',
    'static/img/camere/5/8.jpeg',
    'static/img/camere/5/9.jpeg',
    'static/img/camere/5/10.jpeg',
    'static/img/camere/5/12.jpeg',
  ],
  6: [
    'static/img/camere/6/1.jpeg',
    'static/img/camere/6/2.jpeg',
    'static/img/camere/6/3.jpeg',
    'static/img/camere/6/4.jpeg',
    'static/img/camere/6/5.jpeg',
    'static/img/camere/6/6.jpeg',
    'static/img/camere/6/7.jpeg',
    'static/img/camere/6/8.jpeg',
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const modal    = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-image");
  const caption  = document.getElementById("caption");
  const prevBtn  = document.getElementById("prev-image");
  const nextBtn  = document.getElementById("next-image");
  const closeBtn = document.getElementById("closeModal");
  const backBtn  = document.getElementById("modal-back-btn");
  const backdrop = document.getElementById("modal-backdrop");

  if (!modal) return;

  let images  = [];
  let current = 0;

  const showImg = () => {
    modalImg.src = images[current];
    caption.textContent = `${current + 1} / ${images.length}`;
  };

  const enterPhotoMode = idx => { current = idx; showImg(); modal.classList.add("photo-mode"); };
  const exitPhotoMode  = () => modal.classList.remove("photo-mode");
  const closeModal     = () => { modal.classList.remove("open", "photo-mode"); if (window.GHCalendar) GHCalendar.closeAll(); };

  // ── Prezzi dal listino unico (static/js/prices.js) ─────────────
  const IT = (document.documentElement.lang || "").startsWith("it");
  const P = window.GHPrices;
  const dateInput = document.getElementById("modal-date");
  let currentCard = null;
  const euro = v => "€" + v;
  const range = t => {
    const v = Object.values(t);
    const lo = Math.min(...v), hi = Math.max(...v);
    return lo === hi ? euro(lo) : `${euro(lo)}–${euro(hi)}`;
  };

  // ── Calendario (static/js/gh-calendar.js) ───────────────────────
  let cal = null;
  if (P && dateInput && window.GHCalendar) {
    // Nessuna data all'apertura: i prezzi compaiono solo dopo aver scelto il giorno
    cal = GHCalendar.attach(dateInput, {
      theme: "dark",
      placeholder: IT ? "Scegli una data" : "Choose a date",
      min: P.today,
      marks: iso => { const r = P.rule(iso); return !r || !r.eur; },
      dim: iso => iso > P.data.validUntil,
      legend: IT ? "Alta stagione e festività" : "High season & holidays",
      onChange: () => { if (currentCard) renderPrices(); }
    });
  }

  function renderPrices() {
    const card = currentCard;
    const main = document.getElementById("modal-price-main");
    const period = document.getElementById("modal-price-period");
    const tableEl = document.getElementById("modal-price-table");
    if (!P || !cal) {                 // listino non caricato: vecchi prezzi fissi
      document.querySelector(".modal-date-label").style.display = "none";
      dateInput.style.display = "none";
      main.innerHTML = `${card.dataset.price} <span>${card.dataset.priceUnit}</span>`;
      tableEl.innerHTML = card.dataset.prices.split("|").map(p => `<p>${p}</p>`).join("");
      period.textContent = "";
      return;
    }
    const date = dateInput.value;
    const note = document.querySelector(".modal-price-note");
    if (!date) {                      // data non ancora scelta: niente cifre
      if (note) note.style.display = "none";
      main.innerHTML = `€ – <span>${card.dataset.priceUnit}</span>`;
      period.textContent = IT ? "Scegli una data per vedere i prezzi" : "Choose a date to see the prices";
      const max = P.maxGuests(card.dataset.room);
      let rows = "";
      for (let g = 1; g <= max; g++) rows += `<p>${g} ${IT ? (g === 1 ? "ospite" : "ospiti") : (g === 1 ? "person" : "people")}: –</p>`;
      tableEl.innerHTML = rows;
      return;
    }
    const t = P.table(card.dataset.room, date);
    if (note) note.style.display = t ? "" : "none";
    if (!t) {
      main.innerHTML = "";
      period.textContent = "";
      tableEl.innerHTML = IT
        ? `<p>Per queste date non abbiamo ancora il listino: <a href="${card.dataset.book}">contattaci</a> e ti faremo un preventivo.</p>`
        : `<p>Prices for these dates are not available yet: <a href="${card.dataset.book}">contact us</a> for a quote.</p>`;
      return;
    }
    main.innerHTML = `${range(t)} <span>${card.dataset.priceUnit}</span>`;
    const rule = P.rule(date);
    const promos = P.activePromos().filter(p => !p.stayFrom || (date >= p.stayFrom && date <= p.stayTo));
    period.innerHTML = (rule ? (IT ? rule.it : rule.en) : (IT ? "Bassa stagione" : "Low season")) +
      promos.map(p => `<br><span class="modal-promo">🏷️ ${IT ? p.it : p.en}: ${p.pct}% ${IT ? "prenotando entro il" : "if you book by"} ${p.bookTo.split("-").reverse().join("/")}</span>`).join("");
    tableEl.innerHTML = Object.keys(t).map(g =>
      `<p>${g} ${IT ? (g === "1" ? "ospite" : "ospiti") : (g === "1" ? "person" : "people")}: ${euro(t[g])}${IT ? "/notte" : "/night"}</p>`
    ).join("");
  }

  document.querySelectorAll(".room-card").forEach(card => {
    const roomId = card.dataset.room;
    const photos = ROOM_PHOTOS[roomId];

    // ── Click → open modal ──────────────────────────────────
    card.addEventListener("click", () => {
      images = photos;

      document.getElementById("modal-room-name").textContent = card.dataset.name;
      document.getElementById("modal-room-meta").textContent = card.dataset.topbarMeta;
      document.getElementById("modal-desc").textContent = card.dataset.desc;
      document.getElementById("modal-amen-label").textContent = card.dataset.amenLabel;

      const amenHTML = card.dataset.amenities.split("|").map(a => {
        const [icon, label] = a.split("::");
        return `<div class="amenity"><i class="fas ${icon}"></i><span>${label}</span></div>`;
      }).join("");
      document.getElementById("modal-amenities").innerHTML = amenHTML;

      currentCard = card;
      renderPrices();

      const bookLink = document.getElementById("modal-book-link");
      bookLink.href = card.dataset.book;
      bookLink.textContent = card.dataset.booklabel;

      const grid = document.getElementById("modal-photo-grid");
      grid.innerHTML = photos.map((src, i) =>
        `<img src="${src}" alt="${card.dataset.name}" data-idx="${i}" loading="lazy">`
      ).join("");
      grid.querySelectorAll("img").forEach(gi =>
        gi.addEventListener("click", () => enterPhotoMode(+gi.dataset.idx))
      );

      document.getElementById("modal-body").scrollTop = 0;
      modal.classList.remove("photo-mode");
      modal.classList.add("open");
    });
  });

  // ── Modal controls ───────────────────────────────────────
  backBtn  && backBtn.addEventListener("click", exitPhotoMode);
  prevBtn  && prevBtn.addEventListener("click", () => { current = (current - 1 + images.length) % images.length; showImg(); });
  nextBtn  && nextBtn.addEventListener("click", () => { current = (current + 1) % images.length; showImg(); });
  closeBtn && closeBtn.addEventListener("click", closeModal);
  backdrop && backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", e => {
    if (!modal.classList.contains("open")) return;
    if (modal.classList.contains("photo-mode")) {
      if (e.key === "ArrowLeft")  { current = (current - 1 + images.length) % images.length; showImg(); }
      if (e.key === "ArrowRight") { current = (current + 1) % images.length; showImg(); }
      if (e.key === "Escape")     exitPhotoMode();
    } else {
      if (e.key === "Escape") closeModal();
    }
  });
});
