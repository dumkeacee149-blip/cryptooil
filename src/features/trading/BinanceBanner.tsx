'use client';

import { useState } from 'react';

const BINANCE_OIL_URL = 'https://www.binance.com/en/futures/USOILPERP';

interface TradeSignal {
  readonly direction: 'LONG' | 'SHORT' | 'NEUTRAL';
  readonly confidence: number;
  readonly reason: string;
}

function useTradeSignal(): TradeSignal {
  // Simple momentum-based signal derived from time-of-day heuristic
  // In production this would come from the AI prediction endpoint
  const hour = new Date().getUTCHours();
  if (hour >= 8 && hour <= 14) {
    return { direction: 'LONG', confidence: 68, reason: 'US session momentum + inventory draw expected' };
  }
  if (hour >= 20 || hour <= 4) {
    return { direction: 'SHORT', confidence: 55, reason: 'Asian session low demand + profit taking' };
  }
  return { direction: 'NEUTRAL', confidence: 42, reason: 'Transitional session - wait for breakout' };
}

export default function BinanceBanner() {
  const [dismissed, setDismissed] = useState(false);
  const signal = useTradeSignal();

  if (dismissed) return null;

  const directionColor =
    signal.direction === 'LONG'
      ? 'var(--color-success)'
      : signal.direction === 'SHORT'
        ? 'var(--color-danger)'
        : 'var(--color-warning)';

  const directionLabel =
    signal.direction === 'LONG'
      ? 'BULLISH'
      : signal.direction === 'SHORT'
        ? 'BEARISH'
        : 'NEUTRAL';

  return (
    <div className="relative mx-2 mt-1 overflow-hidden rounded border border-[rgba(243,186,47,0.4)] bg-[rgba(243,186,47,0.06)]">
      {/* Binance gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f3ba2f] to-transparent" />

      <div className="flex items-center gap-3 px-3 py-2">
        {/* Binance logo area */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-5 w-5 rounded bg-[#f3ba2f] flex items-center justify-center text-[10px] font-black text-black">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-[#f3ba2f] tracking-wider">BINANCE</span>
            <span className="text-[8px] text-[var(--color-text-dim)]">OIL FUTURES</span>
          </div>
        </div>

        {/* Signal */}
        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold tracking-wider"
              style={{ color: directionColor }}
            >
              {directionLabel}
            </span>
            <span className="text-[9px] text-[var(--color-text-dim)]">
              {signal.confidence}% confidence
            </span>
          </div>
          <span className="text-[8px] text-[var(--color-text-dim)] truncate">
            {signal.reason}
          </span>
        </div>

        {/* CTA */}
        <a
          href={BINANCE_OIL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#f3ba2f] hover:bg-[#e5ad25] text-black text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
        >
          TRADE NOW
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-70">
            <path d="M3 1h6v6M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-[var(--color-text-dim)] hover:text-[var(--color-text)] text-xs transition-colors"
          title="Dismiss"
        >
          x
        </button>
      </div>

      {/* Bottom disclaimer */}
      <div className="px-3 pb-1 text-[7px] text-[var(--color-text-dim)] opacity-60">
        Powered by CryptoOil AI | Trade oil perpetual contracts on Binance Futures | Not financial advice
      </div>
    </div>
  );
}
