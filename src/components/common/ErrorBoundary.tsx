import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleClearStorageAndReload = () => {
    try {
      localStorage.removeItem('farm2market_shipments_v1');
      localStorage.removeItem('farm2market_shipments_v2');
      localStorage.removeItem('farm2market_b2b_orders_v1');
      localStorage.removeItem('farm2market_b2b_orders_v2');
      localStorage.removeItem('farm2market_inquiries_v1');
      localStorage.removeItem('farm2market_inquiries_v2');
    } catch {
      // Ignore storage errors
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200 shadow-sm text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h2 className="font-serif-heading text-2xl font-bold text-stone-900">
            {this.props.fallbackTitle || 'Unable to Display This Page'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto">
            An unexpected error occurred while loading this view. You can retry loading or reset the demo data.
          </p>

          {this.state.error && (
            <div className="mt-4 p-3 bg-stone-50 rounded-xl text-left border border-stone-200 overflow-x-auto max-h-32 text-[11px] font-mono text-stone-700">
              {this.state.error.message}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>

            <button
              type="button"
              onClick={this.handleClearStorageAndReload}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Reset Data &amp; Go Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
