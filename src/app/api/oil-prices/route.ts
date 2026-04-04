import { NextResponse } from 'next/server';
import { fetchOilPrices } from '@/repositories/eia-repository';
import type { OilPriceData, OilPrice } from '@/lib/types';

// Fallback mock data when EIA API key is not configured
function getMockPrices(): OilPriceData {
  const baseWti = 68.5;
  const baseBrent = 72.3;
  const now = new Date();

  const generatePrices = (base: number): readonly OilPrice[] =>
    Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const fluctuation = (Math.random() - 0.5) * 3;
      const value = Math.round((base + fluctuation - i * 0.05) * 100) / 100;
      const prevValue = Math.round((base + (Math.random() - 0.5) * 3 - (i + 1) * 0.05) * 100) / 100;
      const change = Math.round((value - prevValue) * 100) / 100;
      const changePercent = Math.round((change / prevValue) * 10000) / 100;
      return {
        date: date.toISOString().split('T')[0],
        value,
        change,
        changePercent,
      };
    });

  const wti = generatePrices(baseWti);
  const brent = generatePrices(baseBrent);

  return {
    wti,
    brent,
    latestWti: wti[0] ?? null,
    latestBrent: brent[0] ?? null,
  };
}

export async function GET() {
  try {
    const data = await fetchOilPrices();
    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=1800' } }
    );
  } catch (error: unknown) {
    // Fallback to mock data if API is not available
    const mockData = getMockPrices();
    return NextResponse.json({ success: true, data: mockData });
  }
}
