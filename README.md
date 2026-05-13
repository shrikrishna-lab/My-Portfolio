<div align="center">
  <br>
  <h1>Portfolio CMS</h1>
  <p>
    <strong>A dynamic developer portfolio with a built-in admin panel.</strong>
  </p>
  <p>
    No database · No authentication · Zero configuration
  </p>
  <br>
</div>

---

## ✨ Features

### Public Portfolio
| Section | Description |
|---|---|
| **Hero** | Animated intro with parallax background |
| **Skills** | Categorized grid with icon picker |
| **Projects** | Cards with image, tech stack, links |
| **Achievements** | Interactive milestone cards |
| **Startup Vision** | Mission & vision statement |
| **Contact** | Form with email & location info |
| **Footer** | Social links & copyright |

### Admin Panel — `/admin`
| Tab | What you can do |
|---|---|
| **Profile** | Edit name, title, bio, social links, hero image |
| **Skills** | Add / Edit / Delete skills with icon & category |
| **Projects** | Add / Edit / Delete with image upload & URLs |
| **Achievements** | Add / Edit / Delete with date & image |
| **Messages** | View & delete contact form submissions |
| **Settings** | Connect GitHub & deploy to production |

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** — visit `/admin` to manage content.

---

## 🛠 Tech Stack

```
React 19       → UI framework
Vite 7         → Build tool
Tailwind CSS 3 → Styling
Zustand 5      → State management (localStorage)
Framer Motion  → Animations
Lucide React   → Icons
React Router 7 → Routing
```

No backend server. No database. Everything runs in the browser.

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host.

---

## 🌐 Deploy to Production

Edit content in the admin panel, then push it live for all users:

1. Generate a **GitHub classic token** with `repo` scope at:
   `https://github.com/settings/tokens`

2. Go to `/admin` → **Settings** tab → paste token → **Save**

3. Click **Deploy to Production** — commits to GitHub, Vercel auto-redeploys

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Routes (public + admin)
├── main.jsx                 # Entry point
├── lib/
│   └── store.js             # Zustand store (all CRUD + localStorage)
├── components/public/       # Portfolio sections
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   ├── Achievements.jsx
│   ├── StartupVision.jsx
│   ├── Contact.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── BackgroundScene.jsx
├── pages/
│   ├── public/
│   │   ├── Home.jsx
│   │   └── PublicLayout.jsx
│   └── admin/
│       └── AdminPanel.jsx   # Single-page admin panel
├── public/
│   └── data.json            # Portfolio content (editable)
└── panel.mjs                # Optional CLI tool for terminal editing
```

---

## ⌨️ Terminal CLI (Optional)

```bash
node panel.mjs
```

Manage portfolio content directly from the terminal — useful for bulk edits or scripting.

---

## 🔒 Security Notes

- **No credentials** are stored in this repository
- Admin panel has **no authentication** — only deploy to trusted environments
- GitHub token is stored in **your browser's localStorage**, never committed
- Contact form messages are saved to **localStorage only**
- Image uploads use **data URLs** — no external storage service

---

## 📄 License

MIT
