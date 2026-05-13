<div align="center">
  <br>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <br><br>
  <h1>✨ Portfolio CMS</h1>
  <p>
    <strong>A dynamic developer portfolio with a built-in admin panel.</strong><br>
    <em>No database · No authentication · Deploy from your browser</em>
  </p>
  <br>
  <p>
    <code>/admin</code> &nbsp;·&nbsp; <code>node panel.mjs</code> &nbsp;·&nbsp; <code>npm run dev</code>
  </p>
  <br>
</div>

---

## ⚡ Features

<table>
<tr>
<th width="50%">🌐 Public Portfolio</th>
<th width="50%">⚙️ Admin Panel — <code>/admin</code></th>
</tr>
<tr>
<td>

| Section | What it shows |
|---------|--------------|
| **Hero** | Animated intro + parallax background |
| **Skills** | Categorized grid with icon picker |
| **Projects** | Cards with image, tech stack, live links |
| **Achievements** | Interactive milestone cards with modal |
| **Startup Vision** | Mission & vision statement |
| **Contact** | Form with email & social links |
| **Footer** | Social links, copyright, navigation |

</td>
<td>

| Tab | What you can do |
|-----|----------------|
| **Profile** | Edit name, title, bio, social links, hero image |
| **Skills** | Add / Edit / Delete with icon & category |
| **Projects** | Add / Edit / Delete with image upload & URLs |
| **Achievements** | Add / Edit / Delete with date & image |
| **Messages** | View & delete contact form submissions |
| **Settings** | Music, Background, GitHub token, Deploy |

</td>
</tr>
</table>

<div align="center">
  <br>
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" />
  <img src="https://img.shields.io/badge/LocalStorage-Persistent-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/GitHub_API-Auto--deploy-orange?style=flat-square" />
  <br><br>
</div>

---

## 🚀 Quick Start

```bash
# Install
npm install

# Start development
npm run dev
```

> Open **http://localhost:5173** for the portfolio.  
> Visit **http://localhost:5173/admin** to manage content.

---

## 🛠 Tech Stack

```
╔══════════════╤══════════════════════════════════╗
║  React 19    │  UI Framework                    ║
║  Vite 7      │  Build Tool                      ║
║  Tailwind 3  │  Styling + Animations            ║
║  Zustand 5   │  State Management (localStorage) ║
║  Framer      │  Motion & Transitions            ║
║  Lucide      │  Icon Library                    ║
║  React Router│  Client-side Routing             ║
╚══════════════╧══════════════════════════════════╝
```

> **No backend server.** Everything runs in the browser. Data is loaded from `data.json` and cached in localStorage.

---

## 🎨 Admin Panel Features

<div>
<details>
<summary><strong>🔐 Password Protection</strong> — click to expand</summary>
<br>

Every visit to `/admin` prompts for a password. Default: `admin123`  
Change it in `src/pages/admin/AdminPanel.jsx` (look for `ADMIN_PASSWORD`).

| Device | Behavior |
|--------|----------|
| **First visit** | Password prompt → unlock for session |
| **Same browser** | Stays unlocked until tab closes |
| **New device** | Password prompt again (works everywhere) |

</details>
</div>

<br>

<div>
<details>
<summary><strong>🎵 Music Player</strong> — click to expand</summary>
<br>

Set a song in **Settings** tab. A floating player appears at bottom-right with play/pause.

- Supports any audio URL (MP3, streaming, etc.)
- Loops until paused or tab closes
- Toggle on/off with the floating music button (bottom-left)

</details>
</div>

<br>

<div>
<details>
<summary><strong>🖼️ Background Image / Video</strong> — click to expand</summary>
<br>

Set a background in **Settings** tab. Choose between:

- **Image URL** — covers the admin panel background
- **Video URL** — plays muted, auto-loop (overrides image)

Toggle background on/off with the eye button (bottom-left).

</details>
</div>

<br>

<div>
<details>
<summary><strong>🚀 Deploy to Production</strong> — click to expand</summary>
<br>

1. Generate a **GitHub classic token** with `repo` scope at  
   [`https://github.com/settings/tokens`](https://github.com/settings/tokens)

2. Go to `/admin` → **Settings** tab → paste token → **Save**

3. Click **Deploy to Production**

> Commits `public/data.json` to GitHub → Vercel auto-redeploys → all users see updates within ~30 seconds.

</details>
</div>

---

## 📁 Project Layout

```
📦 Portfolio CMS
├── 📂 public/
│   └── 📄 data.json          ← Edit this → deploy live
├── 📂 src/
│   ├── 📄 App.jsx             ← Routes (/ + /admin)
│   ├── 📄 main.jsx            ← Entry point
│   ├── 📂 lib/
│   │   └── 📄 store.js        ← Zustand (all CRUD)
│   ├── 📂 components/public/  ← Portfolio sections
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Achievements.jsx
│   │   ├── StartupVision.jsx
│   │   ├── Contact.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── BackgroundScene.jsx
│   └── 📂 pages/
│       ├── 📂 public/         ← Public pages
│       │   ├── Home.jsx
│       │   └── PublicLayout.jsx
│       └── 📂 admin/
│           └── 📄 AdminPanel.jsx  ← Single-page admin panel
├── 📄 panel.mjs               ← CLI tool (optional)
├── 📄 vercel.json             ← SPA routing config
└── 📄 package.json
```

---

## ⌨️ Terminal CLI

```bash
node panel.mjs
```

An interactive menu for managing portfolio content directly from the terminal.  
Useful for bulk edits, scripting, or when you prefer a keyboard-driven workflow.

```
  ┌── Portfolio Panel ──────────────────────┐
  │  [ 0]  Edit Profile                     │
  │  [ 1]  List Skills                      │
  │  [ 2]  Add Skill                        │
  │  [ 3]  Edit Skill                       │
  │  ...                                    │
  │  [15]  Preview Summary                  │
  │  [16]  Reset to Defaults                │
  │  [17]  Exit                             │
  └─────────────────────────────────────────┘
```

---

## 🔒 Security

| Item | Where it lives |
|------|---------------|
| **Admin password** | Hardcoded in `AdminPanel.jsx` (change before deploy) |
| **GitHub token** | Your browser's `localStorage` only |
| **Portfolio content** | `public/data.json` + `localStorage` cache |
| **Contact messages** | `localStorage` (per-browser) |
| **Image uploads** | Data URLs (no external service) |

---

## 📄 License

<p align="center">
  <sub>MIT © 2026 · Built with React · Powered by ☕</sub>
</p>
