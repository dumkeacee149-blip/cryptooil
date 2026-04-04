// API Base URLs
export const EIA_BASE_URL = 'https://api.eia.gov/v2';
export const GDELT_BASE_URL = 'https://api.gdeltproject.org/api/v2';
export const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

// EIA Series IDs
export const EIA_SERIES = {
  WTI_SPOT: 'RWTC',
  BRENT_SPOT: 'RBRTE',
  CRUDE_STOCKS: 'WCESTUS1',
  SPR_STOCKS: 'WCSSTUS1',
} as const;

// Refresh intervals (ms)
export const REFRESH_INTERVALS = {
  OIL_PRICES: 5 * 60 * 1000,       // 5 minutes
  INVENTORY: 60 * 60 * 1000,        // 1 hour
  GEOPOLITICAL: 15 * 60 * 1000,     // 15 minutes
  SHIPPING: 6 * 60 * 60 * 1000,     // 6 hours
  AI_ALERTS: 30 * 60 * 1000,        // 30 minutes
} as const;

// Chokepoint coordinates [lat, lng]
export const CHOKEPOINTS = {
  HORMUZ: { name: 'Strait of Hormuz', lat: 26.56, lng: 56.25, dailyBarrels: '21M' },
  SUEZ: { name: 'Suez Canal', lat: 30.45, lng: 32.35, dailyBarrels: '5.5M' },
  BAB_EL_MANDEB: { name: 'Bab el-Mandeb', lat: 12.58, lng: 43.33, dailyBarrels: '6.2M' },
  MALACCA: { name: 'Strait of Malacca', lat: 2.5, lng: 101.8, dailyBarrels: '16M' },
} as const;

// Oil shipping routes (arcs)
export const OIL_ROUTES = [
  {
    name: 'Persian Gulf → East Asia',
    start: { lat: 26.0, lng: 56.0 },
    end: { lat: 35.0, lng: 136.0 },
    volume: '15M bbl/day',
    color: '#00f0ff',
  },
  {
    name: 'Persian Gulf → Europe (Suez)',
    start: { lat: 26.0, lng: 56.0 },
    end: { lat: 51.5, lng: 3.0 },
    volume: '3.5M bbl/day',
    color: '#00d4aa',
  },
  {
    name: 'West Africa → Americas',
    start: { lat: 4.0, lng: 5.0 },
    end: { lat: 29.0, lng: -89.0 },
    volume: '2.5M bbl/day',
    color: '#ff6b00',
  },
  {
    name: 'Russia → Europe',
    start: { lat: 59.0, lng: 30.0 },
    end: { lat: 53.0, lng: 8.0 },
    volume: '4M bbl/day',
    color: '#ff0040',
  },
  {
    name: 'Latin America → North America',
    start: { lat: 10.0, lng: -67.0 },
    end: { lat: 29.0, lng: -95.0 },
    volume: '3M bbl/day',
    color: '#00ff88',
  },
] as const;

// Conflict zones (approximate center coordinates)
export const CONFLICT_ZONES = [
  { name: 'Iran', lat: 32.0, lng: 53.0, radius: 5, severity: 'high' as const },
  { name: 'Yemen', lat: 15.5, lng: 48.5, radius: 3, severity: 'high' as const },
  { name: 'Libya', lat: 26.3, lng: 17.2, radius: 4, severity: 'medium' as const },
  { name: 'Iraq', lat: 33.0, lng: 44.0, radius: 3, severity: 'medium' as const },
  { name: 'Russia-Ukraine', lat: 49.0, lng: 35.0, radius: 4, severity: 'high' as const },
  { name: 'Sudan', lat: 15.0, lng: 30.0, radius: 3, severity: 'medium' as const },
] as const;

// Design system colors
export const COLORS = {
  primary: '#00f0ff',
  secondary: '#ff6b00',
  danger: '#ff0040',
  success: '#00ff88',
  warning: '#ffaa00',
  bg: '#030b1a',
  panel: 'rgba(0, 20, 40, 0.85)',
  panelBorder: 'rgba(0, 240, 255, 0.3)',
  text: '#c0e8ff',
  textDim: '#4a7a8a',
} as const;
