/* ==========================================================================
   NEXUS TOPUP — data.js
   Seluruh data statis: konfigurasi, game, nominal, metode bayar, slide, FAQ.
   Ubah di sini untuk mengganti isi website tanpa menyentuh logika.
   ========================================================================== */
(function (global) {
  "use strict";

  const CONFIG = {
    brand: "NEXUS TOPUP",
    tagline: "Pusat Top Up Game Termurah & Tercepat",
    // Kontak WhatsApp CS sengaja tidak diaktifkan karena ini website demo tugas kuliah.
    paymentWindowMinutes: 15, // batas waktu bayar
    demoOrderId: "NXS-20261030-8842", // contoh nomor pesanan untuk fitur Cek Transaksi
  };

  /* ---------- Game & nominal (16 item, 4 game) ---------- */
  const GAMES = [
    {
      id: "ml",
      name: "Mobile Legends",
      full: "Mobile Legends: Bang Bang",
      publisher: "Moonton",
      image: "assets/img/mobile-legends.jpg",
      colors: ["#4F46E5", "#A855F7"],
      tag: "TERLARIS",
      fields: [
        { id: "userId", label: "User ID", placeholder: "Masukkan User ID", min: 6, max: 12 },
        { id: "zoneId", label: "Zone ID", placeholder: "Zone ID", min: 3, max: 5 },
      ],
      format: (v) => `${v.userId} (${v.zoneId})`,
      hint: "Buka profil di dalam game. User ID dan Zone ID tertera di bawah nama akun, contoh: 123456789 (2345).",
      sampleNick: "NexusPlayer",
      items: [
        { code: "ML086", label: "86 Diamond", price: 30000 },
        { code: "ML172", label: "172 Diamond", price: 60000 },
        { code: "ML344", label: "344 Diamond", price: 115000 },
        { code: "ML706", label: "706 Diamond", price: 230000 },
      ],
    },
    {
      id: "ff",
      name: "Free Fire",
      full: "Garena Free Fire",
      publisher: "Garena",
      image: "assets/img/free-fire.jpg",
      colors: ["#F97316", "#DC2626"],
      tag: "POPULER",
      fields: [{ id: "playerId", label: "Player ID", placeholder: "Masukkan Player ID", min: 6, max: 12 }],
      format: (v) => v.playerId,
      hint: "Ketuk avatar di pojok kiri atas. Player ID tampil tepat di bawah nickname kamu.",
      sampleNick: "NXS.Booyah",
      items: [
        { code: "FF070", label: "70 Diamond", price: 12000 },
        { code: "FF140", label: "140 Diamond", price: 25000 },
        { code: "FF355", label: "355 Diamond", price: 52000 },
        { code: "FF720", label: "720 Diamond", price: 102000 },
      ],
    },
    {
      id: "pubg",
      name: "PUBG Mobile",
      full: "PUBG Mobile",
      publisher: "Level Infinite",
      image: "assets/img/pubg-mobile.jpg",
      colors: ["#EAB308", "#B45309"],
      tag: "TOP UP UC",
      fields: [{ id: "playerId", label: "Player ID", placeholder: "Masukkan Player ID", min: 6, max: 12 }],
      format: (v) => v.playerId,
      hint: "Buka profil karakter. Player ID (Character ID) tertera di bawah nama karakter kamu.",
      sampleNick: "NexusSquad",
      items: [
        { code: "PG060", label: "60 UC", price: 17000 },
        { code: "PG325", label: "325 UC", price: 85000 },
        { code: "PG660", label: "660 UC", price: 170000 },
        { code: "PG180", label: "1800 UC", price: 510000 },
      ],
    },
    {
      id: "genshin",
      name: "Genshin Impact",
      full: "Genshin Impact",
      publisher: "HoYoverse",
      image: "assets/img/genshin-impact.jpg",
      colors: ["#0EA5E9", "#14B8A6"],
      tag: "VIA UID",
      fields: [
        { id: "uid", label: "UID", placeholder: "Masukkan UID", min: 9, max: 10 },
        {
          id: "server",
          label: "Server",
          type: "select",
          options: ["Asia", "America", "Europe", "TW, HK, MO"],
        },
      ],
      format: (v) => `${v.uid} (${v.server})`,
      hint: "Buka menu Paimon. UID tertera di pojok kanan bawah layar, server mengikuti akun kamu (Asia, America, Europe, TW/HK/MO).",
      sampleNick: "Traveler_NXS",
      items: [
        { code: "GI060", label: "60 Genesis Crystal", price: 16000 },
        { code: "GI330", label: "330 Genesis Crystal", price: 79000 },
        { code: "GI109", label: "1090 Genesis Crystal", price: 249000 },
        { code: "GI224", label: "2240 Genesis Crystal", price: 499000 },
      ],
    },
  ];

  /* ---------- Metode pembayaran ---------- */
  const PAYMENTS = [
    { id: "qris", name: "QRIS", desc: "Semua e-wallet & m-banking", bg: "#FFFFFF", fg: "#E11D48", label: "QRIS" },
    { id: "gopay", name: "GoPay", desc: "E-Wallet", bg: "#00AED6", fg: "#FFFFFF", label: "gopay" },
    { id: "dana", name: "DANA", desc: "E-Wallet", bg: "#118EEA", fg: "#FFFFFF", label: "DANA" },
    { id: "ovo", name: "OVO", desc: "E-Wallet", bg: "#4C3494", fg: "#FFFFFF", label: "OVO" },
    { id: "shopeepay", name: "ShopeePay", desc: "E-Wallet", bg: "#EE4D2D", fg: "#FFFFFF", label: "ShopeePay" },
  ];

  /* ---------- Konten beranda ---------- */
  const SLIDES = [
    {
      badge: "🏆 Paling Laris",
      title: "DIAMOND MOBILE LEGENDS\nMASUK INSTAN",
      desc: "Top up Diamond Mobile Legends cukup dengan User ID & Zone ID. Proses otomatis 1-3 detik langsung masuk ke akun game kamu.",
      game: "ml",
      buttons: [
        { label: "Top Up MLBB Sekarang", game: "ml", primary: true },
        { label: "Top Up Free Fire", game: "ff" },
      ],
    },
    {
      badge: "✨ Cukup Pakai UID",
      title: "GENESIS CRYSTAL\nGENSHIN IMPACT",
      desc: "Isi Genesis Crystal hanya dengan UID, tanpa perlu login dan tanpa memberikan kata sandi akun. Dikirim otomatis 24 jam.",
      game: "genshin",
      buttons: [
        { label: "Top Up Genshin", game: "genshin", primary: true },
        { label: "Top Up MLBB", game: "ml" },
      ],
    },
    {
      badge: "🎯 Free Fire & PUBG Mobile",
      title: "DIAMOND FF & UC PUBG\nNONSTOP 24 JAM",
      desc: "Bayar pakai QRIS, GoPay, DANA, OVO, atau ShopeePay. Sistem otomatis memproses pesananmu kapan saja.",
      game: "ff",
      buttons: [
        { label: "Top Up Free Fire", game: "ff", primary: true },
        { label: "Top Up PUBG Mobile", game: "pubg" },
      ],
    },
  ];

  const FEATURES = [
    { icon: "⚡", title: "Proses 1-3 Detik", desc: "Sistem otomatis canggih 24 jam nonstop" },
    { icon: "🔒", title: "Tanpa Kata Sandi", desc: "Cukup ID akun, kata sandi tidak pernah diminta" },
    { icon: "💳", title: "Pembayaran Mudah", desc: "QRIS, GoPay, DANA, OVO & ShopeePay" },
    { icon: "🎧", title: "Customer Support 24/7", desc: "Siap membantu kendala transaksi Anda" },
  ];

  const FAQS = [
    {
      q: "Berapa lama proses top up diamond atau voucher game?",
      a: "Semua pesanan di NEXUS TOPUP diproses otomatis oleh sistem dalam 1 sampai 3 detik setelah pembayaran terverifikasi.",
    },
    {
      q: "Apakah saya perlu memberikan kata sandi akun game?",
      a: "Tidak. NEXUS TOPUP hanya membutuhkan ID akun dan tidak pernah meminta kata sandi. Catatan: ini website demo tugas kuliah, jadi tidak ada transaksi sungguhan.",
    },
    {
      q: "Bagaimana jika saya salah memasukkan User ID atau Zone ID?",
      a: 'Gunakan tombol "Cek Nickname" sebelum membayar untuk memastikan nama akun sudah benar. Pesanan yang terlanjur terkirim ke ID yang salah tidak dapat ditarik kembali karena sistem publisher bersifat final.',
    },
    {
      q: "Metode pembayaran apa saja yang tersedia?",
      a: "Kami menerima QRIS, GoPay, DANA, OVO, dan ShopeePay. Semua pembayaran diverifikasi otomatis selama 24 jam.",
    },
  ];

  /* ---------- Helper data ---------- */
  const getGame = (id) => GAMES.find((g) => g.id === id) || null;
  const getPayment = (id) => PAYMENTS.find((p) => p.id === id) || null;

  global.NEXUS = global.NEXUS || {};
  Object.assign(global.NEXUS, { CONFIG, GAMES, PAYMENTS, SLIDES, FEATURES, FAQS, getGame, getPayment });
})(window);
