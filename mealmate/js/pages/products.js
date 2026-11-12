/**
 * MealMate — Halaman daftar produk dan hasil pencarian.
 */
import { COLORS, P } from '../data.js';
import { S } from '../state.js';
import { esc } from '../utils.js';
import { I } from '../icons.js';
import { band, compareTable, productCard } from '../components.js';

export const productsPage = () => {
  const q = S.q.trim().toLowerCase();
  const list = ['s', 'm', 'l']
    .map(k => P[k])
    .filter(
      p =>
        !q ||
        [p.name, p.cap, p.tagline, 'ukuran ' + p.code, ...COLORS.map(c => c.name)]
          .join(' ')
          .toLowerCase()
          .includes(q) ||
        q
          .split(/\s+/)
          .every(w => (p.name + ' ' + p.cap + ' ' + COLORS.map(c => c.name).join(' ')).toLowerCase().includes(w))
    );
  return `
<section class="sec" style="padding-top:40px">
  <div class="wrap">
    <div class="sec-head">${I.spark}<div><h1 class="h-md" style="font-size:clamp(26px,3.2vw,38px)">Pilih Ukuran yang Sesuai dengan Kebutuhanmu</h1><p class="muted" style="margin-top:6px">Tersedia dalam 3 pilihan ukuran dengan kapasitas dan fitur yang berbeda.</p></div></div>
    ${q ? `<p style="margin:-14px 0 24px" class="muted">Hasil pencarian untuk “<b style="color:var(--brown-900)">${esc(S.q)}</b>” · ${list.length} produk · <button style="text-decoration:underline;color:var(--brown-800)" data-act="clear-search">Hapus pencarian</button></p>` : ''}
    ${list.length ? `<div class="grid3">${list.map(productCard).join('')}</div>` : `<div class="card empty"><div class="ic">${I.bag}</div><h2 class="h-md">Produk tidak ditemukan</h2><p class="muted" style="margin:6px 0 18px">Coba kata kunci lain, misalnya “pink” atau “ukuran M”.</p><button class="btn btn-pri btn-sm" data-act="clear-search">Lihat semua produk</button></div>`}
  </div>
</section>
<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head">${I.spark}<div><h2 class="h-md">Bandingkan Ukuran</h2></div></div>
    <div style="overflow-x:auto">${compareTable()}</div>
  </div>
</section>
${band()}`;
};
