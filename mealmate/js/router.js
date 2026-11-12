/**
 * MealMate — Router berbasis hash (#produk, #checkout, ...) dan render ulang halaman.
 */
import { P } from './data.js';
import { S } from './state.js';
import { $, $$, cartCount, findOrder } from './utils.js';
import { initCarousel, stopCarousel } from './carousel.js';
import { aboutPage } from './pages/about.js';
import { cartPage } from './pages/cart.js';
import { checkoutPage } from './pages/checkout.js';
import { detailPage } from './pages/detail.js';
import { faqPage } from './pages/faq.js';
import { homePage } from './pages/home.js';
import { ordersPage } from './pages/orders.js';
import { drawQR, paymentPage, startTimer, stopPaymentTimer } from './pages/payment.js';
import { productsPage } from './pages/products.js';
import { successPage } from './pages/success.js';

const FAQ_CATEGORIES = ['produk', 'pemesanan', 'pembayaran', 'pengiriman', 'retur'];

/** Peta hash URL -> fungsi render halaman. */
const ROUTES = {
  beranda: homePage,
  produk: productsPage,
  'ukuran-s': () => detailPage('s'),
  'ukuran-m': () => detailPage('m'),
  'ukuran-l': () => detailPage('l'),
  tentang: aboutPage,
  faq: () => faqPage(),
  ...Object.fromEntries(FAQ_CATEGORIES.map(c => ['faq-' + c, () => faqPage(c)])),
  keranjang: cartPage,
  checkout: checkoutPage,
  bayar: paymentPage,
  sukses: successPage,
  pesanan: ordersPage,
};

/** Mengembalikan nama route aktif, atau null bila hash adalah anchor di halaman. */
export function route() {
  const h = location.hash.replace('#', '');
  return ROUTES[h] ? h : h ? (document.getElementById(h) ? null : 'beranda') : 'beranda';
}
/** Merender ulang halaman sesuai hash URL saat ini. */
export function render() {
  const r = route();
  if (r === null) return;
  stopPaymentTimer();
  stopCarousel();
  const app = $('#app');
  app.innerHTML = `<div class="page">${ROUTES[r]()}</div>`;
  const navKey = r.startsWith('ukuran') ? 'produk' : r.startsWith('faq') ? 'faq' : r;
  $$('.nav a').forEach(a => {
    const on = a.dataset.nav === navKey;
    a.classList.toggle('on', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  $('#mnav').classList.remove('open');
  $('#menuBtn').setAttribute('aria-expanded', 'false');
  const titles = {
    beranda: 'Tas Bekal Multifungsi',
    produk: 'Produk',
    tentang: 'Tentang Kami',
    faq: 'FAQ',
    keranjang: 'Keranjang',
    checkout: 'Checkout',
    bayar: 'Pembayaran',
    sukses: 'Pembayaran Berhasil',
    pesanan: 'Pesanan Saya',
  };
  document.title =
    'MealMate — ' + (titles[r] || (r.startsWith('ukuran') ? P[r.slice(-1)].name : r.startsWith('faq') ? 'FAQ' : ''));
  if (r === 'beranda') initCarousel();
  if (r === 'bayar') {
    const o = findOrder(S.currentOrder);
    if (o && o.status === 'pending') {
      if (o.pay === 'qris') drawQR(o);
      startTimer(o);
    } else if (o && o.pay === 'qris') drawQR(o);
  }
  updateBadge();
}
export function updateBadge() {
  const n = cartCount();
  const b = $('#cartN');
  b.textContent = n;
  b.style.display = n ? 'grid' : 'none';
}

/** Memasang listener perubahan hash (navigasi antarhalaman). */
export function initRouter() {
  window.addEventListener('hashchange', () => {
    const r = route();
    if (r === null) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
      return;
    }
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}
