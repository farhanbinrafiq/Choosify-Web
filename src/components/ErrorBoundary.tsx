import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-[#000435] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 bg-[#EB4501]/15 border border-[#EB4501]/25 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle size={28} className="text-[#EB4501]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Something went wrong
          </h1>
          <p className="text-white/55 max-w-md mb-8 text-[14px] font-medium leading-relaxed">
            Please refresh the page or return home.
            <br />
            <span className="text-[#EB4501]/90 mt-2 block text-[13px]">{error?.message}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#EB4501] hover:brightness-110 text-white text-[14px] font-bold tracking-tight rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-white/10 border border-white/15 text-white text-[14px] font-bold tracking-tight rounded-xl flex items-center justify-center gap-2 hover:bg-white/15 transition-all"
            >
              <Home size={16} /> Home
            </a>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
