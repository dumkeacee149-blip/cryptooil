'use client';

import useSWR from 'swr';
import { REFRESH_INTERVALS } from '@/lib/constants';
import type { InventoryData } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const SPR_CAPACITY = 714; // Million barrels capacity

export default function InventoryPanel() {
  const { data } = useSWR<{ success: boolean; data: InventoryData }>(
    '/api/inventory',
    fetcher,
    { refreshInterval: REFRESH_INTERVALS.INVENTORY }
  );

  const inv = data?.data;
  const sprValue = inv?.latestSpr?.value ?? 0;
  const sprFillPct = SPR_CAPACITY > 0 ? (sprValue / SPR_CAPACITY) * 100 : 0;
  const crudeChange = inv?.latestCrude?.change ?? 0;
  const sprChange = inv?.latestSpr?.change ?? 0;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* SPR Gauge */}
      <div>
        <div className="flex justify-between text-[9px] text-[var(--color-text-dim)] mb-1">
          <span>STRATEGIC PETROLEUM RESERVE</span>
          <span>{sprValue.toFixed(0)}M / {SPR_CAPACITY}M bbl</span>
        </div>
        <div className="h-4 w-full rounded-sm border border-[var(--color-panel-border)] bg-[rgba(0,0,0,0.3)] overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-1000"
            style={{
              width: `${sprFillPct}%`,
              background: `linear-gradient(90deg, rgba(0,240,255,0.3), ${
                sprFillPct < 40 ? 'rgba(255,0,64,0.6)' : 'rgba(0,240,255,0.6)'
              })`,
              boxShadow: '0 0 10px rgba(0,240,255,0.3)',
            }}
          />
        </div>
        <div className="flex justify-between text-[9px] mt-0.5">
          <span className="text-[var(--color-text-dim)]">FILL: {sprFillPct.toFixed(1)}%</span>
          <span className={sprChange >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>
            {sprChange >= 0 ? '+' : ''}{sprChange.toFixed(1)}M WoW
          </span>
        </div>
      </div>

      {/* Crude Stocks */}
      <div>
        <div className="flex justify-between text-[9px] text-[var(--color-text-dim)] mb-1">
          <span>COMMERCIAL CRUDE STOCKS</span>
          <span>{inv?.latestCrude?.value.toFixed(0) ?? '--'}M bbl</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`text-lg font-bold ${crudeChange >= 0 ? 'price-up' : 'price-down'}`}
          >
            {crudeChange >= 0 ? '+' : ''}{crudeChange.toFixed(1)}M
          </div>
          <span className="text-[9px] text-[var(--color-text-dim)]">WEEKLY CHANGE</span>
        </div>
      </div>

      {/* Mini trend bars */}
      {inv?.crudeStocks && inv.crudeStocks.length > 0 && (
        <div className="flex-1 flex items-end gap-[2px] min-h-[40px]">
          {inv.crudeStocks.slice(0, 12).reverse().map((point, i) => {
            const isUp = point.change >= 0;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end"
                title={`${point.date}: ${point.change >= 0 ? '+' : ''}${point.change.toFixed(1)}M`}
              >
                <div
                  className="rounded-t-sm"
                  style={{
                    height: `${Math.min(Math.abs(point.change) * 5, 40)}px`,
                    background: isUp
                      ? 'rgba(0,255,136,0.5)'
                      : 'rgba(255,0,64,0.5)',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {!data && (
        <div className="text-center text-[var(--color-text-dim)] text-[10px] pulse-glow">
          LOADING INVENTORY DATA...
        </div>
      )}
    </div>
  );
}
