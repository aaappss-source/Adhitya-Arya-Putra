/**
 * MealMate — Halaman FAQ dengan kategori dan pencarian.
 */
import { FAQ } from '../data.js';
import { S } from '../state.js';
import { esc } from '../utils.js';
import { I } from '../icons.js';
import { band } from '../components.js';

export function faqPage(cat) {
  if (cat && FAQ[cat]) S.faqCat = cat;
  const q = S.faqQ.trim().toLowerCase();
  const items = q
    ? Object.values(FAQ)
        .flatMap(c => c.items)
        .filter(([a, b]) => (a + ' ' + b).toLowerCase().includes(q))
    : FAQ[S.faqCat].items;
  return `
<section class="subhero">
  <div class="wrap">
    <div class="txt">
      <span class="pill" style="font-size:20px;padding:8px 24px;font-weight:700">FAQ</span>
      <h1 class="h-xl">Pertanyaan yang Sering Diajukan</h1>
      <p class="lead" style="color:var(--text)">Temukan jawaban untuk pertanyaan seputar produk, pemesanan, pengiriman, dan lainnya.</p>
    </div>
    <div class="art"><img src="assets/img/hero-faq.jpg" alt="Tas MealMate pink tertutup dan terbuka berisi kotak makan, botol, dan snack"></div>
  </div>
</section>
<section class="wrap" style="padding:40px 24px 60px">
  <div class="faq">
    <div class="cats card" role="tablist" aria-label="Kategori FAQ">
      ${Object.entries(FAQ)
        .map(
          ([id, c]) =>
            `<button role="tab" aria-selected="${id === S.faqCat && !q}" class="${id === S.faqCat && !q ? 'on' : ''}" data-act="faqcat" data-v="${id}">${I[c.icon]}${c.label}</button>`
        )
        .join('')}
    </div>
    <div>
      <label class="faq-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a7a72" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Cari pertanyaan, misalnya “ongkir”" value="${esc(S.faqQ)}" id="faqQ" aria-label="Cari pertanyaan"></label>
      <div id="faqList">${items.length ? items.map(([a, b], i) => `<details class="qa" ${i === 0 ? 'open' : ''}><summary>${esc(a)}${I.chev}</summary><div class="ans">${esc(b)}</div></details>`).join('') : `<p class="muted" style="padding:20px">Belum ada jawaban untuk “${esc(S.faqQ)}”. Hubungi kami di Instagram @mealmate.</p>`}</div>
    </div>
  </div>
</section>
${band()}`;
}
