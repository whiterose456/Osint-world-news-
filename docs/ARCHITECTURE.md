# Architecture

## System overview

The application has two runtime components:

- **Express API** in `server/index.ts`: retrieves and transforms RSS items.
- **React client** in `src/App.tsx`: requests the API, manages filters and selection state, and renders the feed and map.

During development, Vite runs on port `5173` and proxies `/api` requests to Express on port `4000`.

## Request lifecycle

1. The client calls `GET /api/news` when the dashboard mounts or the user presses Refresh.
2. Express requests the BBC World RSS feed using `rss-parser`.
3. The server takes up to 50 feed entries.
4. Each entry is normalized into an object containing an ID, title, summary, article URL, source, publication date, category, severity, and coordinates.
5. The client stores the returned array in React state.
6. Search and filter state is applied with memoized filtering.
7. The filtered items are rendered in the report list and as Leaflet markers.

## Enrichment logic

### Category

The backend checks the title and summary for keyword groups:

- `cyber`: cyber, hack, data, ransomware, breach
- `protest`: protest, march, rally, demonstration, strike, riot
- `conflict`: default category when neither group matches

### Severity

- `critical`: terms such as war, attack, explosion, nuclear, hostage, or bomb
- `high`: terms such as threat, sanction, cyber, breach, military, protest, or storm
- `medium`: default when no configured term matches

These labels are simple string-matching outputs. They are not model predictions or validated severity assessments.

### Geographic hotspot matching

The backend compares the combined title and summary against a static list of hotspot keywords. The first matching hotspot supplies the coordinates.

If no keyword matches, the current implementation chooses a random hotspot. This is a known limitation: the displayed marker may not represent the event's actual location. A future implementation should return a nullable location and display unlocated reports separately.

## Client state

The main client state includes:

- `news`: all reports returned by the API
- `selected`: currently selected report
- `search`: text query
- `typeFilter`: category filter
- `severityFilter`: severity filter
- `sourceFilter`: source filter
- `loading`: request status
- `lastUpdated`: time of the last successful refresh

## External dependencies

- BBC World RSS feed for news data
- Carto dark map tiles for map rendering
- OpenStreetMap attribution displayed through Leaflet

The application depends on these services being reachable. No local copy of the external feed or map tiles is maintained.
