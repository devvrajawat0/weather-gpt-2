import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4 h-full w-full">
          <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border-red-500/30">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6">
              An unexpected error occurred in the application. Our team has been notified.
            </p>
            
            <div className="bg-black/30 p-3 rounded-lg text-left overflow-auto max-h-32 mb-6 border border-white/5">
              <code className="text-xs text-red-400 font-mono">
                {this.state.error?.toString() || 'Unknown Error'}
              </code>
            </div>

            <button
              onClick={this.handleRetry}
              className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-medium transition-colors"
            >
              <RefreshCcw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
