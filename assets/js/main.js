// Portofolio Adhitya Arya Putra
// Isi file:
// 1. Menu HP, header (garis saat discroll, menyingkir saat scroll ke bawah), penanda menu aktif
// 2. Peragaan chat ke rekap di hero
// 3. Animasi: urutan pembuka, muncul saat discroll, judul per kata, cadangan efek scroll,
//    cahaya hero + panel miring mengikuti kursor, tombol magnet, cahaya sorot
// 4. Tahun di footer
//
// Semua animasi hanya jalan kalau pengunjung tidak memilih "kurangi gerakan" di perangkatnya.
// Efek kursor hanya di perangkat dengan mouse/trackpad.

(function () {
  "use strict";

  const root = document.documentElement;
  const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const scrollDriven = !!(window.CSS && CSS.supports("(animation-timeline: view()) and (animation-range: entry)"));
  const clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  // =========================================================
  // 1. Navigasi
  // =========================================================

  // ---------- Menu HP ----------
  const menuOpen = function () { return !!toggle && toggle.getAttribute("aria-expanded") === "true"; };

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Tutup" : "Menu";
    menu.classList.toggle("is-open", open);
    if (open && header) header.classList.remove("is-hidden");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!menuOpen()); });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Kalau layar dilebarkan lagi, tutup menu supaya tidak nyangkut
    window.matchMedia("(min-width: 821px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // ---------- Header: garis bawah saat discroll, menyingkir saat scroll ke bawah ----------
  if (header) {
    let lastY = window.scrollY;
    const onScroll = function () {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      if (motionOK) {
        // Tetap tampil di bagian atas, saat menu terbuka, atau saat ada fokus keyboard di header
        const keepVisible = y < 480 || menuOpen() || !!header.querySelector(":focus-visible");
        if (keepVisible || y < lastY - 4) header.classList.remove("is-hidden");
        else if (y > lastY + 4) header.classList.add("is-hidden");
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    header.addEventListener("focusin", function (event) {
      if (event.target.matches(":focus-visible")) header.classList.remove("is-hidden");
    });
  }

  // ---------- Penanda menu sesuai section yang sedang dilihat ----------
  const links = Array.from(document.querySelectorAll('.nav__list a[href^="#"]'));
  const sections = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  // =========================================================
  // 2. Peragaan di hero: chat masuk satu per satu lalu tercatat di rekap
  // =========================================================
  // Elemen [data-step="n"] muncul berurutan. Diputar sekali saat halaman dibuka; tombol "Putar lagi"
  // muncul setelah selesai. Dengan "kurangi gerakan", semua langsung tampil dan tidak diputar.
  const demo = document.querySelector("[data-demo]");
  if (demo) {
    const steps = Array.from(demo.querySelectorAll("[data-step]"));
    const replay = demo.querySelector("[data-demo-replay]");
    const STEP_MS = 750;
    const last = Math.max.apply(null, steps.map(function (el) { return Number(el.dataset.step); }));
    let timers = [];

    const play = function () {
      timers.forEach(clearTimeout);
      timers = [];
      steps.forEach(function (el) { el.classList.remove("is-in"); });
      demo.classList.add("is-playing");
      if (replay) replay.hidden = true;
      for (let n = 1; n <= last; n++) {
        timers.push(setTimeout(function () {
          steps.forEach(function (el) { if (Number(el.dataset.step) === n) el.classList.add("is-in"); });
        }, 650 + (n - 1) * STEP_MS));
      }
      timers.push(setTimeout(function () { if (replay) replay.hidden = false; }, 650 + last * STEP_MS));
    };

    if (motionOK) play();
    if (replay) replay.addEventListener("click", play);
  }

  // =========================================================
  // 3. Animasi
  // =========================================================
  if (motionOK && "IntersectionObserver" in window) {
    root.classList.add("motion");

    // ---------- Judul: pecah jadi kata supaya bisa naik satu per satu ----------
    document.querySelectorAll("[data-split]").forEach(function (el) {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = "";
      words.forEach(function (word, i) {
        const outer = document.createElement("span");
        const inner = document.createElement("span");
        outer.className = "w";
        inner.textContent = word;
        inner.style.setProperty("--i", i);
        outer.appendChild(inner);
        el.appendChild(outer);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      });
    });

    // ---------- Tandai elemen yang muncul saat discroll ----------
    // [selector, jeda antar-saudara dalam ms]
    const groups = [
      [".service", 80],
      [".freebie", 0],
      [".freebie__list li", 35],
      [".feature__body > *", 120],
      [".mini", 140],
      [".step", 90],
      [".about__text .prose p", 110],
      [".faq__item", 60],
      [".contact__lead", 0],
      [".contact__list", 0]
    ];
    groups.forEach(function (group) {
      document.querySelectorAll(group[0]).forEach(function (el) {
        const siblings = Array.from(el.parentElement.children).filter(function (s) { return s.matches(group[0]); });
        el.classList.add("reveal");
        el.style.setProperty("--d", Math.min(siblings.indexOf(el), 8) * group[1] + "ms");
      });
    });
    document.querySelectorAll(".mini__media, .about__photo").forEach(function (el) {
      el.classList.add("reveal-media");
    });

    // Gambar yang masih terpotong penuh (clip-path) dianggap tidak terlihat oleh IntersectionObserver,
    // jadi untuk gambar yang dipantau adalah pembungkusnya (kartu/section induknya).
    const pending = new Map();
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        (pending.get(entry.target) || []).forEach(function (el) { el.classList.add("is-visible"); });
        pending.delete(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    const watch = function (trigger, el) {
      if (!pending.has(trigger)) {
        pending.set(trigger, []);
        revealObserver.observe(trigger);
      }
      pending.get(trigger).push(el);
    };
    document.querySelectorAll(".reveal, [data-split]").forEach(function (el) { watch(el, el); });
    document.querySelectorAll(".reveal-media").forEach(function (el) { watch(el.parentElement, el); });

    // ---------- Mulai urutan pembuka hero (setelah satu frame supaya transisinya jalan) ----------
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add("is-ready"); });
    });

    // ---------- Cadangan efek scroll untuk browser tanpa scroll-driven animations ----------
    // CSS memakai --p (0..1, posisi elemen di layar) dan --scroll (posisi halaman).
    if (!scrollDriven) {
      root.classList.add("no-sda");
      const linked = Array.from(document.querySelectorAll("[data-sl], .steps"));
      const inView = new Set();
      const viewObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) inView.add(entry.target);
          else inView.delete(entry.target);
        });
        requestUpdate();
      });
      linked.forEach(function (el) { viewObserver.observe(el); });

      let ticking = false;
      const update = function () {
        ticking = false;
        const vh = window.innerHeight;
        const max = root.scrollHeight - vh;
        root.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
        inView.forEach(function (el) {
          const r = el.getBoundingClientRect();
          let p;
          if (el.classList.contains("marquee")) p = (vh - r.top) / (vh + r.height);
          else if (el.classList.contains("steps")) p = (vh * 0.85 - r.top) / (vh * 0.5);
          else p = (vh - r.top) / (vh * 0.9);
          el.style.setProperty("--p", clamp(p, 0, 1).toFixed(4));
        });
      };
      const requestUpdate = function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      };
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
      update();
    }

    // ---------- Efek kursor (laptop/PC saja) ----------
    if (finePointer) {
      // Cahaya hero mengikuti kursor dan panel peragaan sedikit miring ke arah kursor
      const hero = document.querySelector(".hero");
      if (hero) {
        const home = { x: 72, y: 38 };
        const target = { x: home.x, y: home.y, rx: 0, ry: 0 };
        const now = { x: home.x, y: home.y, rx: 0, ry: 0 };
        let raf = 0;

        const loop = function () {
          now.x += (target.x - now.x) * 0.08;
          now.y += (target.y - now.y) * 0.08;
          now.rx += (target.rx - now.rx) * 0.1;
          now.ry += (target.ry - now.ry) * 0.1;
          hero.style.setProperty("--gx", now.x.toFixed(2) + "%");
          hero.style.setProperty("--gy", now.y.toFixed(2) + "%");
          if (demo) {
            demo.style.setProperty("--rx", now.rx.toFixed(2) + "deg");
            demo.style.setProperty("--ry", now.ry.toFixed(2) + "deg");
          }
          const moving = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) +
            Math.abs(target.rx - now.rx) + Math.abs(target.ry - now.ry);
          raf = moving > 0.02 ? requestAnimationFrame(loop) : 0;
        };
        const start = function () { if (!raf) raf = requestAnimationFrame(loop); };

        hero.addEventListener("pointermove", function (e) {
          const h = hero.getBoundingClientRect();
          target.x = ((e.clientX - h.left) / h.width) * 100;
          target.y = ((e.clientY - h.top) / h.height) * 100;
          if (demo) {
            const d = demo.getBoundingClientRect();
            const nx = (e.clientX - (d.left + d.width / 2)) / (d.width / 2);
            const ny = (e.clientY - (d.top + d.height / 2)) / (d.height / 2);
            target.rx = clamp(-ny * 3.5, -3.5, 3.5);
            target.ry = clamp(nx * 4.5, -4.5, 4.5);
          }
          start();
        });
        hero.addEventListener("pointerleave", function () {
          target.x = home.x; target.y = home.y; target.rx = 0; target.ry = 0;
          start();
        });
      }

      // Tombol magnet: bergeser sedikit mengikuti kursor, kembali saat kursor pergi
      document.querySelectorAll(".btn--primary, .nav .btn, .feature .btn, .contact__main").forEach(function (el) {
        el.classList.add("magnetic");
        el.addEventListener("pointermove", function (e) {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", ((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1) + "px");
          el.style.setProperty("--my", ((e.clientY - (r.top + r.height / 2)) * 0.35).toFixed(1) + "px");
        });
        el.addEventListener("pointerleave", function () {
          el.style.setProperty("--mx", "0px");
          el.style.setProperty("--my", "0px");
        });
      });

      // Cahaya sorot di kotak template gratis
      document.querySelectorAll(".freebie").forEach(function (el) {
        el.addEventListener("pointermove", function (e) {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--sx", (e.clientX - r.left).toFixed(0) + "px");
          el.style.setProperty("--sy", (e.clientY - r.top).toFixed(0) + "px");
        });
      });
    }
  }

  // =========================================================
  // 4. Tahun di footer
  // =========================================================
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
