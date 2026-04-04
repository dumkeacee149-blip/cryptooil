'use client';

interface HolographicFrameProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'danger' | 'warning';
  readonly className?: string;
}

export default function HolographicFrame({
  title,
  children,
  variant = 'default',
  className = '',
}: HolographicFrameProps) {
  const variantClass =
    variant === 'danger'
      ? 'sci-fi-panel-danger'
      : variant === 'warning'
        ? 'sci-fi-panel-warning'
        : '';

  const accentColor =
    variant === 'danger'
      ? 'var(--color-danger)'
      : variant === 'warning'
        ? 'var(--color-warning)'
        : 'var(--color-primary)';

  return (
    <div
      className={`sci-fi-panel ${variantClass} relative overflow-hidden ${className}`}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 relative z-10"
        style={{ borderBottom: `1px solid var(--color-panel-border)` }}
      >
        <div
          className="h-1.5 w-1.5 rounded-full pulse-glow"
          style={{ background: accentColor }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accentColor }}
        >
          {title}
        </span>
        <div className="ml-auto flex gap-1">
          <div className="h-1 w-1 rounded-full opacity-40" style={{ background: accentColor }} />
          <div className="h-1 w-1 rounded-full opacity-40" style={{ background: accentColor }} />
          <div className="h-1 w-1 rounded-full opacity-40" style={{ background: accentColor }} />
        </div>
      </div>
      {/* Content */}
      <div className="p-3 overflow-auto h-[calc(100%-32px)] relative z-10">{children}</div>
    </div>
  );
}
