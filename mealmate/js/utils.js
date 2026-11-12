/**
 * MealMate — Helper umum: selektor DOM, format Rupiah, kalkulasi harga, toast, dan modal.
 */
import { COLORS, FREE_SHIP, P, PROMOS, SHIPPING } from './data.js';
import { S } from './state.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
export const esc = s =>
  String(s ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
export const color = id => COLORS.find(c => c.id === id) || COLORS[0];
export const cartCount = () => S.cart.reduce((a, i) => a + i.qty, 0);
export const subtotal = (items = S.cart) => items.reduce((a, i) => a + P[i.size].price * i.qty, 0);
export const shipCost = (sub, id = S.ship) => (sub >= FREE_SHIP ? 0 : SHIPPING.find(s => s.id === id)?.cost || 0);
export const discount = (sub, promo = S.promo) =>
  !promo
    ? 0
    : PROMOS[promo].type === 'pct'
      ? Math.round((sub * PROMOS[promo].v) / 100)
      : Math.min(sub, PROMOS[promo].v);
export const rnd = n => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
};
export const newOrderId = () => `MMT-${rnd(4)}-${rnd(4)}-${rnd(4)}`;
export const fmtDate = ts => {
  const d = new Date(ts);
  return (
    d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ', ' +
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  );
};
export const findOrder = id => S.orders.find(o => o.id === id);
export const STATUS = {
  pending: ['Menunggu Pembayaran', ''],
  paid: ['Dibayar · Sedang Dikemas', 'ok'],
  shipped: ['Dikirim', 'ship'],
  expired: ['Kedaluwarsa', 'x'],
  cancelled: ['Dibatalkan', 'x'],
};
export const statusPill = s => `<span class="status ${STATUS[s][1]}">${STATUS[s][0]}</span>`;

export function toast(msg, link) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.innerHTML = `<span>${msg}</span>${link ? `<a href="${link[1]}">${link[0]}</a>` : ''}`;
  $$('.toast').forEach(x => x.remove());
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3600);
}
export function modal(html) {
  $('#layer').innerHTML = `<div class="modal" role="dialog" aria-modal="true"><div class="box">${html}</div></div>`;
}
export function closeModal() {
  $('#layer').innerHTML = '';
}
export async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Disalin: ' + text);
  } catch {
    const r = document.createRange();
    const el = btn?.parentElement?.querySelector('b');
    if (el) {
      r.selectNodeContents(el);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
    toast('Teks dipilih, tekan Ctrl/⌘+C untuk menyalin');
  }
}
