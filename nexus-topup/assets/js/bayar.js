/* ==========================================================================
   NEXUS TOPUP — bayar.js
   Halaman menunggu pembayaran: QR simulasi, hitung mundur, salin nomor
   pesanan, dan tombol "Simulasi Bayar" yang mengubah status jadi sukses.
   ========================================================================== */
(function () {
  "use strict";

  const { store, ui } = window.NEXUS;
  const { icon, esc, formatRupiah, formatCountdown, copyText, param } = ui;

  const orderId = param("order");
  let order = store.getOrder(orderId);

  if (!order || order.isDemo) {
    location.replace("index.html#tracking");
    return;
  }
  if (order.status === "SUCCESS") {
    location.replace(`berhasil.html?order=${encodeURIComponent(order.id)}`);
    return;
  }

  /* ------------------------------------------------------------------ */
  /* QR simulasi (bukan QR valid, hanya ilustrasi yang konsisten per     */
  /* nomor pesanan)                                                       */
  /* ------------------------------------------------------------------ */
  function seededRandom(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let a = h >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return (((t ^ (t >>> 14)) >>> 0) / 4294967296);
    };
  }

  function qrSvg(seed) {
    const N = 25;
    const rnd = seededRandom(seed);
    const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
    const isOn = (r, c) => {
      if (finder(r, c)) {
        const rr = r < 7 ? r : r - (N - 7);
        const cc = c < 7 ? c : c - (N - 7);
        return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
      }
      // ruang kosong di sekeliling finder
      if ((r === 7 || c === 7 || r === N - 8 || c === N - 8) && (r < 8 || c < 8 || r > N - 9 || c > N - 9)) return false;
      return rnd() > 0.52;
    };
    let d = "";
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) if (isOn(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
    return `<svg class="qr-card__code" viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" role="img" aria-label="Contoh kode QR pembayaran (simulasi)"><path d="${d}" fill="#0F172A"/></svg>`;
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  const page = document.getElementById("pay-page");

  function detailRows() {
    return `
      <dl class="detail-list">
        <div class="detail-row"><dt>No. Pesanan</dt><dd>${esc(order.id)}</dd></div>
        <div class="detail-row"><dt>Game</dt><dd>${esc(order.gameName)}</dd></div>
        <div class="detail-row"><dt>Item</dt><dd>${esc(order.itemLabel)}</dd></div>
        <div class="detail-row"><dt>Akun</dt><dd>${esc(order.account)}</dd></div>
        <div class="detail-row"><dt>Metode</dt><dd>${esc(order.method)}</dd></div>
        <div class="detail-row detail-row--total"><dt>Total Tagihan</dt><dd class="text-gold">${formatRupiah(order.total)}</dd></div>
      </dl>`;
  }

  function renderPending() {
    document.title = "Menunggu Pembayaran — NEXUS TOPUP";
    page.innerHTML = `
      <section class="pay-card" aria-labelledby="pay-title">
        <span class="status status--pending">⏳ Menunggu Pembayaran</span>
        <h1 id="pay-title">Selesaikan Pembayaran</h1>
        <p class="deadline">Batas waktu bayar: <strong id="countdown" role="timer" aria-live="off">--:--</strong> menit</p>

        <div class="qr-card">
          <div class="qr-card__head"><span>NEXUS TOPUP</span><span>QRIS</span></div>
          ${qrSvg(order.id)}
          <span class="qr-card__std">QRIS STANDAR NASIONAL</span>
          <span class="qr-card__via">Bayar via <b>${esc(order.method)}</b></span>
        </div>
        <p class="demo-note">Mode demo: QR ini hanya ilustrasi dan tidak dapat dipindai. Tidak ada uang yang ditagihkan.</p>

        ${detailRows()}

        <button class="copy-btn" type="button" id="copy-btn">${icon("copy")}<span>Salin No. Pesanan</span></button>
        <button class="btn btn--success btn--lg btn--block" type="button" id="simulate-btn">⚡ Simulasi Bayar Sekarang (Uji Sukses)</button>
        <a class="btn btn--ghost btn--block" href="index.html">Tutup</a>
      </section>`;

    const copyBtn = document.getElementById("copy-btn");
    let copyTimer;
    copyBtn.addEventListener("click", async () => {
      const ok = await copyText(order.id);
      copyBtn.classList.toggle("is-copied", ok);
      copyBtn.innerHTML = ok ? `${icon("check")}<span>Disalin!</span>` : `${icon("copy")}<span>Gagal menyalin</span>`;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copyBtn.classList.remove("is-copied");
        copyBtn.innerHTML = `${icon("copy")}<span>Salin No. Pesanan</span>`;
      }, 1600);
    });

    const simBtn = document.getElementById("simulate-btn");
    simBtn.addEventListener("click", () => {
      simBtn.setAttribute("aria-busy", "true");
      setTimeout(() => {
        store.updateOrder(order.id, { status: "SUCCESS", paidAt: Date.now() });
        location.href = `berhasil.html?order=${encodeURIComponent(order.id)}`;
      }, 900);
    });
  }

  function renderExpired() {
    document.title = "Pembayaran Kedaluwarsa — NEXUS TOPUP";
    page.innerHTML = `
      <section class="pay-card is-expired" aria-labelledby="pay-title">
        <span class="status status--expired">⛔ Kedaluwarsa</span>
        <h1 id="pay-title">Waktu Pembayaran Habis</h1>
        <p class="pay-card__desc">Batas waktu pembayaran untuk pesanan ini sudah lewat. Silakan buat pesanan baru untuk melanjutkan.</p>
        ${detailRows()}
        <a class="btn btn--primary btn--lg btn--block" href="topup.html?game=${encodeURIComponent(order.gameId)}">Buat Pesanan Baru</a>
        <a class="btn btn--ghost btn--block" href="index.html">Kembali ke Beranda</a>
      </section>`;
  }

  /* ------------------------------------------------------------------ */
  /* Hitung mundur                                                       */
  /* ------------------------------------------------------------------ */
  function startCountdown() {
    const el = document.getElementById("countdown");
    const tick = () => {
      const left = order.expiresAt - Date.now();
      if (left <= 0) {
        clearInterval(timer);
        order = store.getOrder(order.id); // otomatis menjadi EXPIRED
        renderExpired();
        return;
      }
      if (el) el.textContent = formatCountdown(left);
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (order.status === "EXPIRED") return renderExpired();
    renderPending();
    startCountdown();
  });
})();
