import React from 'react';
import { RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred.'
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Studio UI ErrorBoundary caught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#242424] flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full bg-[#FAF8F5] border border-[#242424]/15 rounded-xs p-8 text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 text-[#644622] flex items-center justify-center mx-auto mb-5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880] block mb-2 font-semibold">
              2R CREATIONS • RECOVERY MODE
            </span>
            <h1 className="font-serif text-2xl font-normal text-[#111111] mb-3">
              Something interrupted this view.
            </h1>
            <p className="text-xs sm:text-sm text-[#242424]/70 font-light leading-relaxed mb-6">
              Your inquiry drafts and privacy preferences remain safely stored. Reload the page or return to the studio homepage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#111111] hover:bg-[#C5A880] text-[#FBF9F5] hover:text-[#111111] rounded-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white border border-[#242424]/20 hover:border-[#111111] text-[#111111] rounded-xs transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Studio Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
