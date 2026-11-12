/**
 * MealMate — Halaman Checkout: form penerima, kurir, pembayaran, validasi, dan pembuatan pesanan.
 */
import { FREE_SHIP, PAYMENTS, PAY_WINDOW, SHIPPING } from '../data.js';
import { S, save } from '../state.js';
import { discount, esc, newOrderId, rp, shipCost, subtotal } from '../utils.js';
import { I } from '../icons.js';
import { cartLines, summaryPanel } from '../components.js';
import { updateBadge } from '../router.js';

export const checkoutPage = () => {
  if (!S.cart.length) {
    location.hash = 'keranjang';
    return '';
  }
  const f = S.form;
  const fld = (id, label, type = 'text', extra = '', full = false) =>
    `<div class="fld ${full ? 'full' : ''}" data-f="${id}"><label for="f-${id}">${label}</label><input id="f-${id}" name="${id}" type="${type}" value="${esc(f[id] || '')}" ${extra}><span class="em"></span></div>`;
  return `
<div class="wrap">
  <div style="padding-top:36px"><a href="#keranjang" class="muted" style="display:inline-flex;align-items:center;gap:4px;font-size:14px">${I.back} Kembali ke keranjang</a><h1 class="h-xl" style="margin-top:8px;font-size:clamp(36px,4.6vw,56px)">Checkout</h1><p class="lead" style="color:var(--text)">Lengkapi pesananmu dan pilih metode pembayaran.</p></div>
  <form class="co" id="coForm" novalidate>
    <div>
      <div class="panel"><h2>Produk yang Dipesan</h2>${cartLines(false)}</div>
      <div class="panel">
        <h2><span class="step-n">1</span>Data Penerima</h2>
        <div class="form">
          ${fld('name', 'Nama lengkap', 'text', 'autocomplete="name" required')}
          ${fld('phone', 'Nomor WhatsApp', 'tel', 'autocomplete="tel" inputmode="tel" placeholder="08xxxxxxxxxx" required')}
          ${fld('email', 'Email', 'email', 'autocomplete="email" placeholder="nama@email.com" required', true)}
          <div class="fld full" data-f="address"><label for="f-address">Alamat lengkap</label><textarea id="f-address" name="address" rows="3" autocomplete="street-address" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" required>${esc(f.address || '')}</textarea><span class="em"></span></div>
          <div class="fld" data-f="city"><label for="f-city">Kota/Kabupaten</label><input id="f-city" name="city" list="cities" value="${esc(f.city || '')}" autocomplete="address-level2" required><datalist id="cities"><option>Jakarta Selatan</option><option>Jakarta Pusat</option><option>Jakarta Barat</option><option>Jakarta Timur</option><option>Jakarta Utara</option><option>Bandung</option><option>Surabaya</option><option>Yogyakarta</option><option>Semarang</option><option>Depok</option><option>Bogor</option><option>Tangerang</option><option>Bekasi</option><option>Malang</option><option>Medan</option><option>Makassar</option><option>Denpasar</option></datalist><span class="em"></span></div>
          ${fld('zip', 'Kode pos', 'text', 'inputmode="numeric" maxlength="5" autocomplete="postal-code" required')}
          <div class="fld full"><label for="f-note">Catatan untuk penjual <span class="muted" style="font-weight:400">(opsional)</span></label><input id="f-note" name="note" value="${esc(f.note || '')}" placeholder="Misalnya: titip di satpam"></div>
        </div>
      </div>
      <div class="panel">
        <h2><span class="step-n">2</span>Pengiriman</h2>
        <div class="opts" role="radiogroup" aria-label="Pilih kurir">
          ${SHIPPING.map(s => `<label class="opt ${s.id === S.ship ? 'on' : ''}"><input type="radio" name="ship" value="${s.id}" ${s.id === S.ship ? 'checked' : ''}><span class="t"><b>${s.name}</b><small>Estimasi ${s.eta}</small></span><span class="pv">${subtotal() >= FREE_SHIP ? `<s class="muted" style="font-weight:400">${rp(s.cost)}</s> Gratis` : rp(s.cost)}</span></label>`).join('')}
        </div>
      </div>
      <div class="panel">
        <h2><span class="step-n">3</span>Metode Pembayaran</h2>
        <div class="opts" role="radiogroup" aria-label="Pilih metode pembayaran">
          ${PAYMENTS.map(m => `<label class="opt ${m.id === S.pay ? 'on' : ''}"><input type="radio" name="pay" value="${m.id}" ${m.id === S.pay ? 'checked' : ''}><span class="paylogo" style="background:${m.bg};color:${m.fg}">${m.logo}</span><span class="t"><b>${m.name}</b><small>${m.sub}</small></span></label>`).join('')}
        </div>
      </div>
    </div>
    <div class="sticky" id="summary">${summaryPanel()}</div>
  </form>
</div>`;
};

export function validate(form) {
  const d = Object.fromEntries(new FormData(form));
  const rules = {
    name: v => v.trim().length >= 3 || 'Isi nama lengkap (min. 3 huruf)',
    phone: v =>
      /^(\+62|62|0)8\d{7,12}$/.test(v.replace(/[\s-]/g, '')) || 'Gunakan nomor HP Indonesia, contoh 081234567890',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Format email belum benar',
    address: v => v.trim().length >= 10 || 'Tulis alamat lengkap (min. 10 karakter)',
    city: v => v.trim().length >= 3 || 'Isi kota/kabupaten',
    zip: v => /^\d{5}$/.test(v.trim()) || 'Kode pos terdiri dari 5 angka',
  };
  let first = null;
  Object.entries(rules).forEach(([k, fn]) => {
    const ok = fn(d[k] || '');
    const box = form.querySelector(`[data-f="${k}"]`);
    box.classList.toggle('err', ok !== true);
    box.querySelector('.em').textContent = ok === true ? '' : ok;
    box.querySelector('input,textarea').setAttribute('aria-invalid', ok !== true);
    if (ok !== true && !first) first = box;
  });
  return { ok: !first, first, data: d };
}

export function placeOrder(d) {
  const sub = subtotal(),
    dsc = discount(sub),
    sh = shipCost(sub);
  const now = Date.now();
  const o = {
    id: newOrderId(),
    created: now,
    expires: now + PAY_WINDOW,
    status: 'pending',
    items: S.cart.map(i => ({ ...i })),
    sub,
    dsc,
    ship: sh,
    total: sub - dsc + sh,
    shipping: SHIPPING.find(s => s.id === S.ship),
    pay: S.pay,
    promo: S.promo,
    customer: {
      name: d.name.trim(),
      phone: d.phone.trim(),
      email: d.email.trim(),
      address: d.address.trim(),
      city: d.city.trim(),
      zip: d.zip.trim(),
      note: (d.note || '').trim(),
    },
    va:
      S.pay === 'qris'
        ? null
        : { bca: '39012', mandiri: '88908', bni: '98827' }[S.pay] +
          String(Math.floor(Math.random() * 1e11)).padStart(11, '0'),
  };
  S.orders.unshift(o);
  S.currentOrder = o.id;
  S.cart = [];
  S.promo = null;
  save();
  updateBadge();
  location.hash = 'bayar';
}
