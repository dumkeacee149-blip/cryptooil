import { NextResponse } from 'next/server';
import { fetchInventory } from '@/repositories/eia-repository';
import type { InventoryData, InventoryPoint } from '@/lib/types';

function getMockInventory(): InventoryData {
  const now = new Date();

  const generatePoints = (base: number): readonly InventoryPoint[] =>
    Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      const change = Math.round((Math.random() - 0.5) * 6 * 10) / 10;
      return {
        date: date.toISOString().split('T')[0],
        value: Math.round((base + change * i * 0.1) * 10) / 10,
        change,
      };
    });

  const crudeStocks = generatePoints(440);
  const sprStocks = generatePoints(395);

  return {
    crudeStocks,
    sprStocks,
    latestCrude: crudeStocks[0] ?? null,
    latestSpr: sprStocks[0] ?? null,
  };
}

export async function GET() {
  try {
    const data = await fetchInventory();
    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=1800' } }
    );
  } catch {
    const mockData = getMockInventory();
    return NextResponse.json({ success: true, data: mockData });
  }
}
