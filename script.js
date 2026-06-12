/**
 * ============================================================
 *  BFL TV - Netflix-Style Multi-Watch YouTube Live Stream
 *  By @elvanprmn
 * ============================================================
 */

// Channel list diambil dari /api/channels (Vercel KV)
// Kalau API gagal, pakai DEFAULT_CHANNELS sebagai fallback
const DEFAULT_CHANNELS = [
  { id: "UCCuzDCoI3EUOo_nhCj4noSw", name: "Marapthon" },
  { id: "UCJTq8YQXj-2_BNgwis4SGsg", name: "RonnyBons" },
  { id: "UCBu6n7CY3k_HdX8THmyEOEw", name: "Abeegel" },
  { id: "UCz4s1BgKNXTwOHO0PHQHQxQ", name: "Kafeyinhere" },
  { id: "UCgrOxB6ZNPQeWJ1PpIHjXlQ", name: "Johnn" },
  { id: "UCZHSRSIP9m2uxOAOlVJGytw", name: "Danny" },
  { id: "UCamUqGw_jBciNhBNwBcJFRg", name: "Nathann" },
  { id: "UCKciWscgYbPCuAdtX91x06w", name: "Deplonnn" },
  { id: "UCvrhggVJsdR6uYvuIrX_Grg", name: "Dipiwww" },
  { id: "UCrvlbX01F8qtXlJDXX7czVg", name: "Rey" },
  { id: "UCYKxEdT_OBIUv7_zJkyQkdg", name: "AndreMemet" },
  { id: "UCQV0qkau8jIHyn5iRY6bIcg", name: "Syacei" },
  { id: "UCKN2A4ShReXSHJER9_lfwLw", name: "Bopeng16" },
  { id: "UChEzBCVwQg3EC7QjsF3iZHw", name: "Zotafrz" },
  { id: "UC-x7sdu_4FNa5fsGDr3nfbQ", name: "Nanzz" },
  { id: "UCUC6Ovlo-UNQD5lKcLIn6Q",  name: "Neyna" },
  { id: "UCt2QdjyIsTHOVzFlTB37UeA", name: "artszzy" },
  { id: "UCb9tHaLY3XFM6V2Is_Z2R6A", name: "Eko D Libra" },
  { id: "UCgqC90SQYpod4-Ys-6NVUHw", name: "Edot" },
  { id: "UCZyUX_68LnJ-AA6REPU45Ew", name: "Jonanthan" },
  { id: "UCPnn55oMeLkr4IF8WTKTdQQ", name: "Sanca" },
  { id: "UCSU2OYfJXGQiCULNy0PAk7w", name: "Reggie" },
  { id: "UChQbgqNc8MARGDS17qmXiVw", name: "Robbeyu" },
  { id: "UCmaXAySgVu7Ptu17PeNCj6w", name: "Samm Kama" },
  { id: "UCCBHkKFT-XBsBnzVBrXs5Vw", name: "Paddang" },
  { id: "UCxnQ2cffx4Y5TcPkaWcDfLA", name: "JxxxN" },
  { id: "UCoxYH2IbvTZFCph-FrMXN4A", name: "Noahh" },
  { id: "UC9jZ5Wa13rtmCa7Gi1C94aQ", name: "Dandan" },
  { id: "UCEbWxsOYTODhzRaxaSzbzGA", name: "Hlynn" },
  { id: "UCdsrkASxJ8QtG55db06789w", name: "Jeffry" },
  { id: "UC8qd1G66ZssAsr8bf1rR-ww", name: "Tristan" },
  { id: "UC0mPJmfyM0pyysqo____vrg", name: "Nathanidk" },
  { id: "UC3QgyfaVyrMrtAWiD-LEznw", name: "Maudy" },
  { id: "UCFIVpDe3Va4-zyqU7X1OmyQ", name: "AmeyJune" },
  { id: "UCeC4g-1WDyASRbUCR581LcA", name: "BuayaKayang" },
  { id: "UCArSnxhpKhVAEsz59qxgUTw", name: "ZaarBot" },
  { id: "UCec5C8MqoL-Ap21K_xassLA", name: "Cikko" },
  { id: "UC6NHHEHU9_ryxdcX8Evpvwg", name: "thoriqzi" },
  { id: "UCXP0FETbRcnTUKfWKT3MMMQ", name: "bhinneka" },
  { id: "UCpxwg_F4dtqJEnpJ1_IjRTQ", name: "Rigel" },
  { id: "UCfSzUAtec_V5wDcnhpO2BtQ", name: "L666" },
  { id: "UCzFMuvYoldcSsAvEhzR0zvA", name: "depoy" },
  { id: "UCR2hk03Jzm54sPlFiKMlQ1g", name: "CingBakar" },
  { id: "UCZHwiV6NsiV5dqbn4DHaJRw", name: "Kyuzin" },
  { id: "UC3XLJcx1dxT-RkC-JhdrjPQ", name: "https" },
  { id: "UCwrlAmZnhLOu9f3FaJvYk_Q", name: "Vigovel" },
  { id: "UCfLQtdWfo0x349wXPGB4OdQ", name: "Ardianlk_" },
  { id: "UCzRbDnymGdZ3Q76BH319FyQ", name: "Lica" },
  { id: "UC1m-4p7PSs-1R5pXeu5-zcg", name: "BIMA ALVAREZ" },
  { id: "UCRZ68rP5E5JUVXlQDOQajSw", name: "KinKin" },
  { id: "UCKbz0Mcaanj2GCicGEzMpWw", name: "Vero" },
  { id: "UCwsSJX4pMzs_Mw13g29P8rA", name: "Moozzyy" },
  { id: "UCoHosix7V3Zd411FgDsG3cg", name: "Moza ends u" },
  { id: "UCtlEqXdxdoc4xYr6cHX9-Fg", name: "Cahya Dwi44" },
  { id: "UCNhLmDbzYe3O06juIuqUtDg", name: "Idinzzz" },
  { id: "UCMcOg9uqZd1_5B8d8U1F-HQ", name: "Bengbeng" },
  { id: "UCTU72lWHiTf6OQr3XM2-_ug", name: "GARREN" },
  { id: "UCSw9DYtlHEvJAn9ElRchXTg", name: "GALLABI" },
  { id: "UC8zU0IoT0C9DX2CS45i-YxA", name: "elmiraa" },
  { id: "UCPsJO9sQY3J-lletKdbG2xQ", name: "matthewah." },
  { id: "UC_T3McVHAUlLfpA6v8JVqvA", name: "ic Alexandria Pradipta" },
  { id: "UCiW7vi6ENHUSKCOTk0nZnUw", name: "Nopalll" },
  { id: "UC5FGwCXwM8Gw4_gNQ2inAgw", name: "NaraLand" },
];

// ============================================================
//  STATE
// ============================================================

let CHANNELS = []; // diisi dari /api/channels
let currentLayout = 4;
let activeChannels = [];
let liveChannels = [];
let heroChannel = null;
let playerOpen = false;

// ============================================================
//  DOM REFS
// ============================================================

const navbar         = document.getElementById("navbar");
const heroTitle      = document.getElementById("heroTitle");
const heroSub        = document.getElementById("heroSub");
const heroWatchBtn   = document.getElementById("heroWatchBtn");
const heroInfoBtn    = document.getElementById("heroInfoBtn");
const statusBar      = document.getElementById("statusBar");
const liveCountEl    = document.getElementById("liveCount");
const liveCountNav   = document.getElementById("liveCountNav");
const allCountEl     = document.getElementById("allCount");
const liveGrid       = document.getElementById("liveGrid");
const allChannelsEl  = document.getElementById("allChannels");
const emptyLive      = document.getElementById("emptyLive");
const playerModal    = document.getElementById("playerModal");
const playerGrid     = document.getElementById("playerGrid");
const modalTitle     = document.getElementById("modalTitle");
const modalBarInner  = document.getElementById("modalBarInner");
const btnBack        = document.getElementById("btnBack");
const btnLayout      = document.getElementById("btnLayout");
const btnLayoutModal = document.getElementById("btnLayoutModal");
const layoutModal    = document.getElementById("layoutModal");
const layoutClose    = document.getElementById("layoutClose");
const lmOpts         = document.querySelectorAll(".lm-opt");

// ============================================================
//  STATUS BAR
// ============================================================

function updateStatus(msg, done = false) {
  const statusText = statusBar.querySelector(".status-text");
  statusText.innerHTML = done
    ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ${msg}`
    : `<svg class="spin-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> ${msg}`;
  if (done) {
    statusBar.classList.add("done");
    setTimeout(() => { statusBar.style.display = "none"; }, 3000);
  }
}

// ============================================================
//  FETCH CHANNELS dari /api/channels
// ============================================================

async function fetchChannels() {
  try {
    const res = await fetch("/api/channels");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (Array.isArray(data.channels) && data.channels.length > 0) {
      return data.channels;
    }
    throw new Error("Empty channels");
  } catch (err) {
    console.warn("Gagal fetch /api/channels, pakai DEFAULT_CHANNELS:", err);
    return DEFAULT_CHANNELS;
  }
}

// ============================================================
//  LIVE DETECTION via /api/livestatus
//  FIX: sebelumnya pakai no-cors fetch langsung ke YouTube
//  yang selalu return opaque (semua channel dianggap live).
//  Sekarang pakai serverless API yang scrape HTML YouTube
//  dan deteksi isLive dengan akurat.
// ============================================================

async function detectLiveChannels() {
  updateStatus("Memeriksa status live semua channel...", false);

  try {
    const res = await fetch("/api/livestatus");
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    const channelsData = data.channels || {};

    // Map channel list dengan data live dari API
    const enriched = CHANNELS.map(ch => ({
      ...ch,
      isLive:  channelsData[ch.id]?.isLive  || false,
      videoId: channelsData[ch.id]?.videoId || null,
      title:   channelsData[ch.id]?.title   || null,
    }));

    liveChannels = enriched.filter(ch => ch.isLive);

    // Fallback kalau tidak ada yang live (bisa semua offline memang)
    if (liveChannels.length === 0) {
      console.info("Tidak ada yang live saat ini.");
    }
  } catch (err) {
    console.warn("Gagal fetch /api/livestatus, fallback ke semua channel:", err);
    // Fallback: tampilkan semua channel, iframe YouTube tunjukkan status aslinya
    liveChannels = CHANNELS.map(ch => ({ ...ch, isLive: true, videoId: null }));
  }

  return liveChannels;
}

// ============================================================
//  INIT
// ============================================================

async function init() {
  setupNavScroll();

  // 1. Ambil daftar channel dari API (atau default)
  CHANNELS = await fetchChannels();

  // Render semua channel dulu (belum tahu siapa live)
  renderAllChannels();

  // 2. Cek siapa yang live via /api/livestatus
  await detectLiveChannels();

  // 3. Update UI dengan hasil live detection
  updateStatus(`${liveChannels.length} channel live ditemukan`, true);
  liveCountEl.textContent  = liveChannels.length + " Channel";
  liveCountNav.textContent = liveChannels.length;
  allCountEl.textContent   = CHANNELS.length + " Channel";

  // Re-render all channels dengan badge live/offline yang akurat
  renderAllChannels();

  if (liveChannels.length === 0) {
    emptyLive.style.display = "";
    liveGrid.style.display  = "none";
  } else {
    emptyLive.style.display = "none";
    liveGrid.style.display  = "";
    renderLiveGrid();
    setHero(liveChannels[0]);
  }

  activeChannels = liveChannels.slice(0, currentLayout);

  setupEvents();
}

// ============================================================
//  HERO
// ============================================================

function setHero(channel) {
  heroChannel = channel;
  heroTitle.textContent = channel.name.toUpperCase();
  heroSub.textContent   = "BFL TV — Tonton Live Sekarang";
}

// ============================================================
//  RENDER LIVE GRID
// ============================================================

function renderLiveGrid() {
  liveGrid.innerHTML = "";
  liveGrid.setAttribute("data-layout", Math.min(currentLayout, 4));

  liveChannels.forEach((ch) => {
    const card = createStreamCard(ch);
    liveGrid.appendChild(card);
  });
}

function createStreamCard(channel) {
  const card     = document.createElement("div");
  card.className = "stream-card";

  const initials = channel.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

  card.innerHTML = `
    <div class="stream-card-thumb">
      <span class="stream-thumb-initials">${initials}</span>
    </div>
    <div class="stream-card-overlay"></div>
    <div class="stream-card-play">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M8 5v14l11-7z"/></svg>
    </div>
    <div class="stream-card-info">
      <div class="stream-card-name">${escapeHtml(channel.name)}</div>
      <div class="stream-card-live-badge">
        <span class="live-dot" style="width:5px;height:5px;"></span>
        LIVE
      </div>
    </div>
  `;

  card.addEventListener("click", () => openPlayer([channel]));
  return card;
}

// ============================================================
//  RENDER ALL CHANNELS
// ============================================================

function renderAllChannels() {
  allChannelsEl.innerHTML = "";
  CHANNELS.forEach((ch) => {
    const isLive   = liveChannels.some(l => l.id === ch.id);
    const initials = ch.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

    const badge     = document.createElement("div");
    badge.className = "ch-badge" + (isLive ? " live" : "");
    badge.innerHTML = `
      <div class="ch-avatar">
        <div class="ch-live-ring"></div>
        ${initials}
      </div>
      <span class="ch-name">${escapeHtml(ch.name)}</span>
      <span class="ch-status">${isLive ? "LIVE" : "Offline"}</span>
    `;
    badge.addEventListener("click", () => {
      if (isLive) openPlayer([ch]);
    });
    allChannelsEl.appendChild(badge);
  });
}

// ============================================================
//  PLAYER MODAL
// ============================================================

function openPlayer(initialChannels) {
  if (initialChannels && initialChannels.length > 0) {
    activeChannels = [...initialChannels];
    liveChannels.forEach(ch => {
      if (activeChannels.length >= currentLayout) return;
      if (!activeChannels.find(a => a.id === ch.id)) {
        activeChannels.push(ch);
      }
    });
  }

  renderPlayerGrid();
  renderModalChannelBar();
  modalTitle.textContent = activeChannels.map(c => c.name).join(", ");
  playerModal.classList.add("open");
  playerOpen = true;
  document.body.style.overflow = "hidden";
}

function closePlayer() {
  playerModal.classList.remove("open");
  playerOpen = false;
  document.body.style.overflow = "";
  setTimeout(() => { playerGrid.innerHTML = ""; }, 400);
}

function renderPlayerGrid() {
  playerGrid.setAttribute("data-layout", currentLayout);
  playerGrid.innerHTML = "";

  for (let i = 0; i < currentLayout; i++) {
    const ch   = activeChannels[i] || null;
    const card = document.createElement("div");
    card.className = "pcard" + (ch ? " loaded" : "");

    const wrapper = document.createElement("div");
    wrapper.className = "pcard-wrapper";

    if (ch) {
      const iframe = document.createElement("iframe");

      // FIX: Kalau ada videoId dari API, pakai embed video langsung
      // (lebih stabil & pasti live). Kalau tidak ada, fallback ke live_stream.
      if (ch.videoId) {
        iframe.src = `https://www.youtube.com/embed/${ch.videoId}?autoplay=1&mute=1`;
      } else {
        iframe.src = `https://www.youtube.com/embed/live_stream?channel=${ch.id}&autoplay=1&mute=1`;
      }

      iframe.allow          = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.loading        = "lazy";
      wrapper.appendChild(iframe);

      const ov       = document.createElement("div");
      ov.className   = "pcard-overlay";
      wrapper.appendChild(ov);
    } else {
      wrapper.innerHTML = `
        <div class="pcard-placeholder">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9l5 3-5 3V9z"/></svg>
          <span>Slot Kosong</span>
        </div>
      `;
    }

    const bar     = document.createElement("div");
    bar.className = "pcard-bar";

    if (ch) {
      bar.innerHTML = `
        <span class="pcard-name">${escapeHtml(ch.name)}</span>
        <span class="pcard-live">
          <span class="live-dot" style="width:5px;height:5px;flex-shrink:0"></span>
          LIVE
        </span>
      `;
    } else {
      bar.innerHTML = `<span class="pcard-name" style="color:var(--text-muted)">Slot Kosong</span>`;
    }

    card.appendChild(wrapper);
    card.appendChild(bar);
    playerGrid.appendChild(card);
  }
}

function renderModalChannelBar() {
  modalBarInner.innerHTML = "";

  CHANNELS.forEach((ch) => {
    const isActive  = activeChannels.some(a => a.id === ch.id);
    const isLive    = liveChannels.some(l => l.id === ch.id);
    const initials  = ch.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

    const badge     = document.createElement("div");
    badge.className = "mch-badge" + (isActive ? " active" : "") + (isLive ? " live-ch" : "");
    badge.innerHTML = `
      <div class="mch-avatar">${initials}</div>
      <span class="mch-name">${escapeHtml(ch.name)}</span>
    `;

    badge.addEventListener("click", () => {
      if (!isLive) return;
      toggleModalChannel(ch.id);
    });

    modalBarInner.appendChild(badge);
  });
}

function toggleModalChannel(channelId) {
  const ch = CHANNELS.find(c => c.id === channelId);
  if (!ch) return;

  const idx = activeChannels.findIndex(c => c.id === channelId);
  if (idx !== -1) {
    activeChannels.splice(idx, 1);
  } else {
    if (activeChannels.length >= currentLayout) {
      activeChannels[currentLayout - 1] = ch;
    } else {
      activeChannels.push(ch);
    }
  }

  renderPlayerGrid();
  renderModalChannelBar();
}

// ============================================================
//  LAYOUT
// ============================================================

function setLayout(count) {
  currentLayout = count;

  if (activeChannels.length > currentLayout) {
    activeChannels = activeChannels.slice(0, currentLayout);
  }

  lmOpts.forEach(opt => {
    opt.classList.toggle("active", parseInt(opt.dataset.layout) === currentLayout);
  });

  if (playerOpen) {
    renderPlayerGrid();
    renderModalChannelBar();
  }

  closeLayoutModal();
}

function openLayoutModal()  { layoutModal.classList.add("open"); }
function closeLayoutModal() { layoutModal.classList.remove("open"); }

// ============================================================
//  NAVBAR SCROLL
// ============================================================

function setupNavScroll() {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// ============================================================
//  EVENTS
// ============================================================

function setupEvents() {
  btnBack.addEventListener("click", closePlayer);

  btnLayout.addEventListener("click", openLayoutModal);
  btnLayoutModal.addEventListener("click", openLayoutModal);
  layoutClose.addEventListener("click", closeLayoutModal);

  layoutModal.addEventListener("click", (e) => {
    if (e.target === layoutModal) closeLayoutModal();
  });

  lmOpts.forEach(opt => {
    opt.addEventListener("click", () => setLayout(parseInt(opt.dataset.layout)));
  });

  heroWatchBtn.addEventListener("click", () => {
    if (heroChannel)          openPlayer([heroChannel]);
    else if (liveChannels.length > 0) openPlayer([liveChannels[0]]);
  });

  heroInfoBtn.addEventListener("click", () => {
    document.getElementById("liveSection").scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (layoutModal.classList.contains("open")) closeLayoutModal();
      else if (playerOpen) closePlayer();
    }
    if (!playerOpen && !layoutModal.classList.contains("open")) {
      if (e.key === "1") setLayout(1);
      if (e.key === "2") setLayout(2);
      if (e.key === "4") setLayout(4);
      if (e.key === "6") setLayout(6);
      if (e.key === "9") setLayout(9);
    }
  });
}

// ============================================================
//  UTILS
// ============================================================

function escapeHtml(str) {
  const d   = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ============================================================
//  START
// ============================================================

document.addEventListener("DOMContentLoaded", init);
