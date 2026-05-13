# Portfolio CMS

A dynamic developer portfolio built with React, featuring a built-in admin dashboard for managing content — all running locally with no backend server.

## Features

### Public Portfolio
- Hero section with animated background
- Skills grid with icon selection
- Project showcase with GitHub/live links
- Achievements timeline
- Contact form
- Startup vision section
- 3D-like visual effects (Framer Motion)

### Admin Panel
- Dashboard with interactive node map
- **Projects** — CRUD with image upload
- **Skills** — CRUD with icon picker & categories
- **Achievements** — CRUD with image support
- **Messages** — view & delete contact submissions
- **Pages** — edit hero, about, startup vision, social links
- **Settings** — system info panel

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS 3 + shadcn/ui (Radix primitives)
- **State:** Zustand 5 (persisted to localStorage)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM 7

No backend server or database required — all data is stored locally in your browser.

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Admin Panel

Navigate to `/admin/login` and sign in with:

| Field    | Value                                |
| -------- | ------------------------------------ |
| Email    | handibagshrikrishna@gmail.com         |
| Password | shrikrishna@admin77                   |

Once logged in, all changes are saved automatically to `localStorage`.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.jsx                   # Root with routes & auth guard
├── main.jsx                  # Entry point
├── lib/
│   ├── store.js              # Zustand store (all state + CRUD)
│   ├── supabase.js           # Supabase client (deprecated)
│   └── utils.js              # cn() utility
├── components/
│   ├── public/               # Portfolio sections
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
│   └── ui/                   # shadcn/ui primitives
└── pages/
    ├── public/
    │   ├── Home.jsx
    │   └── PublicLayout.jsx
    └── admin/
        ├── AdminLogin.jsx
        ├── AdminLayout.jsx
        ├── Dashboard.jsx
        ├── ProjectsMgmt.jsx
        ├── SkillsMgmt.jsx
        ├── AchievementsMgmt.jsx
        ├── MessagesDashboard.jsx
        ├── PagesMgmt.jsx
        └── Settings.jsx
```

## License

MIT
