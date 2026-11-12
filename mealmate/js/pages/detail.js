/**
 * MealMate — Halaman detail produk per ukuran (S, M, L).
 */
import { COLORS, FREE_SHIP, P } from '../data.js';
import { S } from '../state.js';
import { color, rp } from '../utils.js';
import { I } from '../icons.js';
import { band, compareTable } from '../components.js';

export function detailPage(k) {
  const p = P[k];
  const sel = S.sel[k] || p.defColor;
  const g = S.gal[k] || 'closed';
  const qty = S.qty[k] || 1;
  const main = g === 'closed' ? p.closed : g === 'open' ? p.open : color(sel).img;
  const accent = { s: 'var(--tan-500)', m: 'var(--blue-500)', l: 'var(--pink-500)' }[k];
  return `
<div class="wrap dtl">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="#beranda">Beranda</a> / <a href="#produk">Produk</a> / <span style="color:var(--brown-900)">Ukuran ${p.code}</span></nav>
  <section class="dtl-top ${k}">
    <div>
      <div class="gal-main"><img id="galImg" class="${g === 'color' ? 'sm' : ''}" src="${main}" alt="${p.name} ${g === 'open' ? 'terbuka' : ''} warna ${color(sel).name}"><span class="dim">📐 ${p.dim}</span></div>
      <div class="thumbs" role="tablist" aria-label="Foto produk">
        <button class="${g === 'color' ? 'on' : ''}" data-act="gal" data-k="${k}" data-v="color" aria-label="Foto warna terpilih"><img src="${color(sel).img}" alt=""></button>
        <button class="${g === 'closed' ? 'on' : ''}" data-act="gal" data-k="${k}" data-v="closed" aria-label="Foto tas tertutup"><img src="${p.closed}" alt=""></button>
        <button class="${g === 'open' ? 'on' : ''}" data-act="gal" data-k="${k}" data-v="open" aria-label="Foto tas terbuka"><img src="${p.open}" alt=""></button>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:20px">
      <div>
        <span class="size-tag ${k}" style="font-size:32px;padding:6px 26px">Ukuran ${p.code}</span>
        <h1 style="font-size:clamp(22px,2.4vw,28px);font-weight:800;color:var(--brown-900);margin-top:14px;letter-spacing:-.01em">(${p.cap})</h1>
        <p class="lead" style="margin-top:4px">${p.tagline}</p>
      </div>
      <div class="price" style="font-size:34px;color:${accent}">${rp(p.price)}</div>
      <p class="muted">${p.desc}</p>
      <div class="chips">
        <div class="chip">${I.fire}<div><b>Tahan Panas</b><span>hingga ± 6–8 jam</span></div></div>
        <div class="chip">${I.snow}<div><b>Tahan Dingin</b><span>hingga ± 8–12 jam</span></div></div>
        <div class="chip">${I.shield}<div><b>Material Premium</b><span>Tahan air &amp; mudah dibersihkan</span></div></div>
        <div class="chip">${I.leaf}<div><b>Ringan &amp;</b><span>mudah dibawa</span></div></div>
      </div>
      <div>
        <p style="font-weight:700;color:var(--brown-900);margin-bottom:10px">Pilihan Warna: <span class="muted" style="font-weight:500">${color(sel).name}</span></p>
        <div class="colors" role="radiogroup" aria-label="Pilih warna">
          ${COLORS.map(c => `<button class="cbtn ${c.id === sel ? 'on' : ''}" role="radio" aria-checked="${c.id === sel}" data-act="color" data-k="${k}" data-v="${c.id}"><img src="${c.img}" alt="">${c.name}</button>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <div class="qty" aria-label="Jumlah"><button data-act="dqty" data-k="${k}" data-v="-1" aria-label="Kurangi">−</button><input type="number" min="1" max="99" value="${qty}" data-qty-input="${k}" aria-label="Jumlah"><button data-act="dqty" data-k="${k}" data-v="1" aria-label="Tambah">+</button></div>
        <button class="btn btn-out" style="flex:1;min-width:190px" data-act="add" data-k="${k}">Tambah ke Keranjang</button>
        <button class="btn btn-pri" style="flex:1;min-width:150px" data-act="buy" data-k="${k}">Beli Sekarang</button>
      </div>
      <p class="note">🚚 Gratis ongkir untuk belanja ${rp(FREE_SHIP)}+ · Dikirim hari ini untuk pembayaran sebelum 15.00 WIB</p>
    </div>
  </section>

  <section class="sec" style="padding:50px 0 0">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      <div>
        <h2 class="h-md" style="margin-bottom:16px"><span class="size-tag ${k}" style="font-size:22px">Kapasitas</span></h2>
        <div class="cap">
          <div class="it"><div style="display:flex;flex-direction:column;gap:6px">${Array.from({ length: p.boxes }, () => I.box('#2b1712', 64)).join('')}</div>${p.boxes} Kotak Makan</div>
          <span class="plus">+</span>
          <div class="it">${I.bottle('#2b1712', 100)}<span>1 Botol Minum<small>(± 500–700 ml)</small></span></div>
          ${p.snack ? `<span class="plus">+</span><div class="it">${I.snack('#2b1712', 84)}<span>Snack<small>(± 1–2 pcs)</small></span></div>` : ''}
        </div>
      </div>
      <div>
        <h2 class="h-md" style="margin-bottom:16px"><span class="size-tag ${k}" style="font-size:22px">Dimensi</span></h2>
        <div class="cap" style="flex-direction:column;align-items:stretch;gap:0">
          <div style="display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center">
            <div style="writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;color:var(--brown-900);border-left:2px solid var(--brown-900);padding-left:6px">${p.h} cm</div>
            <img src="${p.closed}" alt="Dimensi ${p.name}" style="max-height:220px;object-fit:contain;margin:0 auto">
          </div>
          <div style="display:flex;justify-content:space-around;font-weight:700;color:var(--brown-900);border-top:2px solid var(--brown-900);margin-left:40px;padding-top:8px"><span>Panjang ${p.w} cm</span><span>Lebar ${p.d} cm</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" style="padding:50px 0 0">
    <h2 class="h-md" style="margin-bottom:16px">Bandingkan dengan ukuran lain</h2>
    <div style="overflow-x:auto">${compareTable(k)}</div>
  </section>
</div>
${band()}`;
}
