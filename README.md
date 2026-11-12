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
assets/files/               file CV (PDF)
```

## Mengubah isi

- Proyek ada di bagian `<!-- PROYEK -->` di `index.html`. Untuk menambah proyek, salin satu blok `<article class="project">`.
- Screenshot proyek disimpan di `assets/img/` dengan ukuran sekitar 1600x1000.
- Link demo atau kode bisa ditambah di bawah daftar Peran/Teknologi:
  `<p class="project__links"><a class="link" href="...">Lihat demo</a></p>`

## Mengaktifkan GitHub Pages

Settings > Pages, pilih Source: Deploy from a branch, Branch: `main`, folder `/ (root)`, lalu Save. Tunggu 1 sampai 2 menit.
