// Portofolio Adhitya Arya Putra
// Isi file: menu HP, garis header saat discroll, penanda menu aktif, peragaan chat ke rekap di hero, tahun di footer.

(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  // ---------- Menu HP ----------
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Tutup" : "Menu";
    menu.classList.toggle("is-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    // Kalau layar dilebarkan lagi, tutup menu supaya tidak nyangkut
    window.matchMedia("(min-width: 821px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // ---------- Garis bawah header saat halaman discroll ----------
  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- Penanda menu sesuai section yang sedang dilihat ----------
  const links = Array.from(document.querySelectorAll('.nav__list a[href^="#"]'));
  const sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ---------- Peragaan di hero: chat masuk satu per satu lalu tercatat di rekap ----------
  // Elemen [data-step="n"] muncul berurutan. Diputar sekali saat halaman dibuka; tombol "Putar lagi"
  // muncul setelah selesai. Dengan "kurangi gerakan", semua langsung tampil dan tidak diputar.
  const demo = document.querySelector("[data-demo]");
  if (demo) {
    const steps = Array.from(demo.querySelectorAll("[data-step]"));
    const replay = demo.querySelector("[data-demo-replay]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
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
        }, 350 + (n - 1) * STEP_MS));
      }
      timers.push(setTimeout(function () { if (replay) replay.hidden = false; }, 350 + last * STEP_MS));
    };

    if (!reduce.matches) play();
    if (replay) replay.addEventListener("click", play);
  }

  // ---------- Tahun di footer ----------
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
