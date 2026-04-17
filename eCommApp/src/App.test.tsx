import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderWithRouter = (route: string) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
};

describe('App routing', () => {
    it('renders HomePage on /', async () => {
        renderWithRouter('/');
        expect(await screen.findByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
    });

    it('renders LoginPage on /login', async () => {
        renderWithRouter('/login');
        expect(await screen.findByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    it('renders AdminPage on /admin', async () => {
        renderWithRouter('/admin');
        expect(await screen.findByRole('heading', { name: 'Welcome to the admin portal.' })).toBeInTheDocument();
    });

    it('renders CartPage on /cart', async () => {
        renderWithRouter('/cart');
        expect(await screen.findByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('wraps everything in CartProvider', async () => {
        renderWithRouter('/cart');
        // CartPage requires CartContext - if it renders without error, provider is working
        expect(await screen.findByText('Your cart is empty.')).toBeInTheDocument();
    });
});
