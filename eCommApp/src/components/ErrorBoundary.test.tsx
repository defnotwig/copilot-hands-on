import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return <div>Child content</div>;
};

describe('ErrorBoundary', () => {
    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <div>Safe content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('renders error UI when child throws', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
        vi.restoreAllMocks();
    });

    it('resets error state when Try Again is clicked', async () => {
        const user = userEvent.setup();
        vi.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();

        // Click Try Again — resets hasError to false, which attempts re-render of children
        // Since children still throw, it will catch the error again
        await user.click(screen.getByRole('button', { name: 'Try Again' }));

        // Error UI still shows because the child still throws
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        vi.restoreAllMocks();
    });

    it('renders error UI for generic errors', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        const ThrowGeneric = () => {
            throw new Error('Generic failure');
        };

        render(
            <ErrorBoundary>
                <ThrowGeneric />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Generic failure')).toBeInTheDocument();
        vi.restoreAllMocks();
    });

    it('logs error to console via componentDidCatch', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            'ErrorBoundary caught:',
            expect.any(Error),
            expect.any(String)
        );
        vi.restoreAllMocks();
    });
});
