/**
 * MealMate — Banner carousel Beranda: autoplay, geser (swipe/drag), tombol, dan indikator.
 */
import { COLORS } from './data.js';
import { $, $$ } from './utils.js';
import { I } from './icons.js';

export const SLIDES = [
  {
    cls: 'sl-1',
    tag: 'h1',
    pill: 'Tas Bekal Multifungsi',
    title: 'MealMate<span>Teman Setia Aktivitas Harianmu</span>',
    text: 'Praktis, stylish, dan tahan lama. MealMate hadir untuk menjaga makanan tetap hangat atau dingin, di mana pun kamu berada.',
    cta: ['Lihat Produk', '#produk'],
    cta2: ['Tentang Kami', '#tentang'],
    art: `<img src="assets/img/hero-home.jpg" alt="Tas MealMate hitam tertutup dan terbuka berisi dua kotak makan dan botol minum" draggable="false">`,
  },
  {
    cls: 'sl-2',
    pill: 'Kapasitas Terbesar',
    title: 'Ukuran L<span>3 Kotak Makan + Botol Minum + Snack</span>',
    text: 'Untuk yang selalu siap, kapan saja. Ruang paling lega untuk seharian di luar atau berbagi bekal.',
    cta: ['Lihat Ukuran L', '#ukuran-l'],
    cta2: ['Bandingkan Ukuran', '#produk'],
    art: `<img src="assets/img/l-card.jpg" alt="Tas MealMate ukuran L warna pink, tertutup dan terbuka" draggable="false"><span class="tag">Rp 299.000<small>32 × 26 × 22 cm</small></span>`,
  },
  {
    cls: 'sl-3',
    pill: 'Promo Spesial',
    title: 'Diskon 10%<span>untuk semua ukuran MealMate</span>',
    text: 'Masukkan kode promo saat checkout. Berlaku untuk semua warna dan bisa digabung dengan gratis ongkir.',
    promo: 'MEALMATE10',
    cta: ['Belanja Sekarang', '#produk'],
    art: `<img src="assets/img/hero-about.jpg" alt="Tas MealMate pink dengan tulisan Carry your meal, carry your day" draggable="false">`,
  },
  {
    cls: 'sl-4',
    pill: '6 Pilihan Warna',
    title: 'Pilih Warna,<span>Tunjukkan Gayamu</span>',
    text: 'Hitam, Abu-abu Metalik, Pink, Biru, Matcha, dan Multi Warna. Semua tersedia di ukuran S, M, dan L.',
    cta: ['Pilih Warnamu', '#ukuran-m'],
    art: `<div class="swatch">${COLORS.map(c => `<figure><img src="${c.img}" alt="" draggable="false">${c.name}</figure>`).join('')}</div>`,
  },
  {
    cls: 'sl-5',
    pill: 'Gratis Ongkir',
    title: 'Gratis Ongkir<span>untuk belanja Rp500.000+</span>',
    text: 'Dikirim di hari yang sama untuk pembayaran sebelum pukul 15.00 WIB. Bayar mudah pakai QRIS atau Virtual Account.',
    cta: ['Mulai Belanja', '#produk'],
    cta2: ['Info Pengiriman', '#faq-pengiriman'],
    art: `<img src="assets/img/m-card.jpg" alt="Tas MealMate ukuran M abu-abu dengan dua kotak makan dan botol" draggable="false"><span class="tag">Ukuran M<small>Rp 239.000</small></span>`,
  },
];
export const CAR_DUR = 5000;
export const carousel = () => `
<section class="car" id="car" aria-roledescription="carousel" aria-label="Banner promosi" style="--dur:${CAR_DUR}ms">
  <div class="car-track" id="carTrack" aria-live="off">
    ${SLIDES.map(
      (
        sl,
        i
      ) => `<div class="slide ${sl.cls}" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${SLIDES.length}" ${i ? 'aria-hidden="true"' : ''}>
      <div class="wrap">
        <div class="txt">
          <span class="pill tan">${sl.pill}</span>
          <${sl.tag || 'h2'}>${sl.title}</${sl.tag || 'h2'}>
          <p class="lead" style="color:var(--text)">${sl.text}</p>
          ${sl.promo ? `<span class="promo-code">${sl.promo}<button type="button" data-act="copy" data-v="${sl.promo}">Salin</button></span>` : ''}
          <div style="display:flex;gap:12px;flex-wrap:wrap"><a href="${sl.cta[1]}" class="btn btn-pri" tabindex="${i ? -1 : 0}">${sl.cta[0]} ${I.arrow}</a>${sl.cta2 ? `<a href="${sl.cta2[1]}" class="btn btn-out" tabindex="${i ? -1 : 0}">${sl.cta2[0]}</a>` : ''}</div>
        </div>
        <div class="art">${sl.art}</div>
      </div>
    </div>`
    ).join('')}
  </div>
  <button class="car-nav prev" type="button" data-car="prev" aria-label="Slide sebelumnya">${I.back}</button>
  <button class="car-nav next" type="button" data-car="next" aria-label="Slide berikutnya">${I.arrow}</button>
  <div class="car-dots" role="tablist" aria-label="Pilih slide">${SLIDES.map((_, i) => `<button type="button" role="tab" data-car="${i}" aria-label="Slide ${i + 1}" class="${i ? '' : 'on'}" aria-selected="${!i}"></button>`).join('')}</div>
</section>`;

let carTimer = null,
  carAC = null;

/** Menghentikan autoplay dan melepas listener carousel (dipanggil saat pindah halaman). */
export function stopCarousel() {
  clearTimeout(carTimer);
  carAC?.abort();
}

export function initCarousel() {
  const root = $('#car');
  if (!root) return;
  carAC?.abort();
  carAC = new AbortController();
  const sig = { signal: carAC.signal };
  const track = $('#carTrack'),
    slides = $$('.slide', track),
    dots = $$('.car-dots button', root);
  const n = slides.length;
  let idx = 0,
    hover = false,
    focusIn = false;
  const go = (i, user) => {
    idx = (i + n) % n;
    track.style.transform = `translateX(${-idx * 100}%)`;
    slides.forEach((s, k) => {
      const on = k === idx;
      s.toggleAttribute('aria-hidden', !on);
      $$('a,button', s).forEach(a => (a.tabIndex = on ? 0 : -1));
    });
    dots.forEach((d, k) => {
      d.classList.remove('on');
      d.setAttribute('aria-selected', k === idx);
    });
    void root.offsetWidth;
    dots[idx].classList.add('on');
    schedule();
  };
  const schedule = () => {
    clearTimeout(carTimer);
    const paused = hover || focusIn || document.hidden;
    root.classList.toggle('paused', paused);
    if (!paused) carTimer = setTimeout(() => go(idx + 1), CAR_DUR);
  };
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-car]');
    if (!b) return;
    const v = b.dataset.car;
    go(v === 'prev' ? idx - 1 : v === 'next' ? idx + 1 : +v, true);
  });
  root.addEventListener('mouseenter', () => {
    hover = true;
    restartProgress();
    schedule();
  });
  root.addEventListener('mouseleave', () => {
    hover = false;
    restartProgress();
    schedule();
  });
  root.addEventListener('focusin', () => {
    focusIn = true;
    schedule();
  });
  root.addEventListener('focusout', e => {
    if (!root.contains(e.relatedTarget)) {
      focusIn = false;
      restartProgress();
      schedule();
    }
  });
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(idx - 1, true);
    if (e.key === 'ArrowRight') go(idx + 1, true);
  });
  const restartProgress = () => {
    const d = dots[idx];
    d.classList.remove('on');
    void d.offsetWidth;
    d.classList.add('on');
  };
  document.addEventListener('visibilitychange', schedule, sig);

  // swipe / drag
  let sx = 0,
    sy = 0,
    dx = 0,
    dragging = false,
    locked = null,
    moved = false;
  root.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target.closest('.car-nav,.car-dots')) return;
    dragging = true;
    locked = null;
    moved = false;
    sx = e.clientX;
    sy = e.clientY;
    dx = 0;
  });
  window.addEventListener(
    'pointermove',
    e => {
      if (!dragging) return;
      const mx = e.clientX - sx,
        my = e.clientY - sy;
      if (locked === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) locked = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (locked !== 'x') return;
      moved = true;
      dx = mx;
      root.classList.add('drag');
      clearTimeout(carTimer);
      const edge = (idx === 0 && dx > 0) || (idx === n - 1 && dx < 0) ? 0.35 : 1;
      track.style.transform = `translateX(calc(${-idx * 100}% + ${dx * edge}px))`;
    },
    sig
  );
  const end = () => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('drag');
    if (locked === 'x') {
      const th = Math.min(120, root.clientWidth * 0.15);
      go(dx < -th ? idx + 1 : dx > th ? idx - 1 : idx, true);
    } else schedule();
  };
  window.addEventListener('pointerup', end, sig);
  window.addEventListener('pointercancel', end, sig);
  root.addEventListener(
    'click',
    e => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true
  );
  go(0);
}
