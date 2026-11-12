// Portofolio Adhitya Arya Putra
// Isi file: menu HP, garis header saat discroll, penanda menu aktif, tahun di footer.

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

  // ---------- Tahun di footer ----------
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
