// ─────────────────────────────────────────────────────────────────────────────
// EMDAD Local API Server
// Runs alongside Vite in development. Proxies image → Anthropic API securely
// so your API key is never exposed in the browser.
//
// Start: npm run dev  (launches both Vite + this server together)
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import crypto from "crypto";
import https from "https";
import { createRequire } from "module";
import { readFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// ── Load .env manually (lightweight, no extra package) ────────────────────────
const envPath = fileURLToPath(new URL("./.env", import.meta.url));
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── Admin authentication ─────────────────────────────────────────────────────
// Credentials live ONLY on the server (no VITE_ prefix → never sent to the
// browser bundle). Auth is a stateless HMAC-signed token: the secret never
// leaves the server, and protected endpoints reject any unsigned/expired token.
const ADMIN_USER = process.env.ADMIN_USER || "admin";
// Preferred: a salted scrypt hash (ADMIN_PASS_HASH). Plaintext ADMIN_PASS is
// still accepted as a fallback for convenience, but hashing is recommended.
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || "";
const ADMIN_PASS = process.env.ADMIN_PASS || "";
const adminConfigured = !!(ADMIN_PASS_HASH || ADMIN_PASS);
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
// A stable secret keeps sessions valid across restarts. If none is provided we
// generate a random one (sessions then reset on restart, which is safe).
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString("hex");

if (!adminConfigured) {
  console.warn(
    "[EMDAD] ⚠ No admin password configured — set ADMIN_PASS_HASH (preferred) or ADMIN_PASS in .env.",
  );
} else if (!ADMIN_PASS_HASH && ADMIN_PASS) {
  console.warn(
    "[EMDAD] ⚠ Using plaintext ADMIN_PASS. Generate a hash with `npm run hash-password` and set ADMIN_PASS_HASH instead.",
  );
}

// ── Password hashing (scrypt, salted — no external dependency) ────────────────
// Stored format: scrypt$<N>$<r>$<p>$<saltHex>$<hashHex>
function hashPassword(password) {
  const N = 16384,
    r = 8,
    p = 1,
    keylen = 64;
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, keylen, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function verifyPassword(password, stored) {
  try {
    const [scheme, N, r, p, saltHex, hashHex] = String(stored).split("$");
    if (scheme !== "scrypt") return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = crypto.scryptSync(password, salt, expected.length, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
      maxmem: 256 * 1024 * 1024,
    });
    return (
      actual.length === expected.length &&
      crypto.timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}

const b64url = (buf) =>
  Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

function signSession() {
  const payload = b64url(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }));
  const sig = b64url(
    crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest(),
  );
  return `${payload}.${sig}`;
}

function verifySession(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const expected = b64url(
    crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest(),
  );
  // Constant-time comparison to avoid signature timing leaks.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64").toString());
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

// Timing-safe credential check.
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Express middleware: gate a route behind a valid admin session token.
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!verifySession(token)) {
    audit("auth_denied", req, { method: req.method, path: req.originalUrl });
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

const ANALYSIS_PROMPT = `You are an expert interior design consultant for EMDAD Wooden & Smart Furniture, a premium manufacturer in Zarqa, Jordan specializing in wooden and smart furniture.

Carefully analyze this room photo and provide personalized furniture recommendations from EMDAD's catalogue.

EMDAD's available furniture categories:
• Master Bedrooms — 27 luxury bedroom sets (classic to ultra-modern, ID: master-bedrooms)
• Single Bedrooms — 33 contemporary youth and guest room designs (ID: single-bedrooms)
• Living Rooms — 9 reception and lounge collections (ID: living-rooms)
• Guest Rooms — 8 formal reception and majlis-style seating sets (ID: guest-room)
• Kitchens — 13 designs from minimalist modern to traditional wood (ID: kitchens)
• Dining Tables — 8 solid wood dining sets, 6-seat to 12-seat (ID: dining-table)
• Dressing Rooms — 5 fitted wardrobe and walk-in systems (ID: dressing-room)
• Storage Rooms — 2 custom storage and utility-room solutions (ID: storage-room)
• Outdoor & Landscape — 8 weather-resistant outdoor collections (ID: landscape)
• TV Units — 10 sleek entertainment center designs (ID: tv-units)

CRITICAL: Respond ONLY with valid JSON — no markdown backticks, no explanation, no preamble. Exactly this structure:
{
  "roomType": "Master Bedroom",
  "style": "Modern",
  "colorPalette": ["#F5F0E8", "#C8A96E", "#2C2C2A"],
  "colorNames": ["Warm Ivory", "Oak Tone", "Charcoal"],
  "lightLevel": "High",
  "roomSize": "Spacious",
  "existingStrengths": ["Good natural light", "High ceiling"],
  "opportunities": ["No dressing storage", "TV wall underutilized"],
  "recommendations": [
    {
      "categoryId": "master-bedrooms",
      "categoryName": "Master Bedrooms",
      "reason": "The room proportions suit our king-size platform bed series. Natural oak mirrors your existing warm tones.",
      "finishSuggestion": "Natural Oak with brushed gold hardware",
      "urgency": "essential",
      "confidence": 0.93
    }
  ],
  "designerNote": "2-3 sentences of warm, specific professional design advice."
}

urgency: essential | recommended | optional
confidence: 0.0 to 1.0
lightLevel: Low | Medium | High
roomSize: Compact | Standard | Spacious
style: Modern | Classic | Minimalist | Luxury | Contemporary | Traditional | Eclectic
If image is not a room, set roomType to "Not a Room" and recommendations to [].`;

const EMDAD_SYSTEM = `You are Layla — EMDAD's official AI voice advisor. You speak Arabic and English fluently and represent EMDAD Wooden & Smart Furniture with warmth, expertise, and professionalism.

When answering the user, do not include hashtags, emojis, emoticons, or markdown formatting. Reply in the same language as the user's message. If the user writes in Arabic, answer in Arabic. If the user writes in English, answer in English. Provide only natural spoken text suitable for voice playback.`;

async function callClaude(body) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `API ${res.status}`);
  return data;
}

// ── Server ─────────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

// When deployed behind a TLS-terminating reverse proxy (nginx, Caddy, a PaaS),
// set TRUST_PROXY=true so req.ip reflects the real client (used by rate limiting).
if (process.env.TRUST_PROXY === "true") app.set("trust proxy", true);

app.use(express.json({ limit: "12mb" }));

// Health check
app.get("/api/health", (_, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    status: "ok",
    apiKeySet: hasKey,
    message: hasKey
      ? "API key found — ready to analyze rooms."
      : "ANTHROPIC_API_KEY not set in .env",
  });
});

// ── Login rate limiting ──────────────────────────────────────────────────────
// In-memory limiter: lock an IP after too many failed attempts within a window;
// a successful login resets it. For multi-instance deploys, back this with a
// shared store (e.g. Redis) instead of a process-local Map.
const LOGIN_MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS) || 5;
const LOGIN_WINDOW_MS =
  (Number(process.env.LOGIN_WINDOW_MIN) || 15) * 60 * 1000;
const loginAttempts = new Map(); // ip -> { count, first, lockedUntil }

const clientIp = (req) => req.ip || req.socket?.remoteAddress || "unknown";

// ── Audit log ────────────────────────────────────────────────────────────────
// Append-only security log of admin auth + data-mutation events. One JSON
// object per line (easy to grep or ship to a log aggregator).
// LOG_DIR lets you point logs at a persistent volume in production.
const logsDir =
  process.env.LOG_DIR || join(dirname(fileURLToPath(import.meta.url)), "logs");
mkdirSync(logsDir, { recursive: true });
const auditPath = join(logsDir, "admin-audit.log");

function audit(event, req, extra = {}) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    ip: req ? clientIp(req) : "system",
    ...extra,
  };
  try {
    appendFileSync(auditPath, JSON.stringify(entry) + "\n");
  } catch (err) {
    console.error("[EMDAD] audit log write failed:", err.message);
  }
  console.log(`[AUDIT] ${entry.ts} ${event} ip=${entry.ip}`);
}

function loginLockState(ip) {
  const rec = loginAttempts.get(ip);
  if (rec?.lockedUntil && Date.now() < rec.lockedUntil) {
    return { locked: true, retryAfterMs: rec.lockedUntil - Date.now() };
  }
  return { locked: false };
}

function recordLoginFailure(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip) || { count: 0, first: now, lockedUntil: 0 };
  if (now - rec.first > LOGIN_WINDOW_MS) {
    rec.count = 0;
    rec.first = now;
  }
  rec.count += 1;
  if (rec.count >= LOGIN_MAX_ATTEMPTS) rec.lockedUntil = now + LOGIN_WINDOW_MS;
  loginAttempts.set(ip, rec);
}

// Sweep stale entries so the map can't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of loginAttempts) {
    if (now - rec.first > LOGIN_WINDOW_MS && now > (rec.lockedUntil || 0)) {
      loginAttempts.delete(ip);
    }
  }
}, LOGIN_WINDOW_MS).unref?.();

// ── Admin auth endpoints ─────────────────────────────────────────────────────
// Validate credentials server-side and issue a signed session token.
app.post("/api/admin/login", (req, res) => {
  const ip = clientIp(req);
  const lock = loginLockState(ip);
  if (lock.locked) {
    const secs = Math.ceil(lock.retryAfterMs / 1000);
    res.set("Retry-After", String(secs));
    audit("login_locked", req, { retryAfterSec: secs });
    return res.status(429).json({
      error: `Too many attempts. Try again in ${Math.ceil(secs / 60)} minute(s).`,
    });
  }

  const { username, password } = req.body || {};
  if (!adminConfigured) {
    return res.status(500).json({
      error:
        "Admin login is not configured. Set ADMIN_PASS_HASH (or ADMIN_PASS) in .env.",
    });
  }
  const userOk = safeEqual(username, ADMIN_USER);
  const passOk = ADMIN_PASS_HASH
    ? verifyPassword(String(password ?? ""), ADMIN_PASS_HASH)
    : safeEqual(password, ADMIN_PASS);
  if (!userOk || !passOk) {
    recordLoginFailure(ip);
    audit("login_failure", req, { username: String(username ?? "") });
    return res.status(401).json({ error: "Invalid username or password." });
  }
  loginAttempts.delete(ip); // reset on success
  audit("login_success", req, { username: ADMIN_USER });
  res.json({ token: signSession(), expiresIn: SESSION_TTL_MS });
});

// Let the client check whether its stored token is still valid (e.g. on reload).
app.get("/api/admin/session", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  res.json({ valid: verifySession(token) });
});

// Chat endpoint for voice avatar
app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        "ANTHROPIC_API_KEY is not set. Create a .env file in the project root with: ANTHROPIC_API_KEY=your-key-here",
    });
  }

  const { messages } = req.body || {};
  if (!messages?.length) {
    return res.status(400).json({ error: "messages required" });
  }

  try {
    const data = await callClaude({
      model: "claude-opus-4-6",
      max_tokens: 300,
      system: EMDAD_SYSTEM,
      messages,
    });
    const reply = data.content?.[0]?.text || "";
    res.json({ reply });
  } catch (err) {
    console.error("[EMDAD] Chat error:", err.message);
    res.status(500).json({ error: err.message || "Unexpected server error" });
  }
});

// Room analysis endpoint
app.post("/api/analyze-room", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        "ANTHROPIC_API_KEY is not set. Create a .env file in the project root with: ANTHROPIC_API_KEY=your-key-here",
    });
  }

  const { imageBase64, mediaType = "image/jpeg" } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ error: "imageBase64 is required" });
  }

  try {
    console.log("[EMDAD] Sending image to Claude Vision API…");
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              { type: "text", text: ANALYSIS_PROMPT },
            ],
          },
        ],
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("[EMDAD] Anthropic API error:", apiRes.status, errText);
      return res
        .status(apiRes.status)
        .json({ error: `Anthropic API error ${apiRes.status}: ${errText}` });
    }

    const data = await apiRes.json();
    const rawText = data.content?.[0]?.text || "";
    console.log("[EMDAD] Got response from Claude, extracting JSON…");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[EMDAD] No JSON in response:", rawText.slice(0, 300));
      return res
        .status(500)
        .json({ error: "Could not parse AI response. Please try again." });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log(
      "[EMDAD] ✓ Analysis complete:",
      analysis.roomType,
      "—",
      analysis.style,
    );
    res.json(analysis);
  } catch (err) {
    console.error("[EMDAD] Server error:", err.message);
    res.status(500).json({ error: err.message || "Unexpected server error" });
  }
});

// ── Projects DB helpers ─────────────────────────────────────────────────────
// DB_DIR lets you put the SQLite file on a persistent volume in production
// (critical — without a persistent disk the database resets on every deploy).
const dbDir =
  process.env.DB_DIR || join(dirname(fileURLToPath(import.meta.url)), "db");
mkdirSync(dbDir, { recursive: true });
const dbPath = join(dbDir, "emdad.db");
const sqlite3Verbose = sqlite3.verbose();
const db = await open({
  filename: dbPath,
  driver: sqlite3Verbose.Database,
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
`);

// Customer inquiries submitted from a product's detail view ("orders").
await db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  );
`);

// Showroom visit bookings from the Appointment page.
await db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  );
`);

// Quote requests from the guided estimator.
await db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  );
`);

// DEFAULT_PROJECTS are kept available for the manual "Reset to Defaults"
// endpoint (POST /api/projects/reset), but are no longer auto-seeded on
// startup — an empty projects table stays empty so you can add your own.
const { DEFAULT_PROJECTS } = await import("./src/data/projects.js");

const getAllProjects = async () => {
  const rows = await db.all("SELECT data FROM projects ORDER BY rowid ASC");
  return rows.map((row) => JSON.parse(row.data));
};

const getProjectById = async (id) => {
  const row = await db.get("SELECT data FROM projects WHERE id = ?", id);
  return row ? JSON.parse(row.data) : null;
};

app.get("/api/projects", async (_, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error("[EMDAD] Failed to load projects:", error);
    res.status(500).json({ error: "Unable to load projects" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    console.error("[EMDAD] Failed to load project:", error);
    res.status(500).json({ error: "Unable to load project" });
  }
});

app.post("/api/projects", requireAdmin, async (req, res) => {
  const project = req.body;
  if (!project || typeof project !== "object") {
    return res.status(400).json({ error: "Project object is required" });
  }

  if (!project.id) {
    project.id = `EMD-${Date.now()}`;
  }

  try {
    const existing = await getProjectById(project.id);
    if (existing) {
      return res.status(409).json({ error: "Project ID already exists" });
    }
    await db.run(
      "INSERT INTO projects (id, data) VALUES (?, ?)",
      project.id,
      JSON.stringify(project),
    );
    audit("project_create", req, { id: project.id });
    res.status(201).json(project);
  } catch (error) {
    console.error("[EMDAD] Failed to create project:", error);
    res.status(500).json({ error: "Unable to create project" });
  }
});

app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  const project = req.body;
  const id = req.params.id;
  if (!project || typeof project !== "object") {
    return res.status(400).json({ error: "Project object is required" });
  }
  project.id = id;

  try {
    const existing = await getProjectById(id);
    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }
    await db.run(
      "UPDATE projects SET data = ? WHERE id = ?",
      JSON.stringify(project),
      id,
    );
    audit("project_update", req, { id });
    res.json(project);
  } catch (error) {
    console.error("[EMDAD] Failed to update project:", error);
    res.status(500).json({ error: "Unable to update project" });
  }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const result = await db.run(
      "DELETE FROM projects WHERE id = ?",
      req.params.id,
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    audit("project_delete", req, { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error("[EMDAD] Failed to delete project:", error);
    res.status(500).json({ error: "Unable to delete project" });
  }
});

app.post("/api/projects/reset", requireAdmin, async (req, res) => {
  try {
    await db.run("DELETE FROM projects");
    const insertStmt = await db.prepare(
      "INSERT INTO projects (id, data) VALUES (?, ?)",
    );
    for (const project of DEFAULT_PROJECTS) {
      await insertStmt.run(project.id, JSON.stringify(project));
    }
    await insertStmt.finalize();
    const projects = await getAllProjects();
    audit("projects_reset", req, { count: projects.length });
    res.json({ projects });
  } catch (error) {
    console.error("[EMDAD] Failed to reset projects:", error);
    res.status(500).json({ error: "Unable to reset projects" });
  }
});

// ── Orders (customer product inquiries) ──────────────────────────────────────
const getAllOrders = async () => {
  const rows = await db.all(
    "SELECT id, data, status, created_at FROM orders ORDER BY created_at DESC",
  );
  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.created_at,
    ...JSON.parse(r.data),
  }));
};

const clip = (v, max) => String(v ?? "").trim().slice(0, max);

// Public: a customer submits an inquiry from a product's detail view.
app.post("/api/orders", async (req, res) => {
  const b = req.body || {};
  const name = clip(b.name, 120);
  const phone = clip(b.phone, 40);
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required." });
  }
  const order = {
    name,
    phone,
    email: clip(b.email, 160),
    message: clip(b.message, 2000),
    productTitle: clip(b.productTitle, 200),
    productImage: clip(b.productImage, 400),
    category: clip(b.category, 120),
    finish: clip(b.finish, 80),
  };
  const id = `ORD-${Date.now()}`;
  try {
    await db.run(
      "INSERT INTO orders (id, data, status, created_at) VALUES (?, ?, 'new', ?)",
      id,
      JSON.stringify(order),
      new Date().toISOString(),
    );
    audit("order_created", req, { id, product: order.productTitle });
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error("[EMDAD] Failed to save order:", error);
    res.status(500).json({ error: "Unable to submit inquiry" });
  }
});

// Admin: list all orders (newest first).
app.get("/api/orders", requireAdmin, async (_, res) => {
  try {
    res.json(await getAllOrders());
  } catch (error) {
    console.error("[EMDAD] Failed to load orders:", error);
    res.status(500).json({ error: "Unable to load orders" });
  }
});

// Admin: update an order's status (new → read).
app.patch("/api/orders/:id", requireAdmin, async (req, res) => {
  const status = clip(req.body?.status, 20);
  if (!["new", "read"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    const result = await db.run(
      "UPDATE orders SET status = ? WHERE id = ?",
      status,
      req.params.id,
    );
    if (result.changes === 0)
      return res.status(404).json({ error: "Order not found" });
    audit("order_updated", req, { id: req.params.id, status });
    res.json({ success: true });
  } catch (error) {
    console.error("[EMDAD] Failed to update order:", error);
    res.status(500).json({ error: "Unable to update order" });
  }
});

// Admin: delete an order.
app.delete("/api/orders/:id", requireAdmin, async (req, res) => {
  try {
    const result = await db.run("DELETE FROM orders WHERE id = ?", req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Order not found" });
    audit("order_deleted", req, { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error("[EMDAD] Failed to delete order:", error);
    res.status(500).json({ error: "Unable to delete order" });
  }
});

// ── Appointments (showroom visit bookings) ───────────────────────────────────
const getAllAppointments = async () => {
  const rows = await db.all(
    "SELECT id, data, status, created_at FROM appointments ORDER BY created_at DESC",
  );
  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.created_at,
    ...JSON.parse(r.data),
  }));
};

// Public: a customer books a showroom visit.
app.post("/api/appointments", async (req, res) => {
  const b = req.body || {};
  const name = clip(b.name, 120);
  const phone = clip(b.phone, 40);
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required." });
  }
  const appt = {
    ref: clip(b.ref, 40),
    name,
    phone,
    email: clip(b.email, 160),
    company: clip(b.company, 160),
    type: clip(b.type, 80),
    notes: clip(b.notes, 2000),
    date: clip(b.date, 40),
    dateLabel: clip(b.dateLabel, 80),
    time: clip(b.time, 40),
  };
  const id = `APT-${Date.now()}`;
  try {
    await db.run(
      "INSERT INTO appointments (id, data, status, created_at) VALUES (?, ?, 'new', ?)",
      id,
      JSON.stringify(appt),
      new Date().toISOString(),
    );
    audit("appointment_created", req, { id, date: appt.date, time: appt.time });
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error("[EMDAD] Failed to save appointment:", error);
    res.status(500).json({ error: "Unable to book appointment" });
  }
});

// Admin: list all appointments (newest first).
app.get("/api/appointments", requireAdmin, async (_, res) => {
  try {
    res.json(await getAllAppointments());
  } catch (error) {
    console.error("[EMDAD] Failed to load appointments:", error);
    res.status(500).json({ error: "Unable to load appointments" });
  }
});

// Admin: update an appointment's status (new → read).
app.patch("/api/appointments/:id", requireAdmin, async (req, res) => {
  const status = clip(req.body?.status, 20);
  if (!["new", "read"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    const result = await db.run(
      "UPDATE appointments SET status = ? WHERE id = ?",
      status,
      req.params.id,
    );
    if (result.changes === 0)
      return res.status(404).json({ error: "Appointment not found" });
    audit("appointment_updated", req, { id: req.params.id, status });
    res.json({ success: true });
  } catch (error) {
    console.error("[EMDAD] Failed to update appointment:", error);
    res.status(500).json({ error: "Unable to update appointment" });
  }
});

// Admin: delete an appointment.
app.delete("/api/appointments/:id", requireAdmin, async (req, res) => {
  try {
    const result = await db.run(
      "DELETE FROM appointments WHERE id = ?",
      req.params.id,
    );
    if (result.changes === 0)
      return res.status(404).json({ error: "Appointment not found" });
    audit("appointment_deleted", req, { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error("[EMDAD] Failed to delete appointment:", error);
    res.status(500).json({ error: "Unable to delete appointment" });
  }
});

// ── Quote requests (guided estimator) ────────────────────────────────────────
const getAllQuotes = async () => {
  const rows = await db.all(
    "SELECT id, data, status, created_at FROM quotes ORDER BY created_at DESC",
  );
  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.created_at,
    ...JSON.parse(r.data),
  }));
};

// Public: a customer submits a quote request from the estimator.
app.post("/api/quotes", async (req, res) => {
  const b = req.body || {};
  const name = clip(b.name, 120);
  const phone = clip(b.phone, 40);
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required." });
  }
  const quote = {
    name,
    phone,
    email: clip(b.email, 160),
    notes: clip(b.notes, 2000),
    projectType: clip(b.projectType, 80),
    rooms: Array.isArray(b.rooms)
      ? b.rooms.map((r) => clip(r, 60)).slice(0, 30)
      : clip(b.rooms, 400),
    tier: clip(b.tier, 60),
  };
  const id = `QT-${Date.now()}`;
  try {
    await db.run(
      "INSERT INTO quotes (id, data, status, created_at) VALUES (?, ?, 'new', ?)",
      id,
      JSON.stringify(quote),
      new Date().toISOString(),
    );
    audit("quote_created", req, { id, projectType: quote.projectType });
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error("[EMDAD] Failed to save quote:", error);
    res.status(500).json({ error: "Unable to submit quote request" });
  }
});

// Admin: list all quote requests (newest first).
app.get("/api/quotes", requireAdmin, async (_, res) => {
  try {
    res.json(await getAllQuotes());
  } catch (error) {
    console.error("[EMDAD] Failed to load quotes:", error);
    res.status(500).json({ error: "Unable to load quotes" });
  }
});

// Admin: update a quote request's status (new → read).
app.patch("/api/quotes/:id", requireAdmin, async (req, res) => {
  const status = clip(req.body?.status, 20);
  if (!["new", "read"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    const result = await db.run(
      "UPDATE quotes SET status = ? WHERE id = ?",
      status,
      req.params.id,
    );
    if (result.changes === 0)
      return res.status(404).json({ error: "Quote request not found" });
    audit("quote_updated", req, { id: req.params.id, status });
    res.json({ success: true });
  } catch (error) {
    console.error("[EMDAD] Failed to update quote:", error);
    res.status(500).json({ error: "Unable to update quote request" });
  }
});

// Admin: delete a quote request.
app.delete("/api/quotes/:id", requireAdmin, async (req, res) => {
  try {
    const result = await db.run("DELETE FROM quotes WHERE id = ?", req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Quote request not found" });
    audit("quote_deleted", req, { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error("[EMDAD] Failed to delete quote:", error);
    res.status(500).json({ error: "Unable to delete quote request" });
  }
});

// ── Serve the built frontend (production) ────────────────────────────────────
// One service serves BOTH the SPA and the API on a single origin, so the
// client's relative /api/* calls work with no CORS and no second host. In dev
// this block is skipped (no dist/) and Vite serves the frontend instead.
const distDir = join(dirname(fileURLToPath(import.meta.url)), "dist");
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback: any non-API GET returns index.html so client-side routes work.
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(join(distDir, "index.html"));
  });
}

// ── Start ────────────────────────────────────────────────────────────────────
// Serve over HTTPS when cert paths are provided (production / staging), else
// HTTP (local dev — localhost is already a browser "secure context"). In most
// deployments TLS is terminated by a reverse proxy or host, so HTTPS here is
// optional and off by default to keep `npm run dev` friction-free.
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const useHttps =
  SSL_KEY_PATH &&
  SSL_CERT_PATH &&
  existsSync(SSL_KEY_PATH) &&
  existsSync(SSL_CERT_PATH);

const onListen = () => {
  const proto = useHttps ? "https" : "http";
  console.log("");
  console.log("  ╔══════════════════════════════════════╗");
  console.log("  ║          EMDAD AI Proxy               ║");
  console.log("  ╚══════════════════════════════════════╝");
  console.log(`  → ${proto}://localhost:${PORT}`);
  console.log(
    "  " +
      (process.env.ANTHROPIC_API_KEY
        ? "✓ API key loaded from .env"
        : "✗ No API key — add ANTHROPIC_API_KEY to .env"),
  );
  console.log(
    "  " +
      (useHttps
        ? "✓ HTTPS enabled"
        : "• HTTP (set SSL_KEY_PATH & SSL_CERT_PATH for HTTPS)"),
  );
  console.log(`  ✓ Login rate limit: ${LOGIN_MAX_ATTEMPTS} attempts / ${LOGIN_WINDOW_MS / 60000} min`);
  console.log(
    "  " +
      (ADMIN_PASS_HASH
        ? "✓ Admin password: hashed (scrypt)"
        : ADMIN_PASS
          ? "• Admin password: plaintext (run `npm run hash-password`)"
          : "✗ Admin password: not configured"),
  );
  console.log("  ✓ Audit log: logs/admin-audit.log");
  console.log("");
};

if (useHttps) {
  https
    .createServer(
      { key: readFileSync(SSL_KEY_PATH), cert: readFileSync(SSL_CERT_PATH) },
      app,
    )
    .listen(PORT, "0.0.0.0", onListen);
} else {
  app.listen(PORT, "0.0.0.0", onListen);
}
