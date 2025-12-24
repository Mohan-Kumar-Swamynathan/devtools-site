import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // You can log to an error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ 
              backgroundColor: 'var(--status-error-bg)',
              color: 'var(--status-error)'
            }}
          >
            <AlertTriangle size={32} />
          </div>
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Something went wrong
          </h2>
          <p 
            className="text-sm mb-4 max-w-md"
            style={{ color: 'var(--text-secondary)' }}
          >
            {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <button
            onClick={this.handleReset}
            className="btn-primary flex items-center gap-2"
            aria-label="Reload page"
          >
            <RefreshCw size={16} />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}








