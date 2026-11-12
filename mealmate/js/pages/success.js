/**
 * MealMate — Halaman Pembayaran Berhasil.
 */
import { P, PAYMENTS } from '../data.js';
import { S } from '../state.js';
import { color, esc, findOrder, fmtDate, rp } from '../utils.js';
import { I } from '../icons.js';

export const successPage = () => {
  const o = findOrder(S.currentOrder);
  if (!o || (o.status !== 'paid' && o.status !== 'shipped')) {
    setTimeout(() => (location.hash = o ? 'bayar' : 'beranda'));
    return '';
  }
  const step = o.status === 'shipped' ? 3 : 2;
  return `
<div class="wrap done page">
  <div class="ok">${I.check}</div>
  <h1 class="h-lg">Pembayaran Berhasil!</h1>
  <p class="lead" style="margin-top:8px">Terima kasih, ${esc(o.customer.name.split(' ')[0])}! Pesananmu sedang kami siapkan. Konfirmasi dikirim ke <b style="color:var(--brown-900)">${esc(o.customer.email)}</b>.</p>
  <div class="track">${['Pesanan Dibuat', 'Dibayar', 'Dikemas', 'Dikirim'].map((t, i) => `<div class="${i <= step - 0 ? 'on' : ''}"><i>${i <= step ? '✓' : i + 1}</i>${t}</div>`).join('')}</div>
  <div class="panel" style="text-align:left">
    <h2>Detail Pesanan</h2>
    <div class="kv"><span>Nomor Pesanan</span><b>${o.id}</b></div>
    <div class="kv"><span>Tanggal</span><b>${fmtDate(o.created)}</b></div>
    <div class="kv"><span>Dibayar</span><b>${fmtDate(o.paidAt)}</b></div>
    <div class="kv"><span>Metode</span><b>${PAYMENTS.find(m => m.id === o.pay).name}</b></div>
    <div class="kv"><span>Kirim ke</span><b style="max-width:60%">${esc(o.customer.name)} · ${esc(o.customer.phone)}<br><span class="muted" style="font-weight:500">${esc(o.customer.address)}, ${esc(o.customer.city)} ${esc(o.customer.zip)}</span></b></div>
    <div class="kv"><span>Kurir</span><b>${o.shipping.name} (${o.shipping.eta})</b></div>
    <div class="sum-items" style="margin-top:14px;border-top:1px solid var(--line);padding-top:14px">${o.items.map(it => `<div class="sum-it"><img src="${color(it.color).img}" alt=""><div><b>${P[it.size].name}</b><span class="muted">${color(it.color).name} · ${it.qty}×</span></div><b>${rp(P[it.size].price * it.qty)}</b></div>`).join('')}</div>
    <div class="kv"><span>Subtotal</span><b>${rp(o.sub)}</b></div>
    ${o.dsc ? `<div class="kv"><span>Diskon</span><b style="color:var(--green)">− ${rp(o.dsc)}</b></div>` : ''}
    <div class="kv"><span>Ongkos kirim</span><b>${o.ship ? rp(o.ship) : 'Gratis'}</b></div>
    <div class="kv total"><span>Total Dibayar</span><b>${rp(o.total)}</b></div>
  </div>
  <div style="display:flex;gap:12px;justify-content:center;margin-top:26px;flex-wrap:wrap">
    <a href="#pesanan" class="btn btn-pri">Lihat Pesanan Saya</a>
    <a href="#produk" class="btn btn-out">Belanja Lagi</a>
  </div>
</div>`;
};
