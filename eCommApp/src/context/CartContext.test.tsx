import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartContext, CartProvider } from './CartContext';
import { useContext } from 'react';

// Helper component to test CartContext
const TestConsumer = () => {
    const context = useContext(CartContext);
    if (!context) return <div>No context</div>;
    return (
        <div>
            <span data-testid="count">{context.cartItems.length}</span>
            <span data-testid="items">{JSON.stringify(context.cartItems)}</span>
            <button onClick={() => context.addToCart({ name: 'Apple', price: 1.99, reviews: [], inStock: true, id: '1' })}>
                Add Apple
            </button>
            <button onClick={() => context.addToCart({ name: 'Pear', price: 2.99, reviews: [], inStock: true, id: '2' })}>
                Add Pear
            </button>
            <button onClick={() => context.clearCart()}>Clear</button>
        </div>
    );
};

describe('CartContext', () => {
    it('provides default empty cart', () => {
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        expect(screen.getByTestId('count').textContent).toBe('0');
    });

    it('adds an item to the cart', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByText('Add Apple'));
        expect(screen.getByTestId('count').textContent).toBe('1');
        const items = JSON.parse(screen.getByTestId('items').textContent ?? '[]');
        expect(items[0]).toMatchObject({ name: 'Apple', quantity: 1 });
    });

    it('increments quantity when adding same item', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByText('Add Apple'));
        await user.click(screen.getByText('Add Apple'));
        expect(screen.getByTestId('count').textContent).toBe('1');
        const items = JSON.parse(screen.getByTestId('items').textContent ?? '[]');
        expect(items[0].quantity).toBe(2);
    });

    it('adds different items separately', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByText('Add Apple'));
        await user.click(screen.getByText('Add Pear'));
        expect(screen.getByTestId('count').textContent).toBe('2');
    });

    it('clears the cart', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByText('Add Apple'));
        await user.click(screen.getByText('Add Pear'));
        expect(screen.getByTestId('count').textContent).toBe('2');
        await user.click(screen.getByText('Clear'));
        expect(screen.getByTestId('count').textContent).toBe('0');
    });

    it('returns undefined when used outside provider', () => {
        render(<TestConsumer />);
        expect(screen.getByText('No context')).toBeInTheDocument();
    });

    it('increments only the matching item when multiple items exist', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestConsumer />
            </CartProvider>
        );
        await user.click(screen.getByText('Add Apple'));
        await user.click(screen.getByText('Add Pear'));
        // Now add Apple again - only Apple's quantity should increment
        await user.click(screen.getByText('Add Apple'));
        const items = JSON.parse(screen.getByTestId('items').textContent ?? '[]');
        expect(items.length).toBe(2);
        const apple = items.find((i: any) => i.name === 'Apple');
        const pear = items.find((i: any) => i.name === 'Pear');
        expect(apple.quantity).toBe(2);
        expect(pear.quantity).toBe(1);
    });
});
