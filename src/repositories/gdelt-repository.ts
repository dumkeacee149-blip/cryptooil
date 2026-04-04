import { GDELT_BASE_URL } from '@/lib/constants';
import type { GeopoliticalEvent } from '@/lib/types';

interface GdeltArticle {
  readonly url: string;
  readonly title: string;
  readonly seendate: string;
  readonly socialimage: string;
  readonly domain: string;
  readonly language: string;
  readonly sourcecountry: string;
  readonly tone: string;
}

interface GdeltResponse {
  readonly articles?: readonly GdeltArticle[];
}

export async function fetchGeopoliticalEvents(): Promise<readonly GeopoliticalEvent[]> {
  const query = encodeURIComponent(
    '(oil OR petroleum OR crude) AND (conflict OR sanctions OR military OR Hormuz OR pipeline OR OPEC)'
  );
  const url = `${GDELT_BASE_URL}/doc/doc?query=${query}&mode=artlist&maxrecords=30&format=json&sort=DateDesc`;

  const res = await fetch(url, { next: { revalidate: 900 } }); // 15 min cache
  if (!res.ok) {
    throw new Error(`GDELT API error: ${res.status} ${res.statusText}`);
  }

  const json: GdeltResponse = await res.json();
  const articles = json.articles ?? [];

  return articles.map((article, index) => {
    // Parse tone string: "tone,positive,negative,polarity,activity,selfgroup,wordcount"
    const toneParts = article.tone?.split(',') ?? [];
    const tone = parseFloat(toneParts[0] ?? '0');
    // Map tone to approximate Goldstein scale (-10 to +10)
    const goldsteinScale = Math.max(-10, Math.min(10, tone * 2));

    return {
      id: `gdelt-${index}-${article.seendate}`,
      title: article.title,
      url: article.url,
      source: article.domain,
      sourceCountry: article.sourcecountry ?? 'UNKNOWN',
      date: formatGdeltDate(article.seendate),
      tone,
      goldsteinScale,
      region: inferRegion(article.title, article.sourcecountry),
    };
  });
}

function formatGdeltDate(seendate: string): string {
  if (!seendate || seendate.length < 8) return 'UNKNOWN';
  // GDELT format: YYYYMMDDHHmmss
  const year = seendate.substring(0, 4);
  const month = seendate.substring(4, 6);
  const day = seendate.substring(6, 8);
  return `${year}-${month}-${day}`;
}

function inferRegion(title: string, country: string): string {
  const text = `${title} ${country}`.toLowerCase();
  if (text.includes('iran') || text.includes('iraq') || text.includes('saudi') || text.includes('hormuz')) {
    return 'Middle East';
  }
  if (text.includes('russia') || text.includes('ukraine') || text.includes('europe')) {
    return 'Europe';
  }
  if (text.includes('libya') || text.includes('nigeria') || text.includes('africa')) {
    return 'Africa';
  }
  if (text.includes('china') || text.includes('india') || text.includes('asia')) {
    return 'Asia-Pacific';
  }
  if (text.includes('venezuela') || text.includes('brazil') || text.includes('americ')) {
    return 'Americas';
  }
  return 'Global';
}
