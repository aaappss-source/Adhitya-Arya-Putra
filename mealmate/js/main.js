/**
 * MealMate — Titik masuk aplikasi: delegasi event (klik, input, submit) dan inisialisasi router.
 */
import { P, PAY_WINDOW, PROMOS } from './data.js';
import { S, save, store } from './state.js';
import { $, $$, closeModal, color, copyText, findOrder, modal, toast } from './utils.js';
import { summaryPanel } from './components.js';
import { addToCart, mergeCart } from './cart.js';
import { initRouter, render, route } from './router.js';
import { placeOrder, validate } from './pages/checkout.js';
import { verifyPayment } from './pages/payment.js';

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const { act, k, v } = t.dataset,
    i = +t.dataset.i;
  switch (act) {
    case 'gal':
      S.gal[k] = v;
      render();
      break;
    case 'color':
      S.sel[k] = v;
      S.gal[k] = 'color';
      render();
      break;
    case 'dqty':
      S.qty[k] = Math.max(1, Math.min(99, (S.qty[k] || 1) + +v));
      $(`[data-qty-input="${k}"]`).value = S.qty[k];
      break;
    case 'add':
      addToCart(k, S.qty[k] || 1);
      toast(`${P[k].name} (${color(S.sel[k] || P[k].defColor).name}) ditambahkan`, ['Lihat Keranjang', '#keranjang']);
      break;
    case 'buy':
      addToCart(k, S.qty[k] || 1);
      location.hash = 'checkout';
      break;
    case 'rm': {
      const it = S.cart.splice(i, 1)[0];
      save();
      render();
      toast(`${P[it.size].name} dihapus dari keranjang`);
      break;
    }
    case 'cqty':
      S.cart[i].qty = Math.max(1, Math.min(99, S.cart[i].qty + +v));
      save();
      refreshCartViews();
      break;
    case 'clear-search':
      S.q = '';
      $$('[data-search] input').forEach(x => (x.value = ''));
      render();
      break;
    case 'faqcat':
      S.faqCat = v;
      S.faqQ = '';
      history.replaceState(null, '', '#faq-' + v);
      render();
      break;
    case 'scroll':
      e.preventDefault();
      document.getElementById(v)?.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'promo': {
      if (S.promo) {
        S.promo = null;
      } else {
        const code = ($('#promoIn').value || '').trim().toUpperCase();
        if (PROMOS[code]) {
          S.promo = code;
          toast(PROMOS[code].label + ' diterapkan');
        } else {
          toast(code ? 'Kode promo tidak valid' : 'Masukkan kode promo dulu');
          return;
        }
      }
      $('#summary').innerHTML = summaryPanel();
      break;
    }
    case 'copy':
      copyText(v, t);
      break;
    case 'paid':
      verifyPayment();
      break;
    case 'renew': {
      const o = findOrder(S.currentOrder);
      o.status = 'pending';
      o.expires = Date.now() + PAY_WINDOW;
      if (o.va) o.va = o.va.slice(0, 5) + String(Math.floor(Math.random() * 1e11)).padStart(11, '0');
      save();
      render();
      toast('Kode pembayaran baru dibuat');
      break;
    }
    case 'cancel':
      modal(
        `<h2 class="h-md">Batalkan pesanan?</h2><p class="muted" style="margin:10px 0 22px">Pesanan ${S.currentOrder} akan dibatalkan dan tidak bisa dibayar lagi.</p><div style="display:flex;gap:10px"><button class="btn btn-out" style="flex:1" data-act="close">Tidak</button><button class="btn btn-pri" style="flex:1;background:var(--red)" data-act="cancel-yes">Ya, batalkan</button></div>`
      );
      break;
    case 'cancel-yes': {
      const o = findOrder(S.currentOrder);
      o.status = 'cancelled';
      save();
      closeModal();
      location.hash = 'pesanan';
      toast('Pesanan dibatalkan');
      break;
    }
    case 'close':
      closeModal();
      break;
    case 'goto-pay': {
      S.currentOrder = v;
      const o = findOrder(v);
      if (o.status === 'expired') {
        o.status = 'pending';
        o.expires = Date.now() + PAY_WINDOW;
      }
      save();
      location.hash = 'bayar';
      if (route() === 'bayar') render();
      break;
    }
    case 'goto-done':
      S.currentOrder = v;
      save();
      location.hash = 'sukses';
      render();
      break;
  }
});

export function refreshCartViews() {
  const r = route();
  if (r === 'checkout') {
    const y = scrollY;
    render();
    scrollTo(0, y);
  } else render();
}

document.addEventListener('change', e => {
  const t = e.target;
  if (t.matches('[data-act="chcolor"]')) {
    S.cart[+t.dataset.i].color = t.value;
    mergeCart();
    save();
    render();
  }
  if (t.matches('[data-cart-qty]')) {
    S.cart[+t.dataset.cartQty].qty = Math.max(1, Math.min(99, parseInt(t.value) || 1));
    save();
    refreshCartViews();
  }
  if (t.matches('[data-qty-input]')) {
    const k = t.dataset.qtyInput;
    S.qty[k] = Math.max(1, Math.min(99, parseInt(t.value) || 1));
    t.value = S.qty[k];
  }
  if (t.name === 'ship' || t.name === 'pay') {
    S[t.name] = t.value;
    $$(`input[name="${t.name}"]`).forEach(x => x.closest('.opt').classList.toggle('on', x.checked));
    $('#summary').innerHTML = summaryPanel();
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.closest('#coForm') && t.name && !['ship', 'pay'].includes(t.name)) {
    S.form[t.name] = t.value;
    store.set('form', S.form);
    const box = t.closest('.fld');
    if (box?.classList.contains('err')) box.classList.remove('err');
  }
  if (t.id === 'faqQ') {
    S.faqQ = t.value;
    const pos = t.selectionStart;
    render();
    const n = $('#faqQ');
    n.focus();
    n.setSelectionRange(pos, pos);
  }
});
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.matches('[data-search]')) {
    e.preventDefault();
    S.q = f.querySelector('input').value;
    $$('[data-search] input').forEach(x => (x.value = S.q));
    if (route() === 'produk') render();
    else location.hash = 'produk';
    return;
  }
  if (f.id === 'coForm') {
    e.preventDefault();
    const res = validate(f);
    if (!res.ok) {
      res.first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      res.first.querySelector('input,textarea').focus({ preventScroll: true });
      toast('Lengkapi data penerima terlebih dulu');
      return;
    }
    S.form = { ...res.data };
    delete S.form.ship;
    delete S.form.pay;
    save();
    const btn = f.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Memproses…';
    setTimeout(() => placeOrder(res.data), 600);
  }
});

$('#menuBtn').addEventListener('click', () => {
  const m = $('#mnav');
  const open = !m.classList.contains('open');
  m.classList.toggle('open', open);
  $('#menuBtn').setAttribute('aria-expanded', open);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    $('#mnav').classList.remove('open');
  }
});

initRouter();
render();
