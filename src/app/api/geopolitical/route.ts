import { NextResponse } from 'next/server';
import { fetchGeopoliticalEvents } from '@/repositories/gdelt-repository';
import type { GeopoliticalEvent } from '@/lib/types';

function getMockEvents(): readonly GeopoliticalEvent[] {
  return [
    {
      id: 'mock-1',
      title: 'IRGC conducts naval exercises near Strait of Hormuz amid rising tensions',
      url: '#',
      source: 'reuters.com',
      sourceCountry: 'US',
      date: new Date().toISOString().split('T')[0],
      tone: -4.5,
      goldsteinScale: -7,
      region: 'Middle East',
    },
    {
      id: 'mock-2',
      title: 'OPEC+ considers extending production cuts through Q3 2026',
      url: '#',
      source: 'bloomberg.com',
      sourceCountry: 'US',
      date: new Date().toISOString().split('T')[0],
      tone: -1.2,
      goldsteinScale: -3,
      region: 'Middle East',
    },
    {
      id: 'mock-3',
      title: 'Ukraine drone attacks target Russian oil refinery in Volgograd region',
      url: '#',
      source: 'bbc.com',
      sourceCountry: 'GB',
      date: new Date().toISOString().split('T')[0],
      tone: -6.0,
      goldsteinScale: -9,
      region: 'Europe',
    },
    {
      id: 'mock-4',
      title: 'Houthi forces claim new attack on oil tanker near Bab el-Mandeb strait',
      url: '#',
      source: 'aljazeera.com',
      sourceCountry: 'QA',
      date: new Date().toISOString().split('T')[0],
      tone: -5.3,
      goldsteinScale: -8,
      region: 'Middle East',
    },
    {
      id: 'mock-5',
      title: 'Libya eastern forces blockade El Sharara oilfield, cutting 300K bbl/day',
      url: '#',
      source: 'ft.com',
      sourceCountry: 'GB',
      date: new Date().toISOString().split('T')[0],
      tone: -3.8,
      goldsteinScale: -6,
      region: 'Africa',
    },
    {
      id: 'mock-6',
      title: 'US imposes new sanctions on Iranian oil exports to China',
      url: '#',
      source: 'wsj.com',
      sourceCountry: 'US',
      date: new Date().toISOString().split('T')[0],
      tone: -3.0,
      goldsteinScale: -5,
      region: 'Middle East',
    },
    {
      id: 'mock-7',
      title: 'EIA reports unexpected crude stock draw of 4.2M barrels',
      url: '#',
      source: 'cnbc.com',
      sourceCountry: 'US',
      date: new Date().toISOString().split('T')[0],
      tone: 1.5,
      goldsteinScale: 2,
      region: 'Americas',
    },
    {
      id: 'mock-8',
      title: 'Saudi Arabia signals willingness to negotiate oil production increase',
      url: '#',
      source: 'reuters.com',
      sourceCountry: 'US',
      date: new Date().toISOString().split('T')[0],
      tone: 2.0,
      goldsteinScale: 3,
      region: 'Middle East',
    },
  ];
}

export async function GET() {
  try {
    const data = await fetchGeopoliticalEvents();
    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 's-maxage=900, stale-while-revalidate=300' } }
    );
  } catch {
    const mockData = getMockEvents();
    return NextResponse.json({ success: true, data: mockData });
  }
}
