import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    let onConfirm: ReturnType<typeof vi.fn>;
    let onCancel: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onConfirm = vi.fn();
        onCancel = vi.fn();
    });

    it('renders confirmation heading', () => {
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
    });

    it('renders checkout question text', () => {
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('renders Continue Checkout button', () => {
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        expect(screen.getByRole('button', { name: 'Continue Checkout' })).toBeInTheDocument();
    });

    it('renders Return to cart button', () => {
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        expect(screen.getByRole('button', { name: 'Return to cart' })).toBeInTheDocument();
    });

    it('calls onConfirm when Continue Checkout clicked', async () => {
        const user = userEvent.setup();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        await user.click(screen.getByRole('button', { name: 'Continue Checkout' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Return to cart clicked', async () => {
        const user = userEvent.setup();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        await user.click(screen.getByRole('button', { name: 'Return to cart' }));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('has aria-labelledby on dialog', () => {
        const { container } = render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        const dialog = container.querySelector('dialog');
        expect(dialog).toHaveAttribute('aria-labelledby', 'checkout-modal-heading');
    });

    it('heading has correct id', () => {
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        const heading = screen.getByRole('heading', { name: 'Are you sure?' });
        expect(heading).toHaveAttribute('id', 'checkout-modal-heading');
    });

    it('renders dialog element', () => {
        const { container } = render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        expect(container.querySelector('dialog')).toBeInTheDocument();
    });

    it('has modal-dialog class', () => {
        const { container } = render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        const dialog = container.querySelector('dialog');
        expect(dialog).toHaveClass('modal-dialog');
    });

    it('cancel button has cancel-btn class', () => {
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        expect(screen.getByRole('button', { name: 'Return to cart' })).toHaveClass('cancel-btn');
    });

    it('has checkout-modal-actions container', () => {
        const { container } = render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        expect(container.querySelector('.checkout-modal-actions')).toBeInTheDocument();
    });
});
