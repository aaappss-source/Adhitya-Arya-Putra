/* ==========================================================================
   NEXUS TOPUP — topup.js
   Halaman top up: form akun, cek nickname, pilih nominal & metode bayar,
   validasi, lalu membuat pesanan dan menuju halaman pembayaran.
   ========================================================================== */
(function () {
  "use strict";

  const { PAYMENTS, getGame, getPayment, store, ui } = window.NEXUS;
  const { icon, esc, formatRupiah, param, payBadge } = ui;

  const game = getGame(param("game"));
  if (!game) {
    location.replace("index.html#katalog");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const state = { values: {}, item: null, method: null, wa: "" };

  // Nilai awal untuk <select>
  game.fields.forEach((f) => {
    if (f.type === "select") state.values[f.id] = f.options[0];
  });

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  function renderHero() {
    document.title = `Top Up ${game.name} — NEXUS TOPUP`;
    const page = $("topup-page");
    page.style.setProperty("--c1", game.colors[0]);
    page.style.setProperty("--c2", game.colors[1]);
    const hero = $("game-hero");
    hero.innerHTML = `
      <img class="game-hero__bg" src="${game.image}" alt="" />
      <div class="game-hero__inner">
        <img class="game-hero__tile" src="${game.image}" alt="Logo ${esc(game.name)}" />
        <div>
          <div class="game-hero__eyebrow">DETAIL GAME</div>
          <h1>${esc(game.full)}</h1>
          <div class="game-hero__chips">
            <span class="chip">🏢 ${esc(game.publisher)}</span>
            <span class="chip">⚡ Proses 1-3 detik</span>
            <span class="chip">🔒 Tanpa kata sandi</span>
          </div>
        </div>
      </div>
      <a class="game-hero__close" href="index.html#katalog" aria-label="Tutup dan kembali ke beranda">${icon("close")}</a>`;
  }

  function renderFields() {
    $("account-fields").innerHTML = game.fields
      .map((f) => {
        if (f.type === "select") {
          return `<div class="field">
            <label class="field__label" for="f-${f.id}">${esc(f.label)}</label>
            <select class="input" id="f-${f.id}" data-field="${f.id}">
              ${f.options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join("")}
            </select>
          </div>`;
        }
        return `<div class="field">
          <label class="field__label" for="f-${f.id}">${esc(f.label)}</label>
          <input class="input" id="f-${f.id}" data-field="${f.id}" type="text" inputmode="numeric"
                 autocomplete="off" maxlength="${f.max}" placeholder="${esc(f.placeholder)}" />
        </div>`;
      })
      .join("");
    $("account-hint").innerHTML = `<span>💡 ${esc(game.hint)}</span>`;
  }

  function renderNominal() {
    $("nominal-grid").innerHTML = game.items
      .map(
        (it) => `
        <button class="choice" type="button" role="radio" aria-checked="false" data-code="${it.code}">
          <span class="choice__check">${icon("check")}</span>
          <span class="choice__top">
            <span class="choice__gem"><img src="${game.image}" alt="" loading="lazy" /></span>
            <span class="choice__code">${it.code}</span>
          </span>
          <span class="choice__name">${esc(it.label)}</span>
          <span class="choice__price">${formatRupiah(it.price)}</span>
        </button>`
      )
      .join("");
  }

  function renderPayments() {
    $("pay-grid").innerHTML = PAYMENTS.map(
      (p) => `
      <button class="choice choice--pay" type="button" role="radio" aria-checked="false" data-id="${p.id}">
        <span class="choice__check">${icon("check")}</span>
        ${payBadge(p)}
        <span>
          <strong style="display:block;font-size:14px">${esc(p.name)}</strong>
          <span class="choice__desc">${esc(p.desc)}</span>
        </span>
      </button>`
    ).join("");
  }

  /* ------------------------------------------------------------------ */
  /* Validasi                                                            */
  /* ------------------------------------------------------------------ */
  function validateAccount() {
    for (const f of game.fields) {
      if (f.type === "select") continue;
      const v = (state.values[f.id] || "").trim();
      if (!v) return { ok: false, field: f.id, msg: "Masukkan ID akun terlebih dahulu, lalu klik Cek Nickname." };
      if (!/^\d+$/.test(v) || v.length < f.min || v.length > f.max) {
        const range = f.min === f.max ? `${f.min}` : `${f.min}-${f.max}`;
        return { ok: false, field: f.id, msg: `${f.label} harus berupa angka (${range} digit).` };
      }
    }
    return { ok: true };
  }

  const WA_PATTERN = /^(\+62|62|0)8\d{8,11}$/;

  function validateWa() {
    const v = state.wa.replace(/[\s-]/g, "");
    if (!v) return { ok: false, msg: "Nomor WhatsApp wajib diisi." };
    if (!WA_PATTERN.test(v)) return { ok: false, msg: "Format nomor tidak valid. Contoh: 081234567890." };
    return { ok: true };
  }

  const markInvalid = (el, invalid) => (invalid ? el.setAttribute("aria-invalid", "true") : el.removeAttribute("aria-invalid"));

  function showAccountError(res) {
    const err = $("account-error");
    err.hidden = res.ok;
    if (!res.ok) err.textContent = "⚠️  " + res.msg;
    game.fields.forEach((f) => {
      const el = $("f-" + f.id);
      if (el) markInvalid(el, !res.ok && res.field === f.id);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Interaksi                                                           */
  /* ------------------------------------------------------------------ */
  function updateSummary() {
    $("total").textContent = formatRupiah(state.item ? state.item.price : 0);
    $("sel-item").textContent = state.item ? state.item.label : "-";
    const m = state.method ? getPayment(state.method) : null;
    $("sel-method").textContent = m ? m.name : "-";
  }

  function hideFormError() {
    $("form-error").hidden = true;
  }

  function resetNickname() {
    $("nick-result").hidden = true;
  }

  function initAccount() {
    // Input angka saja; ubah state & bersihkan error
    $("account-fields").addEventListener("input", (e) => {
      const el = e.target.closest("[data-field]");
      if (!el) return;
      if (el.tagName === "INPUT") el.value = el.value.replace(/\D/g, "");
      state.values[el.dataset.field] = el.value;
      markInvalid(el, false);
      $("account-error").hidden = true;
      resetNickname();
      hideFormError();
    });

    // Petunjuk akun (toggle)
    const toggle = $("hint-toggle");
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      $("account-hint").hidden = !open;
    });

    // Cek nickname (simulasi — tidak memanggil API publisher)
    const btn = $("check-nick");
    btn.addEventListener("click", () => {
      resetNickname();
      const res = validateAccount();
      showAccountError(res);
      if (!res.ok) return;
      btn.setAttribute("aria-busy", "true");
      setTimeout(() => {
        btn.removeAttribute("aria-busy");
        const box = $("nick-result");
        box.innerHTML = `<span class="text-success">✅ Nickname ditemukan:</span> <strong>${esc(game.sampleNick)}</strong>`;
        box.hidden = false;
      }, 700);
    });
  }

  function initChoices() {
    $("nominal-grid").addEventListener("click", (e) => {
      const btn = e.target.closest(".choice");
      if (!btn) return;
      state.item = game.items.find((i) => i.code === btn.dataset.code);
      $("nominal-grid").querySelectorAll(".choice").forEach((b) => b.setAttribute("aria-checked", String(b === btn)));
      updateSummary();
      hideFormError();
    });

    $("pay-grid").addEventListener("click", (e) => {
      const btn = e.target.closest(".choice");
      if (!btn) return;
      state.method = btn.dataset.id;
      $("pay-grid").querySelectorAll(".choice").forEach((b) => b.setAttribute("aria-checked", String(b === btn)));
      updateSummary();
      hideFormError();
    });

    // Navigasi panah antar pilihan (pola radiogroup)
    ["nominal-grid", "pay-grid"].forEach((id) => {
      $(id).addEventListener("keydown", (e) => {
        if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) return;
        const items = [...$(id).querySelectorAll(".choice")];
        const i = items.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        const next = items[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
        next.focus();
        next.click();
      });
    });
  }

  function initWhatsapp() {
    const input = $("wa-input");
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^\d+\s-]/g, "");
      state.wa = input.value;
      markInvalid(input, false);
      $("wa-error").hidden = true;
      hideFormError();
    });
  }

  function initSubmit() {
    $("topup-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const account = validateAccount();
      const wa = validateWa();
      const complete = account.ok && state.item && state.method && wa.ok;

      showAccountError(account);
      const waInput = $("wa-input");
      markInvalid(waInput, !wa.ok);
      $("wa-error").hidden = wa.ok;
      if (!wa.ok) $("wa-error").textContent = "⚠️  " + wa.msg;

      if (!complete) {
        const box = $("form-error");
        box.hidden = false;
        box.focus({ preventScroll: true });
        box.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const method = getPayment(state.method);
      const order = store.createOrder({
        gameId: game.id,
        gameName: game.name,
        itemCode: state.item.code,
        itemLabel: state.item.label,
        account: game.format(state.values),
        nickname: game.sampleNick,
        method: method.name,
        methodId: method.id,
        wa: state.wa.replace(/[\s-]/g, ""),
        total: state.item.price,
      });
      $("buy-btn").setAttribute("aria-busy", "true");
      location.href = `bayar.html?order=${encodeURIComponent(order.id)}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHero();
    renderFields();
    renderNominal();
    renderPayments();
    initAccount();
    initChoices();
    initWhatsapp();
    initSubmit();
    updateSummary();
  });
})();
