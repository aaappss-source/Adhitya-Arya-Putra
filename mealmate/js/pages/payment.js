/**
 * MealMate — Halaman Pembayaran (simulasi QRIS / Virtual Account) beserta hitung mundur.
 */
import { PAYMENTS } from '../data.js';
import { S, save } from '../state.js';
import { $, closeModal, esc, findOrder, fmtDate, modal, rp, statusPill } from '../utils.js';
import { I } from '../icons.js';
import { render } from '../router.js';

let timerId = null;

/** Menghentikan hitung mundur pembayaran. */
export function stopPaymentTimer() {
  clearInterval(timerId);
}

export const paymentPage = () => {
  const o = findOrder(S.currentOrder);
  if (!o)
    return `<div class="wrap" style="padding:60px 24px"><div class="card empty"><h1 class="h-md">Tidak ada pembayaran aktif</h1><p class="muted" style="margin:8px 0 18px">Lihat riwayat di Pesanan Saya.</p><a href="#pesanan" class="btn btn-pri btn-sm">Pesanan Saya</a></div></div>`;
  if (o.status === 'paid' || o.status === 'shipped') {
    setTimeout(() => (location.hash = 'sukses'));
    return '';
  }
  const pm = PAYMENTS.find(m => m.id === o.pay);
  const isQ = o.pay === 'qris';
  const expired = o.status === 'expired' || o.status === 'cancelled' || Date.now() > o.expires;
  return `
<div class="wrap">
  <div style="padding-top:36px"><h1 class="h-xl" style="font-size:clamp(34px,4.4vw,54px)">Lakukan Pembayaran</h1><p class="lead" style="color:var(--text)">${isQ ? 'Scan QRIS di bawah ini untuk menyelesaikan pembayaran.' : `Transfer ke nomor ${pm.name} di bawah ini.`}</p></div>
  <div class="co">
    <div class="panel" style="background:linear-gradient(180deg,var(--pink-50),#fff);padding:34px 26px;text-align:center">
      ${
        isQ
          ? `
        <div class="qris-head"><span class="qris-word">QRIS</span><small style="text-align:left">QR Code Standar<br>Pembayaran Nasional</small></div>
        <div class="qr-box ${expired ? 'exp' : ''}" id="qrBox" aria-label="Kode QR pembayaran"></div>
        <p style="margin-top:14px;font-weight:600;color:var(--brown-900)">MealMate Official · NMID ID10239485761</p>
      `
          : `
        <div class="qris-head"><span class="paylogo" style="background:${pm.bg};color:${pm.fg};height:48px;font-size:18px;padding:0 16px">${pm.logo}</span><small style="text-align:left">${pm.name}<br><span class="muted" style="font-weight:500">a.n. MealMate Official</span></small></div>
        <p class="muted" style="margin-top:8px">Nomor Virtual Account</p>
        <div class="code"><b id="vaNum">${o.va.replace(/(\d{4})(?=\d)/g, '$1 ')}</b><button class="copy" data-act="copy" data-v="${o.va}" aria-label="Salin nomor VA">${I.copy}</button></div>
      `
      }
      <p class="muted" style="margin-top:22px">Total Pembayaran</p>
      <p class="price" style="font-size:34px;color:var(--brown-800)">${rp(o.total)}</p>
      <div style="margin:12px 0 18px"><span class="timer" id="timer" aria-live="polite">⏱ <span>--:--</span></span></div>
      <p class="muted">Kode Transaksi</p>
      <div class="code"><b>${o.id}</b><button class="copy" data-act="copy" data-v="${o.id}" aria-label="Salin kode transaksi">${I.copy}</button></div>
      <div style="text-align:left;max-width:460px;margin:26px auto 0">
        <p style="font-weight:700;color:var(--brown-900);margin-bottom:8px">Cara bayar</p>
        <ol class="how">${
          isQ
            ? '<li>Buka aplikasi e-wallet atau m-banking yang mendukung QRIS.</li><li>Pilih menu Scan/Bayar, lalu arahkan kamera ke kode QR.</li><li>Pastikan nominal sesuai, lalu konfirmasi pembayaran.</li><li>Kembali ke halaman ini dan klik “Saya Sudah Membayar”.</li>'
            : `<li>Buka aplikasi ${pm.name.split(' ')[0]} atau ATM terdekat.</li><li>Pilih Transfer › Virtual Account.</li><li>Masukkan nomor VA di atas, nominal akan muncul otomatis.</li><li>Konfirmasi, lalu klik “Saya Sudah Membayar”.</li>`
        }</ol>
      </div>
      <div class="demo"><span>ℹ️</span><span><b>Mode demo:</b> kode QR dan nomor VA ini adalah simulasi, jadi tidak ada uang yang ditarik. Untuk transaksi sungguhan, hubungkan halaman ini ke payment gateway (misalnya Midtrans atau Xendit).</span></div>
    </div>
    <div class="sticky">
      <div class="wait" ${expired ? 'style="background:#f9e3e1"' : ''}>
        <div class="clock" ${expired ? 'style="border-color:#d9534f;color:#b3261e;background:#fff"' : ''}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9" opacity=".25"/><path d="M12 7v5l3 2"/></svg></div>
        <div>${
          expired
            ? `<b>Waktu Pembayaran Habis</b><p>Kode pembayaran sudah tidak berlaku. Buat kode baru untuk melanjutkan pesanan ini.</p>`
            : `<b>Menunggu Pembayaran</b><p>Silakan lakukan pembayaran ${isQ ? 'dengan memindai kode QR di samping' : 'ke nomor Virtual Account di samping'}. Pesanan akan diproses setelah pembayaran berhasil diverifikasi.</p>`
        }</div>
      </div>
      <div class="panel" style="margin-top:20px">
        <h2>Detail Pesanan</h2>
        <div class="kv"><span>Nomor Pesanan</span><b>${o.id}</b></div>
        <div class="kv"><span>Tanggal Pemesanan</span><b>${fmtDate(o.created)}</b></div>
        <div class="kv"><span>Metode Pembayaran</span><b>${pm.name}</b></div>
        <div class="kv"><span>Pengiriman</span><b>${o.shipping.name}</b></div>
        <div class="kv"><span>Penerima</span><b>${esc(o.customer.name)}</b></div>
        <div class="kv" style="align-items:center"><span>Status</span>${statusPill(expired ? 'expired' : o.status)}</div>
      </div>
      ${
        expired
          ? `<button class="btn btn-pri btn-block" style="margin-top:20px;height:62px;font-size:20px" data-act="renew">Buat Kode Pembayaran Baru</button>`
          : `<button class="btn btn-pri btn-block" style="margin-top:20px;height:62px;font-size:20px" data-act="paid">Saya Sudah Membayar</button>`
      }
      <div style="display:flex;gap:12px;margin-top:12px">
        <a href="#pesanan" class="btn btn-out" style="flex:1">Pesanan Saya</a>
        ${o.status === 'pending' ? `<button class="btn btn-out" style="flex:1;border-color:#d9a19b;color:var(--red)" data-act="cancel">Batalkan</button>` : ''}
      </div>
    </div>
  </div>
</div>`;
};

export function drawQR(o) {
  const box = $('#qrBox');
  if (!box || !window.QRCodeLib) return;
  const payload = `MEALMATE-DEMO|${o.id}|${o.total}|${o.expires}`;
  const q = new window.QRCodeLib(-1, window.QRECL.M);
  q.addData(payload);
  q.make();
  const n = q.getModuleCount(),
    m = 2,
    sz = n + m * 2;
  let path = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) path += `M${c + m} ${r + m}h1v1h-1z`;
  box.innerHTML = `<svg viewBox="0 0 ${sz} ${sz}" shape-rendering="crispEdges" role="img" aria-label="QR pembayaran ${o.id}"><rect width="${sz}" height="${sz}" fill="#fff"/><path d="${path}" fill="#111"/></svg>`;
}
export function startTimer(o) {
  clearInterval(timerId);
  const tick = () => {
    const el = $('#timer span');
    if (!el) {
      clearInterval(timerId);
      return;
    }
    const left = o.expires - Date.now();
    if (left <= 0) {
      clearInterval(timerId);
      if (o.status === 'pending') {
        o.status = 'expired';
        save();
        render();
      }
      el.textContent = '00:00';
      return;
    }
    const mm = Math.floor(left / 60000),
      ss = Math.floor((left % 60000) / 1000);
    el.textContent = `Bayar dalam ${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };
  tick();
  timerId = setInterval(tick, 1000);
}

export function verifyPayment() {
  const o = findOrder(S.currentOrder);
  if (!o) return;
  modal(
    `<div class="spin"></div><h2 class="h-md">Memverifikasi pembayaran…</h2><p class="muted" style="margin-top:8px">Mohon tunggu sebentar, jangan tutup halaman ini.</p>`
  );
  setTimeout(() => {
    o.status = 'paid';
    o.paidAt = Date.now();
    save();
    closeModal();
    location.hash = 'sukses';
  }, 2200);
}
