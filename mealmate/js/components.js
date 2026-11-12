/**
 * MealMate — Komponen UI yang dipakai di beberapa halaman (kartu produk, tabel, ringkasan).
 */
import { COLORS, P, PAYMENTS, PROMOS } from './data.js';
import { S } from './state.js';
import { color, discount, rp, shipCost, subtotal } from './utils.js';
import { I } from './icons.js';

export const band = () => `
<section class="wrap" style="padding:20px 24px 60px">
  <div class="band">
    <span class="burst">${I.burst}</span>
    <div>
      <span class="pill">Siap untuk hidup lebih sehat?</span>
      <h3>Yuk, pilih MealMate favoritmu sekarang!</h3>
      <p class="muted">Jaga kualitas makananmu, di setiap langkah aktivitasmu.</p>
    </div>
    <div style="display:flex;align-items:center;gap:18px">
      <a href="#produk" class="btn btn-pri" style="background:#9d5a4a">Lihat Semua Produk ${I.arrow}</a>
      <span aria-hidden="true">${I.heart}</span>
    </div>
  </div>
</section>`;

export const capIcons = (p, c = 'currentColor', s = 30) => {
  const parts = [`<span>${Array.from({ length: p.boxes }, () => I.box(c, s)).join('')}</span>`, I.bottle(c, s)];
  if (p.snack) parts.push(I.snack(c, s));
  return parts;
};

export function productCard(p) {
  const sel = S.sel[p.id] || p.defColor;
  return `<article class="pcard ${p.id}">
    <div><span class="size-tag">Ukuran ${p.code}</span><p class="sub">${p.cap}</p></div>
    <div class="dots" aria-label="Warna tersedia">${COLORS.slice(0, 4)
      .map(c => `<span class="dot" style="background:${c.hex}" title="${c.name}"></span>`)
      .join('')}<span class="muted" style="font-size:12px">+2 warna</span></div>
    <a href="#ukuran-${p.id}" class="ph" aria-label="Lihat ${p.name}"><img src="${p.card}" alt="${p.name} warna ${color(sel).name} beserta isinya" loading="lazy"></a>
    <div class="spec">
      <div><span class="si">${I.box('currentColor', 22)}</span><span>${p.boxes} Kotak Makan<br>(± 500–750 ml)</span></div>
      <div><span class="si">${I.bottle('currentColor', 22)}</span><span>1 Botol Minum${p.snack ? ' + Snack' : ''}<br>(± 500–700 ml)</span></div>
    </div>
    <div class="row">
      <span class="price">${rp(p.price)}</span>
      <a href="#ukuran-${p.id}" class="btn btn-soft btn-sm">Lihat Detail ${I.arrow}</a>
    </div>
  </article>`;
}

export function compareTable(hl) {
  const ks = ['s', 'm', 'l'];
  const row = (label, fn) =>
    `<tr><td>${label}</td>${ks.map(k => `<td class="${hl === k ? 'hl' : ''}">${fn(P[k])}</td>`).join('')}</tr>`;
  return `<table class="cmp"><thead><tr><th></th>${ks.map(k => `<th class="${hl === k ? 'hl' : ''}"><a href="#ukuran-${k}">Ukuran ${P[k].code}</a></th>`).join('')}</tr></thead><tbody>
    ${row('Harga', p => `<b>${rp(p.price)}</b>`)}
    ${row('Dimensi (P × T × L)', p => p.dim)}
    ${row('Kapasitas', p => p.cap)}
    ${row('Berat tas', p => p.weight)}
    ${row('Tahan panas', () => '± 6–8 jam')}
    ${row('Tahan dingin', () => '± 8–12 jam')}
    ${row('Cocok untuk', p => ({ s: 'Sekali makan, kuliah/kerja setengah hari', m: 'Makan siang + camilan, hari penuh', l: 'Seharian di luar, berbagi bekal' })[p.id])}
  </tbody></table>`;
}

export function cartLines(editable) {
  return S.cart
    .map((it, idx) => {
      const p = P[it.size],
        c = color(it.color);
      return `<div class="line">
      <div class="th"><img src="${c.img}" alt="${p.name} warna ${c.name}"></div>
      <div>
        <b>${p.name}</b>
        <div class="meta">${p.cap}</div>
        ${editable ? `<label class="meta">Warna: <select data-act="chcolor" data-i="${idx}" aria-label="Ganti warna">${COLORS.map(x => `<option value="${x.id}" ${x.id === it.color ? 'selected' : ''}>${x.name}</option>`).join('')}</select></label>` : `<div class="meta">Warna: ${c.name}</div>`}
        <div class="price">${rp(p.price * it.qty)}</div>
      </div>
      <div class="act">
        ${editable ? `<button class="del" data-act="rm" data-i="${idx}" aria-label="Hapus ${p.name}">${I.trash}</button>` : ''}
        <div class="qty sm"><button data-act="cqty" data-i="${idx}" data-v="-1" aria-label="Kurangi">−</button><input type="number" value="${it.qty}" min="1" max="99" data-cart-qty="${idx}" aria-label="Jumlah"><button data-act="cqty" data-i="${idx}" data-v="1" aria-label="Tambah">+</button></div>
      </div>
    </div>`;
    })
    .join('');
}

export function summaryPanel() {
  const sub = subtotal(),
    dsc = discount(sub),
    sh = shipCost(sub),
    tot = sub - dsc + sh;
  const pm = PAYMENTS.find(m => m.id === S.pay);
  return `<div class="panel">
    <h2>Ringkasan Pesanan</h2>
    <div class="sum-items">${S.cart.map(it => `<div class="sum-it"><img src="${color(it.color).img}" alt=""><div><b>${P[it.size].name}</b><span class="muted">${color(it.color).name} · ${it.qty}×</span></div><b>${rp(P[it.size].price * it.qty)}</b></div>`).join('')}</div>
    <div class="promo"><input id="promoIn" placeholder="Kode promo" value="${S.promo || ''}" aria-label="Kode promo" autocapitalize="characters"><button type="button" class="btn btn-soft btn-sm" data-act="promo">${S.promo ? 'Hapus' : 'Pakai'}</button></div>
    ${S.promo ? `<p class="note" style="color:var(--green);margin-top:4px">✓ ${PROMOS[S.promo].label} diterapkan</p>` : `<p class="note" style="margin-top:4px">Coba <b>MEALMATE10</b> untuk diskon 10%</p>`}
    <div style="margin-top:12px">
      <div class="kv"><span>Subtotal</span><b>${rp(sub)}</b></div>
      ${dsc ? `<div class="kv"><span>Diskon</span><b style="color:var(--green)">− ${rp(dsc)}</b></div>` : ''}
      <div class="kv"><span>Ongkos kirim</span><b>${sh ? rp(sh) : 'Gratis'}</b></div>
      <div class="kv"><span>Metode pembayaran</span><b>${pm.name.replace(' Virtual Account', ' VA')}</b></div>
      <div class="kv total"><span>Total Bayar</span><b>${rp(tot)}</b></div>
    </div>
    <button type="submit" class="btn btn-pri btn-block" style="margin-top:18px;height:62px;font-size:22px">Bayar Sekarang</button>
    <a href="#beranda" class="btn btn-out btn-block" style="margin-top:12px">Kembali ke Beranda</a>
    <p class="note"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex:none;margin-top:2px"><path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z"/></svg>Data kamu hanya digunakan untuk memproses dan mengirim pesanan ini.</p>
  </div>`;
}
