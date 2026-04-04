'use client';

import useSWR from 'swr';
import { REFRESH_INTERVALS } from '@/lib/constants';
import type { GeopoliticalEvent } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function getSeverityColor(goldstein: number): string {
  if (goldstein <= -5) return 'var(--color-danger)';
  if (goldstein <= -2) return 'var(--color-warning)';
  if (goldstein <= 2) return 'var(--color-text-dim)';
  return 'var(--color-success)';
}

function getSeverityLabel(goldstein: number): string {
  if (goldstein <= -5) return 'CRITICAL';
  if (goldstein <= -2) return 'HIGH';
  if (goldstein <= 2) return 'MEDIUM';
  return 'LOW';
}

export default function RiskPanel() {
  const { data } = useSWR<{ success: boolean; data: readonly GeopoliticalEvent[] }>(
    '/api/geopolitical',
    fetcher,
    { refreshInterval: REFRESH_INTERVALS.GEOPOLITICAL }
  );

  const events = data?.data ?? [];

  // Threat level gauge
  const avgTone =
    events.length > 0
      ? events.reduce((sum, e) => sum + e.goldsteinScale, 0) / events.length
      : 0;
  const threatLevel = Math.max(0, Math.min(100, 50 - avgTone * 5));

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Threat gauge */}
      <div className="flex items-center gap-2">
        <div className="text-[9px] text-[var(--color-text-dim)]">THREAT</div>
        <div className="flex-1 h-2 rounded-full border border-[var(--color-panel-border)] bg-[rgba(0,0,0,0.3)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${threatLevel}%`,
              background: `linear-gradient(90deg, var(--color-success), var(--color-warning), var(--color-danger))`,
            }}
          />
        </div>
        <div
          className="text-[10px] font-bold"
          style={{
            color:
              threatLevel > 70
                ? 'var(--color-danger)'
                : threatLevel > 40
                  ? 'var(--color-warning)'
                  : 'var(--color-success)',
          }}
        >
          {threatLevel.toFixed(0)}
        </div>
      </div>

      {/* Event feed */}
      <div className="flex-1 overflow-auto space-y-1.5 min-h-0">
        {events.length > 0 ? (
          events.slice(0, 20).map((event) => (
            <div
              key={event.id}
              className="border-l-2 pl-2 py-1 hover:bg-[rgba(0,240,255,0.03)] transition-colors"
              style={{ borderLeftColor: getSeverityColor(event.goldsteinScale) }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[8px] font-bold uppercase px-1 py-0.5 rounded-sm"
                  style={{
                    color: getSeverityColor(event.goldsteinScale),
                    background: `${getSeverityColor(event.goldsteinScale)}15`,
                  }}
                >
                  {getSeverityLabel(event.goldsteinScale)}
                </span>
                <span className="text-[8px] text-[var(--color-text-dim)]">
                  {event.sourceCountry}
                </span>
                <span className="text-[8px] text-[var(--color-text-dim)] ml-auto">
                  {event.date}
                </span>
              </div>
              <div className="text-[10px] text-[var(--color-text)] mt-0.5 line-clamp-2 leading-tight">
                {event.title}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[var(--color-text-dim)] text-[10px] pulse-glow py-4">
            LOADING GDELT CONFLICT FEED...
          </div>
        )}
      </div>
    </div>
  );
}
