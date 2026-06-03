# EMDAD Wooden & Smart Furniture — Website

## ⚡ Quick Start (VS Code)

### Step 1 — Install Node.js
Download **Node.js 18+** from https://nodejs.org (LTS version)

### Step 2 — Open the project in VS Code
```
File → Open Folder → select emdad-furniture-optimized
```

### Step 3 — Open a terminal in VS Code
```
Terminal → New Terminal  (or Ctrl + `)
```

### Step 4 — Install dependencies
```bash
npm install
```

### Step 5 — Run the website
```bash
npm run dev
```
Open your browser at **http://localhost:5173** — the site is running! ✅

---

## 🤖 To activate the AI Room Analyzer feature

The AI Room Analyzer needs an Anthropic API key and runs a small local server alongside the site.

### Step A — Get your free API key
1. Go to **https://console.anthropic.com**
2. Create a free account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-api03-...`)

### Step B — Create your .env file
In VS Code, create a new file called `.env` in the project root folder:
```
ANTHROPIC_API_KEY=sk-ant-api03-paste-your-key-here
```
Save the file. *(It already has a `.env.example` you can rename and edit.)*

### Step C — Run TWO terminals in VS Code

**Terminal 1** — start the AI proxy server:
```bash
npm run server
```
You should see:
```
──────────────────────────────────────
  EMDAD AI Proxy → http://localhost:3001
  API Key: ✓ Loaded from .env
──────────────────────────────────────
```

**Terminal 2** — start the website:
```bash
npm run dev
```

Now go to **http://localhost:5173/analyze** and upload a room photo! 🎉

> **To open a second terminal in VS Code:** click the `+` button in the terminal panel, or press `Ctrl+Shift+5`

---

## 📁 Project Structure

```
emdad-furniture-optimized/
├── proxy-server.js          ← Local AI proxy (run with: npm run server)
├── .env                     ← Your API key (create this yourself)
├── .env.example             ← Template for the .env file
├── netlify.toml             ← Netlify deployment config
├── netlify/functions/       ← Serverless function (used in production)
│   └── analyze-room.js
├── public/images/           ← All 123 furniture photos
└── src/
    ├── pages/               ← 12 pages
    │   ├── Home.jsx
    │   ├── Collections.jsx
    │   ├── About.jsx
    │   ├── AR.jsx
    │   ├── Contact.jsx
    │   ├── QuoteEstimator.jsx
    │   ├── Wishlist.jsx
    │   ├── Timeline.jsx
    │   ├── Appointment.jsx
    │   ├── RoomAnalyzer.jsx  ← AI Room Analyzer
    │   ├── Portal.jsx        ← Client Portal
    │   └── Admin.jsx         ← Admin Panel
    ├── components/           ← 13 reusable components
    ├── context/              ← Language (Arabic/English)
    ├── data/                 ← Furniture categories & project data
    ├── hooks/                ← useWishlist, useCountUp
    ├── translations/         ← en.js + ar.js (full coverage)
    └── utils/                ← analyzeRoom.js (image → API)
```

---

## 🔗 All Pages & Routes

| Page | URL | Notes |
|------|-----|-------|
| Home | `/` | Hero, categories, style comparator |
| Collections | `/collections` | Filter + gallery + lightbox |
| About | `/about` | Real EMDAD company content |
| AR Preview | `/ar` | App download page |
| Contact | `/contact` | Form + map |
| Quote Estimator | `/quote` | 4-step project brief |
| My Wishlist | `/wishlist` | Saved pieces |
| Timeline | `/timeline` | Delivery estimator |
| Appointment | `/appointment` | Showroom booking calendar |
| **AI Room Analyzer** | `/analyze` | 📸 Upload photo → AI recommendations |
| Client Portal | `/portal` | Demo: phone 0799-000-001, PIN 1234 |
| Admin Panel | `/admin` | Demo: admin / EMDAD2025 |

---

## 🚀 Deploy to Netlify (production)

```bash
npm run build          # creates /dist folder
```
Then:
1. Go to **netlify.com** → drag your `/dist` folder onto the dashboard
2. In **Site Settings → Environment Variables** add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-your-key`

The AI Room Analyzer works automatically in production through the Netlify serverless function.

---

## 🔧 Placeholders to update before launch
- [ ] Phone: `+962-779989944` → your real number (Contact.jsx, Footer.jsx)
- [ ] Email: `Info@emdadgrp.com` (Contact.jsx, Footer.jsx)
- [ ] Google Maps embed URL in Contact.jsx
- [ ] App Store / Google Play links in AR.jsx
- [ ] Admin password in Admin.jsx: `EMDAD2025` → change it
- [ ] Demo client PIN in Portal.jsx: `1234` → real client credentials
