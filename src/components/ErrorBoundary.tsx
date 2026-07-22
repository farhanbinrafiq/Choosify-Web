import React, { Component, ErrorInfo, ReactNode } from 'react';
import NotFoundPage from '../pages/NotFoundPage';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches render errors and shows the platform NotFound/error page
 * (same visual system as 404) instead of a generic dark placeholder.
 */
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

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <NotFoundPage
          variant="error"
          errorMessage={error?.message}
          onRetry={this.handleRetry}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
