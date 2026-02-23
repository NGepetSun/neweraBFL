/**
 * ============================================================
 *  BFL TV - Netflix-Style Multi-Watch YouTube Live Stream
 *  By @elvanprmn
 * ============================================================
 */

const CHANNELS = [
  { id: "UCJTq8YQXj-2_BNgwis4SGsg", name: "RonnyBons"    },
  { id: "UCBu6n7CY3k_HdX8THmyEOEw", name: "Abeegel"      },
  { id: "UCz4s1BgKNXTwOHO0PHQHQxQ", name: "Kafeyinhere"  },
  { id: "UCsUhlZAanKWUsZxqbPbjAOw", name: "Fahrul Reyza" },
  { id: "UCZHSRSIP9m2uxOAOlVJGytw", name: "Danny"         },
  { id: "UCamUqGw_jBciNhBNwBcJFRg", name: "Nathann"       },
  { id: "UCKciWscgYbPCuAdtX91x06w", name: "Deplonnn"      },
  { id: "UCvrhggVJsdR6uYvuIrX_Grg", name: "Dipiwww"       },
  { id: "UCrvlbX01F8qtXlJDXX7czVg", name: "Rey"           },
  { id: "UCYKxEdT_OBIUv7_zJkyQkdg", name: "AndreMemet"    },
  { id: "UCQV0qkau8jIHyn5iRY6bIcg", name: "Syacei"        },
  { id: "UCKN2A4ShReXSHJER9_lfwLw", name: "Bopeng16"      },
  { id: "UChEzBCVwQg3EC7QjsF3iZHw", name: "Zotafrz"       },
  { id: "UC-x7sdu_4FNa5fsGDr3nfbQ", name: "Nanzz"         },
  { id: "UCUC6Ovlo-UNQD5lKcLIn6Q",  name: "Neyna"         },
  { id: "UCt2QdjyIsTHOVzFlTB37UeA", name: "artszzy"       },
  { id: "UCb9tHaLY3XFM6V2Is_Z2R6A", name: "Eko D Libra"   },
  { id: "UCgqC90SQYpod4-Ys-6NVUHw", name: "Edot"          },
  { id: "UCZyUX_68LnJ-AA6REPU45Ew", name: "Jonanthan"     },
];

// ============================================================
//  STATE
// ============================================================

let currentLayout = 4;
let activeChannels = []; // channels shown in multi-view player
let liveChannels = [];   // channels detected as live
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
//  LIVE DETECTION
//  Strategy: try to embed the live_stream URL inside a hidden
//  iframe and use the onerror / onload heuristic. 
//  Since we can't read iframe content cross-origin, we use the
//  YouTube oembed endpoint which returns metadata if a live
//  stream exists.
// ============================================================

async function checkIfLive(channel) {
  try {
    const url = `https://www.youtube.com/embed/live_stream?channel=${channel.id}`;
    // Use oembed to detect: if channel has an active live stream
    // oembed for channel live doesn't always work, so we use a
    // fetch to the embed URL and check for redirect / content.
    // Since CORS blocks this, we use a no-cors fetch and check
    // if the response is opaque (means page exists / loaded).
    const res = await fetch(url, { method: "GET", mode: "no-cors", signal: AbortSignal.timeout(5000) });
    // opaque response means the request "succeeded" (200 range)
    // but we can't read the body. This means the embed exists.
    // YouTube returns a specific page even for non-live channels,
    // so we treat all reachable channels as potentially live.
    // We'll mark all as "live" and let the iframe show naturally.
    return res.type === "opaque";
  } catch {
    return false;
  }
}

/**
 * Because we can't do true live detection without an API key,
 * we use a practical approach:
 * 1. Attempt a no-cors fetch to the embed URL
 * 2. All channels that respond are shown in the "Live Now" grid
 * 3. Iframes that show "no live stream" will display YouTube's
 *    own "no stream available" message naturally
 *
 * To show a more meaningful demo, we mark all channels as 
 * "potentially live" and show them all in the live grid,
 * letting the iframe content reveal actual status.
 */
async function detectLiveChannels() {
  updateStatus("Memeriksa status live semua channel...", false);

  const checks = CHANNELS.map(async (ch) => {
    const live = await checkIfLive(ch);
    return { ...ch, live };
  });

  const results = await Promise.all(checks);

  // All that returned opaque are considered live candidates
  liveChannels = results.filter(ch => ch.live);

  // Fallback: if nothing detected (e.g. network blocked), show all
  if (liveChannels.length === 0) {
    liveChannels = [...CHANNELS];
  }

  return liveChannels;
}

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
//  INIT
// ============================================================

async function init() {
  setupNavScroll();
  renderAllChannels();

  // Start live detection
  await detectLiveChannels();

  updateStatus(`${liveChannels.length} channel ditemukan`, true);
  liveCountEl.textContent = liveChannels.length + " Channel";
  liveCountNav.textContent = liveChannels.length;
  allCountEl.textContent = CHANNELS.length + " Channel";

  // Update all channel badges with live status
  renderAllChannels();

  if (liveChannels.length === 0) {
    emptyLive.style.display = "";
    liveGrid.style.display = "none";
  } else {
    emptyLive.style.display = "none";
    liveGrid.style.display = "";
    renderLiveGrid();
    setHero(liveChannels[0]);
  }

  // Default active channels = first N live channels
  activeChannels = liveChannels.slice(0, currentLayout);

  setupEvents();
}

// ============================================================
//  HERO
// ============================================================

function setHero(channel) {
  heroChannel = channel;
  heroTitle.textContent = channel.name.toUpperCase();
  heroSub.textContent = "BFL TV — Tonton Live Sekarang";
}

// ============================================================
//  RENDER LIVE GRID (Netflix card grid)
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
  const card = document.createElement("div");
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
    const isLive = liveChannels.some(l => l.id === ch.id);
    const initials = ch.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

    const badge = document.createElement("div");
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
  // If single channel, set it; otherwise use activeChannels
  if (initialChannels && initialChannels.length > 0) {
    activeChannels = [...initialChannels];
    // Fill remaining slots with other live channels
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
  // Clear iframes to stop playback
  setTimeout(() => { playerGrid.innerHTML = ""; }, 400);
}

function renderPlayerGrid() {
  playerGrid.setAttribute("data-layout", currentLayout);
  playerGrid.innerHTML = "";

  for (let i = 0; i < currentLayout; i++) {
    const ch = activeChannels[i] || null;
    const card = document.createElement("div");
    card.className = "pcard" + (ch ? " loaded" : "");

    const wrapper = document.createElement("div");
    wrapper.className = "pcard-wrapper";

    if (ch) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/live_stream?channel=${ch.id}&autoplay=1&mute=1`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      wrapper.appendChild(iframe);

      const ov = document.createElement("div");
      ov.className = "pcard-overlay";
      wrapper.appendChild(ov);
    } else {
      wrapper.innerHTML = `
        <div class="pcard-placeholder">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9l5 3-5 3V9z"/></svg>
          <span>Slot Kosong</span>
        </div>
      `;
    }

    const bar = document.createElement("div");
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
    const isActive = activeChannels.some(a => a.id === ch.id);
    const isLive = liveChannels.some(l => l.id === ch.id);
    const initials = ch.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

    const badge = document.createElement("div");
    badge.className = "mch-badge" + (isActive ? " active" : "") + (isLive ? " live-ch" : "");
    badge.innerHTML = `
      <div class="mch-avatar">${initials}</div>
      <span class="mch-name">${escapeHtml(ch.name)}</span>
    `;

    badge.addEventListener("click", () => {
      if (!isLive) return; // only live channels
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

function openLayoutModal() { layoutModal.classList.add("open"); }
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
    if (heroChannel) openPlayer([heroChannel]);
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
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ============================================================
//  START
// ============================================================

document.addEventListener("DOMContentLoaded", init);
