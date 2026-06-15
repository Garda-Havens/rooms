// ── Photo sets — add or remove a path to change what appears in each room ──
const ROOM_PHOTOS = {
  1: [
    'static/1/1.jpeg',
    'static/1/2.jpeg',
    'static/1/3.jpeg',
    'static/1/4.jpeg',
    'static/1/5.jpeg',
    'static/1/6.jpeg',
    'static/1/7.jpeg',
    'static/1/8.jpeg',
    'static/1/9.jpeg',
    'static/1/10.jpeg',
    'static/1/11.jpeg',
    'static/1/12.jpeg',
    'static/1/13.jpeg',
  ],
  2: [
    'static/2/1.jpeg',
    'static/2/2.jpeg',
    'static/2/3.jpeg',
    'static/2/4.jpeg',
    'static/2/5.jpeg',
    'static/2/6.jpeg',
    'static/2/7.jpeg',
    'static/2/8.jpeg',
    'static/2/9.jpeg',
  ],
  3: [
    'static/3/1.jpeg',
    'static/3/2.jpeg',
    'static/3/3.jpeg',
    'static/3/4.jpeg',
    'static/3/5.jpeg',
    'static/3/6.jpeg',
    'static/3/7.jpeg',
    'static/3/8.jpeg',
    'static/3/9.jpeg',
    'static/3/10.jpeg',
    'static/3/11.jpeg',
    'static/3/12.jpeg',
  ],
  4: [
    'static/4/1.jpeg',
    'static/4/2.jpeg',
    'static/4/3.jpeg',
    'static/4/4.jpeg',
    'static/4/5.jpeg',
    'static/4/6.jpeg',
    'static/4/7.jpeg',
    'static/4/8.jpeg',
    'static/4/9.jpeg',
    'static/4/10.jpeg',
    'static/4/11.jpeg',
    'static/4/12.jpeg',
  ],
  5: [
    'static/5/1.jpeg',
    'static/5/2.jpeg',
    'static/5/3.jpeg',
    'static/5/4.jpeg',
    'static/5/7.jpeg',
    'static/5/8.jpeg',
    'static/5/9.jpeg',
    'static/5/10.jpeg',
    'static/5/12.jpeg',
  ],
  6: [
    'static/6/1.jpeg',
    'static/6/2.jpeg',
    'static/6/3.jpeg',
    'static/6/4.jpeg',
    'static/6/5.jpeg',
    'static/6/6.jpeg',
    'static/6/7.jpeg',
    'static/6/8.jpeg',
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
  const closeModal     = () => modal.classList.remove("open", "photo-mode");

  document.querySelectorAll(".room-card").forEach(card => {
    const roomId = card.dataset.room;
    const photos = ROOM_PHOTOS[roomId];

    // ── Click → open modal ──────────────────────────────────
    card.addEventListener("click", () => {
      images = photos;

      document.getElementById("modal-room-name").textContent = card.dataset.name;
      document.getElementById("modal-room-meta").textContent = card.dataset.topbarMeta;
      document.getElementById("modal-type-badge").textContent = card.dataset.badge;
      document.getElementById("modal-desc").textContent = card.dataset.desc;
      document.getElementById("modal-amen-label").textContent = card.dataset.amenLabel;

      const amenHTML = card.dataset.amenities.split("|").map(a => {
        const [icon, label] = a.split("::");
        return `<div class="amenity"><i class="fas ${icon}"></i><span>${label}</span></div>`;
      }).join("");
      document.getElementById("modal-amenities").innerHTML = amenHTML;

      document.getElementById("modal-price-main").innerHTML =
        `${card.dataset.price} <span>${card.dataset.priceUnit}</span>`;
      document.getElementById("modal-price-table").innerHTML =
        card.dataset.prices.split("|").map(p => `<p>${p}</p>`).join("");

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
