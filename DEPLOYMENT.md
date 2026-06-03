# Deploying EMDAD online

This app deploys as **one service**: a single Node/Express server that serves
the built React frontend **and** the API (Claude proxy, SQLite projects, admin
auth) on one URL. No CORS, no second host, one place to manage.

```
                 ┌─────────────────────────────────────────┐
   Browser  ───▶ │  Express (server.js)                     │
                 │   • / , /collections, …  → React SPA     │
                 │   • /api/chat, /api/analyze-room → Claude │
                 │   • /api/projects        → SQLite         │
                 │   • /api/admin/*         → auth           │
                 └─────────────────┬───────────────────────┘
                                   │ persistent disk (/data)
                                   ▼  db/emdad.db  +  logs/admin-audit.log
```

## ⚠️ Important: the database needs a persistent disk

The projects live in a **SQLite file**. On serverless/static hosts (Netlify,
Vercel, the Render *free* plan) the filesystem is wiped on every restart, so the
database would reset. You need a host that offers a **persistent disk/volume**:

- **Render** (Starter plan, ~$7/mo) — easiest, used in the steps below.
- **Railway** — persistent volumes, usage-based pricing.
- **Fly.io** — persistent volumes, has a small free allowance.

(If you'd rather stay on a free/serverless tier, the alternative is migrating
the projects table from SQLite to a hosted Postgres — a bigger change. Ask and
I can do that conversion.)

The frontend, Claude proxy, and admin auth all work fine without a disk — it's
only the SQLite database and audit log that need `/data` to persist.

---

## Environment variables to set (in the host dashboard — never commit these)

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `ANTHROPIC_API_KEY` | your Claude key (from `console.anthropic.com`) |
| `ADMIN_USER` | `admin` (or your choice) |
| `ADMIN_PASS_HASH` | a scrypt hash — generate it (below) |
| `ADMIN_SESSION_SECRET` | a long random string — generate it (below) |
| `DB_DIR` | `/data/db` |
| `LOG_DIR` | `/data/logs` |

**Generate the admin password hash** (locally, then paste the printed value):

```bash
npm run hash-password -- "your-admin-password"
# → ADMIN_PASS_HASH=scrypt$16384$8$1$....
```

**Generate the session secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> `PORT` is injected automatically by the host — don't set it. HTTPS is
> provided automatically by Render/Railway/Fly, so you don't need the
> `SSL_*` vars in production.

---

## Step 1 — Put the code on GitHub

The hosts below deploy from a Git repo. From the project folder:

```bash
git init
git add .
git commit -m "EMDAD furniture site — production ready"
# create an EMPTY repo at github.com/new (e.g. emdad-furniture), then:
git remote add origin https://github.com/<you>/emdad-furniture.git
git branch -M main
git push -u origin main
```

`.env` is git-ignored, so your API key and password hash stay off GitHub.
(Double-check: `git status` should NOT list `.env`.)

## Step 2 — Deploy on Render (recommended)

1. Sign in at **render.com** and connect your GitHub.
2. **New → Blueprint**, pick the repo. Render reads `render.yaml` and proposes
   the service + a 1 GB disk at `/data`.
3. When prompted, fill the secret env vars (`ANTHROPIC_API_KEY`,
   `ADMIN_PASS_HASH`, `ADMIN_SESSION_SECRET`). The rest come from the blueprint.
4. **Apply** / **Create**. Render builds the Dockerfile and deploys.
5. You get a URL like `https://emdad-furniture.onrender.com`.

> Prefer clicking manually instead of the blueprint? **New → Web Service →**
> select the repo → Runtime **Docker** → add the env vars from the table →
> add a **Disk** (mount path `/data`, 1 GB) → Create.

## Step 3 — Verify it's live

```bash
curl https://YOUR-URL/api/health         # {"status":"ok","apiKeySet":true,...}
```

- Open `https://YOUR-URL/` → the site loads.
- `https://YOUR-URL/admin` → log in with your admin user + password → add a
  project → it persists (refresh / redeploy and it's still there).
- Voice advisor ("Layla") and the Room Analyzer reply → Claude key works.

---

## Alternatives

**Railway** — New Project → Deploy from GitHub repo. It detects the Dockerfile.
Add a **Volume** mounted at `/data`. Add the env vars from the table. Deploy.

**Fly.io** — `fly launch` (detects the Dockerfile), then
`fly volumes create emdad_data --size 1`, mount it at `/data` in `fly.toml`,
`fly secrets set ANTHROPIC_API_KEY=... ADMIN_PASS_HASH=... ADMIN_SESSION_SECRET=...`,
then `fly deploy`. (Ask me and I'll generate the `fly.toml`.)

---

## Security checklist (already done in this project)

- ✅ Secrets (`ANTHROPIC_API_KEY`, etc.) only in env vars — never in the bundle or git.
- ✅ Admin password stored as a salted **scrypt hash** (`ADMIN_PASS_HASH`).
- ✅ Admin API protected by signed session tokens; mutations require auth.
- ✅ Login **rate limiting** (5 attempts / 15 min) + **audit log** at `logs/admin-audit.log`.
- ✅ `.env` is git-ignored.
- ⚠️ ROTATE: if your `.env` was ever committed before `.gitignore` existed,
  rotate the Anthropic key at `console.anthropic.com`.
