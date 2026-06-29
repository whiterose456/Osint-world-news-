# 🌍 OSINT World News

A modern OSINT dashboard that combines React, Vite, Express, and Leaflet to visualize live world news across a cyber-inspired interactive map.

![React](https://img.shields.io/badge/React-19.2.7-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38bdf8?style=flat-square&logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-4.18.4-000000?style=flat-square&logo=express)

---

## 📡 Overview

OSINT World News is a full-stack news intelligence dashboard. It fetches BBC World RSS headlines on the server, enriches each item with classification and geo-mapping logic, and renders stories on a responsive dark-themed global map.

The application includes:
- a React + Vite frontend
- an Express backend API proxy
- real-time news classification by type and severity
- interactive markers and map fly-to behavior

---

## ✨ Project Features

- 🗺️ **Interactive world map** with Leaflet and dark basemap tiles
- 📰 **Live news feed** served from `server/index.ts` using `rss-parser`
- 🔎 **Search and filter** by keyword, type, severity, and source
- 🔄 **Refresh on demand** with a refresh button
- 🚨 **Severity classification** into `critical`, `high`, or `medium`
- 🧭 **Type classification** into `cyber`, `protest`, or `conflict`
- 📍 **Hotspot mapping** to major world cities based on keyword detection
- ✈️ **Fly-to-on-click** behavior for selected news items
- 🖤 **Cyber UI** with a glass-panel aesthetic and neon highlights

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS |
| Maps | React Leaflet + Leaflet |
| Icons | Lucide React |
| Backend | Express + rss-parser |
| Dev tooling | Vite, tsx, concurrently |

---

## 🚀 Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both frontend and backend:
   ```bash
   npm run dev
   ```

3. Open the frontend at:
   ```text
   http://localhost:5173
   ```

The Vite client proxies `/api` requests to the Express server running on port `4000`.

---

## 🧪 Available Scripts

- `npm run dev` — run Vite frontend and Express backend together
- `npm run dev:client` — start the Vite development server only
- `npm run dev:server` — start the Express API server only
- `npm run build` — build the React app for production
- `npm run preview` — preview the production build

---

## 📁 Project Structure

```
Osint-world-news-/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── tailwind.config.js
├── server/
│   └── index.ts       # Express backend API for RSS parsing and classification
└── src/
    ├── App.tsx        # React UI, filters, map, and data handling
    ├── main.tsx       # React entrypoint
    └── index.css      # Tailwind + global styling
```

---

## 🔧 Backend Behavior

The server fetches the BBC World RSS feed and converts each news item into a structured JSON object with:
- `title`
- `summary`
- `link`
- `source`
- `pubDate`
- `type` (`cyber`, `protest`, or `conflict`)
- `severity` (`critical`, `high`, or `medium`)
- `location` (mapped from hotspot keywords)

This makes the app easier to extend with additional RSS sources or geolocation rules.

---

## 📌 Notes

- The current source is BBC World News RSS.
- Hotspot locations are inferred from keywords and may not exactly match the article location.
- The project supports environment variable `PORT` for the backend server.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

> Built for OSINT-style world news visualization
