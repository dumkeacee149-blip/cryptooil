'use client';

import useSWR from 'swr';
import { REFRESH_INTERVALS } from '@/lib/constants';
import type { OilPriceData } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PriceTicker() {
  const { data } = useSWR<{ success: boolean; data: OilPriceData }>(
    '/api/oil-prices',
    fetcher,
    { refreshInterval: REFRESH_INTERVALS.OIL_PRICES }
  );

  const wti = data?.data?.latestWti;
  const brent = data?.data?.latestBrent;

  const formatPrice = (label: string, price: { value: number; changePercent: number } | null | undefined) => {
    if (!price) return `${label}: --`;
    const isUp = price.changePercent >= 0;
    const sign = isUp ? '+' : '';
    return (
      <span className="mx-6">
        <span className="text-[var(--color-text-dim)]">{label}</span>{' '}
        <span className={isUp ? 'price-up' : 'price-down'}>
          ${price.value.toFixed(2)} ({sign}{price.changePercent.toFixed(2)}%)
        </span>
      </span>
    );
  };

  const tickerContent = (
    <>
      {formatPrice('WTI', wti)}
      <span className="text-[var(--color-panel-border)]">|</span>
      {formatPrice('BRENT', brent)}
      <span className="text-[var(--color-panel-border)]">|</span>
      <span className="mx-6 text-[var(--color-text-dim)]">
        HORMUZ <span className="text-[var(--color-success)]">OPEN</span>
      </span>
      <span className="text-[var(--color-panel-border)]">|</span>
      <span className="mx-6 text-[var(--color-text-dim)]">
        SUEZ <span className="text-[var(--color-success)]">NORMAL</span>
      </span>
      <span className="text-[var(--color-panel-border)]">|</span>
      <span className="mx-6 text-[var(--color-text-dim)]">
        FEEDS <span className="text-[var(--color-primary)]">4 ACTIVE</span>
      </span>
      <span className="text-[var(--color-panel-border)]">|</span>
      <span className="mx-6 text-[var(--color-text-dim)]">
        AI ENGINE <span className="text-[var(--color-success)]">READY</span>
      </span>
    </>
  );

  return (
    <div className="border-t border-[var(--color-panel-border)] bg-[rgba(0,10,20,0.9)] py-1 text-[10px] overflow-hidden whitespace-nowrap">
      <div className="marquee inline-flex">
        {tickerContent}
        {tickerContent}
      </div>
    </div>
  );
}
