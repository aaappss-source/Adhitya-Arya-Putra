/**
 * MealMate — Halaman Pesanan Saya (riwayat pesanan).
 */
import { P, PAYMENTS } from '../data.js';
import { S, save } from '../state.js';
import { color, fmtDate, rp, statusPill } from '../utils.js';
import { I } from '../icons.js';

export const ordersPage = () => {
  S.orders.forEach(o => {
    if (o.status === 'pending' && Date.now() > o.expires) o.status = 'expired';
  });
  save();
  return `
<div class="wrap" style="padding:36px 24px 70px">
  <h1 class="h-lg">Pesanan Saya</h1>
  <p class="lead" style="margin-bottom:24px">Riwayat pesanan yang dibuat dari perangkat ini.</p>
  ${
    !S.orders.length
      ? `<div class="card empty"><div class="ic">${I.bag}</div><h2 class="h-md">Belum ada pesanan</h2><p class="muted" style="margin:6px 0 18px">Pesanan yang kamu buat akan muncul di sini.</p><a href="#produk" class="btn btn-pri btn-sm">Mulai Belanja</a></div>`
      : S.orders
          .map(
            o => `<div class="card ord">
    <div>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><b style="font-size:17px;color:var(--brown-900)">${o.id}</b>${statusPill(o.status)}</div>
      <p class="muted" style="font-size:14px;margin-top:4px">${fmtDate(o.created)} · ${o.items.reduce((a, i) => a + i.qty, 0)} barang · ${PAYMENTS.find(m => m.id === o.pay).name}</p>
      <div class="thumbs-s">${o.items.map(it => `<img src="${color(it.color).img}" alt="${P[it.size].name} ${color(it.color).name}" title="${P[it.size].name} · ${color(it.color).name} × ${it.qty}">`).join('')}</div>
    </div>
    <div style="text-align:right;display:flex;flex-direction:column;gap:10px;align-items:flex-end">
      <span class="price" style="font-size:22px;color:var(--brown-800)">${rp(o.total)}</span>
      ${
        o.status === 'pending'
          ? `<button class="btn btn-pri btn-sm" data-act="goto-pay" data-v="${o.id}">Bayar Sekarang</button>`
          : o.status === 'expired'
            ? `<button class="btn btn-soft btn-sm" data-act="goto-pay" data-v="${o.id}">Buat Kode Baru</button>`
            : o.status === 'paid' || o.status === 'shipped'
              ? `<button class="btn btn-out btn-sm" data-act="goto-done" data-v="${o.id}">Lihat Detail</button>`
              : ''
      }
    </div>
  </div>`
          )
          .join('')
  }
</div>`;
};
