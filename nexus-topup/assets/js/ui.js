/* ==========================================================================
   NEXUS TOPUP — ui.js
   Helper UI bersama: ikon, format, salin, header & footer.
   ========================================================================== */
(function (global) {
  "use strict";

  const { CONFIG, GAMES, PAYMENTS } = global.NEXUS;

  /* ---------- Ikon (SVG inline) ---------- */
  const ICON_PATHS = {
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
    chevronRight: '<path d="M9 18l6-6-6-6"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  };

  function icon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
  }

  /* ---------- Format & util ---------- */
  const formatRupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

  const pad = (n) => String(n).padStart(2, "0");

  function formatClock(ts) {
    return (
      new Date(ts).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).replace(/\./g, ":") + " WIB"
    );
  }

  function formatCountdown(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
  }

  /** Escape HTML agar teks dari input pengguna aman dimasukkan ke innerHTML. */
  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function maskPhone(phone) {
    const d = String(phone || "").replace(/\D/g, "");
    if (d.length < 8) return phone || "-";
    return `${d.slice(0, 4)} •••• ${d.slice(-4)}`;
  }

  const param = (name) => new URLSearchParams(location.search).get(name);

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  function payBadge(p) {
    return `<span class="pay-badge" style="background:${p.bg};color:${p.fg};${p.label === "gopay" ? "letter-spacing:0" : ""}">${esc(p.label)}</span>`;
  }

  /* ---------- Logo ---------- */
  function logoHTML() {
    return `<a class="logo" href="index.html" aria-label="${CONFIG.brand} — Beranda">
      <span class="logo__mark" aria-hidden="true">N</span>
      <span>
        <span class="logo__name">NEXUS<span class="text-accent">TOPUP</span></span>
        <span class="logo__tag">${CONFIG.tagline}</span>
      </span>
    </a>`;
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    host.className = "site-header";
    host.innerHTML = `
      <div class="container site-header__inner">
        ${logoHTML()}
        <nav class="main-nav" id="main-nav" aria-label="Menu utama">
          <a href="index.html#katalog" data-section="katalog">🎮 Semua Game</a>
          <a href="index.html#tracking" data-section="tracking">🔍 Cek Transaksi</a>
          <a href="index.html#faq" data-section="faq">❓ Bantuan</a>
        </nav>
        <div class="header-actions">
          <a class="icon-btn icon-btn--search" href="index.html#katalog" aria-label="Cari game">${icon("search")}</a>
          <button class="icon-btn menu-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="main-nav">${icon("menu")}</button>
        </div>
      </div>`;

    const toggle = host.querySelector(".menu-toggle");
    const nav = host.querySelector(".main-nav");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.className = "site-footer";
    host.innerHTML = `
      <div class="container">
        <div class="site-footer__cols">
          <div class="site-footer__brand">
            ${logoHTML()}
            <p>NEXUS TOPUP adalah platform isi ulang mata uang game terpercaya di Indonesia. Transaksi otomatis 24 jam dengan harga ramah kantong.</p>
            <div class="pay-badges">${PAYMENTS.map(payBadge).join("")}</div>
          </div>
          <div>
            <h3>Menu Cepat</h3>
            <ul>
              <li><a href="index.html#katalog">Katalog Game</a></li>
              <li><a href="index.html#tracking">Lacak Status Pesanan</a></li>
              <li><a href="index.html#faq">FAQ &amp; Bantuan</a></li>
            </ul>
          </div>
          <div>
            <h3>Game Populer</h3>
            <ul>${GAMES.map((g) => `<li><a href="topup.html?game=${g.id}">${esc(g.name)}</a></li>`).join("")}</ul>
          </div>
          <div class="site-footer__help">
            <h3>Bantuan</h3>
            <p>Ini website demo tugas kuliah, jadi layanan CS tidak aktif. Jawaban pertanyaan umum ada di bagian <a href="index.html#faq">FAQ</a>.</p>
          </div>
        </div>
        <div class="site-footer__bottom">
          <span>© ${new Date().getFullYear()} NEXUS TOPUP. Seluruh Hak Cipta Dilindungi Undang-Undang.</span>
          <span>Website demo tugas kuliah, tidak ada transaksi sungguhan. Merek dagang milik penerbit masing-masing.</span>
        </div>
      </div>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
  });

  global.NEXUS.ui = { icon, formatRupiah, formatClock, formatCountdown, esc, maskPhone, param, copyText, payBadge };
})(window);
