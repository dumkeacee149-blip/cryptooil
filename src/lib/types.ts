// All types are readonly for immutability

export interface OilPrice {
  readonly date: string;
  readonly value: number;
  readonly change: number;
  readonly changePercent: number;
}

export interface OilPriceData {
  readonly wti: readonly OilPrice[];
  readonly brent: readonly OilPrice[];
  readonly latestWti: OilPrice | null;
  readonly latestBrent: OilPrice | null;
}

export interface InventoryData {
  readonly crudeStocks: readonly InventoryPoint[];
  readonly sprStocks: readonly InventoryPoint[];
  readonly latestCrude: InventoryPoint | null;
  readonly latestSpr: InventoryPoint | null;
}

export interface InventoryPoint {
  readonly date: string;
  readonly value: number;
  readonly change: number;
}

export interface GeopoliticalEvent {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly source: string;
  readonly sourceCountry: string;
  readonly date: string;
  readonly tone: number;
  readonly goldsteinScale: number;
  readonly region: string;
}

export interface ChokePointStatus {
  readonly name: string;
  readonly lat: number;
  readonly lng: number;
  readonly dailyBarrels: string;
  readonly status: 'normal' | 'warning' | 'critical';
  readonly vesselCount: number;
  readonly trend: 'up' | 'down' | 'stable';
}

export interface AiPrediction {
  readonly direction: 'bullish' | 'bearish' | 'neutral';
  readonly confidence: number;
  readonly forecast: readonly number[];
  readonly keyFactors: readonly string[];
  readonly riskEvents: readonly string[];
  readonly summary: string;
}

export interface Alert {
  readonly id: string;
  readonly type: 'PRICE_SPIKE' | 'PRICE_DROP' | 'SUPPLY_DISRUPTION' | 'GEOPOLITICAL_ESCALATION';
  readonly severity: 'INFO' | 'WARNING' | 'CRITICAL';
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly relatedAsset: string;
}

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}
