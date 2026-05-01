import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  context?: string | null;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('NYC Renting Assistant UI crashed', {
      error,
      componentStack: info.componentStack,
      context: this.props.context,
      url: window.location.href,
    });
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (previousProps.context !== this.props.context && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="pointer-events-auto rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800 shadow-elegant">
        <p className="font-semibold">Renting Assistant hit a UI error.</p>
        <p className="mt-1 text-xs">{this.state.error.message}</p>
      </div>
    );
  }
}
