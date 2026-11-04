# OSINT World News

A full-stack global news monitoring dashboard that combines RSS ingestion, lightweight keyword-based classification, and an interactive Leaflet map. The interface presents BBC World RSS headlines as filterable reports and plots each item against a set of predefined geographic hotspots.

<p align="center">
  <a href="https://osint-world-news.vercel.app"><strong>Live Demo</strong></a>
  ·
  <a href="https://github.com/whiterose456/Osint-world-news-"><strong>Source Code</strong></a>
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white)

---

## Overview

OSINT World News is an experimental news-awareness dashboard built around a simple pipeline:

1. The Express server retrieves the BBC World RSS feed.
2. RSS entries are normalized into a compact report format.
3. Keyword rules assign each report a broad category and severity label.
4. A hotspot-matching heuristic assigns approximate map coordinates.
5. The React client displays the reports in a searchable feed and on an interactive world map.

The project explores how public news feeds, data processing, and geospatial visualization can be combined in one interface.

## Features

- **Global map interface** — explore reports through an interactive Leaflet map with a dark Carto basemap.
- **RSS ingestion** — retrieve current entries from the BBC World RSS feed through the backend.
- **Keyword classification** — classify reports as `cyber`, `protest`, or `conflict`.
- **Severity labels** — apply heuristic `critical`, `high`, or `medium` labels based on configured keywords.
- **Search and filtering** — filter by headline, summary, source, category, and severity.
- **Report selection** — select a feed item or map marker to inspect its summary and open the original article.
- **Manual refresh** — request the latest feed data from the UI.
- **Responsive dark UI** — built with React, Tailwind CSS, and Lucide icons.

## Preview

Live application: **[osint-world-news.vercel.app](https://osint-world-news.vercel.app)**

> The map coordinates and classification labels are heuristic estimates, not verified intelligence assessments. See [Limitations](#limitations).

## Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | React 19, TypeScript | UI and application state |
| Build tooling | Vite 5 | Development server and production build |
| Styling | Tailwind CSS 3 | Layout and visual design |
| Mapping | Leaflet, React Leaflet | Interactive map and markers |
| Map tiles | Carto dark basemap | Map visualization |
| Icons | Lucide React | Interface icons |
| Backend | Node.js, Express | RSS API |
| Feed parsing | rss-parser | Parse BBC World RSS |
| Development | tsx, concurrently | Run TypeScript server and client together |

## Architecture

```text
BBC World RSS
     |
     v
Express API (GET /api/news)
     |
     +--> Parse RSS entries
     +--> Normalize title and summary
     +--> Keyword-based category/severity
     +--> Match text to predefined hotspots
     |
     v
JSON response
     |
     v
React + TypeScript client
     |
     +--> Search and filters
     +--> News report list
     +--> Leaflet markers and popups
     +--> Selected report panel
```

### Project structure

```text
Osint-world-news-/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── server/
│   └── index.ts          # Express RSS endpoint and enrichment logic
└── src/
    ├── App.tsx            # Dashboard, filters, feed, and map
    ├── main.tsx           # React entry point
    └── index.css          # Global styles and Leaflet theme
```

For a deeper explanation of the data flow and current design decisions, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Getting Started

### Prerequisites

- Node.js 20 or later recommended
- npm

### Installation

```bash
git clone https://github.com/whiterose456/Osint-world-news-.git
cd Osint-world-news-
npm install
```

### Run locally

Start the frontend and backend together:

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

The Vite development server proxies requests from `/api` to the Express server at `http://localhost:4000`.

### Run services separately

Terminal 1 — backend:

```bash
npm run dev:server
```

Terminal 2 — frontend:

```bash
npm run dev:client
```

## Available Scripts

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Run frontend and backend concurrently |
| `npm run dev:client` | Start the Vite development server |
| `npm run dev:server` | Start the Express server with tsx watch mode |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |

## API

### `GET /api/news`

Fetches and parses the configured BBC World RSS feed.

A successful response is an array of report objects:

```json
[
  {
    "id": "0-0000000000000",
    "title": "Example headline",
    "summary": "A short article summary.",
    "link": "https://www.bbc.com/news/",
    "source": "BBC News",
    "pubDate": "Example publication date",
    "type": "conflict",
    "severity": "medium",
    "location": [51.5074, -0.1278]
  }
]
```

| Field | Description |
|---|---|
| `id` | Identifier generated for the feed item |
| `title` | RSS headline |
| `summary` | Sanitized and truncated summary |
| `link` | Original article URL |
| `source` | RSS feed title |
| `pubDate` | Publication date supplied by the feed |
| `type` | Heuristic category: `cyber`, `protest`, or `conflict` |
| `severity` | Heuristic label: `critical`, `high`, or `medium` |
| `location` | Approximate latitude/longitude pair |

If the feed cannot be retrieved or parsed, the endpoint responds with HTTP 500 and an error message.

## Classification and Geolocation

The backend currently uses keyword matching rather than a machine-learning model or a dedicated geocoding service.

- **Category:** terms related to cybersecurity, demonstrations, and conflict determine the report type.
- **Severity:** configured keywords determine the severity label.
- **Location:** report text is checked against a fixed list of city/country hotspots. If no hotspot matches, the current implementation chooses a fallback hotspot at random.

These methods are intentionally lightweight and should be treated as demonstration logic. A keyword match does not establish the actual event location, the credibility of a report, or the real-world severity of an incident.

## Limitations

- The current ingestion source is the BBC World RSS feed; it is not yet a multi-source aggregator.
- Classification is rule-based and can produce false positives or miss relevant stories.
- Geographic placement is approximate. Unmatched stories are assigned a random fallback hotspot, so a marker must not be interpreted as a confirmed event location.
- Severity labels are interface aids, not validated risk scores.
- Feed availability depends on the external RSS provider and network access.
- The dashboard does not independently verify claims or provide professional threat intelligence.

## Roadmap

Potential next steps:

- [ ] Add configurable RSS sources and source attribution.
- [ ] Replace random fallback coordinates with an explicit `unknown location` state.
- [ ] Improve entity extraction and location resolution.
- [ ] Add timestamps, date-range filters, and automatic refresh.
- [ ] Add deduplication across feeds.
- [ ] Introduce source reliability metadata and links to original reporting.
- [ ] Add automated tests for parsing, classification, and API responses.
- [ ] Improve API error states and loading feedback.
- [ ] Add deployment documentation for the frontend and backend services.

## Contributing

Contributions, bug reports, and suggestions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Please do not submit credentials, private feed URLs, or sensitive information in issues. See [SECURITY.md](SECURITY.md) for responsible reporting guidance.

## License

No license file is currently included in this repository. Unless a license is added, reuse and redistribution are not granted by this README.

---

**Built as an experimental project exploring open-source information, news processing, and geospatial visualization.**
