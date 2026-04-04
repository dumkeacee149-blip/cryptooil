'use client';

import { useState } from 'react';
import type { AiPrediction } from '@/lib/types';

export default function PredictionCard() {
  const [prediction, setPrediction] = useState<AiPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/predict', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setPrediction(json.data);
      }
    } catch {
      // silently handle - will show error state
    } finally {
      setLoading(false);
    }
  };

  const directionColor =
    prediction?.direction === 'bullish'
      ? 'var(--color-success)'
      : prediction?.direction === 'bearish'
        ? 'var(--color-danger)'
        : 'var(--color-warning)';

  const directionIcon =
    prediction?.direction === 'bullish' ? '\u25B2' : prediction?.direction === 'bearish' ? '\u25BC' : '\u25C6';

  return (
    <div className="holo-panel rounded-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-primary)]">
          AI PREDICTION
        </span>
        <button
          onClick={fetchPrediction}
          disabled={loading}
          className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[rgba(0,240,255,0.1)] transition-colors disabled:opacity-50"
        >
          {loading ? 'ANALYZING...' : 'PREDICT'}
        </button>
      </div>

      {prediction ? (
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: directionColor }}>
              {directionIcon}
            </div>
            <div
              className="text-[10px] uppercase font-bold"
              style={{ color: directionColor }}
            >
              {prediction.direction}
            </div>
          </div>
          <div className="flex-1 text-[10px] text-[var(--color-text-dim)]">
            <div>
              Confidence:{' '}
              <span className="text-[var(--color-text)]">{prediction.confidence}%</span>
            </div>
            <div className="mt-1 line-clamp-2">{prediction.summary}</div>
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-[var(--color-text-dim)] text-center py-1">
          {loading ? (
            <span className="pulse-glow">QUANTUM AI ENGINE PROCESSING...</span>
          ) : (
            'Click PREDICT to activate AI analysis'
          )}
        </div>
      )}
    </div>
  );
}
