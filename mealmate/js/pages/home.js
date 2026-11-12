/**
 * MealMate — Halaman Beranda.
 */
import { COLORS, FREE_SHIP, P } from '../data.js';
import { rp } from '../utils.js';
import { I } from '../icons.js';
import { band, productCard } from '../components.js';
import { carousel } from '../carousel.js';

export const homePage = () => `
${carousel()}
<section class="wrap featbar" aria-label="Keunggulan">
  <div class="feat"><div class="ic">${I.fire.replace(/30/g, '24')}${I.snow.replace(/28/g, '20')}</div><div><b>Tahan Panas &amp; Dingin</b><small>Jaga suhu makanan lebih lama</small></div></div>
  <div class="feat"><div class="ic">${I.shield.replace('#3d1a12', '#7a4330')}</div><div><b>Material Premium</b><small>Aman untuk makanan, awet digunakan</small></div></div>
  <div class="feat"><div class="ic">${I.leaf}</div><div><b>Ringan &amp; Mudah Dibawa</b><small>Nyaman untuk aktivitas harian</small></div></div>
  <div class="feat"><div class="ic">${I.truck.replace(/34/g, '26')}</div><div><b>Gratis Ongkir</b><small>Untuk belanja ${rp(FREE_SHIP)}+</small></div></div>
</section>

<section class="sec" id="pilih">
  <div class="wrap">
    <div class="sec-head">${I.spark}<div><h2 class="h-md" style="font-size:clamp(24px,3vw,34px)">Pilih Ukuran yang Sesuai dengan Kebutuhanmu</h2><p class="muted" style="margin-top:6px">Tersedia dalam 3 pilihan ukuran dengan kapasitas dan fitur yang berbeda.</p></div></div>
    <div class="grid3">${['s', 'm', 'l'].map(k => productCard(P[k])).join('')}</div>
  </div>
</section>

<section class="sec" style="background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
  <div class="wrap">
    <div class="sec-head">${I.spark}<div><h2 class="h-md" style="font-size:clamp(24px,3vw,34px)">Kenapa MealMate?</h2><p class="muted" style="margin-top:6px">Dirancang untuk mahasiswa dan pekerja urban yang selalu bergerak.</p></div></div>
    <div class="why">
      <div class="card"><div class="ic" style="background:#fdeee6">${I.fire}</div><b>Hangat 6–8 Jam</b><p>Lapisan foil berinsulasi menahan panas sampai jam makan siang.</p></div>
      <div class="card"><div class="ic" style="background:var(--blue-50)">${I.snow}</div><b>Dingin 8–12 Jam</b><p>Buah, salad, dan minuman tetap segar sepanjang hari.</p></div>
      <div class="card"><div class="ic" style="background:var(--tan-50)">${I.shield}</div><b>Tahan Air &amp; Mudah Dibersihkan</b><p>Cukup dilap jika ada tumpahan kuah atau minuman.</p></div>
      <div class="card"><div class="ic" style="background:#eef6e9">${I.leaf}</div><b>Ringan &amp; Ergonomis</b><p>Tali bahu yang bisa dilepas, handle empuk, mulai ± 380 g.</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">${I.spark}<div><h2 class="h-md" style="font-size:clamp(24px,3vw,34px)">6 Warna, 1 Gaya Kamu</h2><p class="muted" style="margin-top:6px">Semua ukuran tersedia dalam warna berikut.</p></div></div>
    <div class="cgrid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px">
      ${COLORS.map(c => `<a href="#produk" class="card" style="padding:10px;text-align:center;font-weight:600"><img src="${c.img}" alt="Tas MealMate warna ${c.name}" style="border-radius:12px;aspect-ratio:1.15/1;object-fit:cover;width:100%;margin-bottom:8px" loading="lazy">${c.name}</a>`).join('')}
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head">${I.spark}<div><h2 class="h-md" style="font-size:clamp(24px,3vw,34px)">Belanja dalam 4 Langkah</h2></div></div>
    <div class="why">
      ${[
        ['1', 'Pilih ukuran & warna', 'Bandingkan S, M, dan L lalu pilih warna favoritmu.'],
        ['2', 'Checkout', 'Isi alamat pengiriman dan pilih kurir.'],
        ['3', 'Bayar', 'QRIS atau Virtual Account BCA, Mandiri, BNI.'],
        ['4', 'Terima paket', 'Dikirim di hari yang sama untuk pembayaran sebelum 15.00 WIB.'],
      ]
        .map(
          s =>
            `<div class="card"><div class="ic" style="background:var(--pink-100);font-weight:800;font-size:22px;color:var(--brown-800)">${s[0]}</div><b>${s[1]}</b><p>${s[2]}</p></div>`
        )
        .join('')}
    </div>
  </div>
</section>
${band()}`;
