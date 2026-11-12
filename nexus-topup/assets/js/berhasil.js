/* ==========================================================================
   NEXUS TOPUP — berhasil.js
   Halaman pembayaran berhasil.
   ========================================================================== */
(function () {
  "use strict";

  const { store, ui } = window.NEXUS;
  const { icon, esc, formatRupiah, maskPhone, param } = ui;

  const order = store.getOrder(param("order"));

  if (!order || order.isDemo) {
    location.replace("index.html#tracking");
    return;
  }
  if (order.status !== "SUCCESS") {
    location.replace(`bayar.html?order=${encodeURIComponent(order.id)}`);
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("success-page").innerHTML = `
      <section class="pay-card pay-card--success" aria-labelledby="ok-title">
        <span class="success-icon" aria-hidden="true">${icon("check")}</span>
        <h1 id="ok-title">Pembayaran Berhasil! 🎉</h1>
        <p class="pay-card__desc">Pesananmu sudah diproses otomatis dan item telah dikirim ke akun game.</p>

        <dl class="detail-list">
          <div class="detail-row"><dt>No. Pesanan</dt><dd>${esc(order.id)}</dd></div>
          <div class="detail-row"><dt>Game</dt><dd>${esc(order.gameName)}</dd></div>
          <div class="detail-row"><dt>Item</dt><dd>${esc(order.itemLabel)}</dd></div>
          <div class="detail-row"><dt>Akun</dt><dd>${esc(order.account)}</dd></div>
          <div class="detail-row"><dt>Metode</dt><dd>${esc(order.method)}</dd></div>
          <div class="detail-row detail-row--total"><dt>Total Dibayar</dt><dd class="text-success">${formatRupiah(order.total)}</dd></div>
          <div class="detail-row"><dt>Status</dt><dd class="text-success">✅ Berhasil Terkirim</dd></div>
        </dl>

        <p class="pay-card__note">📩 Invoice telah dikirim ke nomor WhatsApp kamu (${esc(maskPhone(order.wa))}).</p>
        <a class="btn btn--primary btn--lg btn--block" href="index.html">🏠 Kembali ke Beranda</a>
        <a class="btn btn--ghost btn--block" href="index.html#tracking">Lacak Pesanan</a>
      </section>`;
  });
})();
