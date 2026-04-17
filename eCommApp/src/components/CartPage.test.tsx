import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('throws error when rendered without CartProvider', () => {
        // Suppress console.error for this test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
            render(<CartPage />);
        }).toThrow('CartContext must be used within a CartProvider');
        spy.mockRestore();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('shows empty cart message when no items', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('renders Header and Footer', () => {
        renderWithCartContext();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('shows Checkout button when cart has items', () => {
        renderWithCartContext();
        expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    it('does not show Checkout button when cart is empty', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });
        expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
    });

    it('shows checkout modal when Checkout is clicked', async () => {
        renderWithCartContext();
        await userEvent.click(screen.getByText('Checkout'));
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
    });

    it('cancels checkout and hides modal', async () => {
        renderWithCartContext();
        await userEvent.click(screen.getByText('Checkout'));
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('cancel-checkout'));
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('confirms checkout: clears cart and shows order processed', async () => {
        renderWithCartContext();
        await userEvent.click(screen.getByText('Checkout'));
        await userEvent.click(screen.getByTestId('confirm-checkout'));
        expect(mockCartContext.clearCart).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
    });

    it('shows processed items after checkout', async () => {
        renderWithCartContext();
        await userEvent.click(screen.getByText('Checkout'));
        await userEvent.click(screen.getByTestId('confirm-checkout'));
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('renders product images in cart', () => {
        renderWithCartContext();
        const images = screen.getAllByRole('img');
        expect(images.length).toBe(2);
        expect(images[0]).toHaveAttribute('alt', 'Test Product 1');
        expect(images[1]).toHaveAttribute('alt', 'Test Product 2');
    });

    it('has cart-container class', () => {
        const { container } = renderWithCartContext();
        expect(container.querySelector('.cart-container')).toBeInTheDocument();
    });

    it('has checkout-btn class on checkout button', () => {
        renderWithCartContext();
        expect(screen.getByText('Checkout')).toHaveClass('checkout-btn');
    });
});
