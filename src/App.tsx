import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Globe, RefreshCcw, Search, ExternalLink } from 'lucide-react';

const defaultIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div class="marker-dot"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const HOTSPOTS = [
  { name: 'Washington D.C.', coords: [38.9072, -77.0369], keywords: ['washington', 'dc', 'white house', 'pentagon', 'america', 'us'] },
  { name: 'London', coords: [51.5074, -0.1278], keywords: ['london', 'uk', 'britain', 'british', 'england'] },
  { name: 'Moscow', coords: [55.7558, 37.6173], keywords: ['moscow', 'russia', 'kremlin', 'putin', 'russian'] },
  { name: 'Beijing', coords: [39.9042, 116.4074], keywords: ['beijing', 'china', 'chinese', 'xi'] },
  { name: 'Tokyo', coords: [35.6762, 139.6503], keywords: ['tokyo', 'japan', 'japanese'] },
  { name: 'Berlin', coords: [52.5200, 13.4050], keywords: ['berlin', 'germany', 'german'] },
  { name: 'Paris', coords: [48.8566, 2.3522], keywords: ['paris', 'france', 'french'] },
  { name: 'New Delhi', coords: [28.6139, 77.2090], keywords: ['delhi', 'india', 'indian'] },
  { name: 'Kyiv', coords: [50.4501, 30.5234], keywords: ['kyiv', 'kiev', 'ukraine', 'ukrainian'] },
  { name: 'Tehran', coords: [35.6892, 51.3890], keywords: ['tehran', 'iran', 'persian'] },
  { name: 'Jerusalem', coords: [31.7683, 35.2137], keywords: ['jerusalem', 'israel', 'palestine', 'gaza'] },
  { name: 'Taipei', coords: [25.0330, 121.5654], keywords: ['taipei', 'taiwan'] },
  { name: 'Seoul', coords: [37.5665, 126.9780], keywords: ['seoul', 'south korea', 'north korea', 'korean'] },
  { name: 'Brussels', coords: [50.8503, 4.3517], keywords: ['brussels', 'eu', 'european union'] },
  { name: 'Cairo', coords: [30.0444, 31.2357], keywords: ['cairo', 'egypt', 'egyptian'] }
];

const severityPalette = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6'
};

const determineSeverity = (text: string) => {
  const critical = ['war', 'attack', 'kill', 'dead', 'blast', 'explosion', 'nuclear', 'crisis', 'hostage', 'bomb', 'massacre'];
  const high = ['threat', 'warning', 'sanction', 'cyber', 'hack', 'breach', 'military', 'strike', 'protest', 'riot', 'storm'];

  const normalized = text.toLowerCase();
  if (critical.some((term) => normalized.includes(term))) return 'critical';
  if (high.some((term) => normalized.includes(term))) return 'high';
  return 'medium';
};

const determineType = (text: string) => {
  const normalized = text.toLowerCase();
  if (['cyber', 'hack', 'data', 'ransomware', 'breach'].some((term) => normalized.includes(term))) return 'cyber';
  if (['protest', 'march', 'rally', 'demonstration', 'strike', 'riot'].some((term) => normalized.includes(term))) return 'protest';
  return 'conflict';
};

const parseText = (html: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html').body.textContent || '';
};

const matchHotspot = (text: string) => {
  const normalized = text.toLowerCase();
  const match = HOTSPOTS.find((hotspot) => hotspot.keywords.some((keyword) => normalized.includes(keyword)));
  return match?.coords ?? HOTSPOTS[Math.floor(Math.random() * HOTSPOTS.length)].coords;
};

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  pubDate: string;
  type: 'conflict' | 'cyber' | 'protest';
  severity: 'critical' | 'high' | 'medium';
  location: [number, number];
}

const FlyToMarker = ({ location }: { location: [number, number] | null }) => {
  const map = useMap();

  useEffect(() => {
    if (!location) return;
    map.flyTo(location, 6, { duration: 1.4 });
  }, [location, map]);

  return null;
};

const App = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'conflict' | 'cyber' | 'protest'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Feed request failed');
      const feed = await response.json();
      setNews(feed);
      setSelected(feed[0] || null);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error(error);
      setNews([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const sources = useMemo(
    () => Array.from(new Set(news.map((item) => item.source))),
    [news]
  );

  const filteredNews = useMemo(
    () =>
      news.filter((item) => {
        const query = search.trim().toLowerCase();
        const matchesQuery =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query);
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
        const matchesSource = sourceFilter === 'all' || item.source === sourceFilter;
        return matchesQuery && matchesType && matchesSeverity && matchesSource;
      }),
    [news, search, typeFilter, severityFilter, sourceFilter]
  );

  return (
    <div className="min-h-screen bg-cyber-black text-slate-100">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-cyber-dark/95 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyber-green">
            <Globe className="h-6 w-6" />
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-slate-400">OSINT World News</p>
              <p className="font-semibold text-lg text-slate-100">Global intelligence dashboard</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1">{loading ? 'SYNCING...' : `Updated ${lastUpdated}`}</span>
            <button
              onClick={fetchFeed}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-cyber-green px-3 py-1 text-cyber-black transition hover:bg-cyber-green/90 disabled:opacity-50"
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <main className="pt-24">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 lg:grid-cols-[320px_1fr]">
          <section className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Search</p>
                  <h2 className="mt-2 text-xl font-semibold">Filter intelligence</h2>
                </div>
                <Search className="h-5 w-5 text-cyber-green" />
              </div>

              <div className="mt-4 space-y-3">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search headlines, summary, source"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyber-green"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value as any)}
                    className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100"
                  >
                    <option value="all">All types</option>
                    <option value="conflict">Conflict</option>
                    <option value="cyber">Cyber</option>
                    <option value="protest">Protest</option>
                  </select>
                  <select
                    value={severityFilter}
                    onChange={(event) => setSeverityFilter(event.target.value as any)}
                    className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100"
                  >
                    <option value="all">All severity</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100"
                >
                  <option value="all">All sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/10">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">News feed</p>
                  <h2 className="mt-2 text-xl font-semibold">Active reports</h2>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  {filteredNews.length}
                </span>
              </div>

              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {loading ? (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-6 text-center text-sm text-slate-400">
                    Loading intelligence...
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-6 text-center text-sm text-slate-400">
                    No matching reports found.
                  </div>
                ) : (
                  filteredNews.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className="group cursor-pointer rounded-3xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-cyber-green/60 hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                          {item.type}
                        </span>
                        <span className="text-[11px] text-slate-500">{item.pubDate}</span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-slate-100 group-hover:text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">{item.summary}</p>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{item.source}</span>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-400">{item.severity}</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="relative min-h-[calc(100vh-7rem)] rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl shadow-cyan-950/10">
            <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} className="h-full w-full rounded-3xl">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {filteredNews.map((item) => (
                <Marker
                  key={item.id}
                  position={item.location}
                  icon={defaultIcon}
                  eventHandlers={{ click: () => setSelected(item) }}
                >
                  <Popup>
                    <div className="max-w-xs">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1 text-xs text-slate-600">{item.summary}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selected && <FlyToMarker location={selected.location} />}
            </MapContainer>

            {selected && (
              <div className="absolute bottom-6 right-6 w-96 rounded-[2rem] border border-cyber-green/20 bg-slate-950/95 p-6 shadow-2xl shadow-cyan-950/20">
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                  <span>{selected.type}</span>
                  <span>{selected.severity}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-slate-100">{selected.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{selected.summary}</p>
                <div className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Source</p>
                    <p className="mt-2 text-slate-100">{selected.source}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Published</p>
                    <p className="mt-2 text-slate-100">{selected.pubDate}</p>
                  </div>
                </div>
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-green px-4 py-3 text-sm font-semibold text-cyber-black hover:bg-cyber-green/90"
                >
                  <ExternalLink className="h-4 w-4" /> Open source
                </a>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
