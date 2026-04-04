'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { REFRESH_INTERVALS } from '@/lib/constants';
import type { OilPriceData } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PricePanel() {
  const [activeTab, setActiveTab] = useState<'WTI' | 'BRENT'>('WTI');
  const { data, error } = useSWR<{ success: boolean; data: OilPriceData }>(
    '/api/oil-prices',
    fetcher,
    { refreshInterval: REFRESH_INTERVALS.OIL_PRICES }
  );

  const priceData = data?.data;
  const latest =
    activeTab === 'WTI' ? priceData?.latestWti : priceData?.latestBrent;
  const series =
    activeTab === 'WTI' ? priceData?.wti : priceData?.brent;

  const isUp = (latest?.changePercent ?? 0) >= 0;

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Tab selector */}
      <div className="flex gap-1">
        {(['WTI', 'BRENT'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
              activeTab === tab
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[rgba(0,240,255,0.05)]'
                : 'border-[var(--color-panel-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Current price */}
      {latest ? (
        <div className="text-center">
          <div className={`text-3xl font-bold text-glow ${isUp ? 'price-up' : 'price-down'}`}>
            ${latest.value.toFixed(2)}
          </div>
          <div className={`text-sm ${isUp ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
            {isUp ? '+' : ''}
            {latest.change.toFixed(2)} ({isUp ? '+' : ''}
            {latest.changePercent.toFixed(2)}%)
          </div>
          <div className="text-[10px] text-[var(--color-text-dim)] mt-1">{latest.date}</div>
        </div>
      ) : error ? (
        <div className="text-center text-[var(--color-danger)] text-xs">DATA FEED ERROR</div>
      ) : (
        <div className="text-center text-[var(--color-text-dim)] text-xs pulse-glow">
          LOADING PRICE DATA...
        </div>
      )}

      {/* Mini chart - simplified bar representation */}
      {series && series.length > 0 && (
        <div className="flex-1 flex items-end gap-[2px] min-h-[80px] mt-2">
          {series.slice(0, 30).reverse().map((point, i) => {
            const values = series.slice(0, 30).map((p) => p.value);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min || 1;
            const height = ((point.value - min) / range) * 100;
            const barIsUp = point.changePercent >= 0;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${Math.max(height, 5)}%`,
                  background: barIsUp
                    ? 'linear-gradient(to top, rgba(0,255,136,0.3), rgba(0,255,136,0.6))'
                    : 'linear-gradient(to top, rgba(255,0,64,0.3), rgba(255,0,64,0.6))',
                }}
                title={`${point.date}: $${point.value.toFixed(2)}`}
              />
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-between text-[9px] text-[var(--color-text-dim)]">
        <span>30D</span>
        <span>{activeTab} CRUDE OIL</span>
        <span>TODAY</span>
      </div>
    </div>
  );
}
