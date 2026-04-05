'use client';

import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between border-b border-[var(--color-panel-border)] bg-[rgba(0,10,20,0.9)] px-2 md:px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] shrink-0 gap-2 overflow-hidden">
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <span className="text-glow font-bold text-[var(--color-primary)]">
          <span className="hidden sm:inline">CRYPTOOIL INTELLIGENCE</span>
          <span className="sm:hidden">CRYPTOOIL</span>
        </span>
        <span className="text-[var(--color-text-dim)] hidden md:inline">v2.0</span>
      </div>

      {/* Center */}
      <div className="flex items-center gap-2 md:gap-6 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
          <span className="text-[var(--color-text-dim)] hidden sm:inline">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)] pulse-glow" />
          <span className="text-[var(--color-text-dim)] hidden md:inline">THREAT: </span>
          <span className="text-[var(--color-warning)]">ELEVATED</span>
        </div>
        <span className="text-[var(--color-text-dim)] hidden lg:inline">
          FEEDS: 4 ACTIVE
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <span className="text-[var(--color-text-dim)]">
          <span className="hidden md:inline">UTC </span>{time}
        </span>
        <span className="text-[var(--color-primary)]">
          [LIVE]
        </span>
      </div>
    </div>
  );
}
