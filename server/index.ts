import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';

const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.json());

app.get('/api/news', async (req, res) => {
  try {
    const feed = await parser.parseURL('http://feeds.bbci.co.uk/news/world/rss.xml');

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

    const confidence = (text: string) => {
      const normalized = text.toLowerCase();
      if (['war', 'attack', 'kill', 'dead', 'blast', 'explosion', 'nuclear', 'crisis', 'hostage', 'bomb', 'massacre'].some((t) => normalized.includes(t))) return 'critical';
      if (['threat', 'warning', 'sanction', 'cyber', 'hack', 'breach', 'military', 'strike', 'protest', 'riot', 'storm'].some((t) => normalized.includes(t))) return 'high';
      return 'medium';
    };

    const category = (text: string) => {
      const normalized = text.toLowerCase();
      if (['cyber', 'hack', 'data', 'ransomware', 'breach'].some((t) => normalized.includes(t))) return 'cyber';
      if (['protest', 'march', 'rally', 'demonstration', 'strike', 'riot'].some((t) => normalized.includes(t))) return 'protest';
      return 'conflict';
    };

    const safeText = (text = '') =>
      text
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const chooseLocation = (text: string) => {
      const normalized = text.toLowerCase();
      const matched = HOTSPOTS.find((hotspot) => hotspot.keywords.some((keyword) => normalized.includes(keyword)));
      return matched?.coords ?? HOTSPOTS[Math.floor(Math.random() * HOTSPOTS.length)].coords;
    };

    const feedItems = feed.items.slice(0, 50).map((item, index) => {
      const title = item.title ?? 'Untitled report';
      const summary = safeText(item.contentSnippet ?? item.content ?? item.summary ?? '');
      const text = `${title} ${summary}`;

      return {
        id: `${index}-${Date.now()}`,
        title,
        summary: summary.slice(0, 160),
        link: item.link ?? '#',
        source: feed.title ?? 'RSS Source',
        pubDate: item.pubDate ?? '',
        type: category(text),
        severity: confidence(text),
        location: chooseLocation(text)
      };
    });

    res.json(feedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Cannot fetch news feed' });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`OSINT server running on http://localhost:${PORT}`);
});
