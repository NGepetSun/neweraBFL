// /api/channels.js
// GET  -> kembalikan daftar channel (terlihat semua orang)
// POST -> admin update daftar channel (butuh password), tersimpan di Vercel KV
//
// SETUP DI VERCEL:
// 1. Database "upstash-kv-aquamarine-ball" sudah terhubung ke project ini, dan
//    otomatis menyediakan env vars: KV_REST_API_URL & KV_REST_API_TOKEN.
// 2. Tambahkan env var ADMIN_PASSWORD di Settings -> Environment Variables
//    (isi dengan password admin kamu, mis. "permana123A").
// 3. TIDAK PERLU install package apapun — file ini langsung fetch ke REST API KV.

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) throw new Error("KV env vars belum diset");
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) throw new Error("KV GET gagal: HTTP " + res.status);
  const json = await res.json();
  if (json.result == null) return null;
  try {
    return JSON.parse(json.result);
  } catch {
    return json.result;
  }
}

async function kvSet(key, value) {
  if (!KV_URL || !KV_TOKEN) throw new Error("KV env vars belum diset");
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSON.stringify(value)),
  });
  if (!res.ok) throw new Error("KV SET gagal: HTTP " + res.status);
  return true;
}

const KEY = "bfltv_channels";

// Channel default jika KV masih kosong (sinkron dengan DEFAULT_CHANNELS di frontend)
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
  { id: "UCUC6Ovlo-UNQD5lKcLIn6Q", name: "Neyna" },
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

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-password");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const data = await kvGet(KEY);
      const channels = Array.isArray(data) && data.length > 0 ? data : DEFAULT_CHANNELS;
      return res.status(200).json({ channels });
    } catch (e) {
      // KV belum disetup / error -> kembalikan default
      return res.status(200).json({ channels: DEFAULT_CHANNELS, warning: String(e.message || e) });
    }
  }

  if (req.method === "POST") {
    const adminPass = req.headers["x-admin-password"];
    if (!process.env.ADMIN_PASSWORD || adminPass !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized: password admin salah/tidak ada" });
    }

    const body = req.body;
    const channels = body && body.channels;
    if (!Array.isArray(channels)) {
      return res.status(400).json({ error: "Body harus berupa { channels: [...] }" });
    }
    for (const c of channels) {
      if (!c || typeof c.id !== "string" || typeof c.name !== "string") {
        return res.status(400).json({ error: "Setiap channel harus punya { id, name } string" });
      }
    }

    try {
      await kvSet(KEY, channels);
      return res.status(200).json({ ok: true, count: channels.length });
    } catch (e) {
      return res.status(500).json({ error: "Gagal simpan ke KV: " + String(e.message || e) });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
