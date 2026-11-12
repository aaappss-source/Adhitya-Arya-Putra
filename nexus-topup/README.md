# NEXUS TOPUP

Website top up game (frontend) — HTML, CSS, dan JavaScript murni tanpa framework dan tanpa build step.
Dibuat berdasarkan desain Figma "Nexus-TopUp" sebagai tugas kuliah Digital Entrepreneurship.
Semua alur berjalan di browser, tanpa backend dan tanpa transaksi sungguhan.

**Demo:** https://aaappss-source.github.io/Adhitya-Arya-Putra/nexus-topup/

## Fitur

- **Beranda**: slider banner otomatis (panah, titik, geser di HP), keunggulan, katalog 4 game, cek transaksi, FAQ, scrollspy menu.
- **Top Up** (`topup.html?game=ml|ff|pubg|genshin`): input ID akun + validasi, petunjuk akun, cek nickname, pilih nominal, pilih metode bayar, nomor WhatsApp, total otomatis.
- **Bayar** (`bayar.html?order=…`): QR simulasi, hitung mundur 15 menit, salin nomor pesanan, tombol "Simulasi Bayar", state kedaluwarsa.
- **Berhasil** (`berhasil.html?order=…`): ringkasan pesanan.
- **Cek Transaksi**: cari pesanan berdasarkan nomor (disimpan di `localStorage`). Contoh nomor: `NXS-20261030-8842`.
- 4 game, 16 nominal, 5 metode pembayaran (QRIS, GoPay, DANA, OVO, ShopeePay). Fitur diskon dan kalkulator sengaja tidak ada.
- Responsif (desktop, tablet, HP portrait & landscape, sampai layar 320 px). Sasaran sentuh min. 44 px, font input 16 px (mencegah zoom otomatis di iOS), tanpa scroll horizontal. Diuji pada emulasi iPhone SE, Galaxy 360, iPhone 14, Pixel 7, dan iPad Mini.
- Aksesibel: label, `aria-*`, navigasi keyboard, `prefers-reduced-motion`.

## Struktur folder

```
nexus-topup/
├── index.html            Beranda
├── topup.html            Halaman top up (satu template untuk 4 game)
├── bayar.html            Menunggu pembayaran
├── berhasil.html         Pembayaran berhasil
└── assets/
    ├── css/
    │   ├── base.css        Token warna, reset, tombol, utilitas
    │   ├── layout.css      Header, footer, judul section
    │   ├── components.css  Input, chip, status, alert, daftar detail
    │   ├── home.css        Slider, fitur, katalog, cek transaksi, FAQ
    │   ├── topup.css       Halaman top up
    │   └── payment.css     Halaman bayar & berhasil
    ├── js/
    │   ├── data.js         SEMUA data (game, harga, metode bayar, FAQ, slide, nomor WA)
    │   ├── store.js        Penyimpanan pesanan (localStorage)
    │   ├── ui.js           Helper bersama + header & footer
    │   ├── home.js  topup.js  bayar.js  berhasil.js   Logika per halaman
    └── img/                Gambar game dan banner
```

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
python3 -m http.server 8000     # lalu buka http://localhost:8000
```

Font Poppins dimuat dari Google Fonts (butuh internet; tanpa itu otomatis memakai font sistem).

## Deploy gratis

- **GitHub Pages**: push folder ini ke repo, lalu Settings → Pages → Branch `main` / root.
- **Vercel / Netlify**: import repo, tanpa build command, output directory `.`

## Kustomisasi cepat

| Mau ubah | Edit |
| --- | --- |
| Batas waktu bayar, nomor pesanan contoh | `CONFIG` di `assets/js/data.js` |
| Harga, nominal, game, metode bayar | `GAMES` dan `PAYMENTS` di `assets/js/data.js` |
| Teks banner / FAQ | `SLIDES` dan `FAQS` di `assets/js/data.js` |
| Warna | variabel `:root` di `assets/css/base.css` |
| Gambar game | ganti file di `assets/img/` (nama file sama) |

## Catatan

- **Cek Nickname** dan **pembayaran** adalah simulasi. Untuk produksi, ganti `store.js` dan bagian cek nickname di `topup.js` dengan pemanggilan API backend dan payment gateway (mis. Midtrans / Xendit).
- QR di halaman bayar hanya ilustrasi, tidak bisa dipindai.
- Gambar game adalah ilustrasi buatan AI (bukan artwork resmi), resolusi 640 px. Ganti dengan gambar beresolusi lebih tinggi bila perlu.
- Tombol WhatsApp CS sengaja tidak diaktifkan karena ini website demo.
- Semua merek dagang milik penerbit masing-masing.
