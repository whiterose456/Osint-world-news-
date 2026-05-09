# 🌍 OSINT World News

A real-time global news intelligence dashboard that scrapes and visualizes world news on an interactive map — built with a cyber/dark-ops aesthetic.

![HTML](https://img.shields.io/badge/HTML-100%25-orange?style=flat-square&logo=html5)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-38bdf8?style=flat-square&logo=tailwindcss)
![Leaflet](https://img.shields.io/badge/Leaflet.js-Map-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)

---

## 📡 Overview

OSINT World News is a single-page intelligence dashboard that pulls live world news from RSS feeds and plots them as geo-tagged markers on an interactive dark-themed world map. Each news item is automatically classified by **severity** and **type**, giving it a real OSINT (Open Source Intelligence) operator feel.

---

## ✨ Features

- 🗺️ **Interactive World Map** — powered by Leaflet.js with a dark CartoDB tile layer
- 📰 **Live News Feed** — fetches real-time headlines from BBC World News via RSS
- 🔴 **Severity Classification** — auto-tags stories as `critical`, `high`, or `medium` based on keywords
- 🏷️ **Type Detection** — categorizes news as `cyber`, `protest`, or `conflict`
- 📍 **Geo-pinned Markers** — stories are mapped to relevant global hotspots (Washington D.C., Moscow, Beijing, Kyiv, etc.)
- 🖱️ **Click to Fly** — clicking a news card flies the map to that location with a smooth animation
- 🎨 **Cyber UI** — dark terminal-style interface with custom scrollbars, glass panels, and glowing markers

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML / CSS | Structure & styling |
| Tailwind CSS | Utility-first responsive design |
| React 18 (CDN) | UI components & state management |
| Leaflet.js | Interactive map rendering |
| Lucide Icons | Icon library |
| BBC RSS + rss2json API | Live news data source |

---

## 🚀 Getting Started

No build tools or installation required — this is a pure HTML file.

1. Clone the repository:
   ```bash
   git clone https://github.com/whiterose456/Osint-world-news-.git
   ```

2. Open `index.html` directly in your browser:
   ```bash
   open index.html
   ```

That's it. The app will fetch live news on load.

---

## 📁 Project Structure

```
Osint-world-news-/
└── index.html       # Entire application — map, UI, logic, and styles
```

---

## 🔮 Planned Features

- [ ] Search/filter news by keyword
- [ ] Multiple RSS source support (Reuters, Al Jazeera, etc.)
- [ ] Real geolocation from article metadata
- [ ] Timeline/history playback of news events
- [ ] Export intel report as PDF

---

## 🧠 What is OSINT?

**OSINT** (Open Source Intelligence) is the practice of collecting and analyzing publicly available information for intelligence purposes. This tool automates the aggregation of open news sources and presents them in a geospatial context — similar to tools used by journalists, researchers, and security analysts.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

> Built by [@whiterose456](https://github.com/whiterose456)
