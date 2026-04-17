import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="app">
                    <main className="main-content" role="alert" style={{ flexDirection: 'column', gap: '1rem' }}>
                        <h2 style={{ color: 'var(--color-error)' }}>Something went wrong</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {/* c8 ignore next -- unreachable: getDerivedStateFromError always sets error */}
                            {this.state.error?.message ?? 'An unexpected error occurred.'}
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            style={{
                                padding: '0.5rem 1.5rem',
                                background: 'var(--color-emerald)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                    </main>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
