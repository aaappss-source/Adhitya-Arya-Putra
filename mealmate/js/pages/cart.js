/**
 * MealMate — Halaman Keranjang.
 */
import { FREE_SHIP } from '../data.js';
import { S } from '../state.js';
import { cartCount, rp, subtotal } from '../utils.js';
import { I } from '../icons.js';
import { cartLines } from '../components.js';

export const cartPage = () => {
  if (!S.cart.length)
    return `<div class="wrap" style="padding:50px 24px 70px"><h1 class="h-lg" style="margin-bottom:24px">Keranjang</h1><div class="card empty"><div class="ic">${I.cart}</div><h2 class="h-md">Keranjangmu masih kosong</h2><p class="muted" style="margin:6px 0 20px">Yuk pilih MealMate yang pas untuk aktivitasmu.</p><a href="#produk" class="btn btn-pri">Lihat Produk ${I.arrow}</a></div></div>`;
  const sub = subtotal();
  return `
<div class="wrap">
  <div style="padding-top:36px"><h1 class="h-lg">Keranjang</h1><p class="lead">${cartCount()} barang di keranjangmu.</p></div>
  <div class="co" style="padding-top:24px">
    <div class="panel"><h2>Produk yang Dipesan</h2>${cartLines(true)}</div>
    <div class="sticky">
      <div class="panel">
        <h2>Ringkasan Belanja</h2>
        <div class="kv"><span>Subtotal (${cartCount()} barang)</span><b>${rp(sub)}</b></div>
        <div class="kv"><span>Ongkos kirim</span><b class="muted" style="font-weight:500">Dihitung saat checkout</b></div>
        ${sub < FREE_SHIP ? `<p class="note">🚚 Tambah ${rp(FREE_SHIP - sub)} lagi untuk gratis ongkir.</p>` : `<p class="note" style="color:var(--green)">🎉 Kamu dapat gratis ongkir!</p>`}
        <div class="kv total"><span>Total sementara</span><b>${rp(sub)}</b></div>
        <a href="#checkout" class="btn btn-pri btn-block" style="margin-top:18px;height:58px;font-size:18px">Lanjut ke Checkout</a>
        <a href="#produk" class="btn btn-out btn-block" style="margin-top:12px">Lanjut Belanja</a>
      </div>
    </div>
  </div>
</div>`;
};
