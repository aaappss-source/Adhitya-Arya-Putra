/**
 * MealMate — State aplikasi dan penyimpanan lokal (keranjang, pesanan, data form).
 */
export const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem('mm_' + k);
      return v ? JSON.parse(v) : d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem('mm_' + k, JSON.stringify(v));
    } catch {
      /* penyimpanan tidak tersedia */
    }
  },
};
export const S = {
  cart: store.get('cart', []),
  orders: store.get('orders', []),
  form: store.get('form', {}),
  ship: 'jne',
  pay: 'qris',
  promo: null,
  q: '',
  sel: {},
  gal: {},
  qty: {},
  faqCat: 'produk',
  faqQ: '',
  currentOrder: store.get('current', null),
};
export const save = () => {
  store.set('cart', S.cart);
  store.set('orders', S.orders);
  store.set('form', S.form);
  store.set('current', S.currentOrder);
};
