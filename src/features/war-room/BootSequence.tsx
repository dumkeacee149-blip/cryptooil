'use client';

import { useEffect, useState } from 'react';

interface BootSequenceProps {
  readonly onComplete: () => void;
}

const BOOT_LINES = [
  'CRYPTOOIL INTELLIGENCE SYSTEM v2.0',
  'INITIALIZING QUANTUM PREDICTION ENGINE...',
  'CONNECTING EIA DATA FEEDS.............. OK',
  'CONNECTING GDELT CONFLICT MONITOR...... OK',
  'CONNECTING IMF PORTWATCH............... OK',
  'LOADING SHIPPING ROUTE DATABASE........ OK',
  'CALIBRATING AI PREDICTION MODEL........ OK',
  'SCANNING CHOKEPOINTS: HORMUZ, SUEZ, BAB EL-MANDEB, MALACCA',
  'THREAT ASSESSMENT: ELEVATED',
  '',
  'ALL SYSTEMS NOMINAL. ENTERING WAR ROOM.',
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<readonly string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_LINES.length) {
        setVisibleLines((prev) => [...prev, BOOT_LINES[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 500);
        }, 600);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)] transition-opacity duration-500 ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="grid-bg absolute inset-0" />
      <div className="relative z-10 w-full max-w-2xl p-8 font-mono text-sm">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className="animate-fade-in mb-1"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {!line ? (
              <span>&nbsp;</span>
            ) : line.includes('OK') ? (
              <span>
                <span className="text-[var(--color-text-dim)]">
                  {line.replace(' OK', '')}
                </span>
                <span className="text-[var(--color-success)] text-glow-success"> OK</span>
              </span>
            ) : line.includes('ELEVATED') ? (
              <span className="text-[var(--color-warning)] text-glow-warning">{line}</span>
            ) : line.includes('WAR ROOM') ? (
              <span className="text-[var(--color-primary)] text-glow font-bold">{line}</span>
            ) : (
              <span className="text-[var(--color-text)]">{line}</span>
            )}
          </div>
        ))}
        {!done && visibleLines.length > 0 && (
          <span className="inline-block w-2 h-4 bg-[var(--color-primary)] pulse-glow ml-1" />
        )}
      </div>
    </div>
  );
}
