import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import Header from './Header';

describe('Header', () => {
    it('renders store name', () => {
        render(<Header />);
        expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
    });

    it('renders Home link', () => {
        render(<Header />);
        const homeLink = screen.getByRole('link', { name: 'Home' });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders Products link', () => {
        render(<Header />);
        const productsLink = screen.getByRole('link', { name: 'Products' });
        expect(productsLink).toBeInTheDocument();
        expect(productsLink).toHaveAttribute('href', '/products');
    });

    it('renders Cart link', () => {
        render(<Header />);
        const cartLink = screen.getByRole('link', { name: 'Cart' });
        expect(cartLink).toBeInTheDocument();
        expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('renders Admin Login link', () => {
        render(<Header />);
        const adminLink = screen.getByRole('link', { name: 'Admin Login' });
        expect(adminLink).toBeInTheDocument();
        expect(adminLink).toHaveAttribute('href', '/login');
    });

    it('has admin-login-link class on admin link', () => {
        render(<Header />);
        const adminLink = screen.getByRole('link', { name: 'Admin Login' });
        expect(adminLink).toHaveClass('admin-login-link');
    });

    it('renders header element', () => {
        render(<Header />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders navigation', () => {
        render(<Header />);
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
});
