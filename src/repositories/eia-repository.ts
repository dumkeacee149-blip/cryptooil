import { EIA_BASE_URL, EIA_SERIES } from '@/lib/constants';
import type { OilPrice, OilPriceData, InventoryData, InventoryPoint } from '@/lib/types';

function getApiKey(): string {
  const key = process.env.EIA_API_KEY;
  if (!key) {
    throw new Error('EIA_API_KEY environment variable is not configured');
  }
  return key;
}

interface EiaDataPoint {
  readonly period: string;
  readonly value: string | number;
}

interface EiaResponse {
  readonly response: {
    readonly data: readonly EiaDataPoint[];
  };
}

async function fetchEiaSeries(
  path: string,
  seriesId: string,
  frequency: string,
  length: number
): Promise<readonly EiaDataPoint[]> {
  const key = getApiKey();
  const url = `${EIA_BASE_URL}/${path}?api_key=${key}&frequency=${frequency}&data[0]=value&facets[series][]=${seriesId}&sort[0][column]=period&sort[0][direction]=desc&length=${length}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`EIA API error: ${res.status} ${res.statusText}`);
  }

  const json: EiaResponse = await res.json();
  return json.response.data;
}

function toOilPrices(points: readonly EiaDataPoint[]): readonly OilPrice[] {
  return points.map((point, i) => {
    const value = Number(point.value);
    const prev = points[i + 1];
    const prevValue = prev ? Number(prev.value) : 0;
    const change = prev ? value - prevValue : 0;
    const changePercent = prev && prevValue !== 0 ? (change / prevValue) * 100 : 0;
    return {
      date: point.period,
      value,
      change,
      changePercent,
    };
  });
}

function toInventoryPoints(points: readonly EiaDataPoint[]): readonly InventoryPoint[] {
  return points.map((point, i) => {
    const value = Number(point.value);
    const prev = points[i + 1];
    const prevValue = prev ? Number(prev.value) : 0;
    const change = prev ? value - prevValue : 0;
    return {
      date: point.period,
      value: value / 1000, // Convert thousands of barrels to millions
      change: change / 1000,
    };
  });
}

export async function fetchOilPrices(): Promise<OilPriceData> {
  const [wtiRaw, brentRaw] = await Promise.all([
    fetchEiaSeries('petroleum/pri/spt/data', EIA_SERIES.WTI_SPOT, 'daily', 90),
    fetchEiaSeries('petroleum/pri/spt/data', EIA_SERIES.BRENT_SPOT, 'daily', 90),
  ]);

  const wti = toOilPrices(wtiRaw);
  const brent = toOilPrices(brentRaw);

  return {
    wti,
    brent,
    latestWti: wti[0] ?? null,
    latestBrent: brent[0] ?? null,
  };
}

export async function fetchInventory(): Promise<InventoryData> {
  const [crudeRaw, sprRaw] = await Promise.all([
    fetchEiaSeries('petroleum/stoc/wstk/data', EIA_SERIES.CRUDE_STOCKS, 'weekly', 52),
    fetchEiaSeries('petroleum/stoc/wstk/data', EIA_SERIES.SPR_STOCKS, 'weekly', 52),
  ]);

  const crudeStocks = toInventoryPoints(crudeRaw);
  const sprStocks = toInventoryPoints(sprRaw);

  return {
    crudeStocks,
    sprStocks,
    latestCrude: crudeStocks[0] ?? null,
    latestSpr: sprStocks[0] ?? null,
  };
}
