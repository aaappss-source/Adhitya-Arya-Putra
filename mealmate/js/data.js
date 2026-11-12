/**
 * MealMate — Data statis toko: produk, warna, kurir, metode pembayaran, promo, dan FAQ.
 */
export const COLORS = [
  { id: 'hitam', name: 'Hitam', hex: '#262322', img: 'assets/img/c-hitam.jpg' },
  { id: 'abu', name: 'Abu-abu Metalik', hex: '#8d8f93', img: 'assets/img/c-abu.jpg' },
  { id: 'pink', name: 'Pink', hex: '#e98a9c', img: 'assets/img/c-pink.jpg' },
  { id: 'biru', name: 'Biru', hex: '#4f7fb3', img: 'assets/img/c-biru.jpg' },
  { id: 'matcha', name: 'Matcha', hex: '#86a061', img: 'assets/img/c-matcha.jpg' },
  { id: 'multi', name: 'Multi Warna', hex: 'linear-gradient(135deg,#f9c3dc,#c4e1fb,#fff0b5)', img: 'assets/img/c-multi.jpg' },
];
export const P = {
  s: {
    id: 's',
    code: 'S',
    name: 'MealMate Ukuran S',
    price: 189000,
    cap: '1 Kotak Makan + Botol Minum',
    tagline: 'Praktis untuk aktivitas harianmu',
    dim: '24 × 22 × 15 cm',
    w: 24,
    h: 22,
    d: 15,
    boxes: 1,
    snack: false,
    closed: 'assets/img/s-closed.jpg',
    open: 'assets/img/s-open.jpg',
    card: 'assets/img/s-card.jpg',
    defColor: 'hitam',
    weight: '± 380 g',
    desc: 'Ukuran ringkas untuk satu kali makan. Pas dibawa ke kampus atau kantor tanpa memenuhi tas utama.',
  },
  m: {
    id: 'm',
    code: 'M',
    name: 'MealMate Ukuran M',
    price: 239000,
    cap: '2 Kotak Makan + Botol Minum',
    tagline: 'Lebih banyak ruang, lebih banyak pilihan menu',
    dim: '28 × 22 × 18 cm',
    w: 28,
    h: 22,
    d: 18,
    boxes: 2,
    snack: false,
    closed: 'assets/img/m-closed.jpg',
    open: 'assets/img/m-open.jpg',
    card: 'assets/img/m-card.jpg',
    defColor: 'abu',
    weight: '± 460 g',
    desc: 'Muat makan siang dan camilan sore, atau dua menu berbeda. Pilihan paling populer untuk hari yang panjang.',
  },
  l: {
    id: 'l',
    code: 'L',
    name: 'MealMate Ukuran L',
    price: 299000,
    cap: '3 Kotak Makan + Botol Minum + Snack',
    tagline: 'Untuk yang selalu siap, kapan saja',
    dim: '32 × 26 × 22 cm',
    w: 32,
    h: 26,
    d: 22,
    boxes: 3,
    snack: true,
    closed: 'assets/img/l-closed.jpg',
    open: 'assets/img/l-open.jpg',
    card: 'assets/img/l-card.jpg',
    defColor: 'pink',
    weight: '± 560 g',
    desc: 'Kapasitas paling lega: tiga kotak makan, botol minum, dan ruang ekstra untuk snack. Cocok untuk seharian di luar atau berbagi bekal.',
  },
};
export const SHIPPING = [
  { id: 'jne', name: 'JNE Reguler', eta: '2–3 hari kerja', cost: 15000 },
  { id: 'jnt', name: 'J&T Express', eta: '2–3 hari kerja', cost: 14000 },
  { id: 'sicepat', name: 'SiCepat REG', eta: '1–3 hari kerja', cost: 13000 },
  { id: 'gosend', name: 'GoSend Same Day', eta: 'Hari ini (Jabodetabek)', cost: 25000 },
];
export const FREE_SHIP = 500000;
export const PAYMENTS = [
  {
    id: 'qris',
    name: 'QRIS',
    sub: 'Bayar pakai GoPay, OVO, DANA, ShopeePay, atau m-banking',
    logo: 'QRIS',
    bg: '#111',
    fg: '#fff',
  },
  {
    id: 'bca',
    name: 'BCA Virtual Account',
    sub: 'Transfer melalui m-BCA, KlikBCA, atau ATM',
    logo: 'BCA',
    bg: '#0b4ea2',
    fg: '#fff',
  },
  {
    id: 'mandiri',
    name: 'Mandiri Virtual Account',
    sub: "Livin' by Mandiri atau ATM Mandiri",
    logo: 'mandiri',
    bg: '#003d79',
    fg: '#f8c21c',
  },
  {
    id: 'bni',
    name: 'BNI Virtual Account',
    sub: 'BNI Mobile Banking atau ATM BNI',
    logo: 'BNI',
    bg: '#f37021',
    fg: '#fff',
  },
];
export const PROMOS = {
  MEALMATE10: { type: 'pct', v: 10, label: 'Diskon 10%' },
  BEKALSEHAT: { type: 'flat', v: 25000, label: 'Potongan Rp25.000' },
};
export const PAY_WINDOW = 15 * 60 * 1000;

export const FAQ = {
  produk: {
    label: 'Produk',
    icon: 'bag',
    items: [
      [
        'Apa saja ukuran MealMate yang tersedia?',
        'MealMate tersedia dalam 3 ukuran: S (1 kotak makan + 1 botol minum), M (2 kotak makan + 1 botol minum), dan L (3 kotak makan + 1 botol minum + snack).',
      ],
      [
        'Apa saja warna yang tersedia?',
        'Setiap ukuran tersedia dalam 6 warna: Hitam, Abu-abu Metalik, Pink, Biru, Matcha, dan Multi Warna.',
      ],
      [
        'Apakah tas ini tahan panas dan tahan dingin?',
        'Ya. Lapisan dalam berbahan aluminium foil berinsulasi menjaga makanan tetap hangat sekitar 6–8 jam dan tetap dingin sekitar 8–12 jam, tergantung suhu awal makanan dan lingkungan.',
      ],
      [
        'Apakah kotak makan dan botol minum sudah termasuk?',
        'Harga yang tertera adalah untuk tasnya. Ukuran kapasitas (jumlah kotak dan botol) adalah panduan muatan agar kamu bisa memilih ukuran yang pas.',
      ],
      [
        'Bagaimana cara membersihkannya?',
        'Lapisan dalam tahan air dan cukup dilap dengan kain lembap dan sabun ringan. Bagian luar bisa dicuci tangan dengan air dingin. Hindari mesin cuci dan pengering.',
      ],
    ],
  },
  pemesanan: {
    label: 'Pemesanan',
    icon: 'cart',
    items: [
      [
        'Bagaimana cara memesan?',
        'Pilih ukuran di halaman Produk, tentukan warna dan jumlah, lalu klik "Tambah ke Keranjang". Buka keranjang, klik "Lanjut ke Checkout", isi data pengiriman, pilih kurir dan metode pembayaran, lalu selesaikan pembayaran.',
      ],
      [
        'Apakah saya perlu membuat akun?',
        'Tidak perlu. Kamu bisa checkout sebagai tamu. Riwayat pesanan tersimpan di browser yang kamu pakai dan bisa dilihat di menu Pesanan Saya (ikon profil).',
      ],
      [
        'Bisakah saya mengubah pesanan setelah checkout?',
        'Selama status masih "Menunggu Pembayaran", kamu bisa membatalkan pesanan lalu membuat pesanan baru. Setelah dibayar, hubungi tim kami melalui Instagram @mealmate.',
      ],
      [
        'Apakah ada kode promo?',
        'Ada! Pakai kode MEALMATE10 untuk diskon 10%, atau BEKALSEHAT untuk potongan Rp25.000. Satu kode per pesanan.',
      ],
    ],
  },
  pembayaran: {
    label: 'Pembayaran',
    icon: 'card',
    items: [
      [
        'Metode pembayaran apa saja yang tersedia?',
        'QRIS (semua e-wallet dan m-banking yang mendukung QRIS) serta Virtual Account BCA, Mandiri, dan BNI.',
      ],
      [
        'Berapa lama batas waktu pembayaran?',
        'Kode pembayaran berlaku 15 menit. Jika kedaluwarsa, kamu bisa membuat kode baru dari halaman pembayaran atau Pesanan Saya.',
      ],
      [
        'Pembayaran saya sudah berhasil tetapi status belum berubah?',
        'Klik tombol "Saya Sudah Membayar" agar sistem mengecek ulang. Verifikasi biasanya selesai dalam hitungan detik.',
      ],
    ],
  },
  pengiriman: {
    label: 'Pengiriman',
    icon: 'truck',
    items: [
      [
        'Kurir apa saja yang tersedia?',
        'JNE Reguler, J&T Express, SiCepat REG, dan GoSend Same Day (khusus Jabodetabek).',
      ],
      ['Berapa ongkos kirimnya?', 'Mulai Rp13.000. Gratis ongkir untuk total belanja Rp500.000 ke atas.'],
      [
        'Kapan pesanan saya dikirim?',
        'Pesanan yang dibayar sebelum pukul 15.00 WIB dikirim di hari yang sama, selebihnya dikirim keesokan harinya.',
      ],
    ],
  },
  retur: {
    label: 'Retur & Refund',
    icon: 'return',
    items: [
      [
        'Bagaimana jika produk yang saya terima rusak?',
        'Kirim video unboxing dan foto kerusakan dalam 3×24 jam setelah barang diterima. Kami akan mengganti produk atau mengembalikan dana sepenuhnya.',
      ],
      [
        'Apakah bisa tukar warna atau ukuran?',
        'Bisa, selama produk belum dipakai, label masih terpasang, dan diajukan maksimal 7 hari setelah diterima. Ongkos kirim penukaran ditanggung pembeli.',
      ],
      [
        'Berapa lama proses refund?',
        'Dana dikembalikan 3–7 hari kerja setelah retur kami terima, ke rekening atau e-wallet yang kamu pilih.',
      ],
    ],
  },
};
