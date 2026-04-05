'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import StatusBar from './StatusBar';
import ScanlineOverlay from './ScanlineOverlay';
import BootSequence from './BootSequence';
import HolographicFrame from './HolographicFrame';
import ErrorBoundary from './ErrorBoundary';

const HolographicGlobe = dynamic(
  () => import('@/features/globe/HolographicGlobe'),
  { ssr: false, loading: () => <GlobeLoader /> }
);

const PricePanel = dynamic(() => import('@/features/price-panel/PricePanel'), {
  ssr: false,
});
const InventoryPanel = dynamic(
  () => import('@/features/inventory/InventoryPanel'),
  { ssr: false }
);
const RiskPanel = dynamic(() => import('@/features/geopolitical/RiskPanel'), {
  ssr: false,
});
const AlertPanel = dynamic(() => import('@/features/alerts/AlertPanel'), {
  ssr: false,
});
const PriceTicker = dynamic(
  () => import('@/features/price-panel/PriceTicker'),
  { ssr: false }
);
const ChatPanel = dynamic(() => import('@/features/ai-chat/ChatPanel'), {
  ssr: false,
});
const BinanceBanner = dynamic(
  () => import('@/features/trading/BinanceBanner'),
  { ssr: false }
);

function GlobeLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-[var(--color-primary)] text-glow text-sm uppercase tracking-widest pulse-glow">
        Loading Globe...
      </div>
    </div>
  );
}

export default function WarRoomLayout() {
  const [booted, setBooted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const handleBootComplete = useCallback(() => setBooted(true), []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--color-bg)] grid-bg">
      {/* Boot Sequence */}
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      {/* Scanline overlay */}
      <ScanlineOverlay />

      {/* Main layout */}
      <div
        className={`flex h-full w-full flex-col transition-opacity duration-1000 ${
          booted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top status bar */}
        <StatusBar />

        {/* Main content — scrollable on mobile/tablet, fixed grid on desktop */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden min-h-0">
          {/* Desktop: 3-column grid */}
          <div className="
            flex flex-col gap-2 p-2
            md:grid md:grid-cols-[280px_1fr] md:grid-rows-[1fr_1fr]
            lg:grid-cols-[280px_1fr_280px]
            xl:grid-cols-[320px_1fr_320px]
            min-h-0 h-auto lg:h-full
          ">
            {/* Left column: Prices + Inventory */}
            <div className="md:row-span-2 flex flex-col gap-2 min-h-0">
              <HolographicFrame title="Oil Prices" className="flex-1 min-h-[280px] lg:min-h-0">
                <PricePanel />
              </HolographicFrame>
              <HolographicFrame title="Inventory / SPR" className="flex-[0.6] min-h-[200px] lg:min-h-0">
                <InventoryPanel />
              </HolographicFrame>
            </div>

            {/* Center - Globe */}
            <div className="md:row-span-2 relative min-h-[300px] md:min-h-[400px] lg:min-h-0 overflow-hidden">
              <ErrorBoundary>
                <HolographicGlobe />
              </ErrorBoundary>
            </div>

            {/* Right column: Risk + Alerts */}
            <div className="md:col-span-2 lg:col-span-1 md:row-span-1 lg:row-span-2 flex flex-col gap-2 min-h-0">
              <div className="md:grid md:grid-cols-2 lg:flex lg:flex-col gap-2 flex-1 min-h-0">
                <HolographicFrame title="Geopolitical Risk" className="flex-1 min-h-[200px] lg:min-h-0">
                  <RiskPanel />
                </HolographicFrame>
                <HolographicFrame
                  title="Alerts"
                  variant="warning"
                  className="flex-[0.6] min-h-[180px] lg:min-h-0"
                >
                  <AlertPanel />
                </HolographicFrame>
              </div>
            </div>
          </div>
        </div>

        {/* Binance trading banner */}
        <BinanceBanner />

        {/* Bottom ticker */}
        <PriceTicker />
      </div>

      {/* AI Chat toggle */}
      <button
        onClick={() => setChatOpen((prev) => !prev)}
        className="fixed bottom-14 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-panel)] text-[var(--color-primary)] text-glow hover:bg-[rgba(0,240,255,0.1)] transition-colors"
        title="AI Analysis Chat"
      >
        AI
      </button>

      {/* Chat drawer */}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
