/* ==========================================================================
   NEXUS TOPUP — home.js
   Beranda: slider, fitur, katalog game, cek transaksi, FAQ, scrollspy.
   ========================================================================== */
(function () {
  "use strict";

  const { SLIDES, FEATURES, GAMES, FAQS, CONFIG, getGame, store, ui } = window.NEXUS;
  const { icon, esc, formatRupiah, formatClock } = ui;

  /* ------------------------------------------------------------------ */
  /* Slider                                                              */
  /* ------------------------------------------------------------------ */
  function initSlider() {
    const root = document.getElementById("slider");
    const AUTOPLAY_MS = 4500;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.innerHTML = `
      <div class="slider__bg" aria-hidden="true"></div>
      ${SLIDES.map((s, i) => {
        const g = getGame(s.game);
        return `
        <article class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${SLIDES.length}"
                 style="--g1:${g.colors[0]};--g2:${g.colors[1]}">
          <span class="slide__glow slide__glow--1" aria-hidden="true"></span>
          <span class="slide__glow slide__glow--2" aria-hidden="true"></span>
          <div class="slide__content">
            <span class="badge">${esc(s.badge)}</span>
            <h1 class="slide__title">${esc(s.title)}</h1>
            <p class="slide__desc">${esc(s.desc)}</p>
            <div class="slide__btns">
              ${s.buttons
                .map(
                  (b) =>
                    `<a class="btn btn--lg ${b.primary ? "btn--primary" : "btn--ghost"}" href="topup.html?game=${b.game}">${esc(b.label)}${b.primary ? icon("arrowRight") : ""}</a>`
                )
                .join("")}
            </div>
          </div>
          <div class="slide__art" aria-hidden="true">
            <div class="slide__card"><img src="${g.image}" alt="" loading="${i === 0 ? "eager" : "lazy"}" /></div>
            <span class="slide__chip slide__chip--a">⚡ Proses 1-3 detik</span>
            <span class="slide__chip slide__chip--b">🛡️ 100% Legal &amp; Aman</span>
          </div>
        </article>`;
      }).join("")}
      <button class="slider__arrow slider__arrow--prev" type="button" aria-label="Slide sebelumnya">${icon("chevronLeft")}</button>
      <button class="slider__arrow slider__arrow--next" type="button" aria-label="Slide berikutnya">${icon("chevronRight")}</button>
      <div class="slider__dots">
        ${SLIDES.map((_, i) => `<button class="slider__dot" type="button" aria-label="Ke slide ${i + 1}"></button>`).join("")}
      </div>`;

    const slides = [...root.querySelectorAll(".slide")];
    const dots = [...root.querySelectorAll(".slider__dot")];
    let index = 0;
    let timer = null;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const active = k === index;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", String(!active));
        s.querySelectorAll("a").forEach((a) => (a.tabIndex = active ? 0 : -1));
      });
      dots.forEach((d, k) => d.setAttribute("aria-current", String(k === index)));
    }

    function start() {
      stop();
      if (!reduceMotion) timer = setInterval(() => show(index + 1), AUTOPLAY_MS);
    }
    function stop() {
      clearInterval(timer);
      timer = null;
    }
    const go = (i) => {
      show(i);
      start(); // reset timer setelah interaksi
    };

    root.querySelector(".slider__arrow--prev").addEventListener("click", () => go(index - 1));
    root.querySelector(".slider__arrow--next").addEventListener("click", () => go(index + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));

    // Jeda saat disorot / difokuskan
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // Geser di layar sentuh
    let startX = null;
    root.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    root.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    // Hemat baterai: berhenti saat tab tidak terlihat
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    show(0);
    start();
  }

  /* ------------------------------------------------------------------ */
  /* Fitur & katalog                                                     */
  /* ------------------------------------------------------------------ */
  function renderFeatures() {
    document.getElementById("features").innerHTML = FEATURES.map(
      (f) => `
      <div class="feature">
        <span class="feature__icon" aria-hidden="true">${f.icon}</span>
        <div><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p></div>
      </div>`
    ).join("");
  }

  function renderGames() {
    document.getElementById("game-grid").innerHTML = GAMES.map(
      (g) => `
      <a class="game-card" href="topup.html?game=${g.id}" style="--c1:${g.colors[0]};--c2:${g.colors[1]}"
         aria-label="Top up ${esc(g.name)}">
        <div class="game-card__media">
          <img src="${g.image}" alt="Ilustrasi ${esc(g.name)}" loading="lazy" width="292" height="250" />
          <span class="game-card__tag">${esc(g.tag)}</span>
        </div>
        <div class="game-card__info">
          <h3>${esc(g.name)}</h3>
          <p>${esc(g.publisher)}</p>
          <span class="game-card__cta">Top Up Sekarang ${icon("arrowRight")}</span>
        </div>
      </a>`
    ).join("");
  }

  /* ------------------------------------------------------------------ */
  /* Cek transaksi                                                       */
  /* ------------------------------------------------------------------ */
  const STATUS_VIEW = {
    SUCCESS: { cls: "status--success", text: "✅ Berhasil Terkirim" },
    PENDING: { cls: "status--pending", text: "⏳ Menunggu Pembayaran" },
    EXPIRED: { cls: "status--expired", text: "⛔ Kedaluwarsa" },
  };

  function timelineHTML(order) {
    const ok = order.status === "SUCCESS";
    const paid = order.paidAt;
    const steps = [
      { label: "Pesanan Dibuat", at: order.createdAt, done: true },
      { label: "Pembayaran Diterima", at: paid, done: ok },
      { label: "Diproses Sistem", at: paid ? paid + 1000 : null, done: ok },
      { label: "Item Terkirim", at: paid ? paid + 3000 : null, done: ok },
    ];
    return `<div class="timeline" role="list">${steps
      .map(
        (s, i) => `
        ${i ? `<span class="timeline__line ${s.done ? "" : "is-pending"}" aria-hidden="true"></span>` : ""}
        <div class="timeline__step ${s.done ? "" : "is-pending"}" role="listitem">
          <span class="timeline__dot" aria-hidden="true">${s.done ? icon("check") : ""}</span>
          <div><strong>${s.label}</strong><small>${s.done && s.at ? formatClock(s.at) : "Menunggu"}</small></div>
        </div>`
      )
      .join("")}</div>`;
  }

  function resultHTML(order) {
    const v = STATUS_VIEW[order.status] || STATUS_VIEW.PENDING;
    const details = [
      ["Game", order.gameName],
      ["Item", order.itemLabel],
      ["Akun", order.account],
      ["Metode", order.method],
      ["Total", formatRupiah(order.total)],
    ];
    const payLink =
      order.status === "PENDING"
        ? `<a class="btn btn--primary btn--sm" href="bayar.html?order=${encodeURIComponent(order.id)}">Lanjutkan Pembayaran</a>`
        : "";
    return `
      <div class="track-result" data-status="${order.status}">
        <div class="track-result__top">
          <div><div class="track-result__label">No. Pesanan</div><div class="track-result__no">${esc(order.id)}</div></div>
          <span class="status ${v.cls}">${v.text}</span>
        </div>
        <dl class="track-result__details">
          ${details.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join("")}
        </dl>
        ${timelineHTML(order)}
        ${payLink}
      </div>`;
  }

  function initTracking() {
    const form = document.getElementById("tracking-form");
    const input = document.getElementById("order-no");
    const err = document.getElementById("tracking-error");
    const out = document.getElementById("tracking-result");

    function showError(msg) {
      err.textContent = "⚠️  " + msg;
      err.hidden = false;
      out.innerHTML = "";
      input.setAttribute("aria-invalid", "true");
    }

    function lookup(raw) {
      const value = raw.trim();
      err.hidden = true;
      input.removeAttribute("aria-invalid");
      if (!value) return showError("Masukkan nomor pesanan terlebih dahulu.");
      const order = store.getOrder(value);
      if (!order) return showError("Pesanan tidak ditemukan. Periksa kembali nomor pesanan Anda.");
      out.innerHTML = resultHTML(order);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      lookup(input.value);
    });
    document.getElementById("tracking-demo").addEventListener("click", () => {
      input.value = CONFIG.demoOrderId;
      lookup(input.value);
    });
    input.addEventListener("input", () => {
      err.hidden = true;
      input.removeAttribute("aria-invalid");
    });
  }

  /* ------------------------------------------------------------------ */
  /* FAQ                                                                 */
  /* ------------------------------------------------------------------ */
  function initFaq() {
    const list = document.getElementById("faq-list");
    list.innerHTML = FAQS.map(
      (f, i) => `
      <div class="faq__item">
        <h3>
          <button class="faq__q" type="button" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">
            <span>${esc(f.q)}</span>${icon("chevronDown")}
          </button>
        </h3>
        <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
          <div><p>${esc(f.a)}</p></div>
        </div>
      </div>`
    ).join("");

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq__q");
      if (!btn) return;
      const item = btn.closest(".faq__item");
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scrollspy menu header                                               */
  /* ------------------------------------------------------------------ */
  function initScrollSpy() {
    const links = [...document.querySelectorAll(".main-nav a[data-section]")];
    const map = new Map();
    links.forEach((a) => {
      const sec = document.getElementById(a.dataset.section);
      if (sec) map.set(sec, a);
    });
    if (!("IntersectionObserver" in window) || !map.size) return;

    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
        // pilih section paling atas yang sedang terlihat
        const current = [...map.keys()].find((s) => visible.has(s));
        links.forEach((a) => a.removeAttribute("aria-current"));
        if (current) map.get(current).setAttribute("aria-current", "true");
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    map.forEach((_, sec) => io.observe(sec));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSlider();
    renderFeatures();
    renderGames();
    initTracking();
    initFaq();
    initScrollSpy();
  });
})();
