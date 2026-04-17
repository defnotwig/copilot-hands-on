import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
    it('renders copyright text', () => {
        render(<Footer />);
        expect(screen.getByText(/© 2025 The Daily Harvest\. All rights reserved\./)).toBeInTheDocument();
    });

    it('renders footer element', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('has app-footer class', () => {
        const { container } = render(<Footer />);
        expect(container.querySelector('.app-footer')).toBeInTheDocument();
    });
});
