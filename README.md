# Portofolio Adhitya Arya Putra

Website portofolio satu halaman. HTML, CSS, dan JavaScript biasa, tanpa build tool.

Alamat web: https://aaappss-source.github.io/Adhitya-Arya-Putra/

Demo proyek di repo yang sama:

- Nexus TopUp: https://aaappss-source.github.io/Adhitya-Arya-Putra/nexus-topup/ (kode di folder `nexus-topup/`)
- MealMate: https://aaappss-source.github.io/Adhitya-Arya-Putra/mealmate/ (kode di folder `mealmate/`)

## Struktur folder

```
index.html                  semua isi halaman portofolio
nexus-topup/                website demo Nexus TopUp (tugas kuliah)
mealmate/                   website demo MealMate (tugas kuliah)
assets/css/style.css        tampilan (warna dan ukuran huruf ada di bagian "Token")
assets/js/main.js           menu HP, penanda menu aktif, tahun di footer
assets/img/                 foto, favicon, screenshot proyek
```

## Mengubah isi

- Peragaan di bagian atas (chat masuk jadi rekap) ada di `<figure class="demo">` di `index.html`. Urutan munculnya diatur lewat `data-step` (1, 2, 3, ...), dan diputar oleh `assets/js/main.js`.
- Proyek ada di bagian `<!-- PROYEK -->` di `index.html`. Proyek utama memakai `<article class="feature">`, proyek lain `<article class="mini">` (tinggal salin bloknya).
- Screenshot proyek disimpan di `assets/img/` dengan ukuran sekitar 1600x1000.

## Animasi

- Semua gerak ada di bagian "15. Gerak" di `assets/css/style.css` dan bagian "3. Animasi" di `assets/js/main.js`.
- Judul dengan atribut `data-split` naik kata demi kata. Elemen yang muncul saat discroll ditentukan di daftar `groups` di `main.js`.
- Efek yang terikat scroll (pita teks, bingkai foto proyek, garis cara kerja, garis progres) memakai CSS scroll-driven animations. Browser yang belum mendukung memakai cadangan di `main.js`.
- Pengunjung yang memilih "kurangi gerakan" di HP/laptopnya melihat halaman diam dan utuh. Tanpa JavaScript, semua konten tetap tampil.

## Tombol WhatsApp melayang

- Ada di akhir `index.html` (`<a class="wa-float">`) dan bagian "16. Tombol WhatsApp melayang" di `style.css`.
- Logo `assets/img/whatsapp-logo-putih.png` (versi putih, di atas lingkaran hijau #25D366) berasal dari WhatsApp Brand Resources (Meta), hanya diperkecil. Sesuai aturan Meta, jangan ubah warna atau bentuknya.

## Mengaktifkan GitHub Pages

Settings > Pages, pilih Source: Deploy from a branch, Branch: `main`, folder `/ (root)`, lalu Save. Tunggu 1 sampai 2 menit.
