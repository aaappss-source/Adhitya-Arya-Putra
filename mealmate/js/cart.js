/**
 * MealMate — Logika keranjang belanja.
 */
import { P } from './data.js';
import { S, save } from './state.js';
import { updateBadge } from './router.js';

export function addToCart(k, qty) {
  const c = S.sel[k] || P[k].defColor;
  const ex = S.cart.find(i => i.size === k && i.color === c);
  if (ex) ex.qty = Math.min(99, ex.qty + qty);
  else S.cart.push({ size: k, color: c, qty });
  save();
  updateBadge();
}
export function mergeCart() {
  const m = [];
  S.cart.forEach(i => {
    const e = m.find(x => x.size === i.size && x.color === i.color);
    e ? (e.qty = Math.min(99, e.qty + i.qty)) : m.push(i);
  });
  S.cart = m;
}
