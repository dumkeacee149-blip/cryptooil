'use client';

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[CryptoOil] Component error:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex h-full w-full items-center justify-center p-4">
          <div className="text-center text-[var(--color-danger)] text-xs">
            <div className="text-glow-danger mb-1">MODULE ERROR</div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-[var(--color-primary)] text-[10px] border border-[var(--color-panel-border)] px-2 py-1 hover:bg-[rgba(0,240,255,0.1)] transition-colors"
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
