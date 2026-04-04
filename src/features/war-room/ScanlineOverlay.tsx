'use client';

export default function ScanlineOverlay() {
  return (
    <>
      {/* CRT scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 2px)',
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      {/* Scan sweep line */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50 h-[2px] opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
          animation: 'scan-sweep 8s linear infinite',
        }}
      />
    </>
  );
}
