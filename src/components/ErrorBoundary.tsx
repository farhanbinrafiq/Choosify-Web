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
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-navy uppercase tracking-tighter italic mb-4">Something went wrong</h1>
          <p className="text-gray-500 max-w-md mb-12 font-bold italic uppercase text-[11px] tracking-widest leading-relaxed">
            The discovery matrix has encountered an anomaly. Our experts have been notified.
            <br />
            <span className="text-red-400 mt-2 block">{error?.message}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-navy text-white text-[11px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 hover:bg-orange-primary hover:scale-105 transition-all italic shadow-xl"
            >
              <RefreshCcw size={16} /> Re-initialize
            </button>
            <a 
              href="/"
              className="px-10 py-4 bg-white border-2 border-navy text-navy text-[11px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 hover:bg-navy hover:text-white hover:scale-105 transition-all italic shadow-xl"
            >
              <Home size={16} /> Return Base
            </a>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
