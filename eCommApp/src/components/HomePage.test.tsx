import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import HomePage from './HomePage';

describe('HomePage', () => {
    it('renders welcome heading', () => {
        render(<HomePage />);
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
    });

    it('renders product page prompt', () => {
        render(<HomePage />);
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });

    it('renders Header component', () => {
        render(<HomePage />);
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
    });

    it('renders Footer component', () => {
        render(<HomePage />);
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('has correct structure with main content', () => {
        const { container } = render(<HomePage />);
        expect(container.querySelector('.app')).toBeInTheDocument();
        expect(container.querySelector('.main-content')).toBeInTheDocument();
    });
});
