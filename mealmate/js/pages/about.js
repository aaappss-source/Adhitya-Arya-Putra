/**
 * MealMate — Halaman Tentang Kami.
 */
import { I } from '../icons.js';
import { band } from '../components.js';

export const aboutPage = () => `
<section class="subhero" style="background:linear-gradient(90deg,#fff,var(--tan-50))">
  <div class="wrap">
    <div class="txt">
      <span class="pill">Tentang Kami</span>
      <h1 class="h-xl">Karena Setiap Bekal Punya Cerita</h1>
      <p class="lead" style="color:var(--text)">MealMate lahir dari kebutuhan nyata mahasiswa dan pekerja urban yang ingin membawa bekal makan yang praktis, higienis, dan tetap berkualitas hingga waktu makan.</p>
      <a href="#latar" class="btn btn-pri" data-act="scroll" data-v="latar">Kenalan Lebih Dekat ${I.arrow}</a>
    </div>
    <div class="art"><img src="assets/img/hero-about.jpg" alt="Tas MealMate pink dengan tulisan Carry your meal, carry your day"></div>
  </div>
</section>

<section class="sec" id="latar">
  <div class="wrap two">
    <div>
      <span class="pill tan">Latar Belakang</span>
      <h2 class="h-lg" style="margin:16px 0">Berangkat dari Kebutuhan Nyata</h2>
      <p class="lead">Mobilitas mahasiswa dan pekerja urban yang semakin tinggi membuat waktu di perjalanan, kampus, atau kantor menjadi lebih panjang. Membawa bekal adalah pilihan yang lebih hemat dan sehat, tetapi tas bekal di pasaran sering kali kurang fleksibel, cepat kehilangan suhu, atau tidak nyaman dibawa.</p>
    </div>
    <div class="prob">
      <div class="card"><div class="ic">${I.truck.replace(/34/g, '44')}</div><b>Mobilitas Tinggi</b><p>Banyak waktu di perjalanan, kampus, dan kantor.</p></div>
      <div class="card"><div class="ic"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 2v8M5 2v5a2 2 0 0 0 4 0V2M7 10v12M17 2c-2 0-3 3-3 6s1 4 3 4v10"/></svg></div><b>Butuh Bekal Sehat</b><p>Lebih hemat, lebih sehat, dan porsinya terkontrol.</p></div>
      <div class="card"><div class="ic"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5" stroke-linecap="round"/></svg></div><b>Masalah di Pasaran</b><p>Lunch bag umumnya kurang fleksibel dan cepat kehilangan suhu.</p></div>
    </div>
  </div>
</section>

<section class="sec" style="background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
  <div class="wrap two">
    <div>
      <span class="pill">Solusi Kami</span>
      <h2 class="h-lg" style="margin:16px 0">Satu Tas, Tiga Ukuran, Banyak Cerita</h2>
      <p class="lead">Kami merancang MealMate dengan insulasi berlapis, material tahan air, dan tiga pilihan kapasitas, supaya setiap orang bisa membawa bekal sesuai ritme harinya.</p>
      <div class="stats" style="margin-top:28px">
        <div><b>3</b><span>Pilihan ukuran</span></div>
        <div><b>6</b><span>Pilihan warna</span></div>
        <div><b>12 jam</b><span>Tahan dingin</span></div>
        <div><b>8 jam</b><span>Tahan panas</span></div>
      </div>
    </div>
    <div class="vm">
      <div class="card" style="background:var(--pink-50)"><h3 class="h-md">Visi</h3><p class="muted" style="margin-top:8px">Menjadi teman bekal pilihan generasi urban Indonesia untuk hidup yang lebih sehat dan hemat.</p></div>
      <div class="card" style="background:var(--tan-50)"><h3 class="h-md">Misi</h3><ul><li>Menghadirkan tas bekal yang fungsional dan stylish.</li><li>Menjaga kualitas makanan hingga waktu makan.</li><li>Mendorong kebiasaan membawa bekal sendiri.</li></ul></div>
      <div class="card" style="grid-column:1/-1;background:var(--blue-50)"><h3 class="h-md">Nilai Kami</h3><p class="muted" style="margin-top:8px"><b style="color:var(--brown-900)">Praktis</b> dalam setiap detail, <b style="color:var(--brown-900)">higienis</b> untuk makanan, <b style="color:var(--brown-900)">tahan lama</b> untuk dipakai bertahun-tahun, dan <b style="color:var(--brown-900)">ramah lingkungan</b> karena mengurangi kemasan sekali pakai.</p></div>
    </div>
  </div>
</section>
${band()}`;
