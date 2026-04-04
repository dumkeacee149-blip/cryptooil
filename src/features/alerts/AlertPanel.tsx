'use client';

import { useEffect, useState } from 'react';
import type { Alert } from '@/lib/types';

const MOCK_ALERTS: readonly Alert[] = [
  {
    id: '1',
    type: 'GEOPOLITICAL_ESCALATION',
    severity: 'WARNING',
    title: 'Hormuz Strait Tension Elevated',
    description: 'IRGC naval exercises detected near Strait of Hormuz. Oil tanker rerouting observed.',
    timestamp: new Date().toISOString(),
    relatedAsset: 'WTI',
  },
  {
    id: '2',
    type: 'PRICE_SPIKE',
    severity: 'INFO',
    title: 'WTI Above 30-Day MA',
    description: 'WTI crude crossed above 30-day moving average, signaling potential uptrend.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    relatedAsset: 'WTI',
  },
  {
    id: '3',
    type: 'SUPPLY_DISRUPTION',
    severity: 'CRITICAL',
    title: 'Libya Pipeline Shutdown',
    description: 'Armed groups forced shutdown of El Sharara oilfield. 300K bbl/day offline.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    relatedAsset: 'BRENT',
  },
];

const SEVERITY_COLORS = {
  INFO: 'var(--color-primary)',
  WARNING: 'var(--color-warning)',
  CRITICAL: 'var(--color-danger)',
} as const;

export default function AlertPanel() {
  const [alerts, setAlerts] = useState<readonly Alert[]>([]);

  useEffect(() => {
    // Start with mock alerts, will be replaced by AI-generated ones
    setAlerts(MOCK_ALERTS);

    // Try to fetch real alerts
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/ai/alerts', { method: 'POST' });
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setAlerts(json.data);
        }
      } catch {
        // Keep mock alerts
      }
    };

    const timer = setTimeout(fetchAlerts, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 h-full overflow-auto">
      {alerts.map((alert) => {
        const color = SEVERITY_COLORS[alert.severity];
        const timeAgo = getTimeAgo(alert.timestamp);
        return (
          <div
            key={alert.id}
            className="border-l-2 pl-2 py-1.5"
            style={{ borderLeftColor: color }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="text-[8px] font-bold uppercase px-1 py-0.5 rounded-sm"
                style={{ color, background: `${color}15` }}
              >
                {alert.severity}
              </span>
              <span className="text-[8px] text-[var(--color-text-dim)]">{timeAgo}</span>
            </div>
            <div
              className="text-[10px] font-bold mt-0.5"
              style={{ color }}
            >
              {alert.title}
            </div>
            <div className="text-[9px] text-[var(--color-text-dim)] mt-0.5 line-clamp-2 leading-tight">
              {alert.description}
            </div>
          </div>
        );
      })}
      {alerts.length === 0 && (
        <div className="text-center text-[var(--color-text-dim)] text-[10px] py-4">
          NO ACTIVE ALERTS
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'JUST NOW';
  if (mins < 60) return `${mins}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}H AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}
