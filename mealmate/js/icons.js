/**
 * MealMate — Kumpulan ikon SVG inline.
 */
export const I = {
  arrow:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>',
  box: (c = 'currentColor', s = 30) =>
    `<svg width="${s}" height="${s * 0.7}" viewBox="0 0 40 28" fill="none" stroke="${c}" stroke-width="2.4"><rect x="3" y="3" width="34" height="7" rx="3"/><path d="M5 10v11a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4V10"/></svg>`,
  bottle: (c = 'currentColor', s = 30) =>
    `<svg width="${s * 0.5}" height="${s}" viewBox="0 0 20 40" fill="none" stroke="${c}" stroke-width="2.4"><rect x="6" y="2" width="8" height="6" rx="1.5"/><path d="M6 8c-3 2-4 4-4 7v19a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V15c0-3-1-5-4-7"/></svg>`,
  snack: (c = 'currentColor', s = 30) =>
    `<svg width="${s * 0.8}" height="${s}" viewBox="0 0 32 40" fill="none" stroke="${c}" stroke-width="2.4"><path d="M4 3h24l-2 4 2 4v24l-2 2H6l-2-2V11l2-4z"/><text x="16" y="25" font-size="5.6" font-weight="800" text-anchor="middle" fill="${c}" stroke="none" font-family="Arial">SNACK</text></svg>`,
  fire: '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-4-1-6 1-9.5z" fill="#ef6c2f"/><path d="M12 13c1 1.5 2.5 2.4 2.5 4.2a2.5 2.5 0 0 1-5 0c0-1.2.8-1.8 1.4-2.4.3 1 .7 1.2 1.1 1.2 0-1.2-.4-2 0-3z" fill="#fbc02d"/></svg>',
  snow: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a9ad9" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>',
  shield:
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d1a12" stroke-width="2"><path d="M12 2 4 5v7c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z"/><path d="M12 2v20" opacity=".4"/></svg>',
  leaf: '<svg width="28" height="28" viewBox="0 0 24 24"><path d="M20 3C9 3 4 9 4 16c0 2 .5 3.5 1 5 1-6 5-10 10-12-4 3-7 7-8 12 9 0 13-7 13-18z" fill="#4f9a3a"/></svg>',
  bag: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  cart: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
  card: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></svg>',
  truck:
    '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  return:
    '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 9h11a5 5 0 0 1 0 10H8"/><path d="m8 5-4 4 4 4"/></svg>',
  trash:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  copy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>',
  chev: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  check:
    '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  spark:
    '<svg class="spark" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 3 15 11M5 13l7 2M9 5l5 7"/></svg>',
  burst:
    '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><path d="M30 4 27 16M12 18l10 4M8 32h12M16 8l7 10"/></svg>',
  heart:
    '<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#5e3022" stroke-width="2.5" stroke-linecap="round"><path d="M24 38S10 29 10 19a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 19-14 19z"/><path d="M41 8l-3 5M44 18l-5 1"/></svg>',
};
