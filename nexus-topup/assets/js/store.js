/* ==========================================================================
   NEXUS TOPUP — store.js
   Penyimpanan pesanan di localStorage (dengan cadangan di memori bila
   localStorage tidak tersedia, mis. mode privat).
   Untuk versi sungguhan, ganti isi fungsi ini dengan pemanggilan API.
   ========================================================================== */
(function (global) {
  "use strict";

  const KEY = "nexus_orders_v1";
  let memory = {};

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return memory;
    }
  }

  function write(orders) {
    memory = orders;
    try {
      localStorage.setItem(KEY, JSON.stringify(orders));
    } catch (e) {
      /* abaikan: tetap tersimpan di memori selama halaman terbuka */
    }
  }

  const pad = (n) => String(n).padStart(2, "0");

  function newOrderId(orders) {
    const d = new Date();
    const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    let id;
    do {
      id = `NXS-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (orders[id]);
    return id;
  }

  /** Buat pesanan baru dengan status PENDING. */
  function createOrder(data) {
    const orders = read();
    const id = newOrderId(orders);
    const now = Date.now();
    orders[id] = Object.assign({}, data, {
      id,
      status: "PENDING",
      createdAt: now,
      expiresAt: now + NEXUS.CONFIG.paymentWindowMinutes * 60 * 1000,
      paidAt: null,
    });
    write(orders);
    return orders[id];
  }

  /** Contoh pesanan tetap supaya fitur Cek Transaksi bisa dicoba tanpa membeli. */
  function demoOrder() {
    const base = new Date("2026-10-30T00:21:04+07:00").getTime();
    return {
      id: NEXUS.CONFIG.demoOrderId,
      gameId: "ml",
      gameName: "Mobile Legends",
      itemLabel: "86 Diamond",
      itemCode: "ML086",
      account: "123456789 (2345)",
      method: "QRIS",
      total: 30000,
      status: "SUCCESS",
      createdAt: base - 60000,
      paidAt: base,
      expiresAt: base + 840000,
      isDemo: true,
    };
  }

  /** Ambil pesanan; PENDING yang lewat batas waktu otomatis menjadi EXPIRED. */
  function getOrder(id) {
    if (!id) return null;
    const key = String(id).trim().toUpperCase();
    if (key === NEXUS.CONFIG.demoOrderId) return demoOrder();
    const orders = read();
    const order = orders[key];
    if (!order) return null;
    if (order.status === "PENDING" && Date.now() >= order.expiresAt) {
      order.status = "EXPIRED";
      write(orders);
    }
    return order;
  }

  function updateOrder(id, patch) {
    const orders = read();
    if (!orders[id]) return null;
    Object.assign(orders[id], patch);
    write(orders);
    return orders[id];
  }

  global.NEXUS = global.NEXUS || {};
  global.NEXUS.store = { createOrder, getOrder, updateOrder };
})(window);
