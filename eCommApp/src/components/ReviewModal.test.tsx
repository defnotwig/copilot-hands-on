import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const mockProductWithReviews: Product = {
    id: '1',
    name: 'Apple',
    price: 1.99,
    reviews: [
        { author: 'John', comment: 'Great apple!', date: '2024-01-15T10:00:00Z' },
        { author: 'Jane', comment: 'Very fresh', date: '2024-02-20T12:00:00Z' },
    ],
    inStock: true,
};

const mockProductNoReviews: Product = {
    id: '2',
    name: 'Grapes',
    price: 3.49,
    reviews: [],
    inStock: true,
};

describe('ReviewModal', () => {
    let onClose: ReturnType<typeof vi.fn>;
    let onSubmit: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onClose = vi.fn();
        onSubmit = vi.fn();
    });

    it('renders nothing when product is null', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(container.querySelector('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog with product reviews', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        expect(screen.getByText('Great apple!')).toBeInTheDocument();
        expect(screen.getByText('Very fresh')).toBeInTheDocument();
    });

    it('shows review authors', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(screen.getByText(/John/)).toBeInTheDocument();
        expect(screen.getByText(/Jane/)).toBeInTheDocument();
    });

    it('displays formatted review dates', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        // Dates are rendered with toLocaleDateString(), format may vary by locale
        const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
        expect(dateElements.length).toBeGreaterThanOrEqual(1);
    });

    it('shows "No reviews yet." when product has no reviews', () => {
        render(
            <ReviewModal product={mockProductNoReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders review form', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(screen.getByText('Leave a Review')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your review')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders close button', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('calls onClose when close button clicked', async () => {
        const user = userEvent.setup();
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onSubmit with review data on form submit', async () => {
        const user = userEvent.setup();
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        await user.type(screen.getByPlaceholderText('Your name'), 'Bob');
        await user.type(screen.getByPlaceholderText('Your review'), 'Amazing fruit!');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onSubmit).toHaveBeenCalledTimes(1);
        const submittedReview = onSubmit.mock.calls[0][0];
        expect(submittedReview.author).toBe('Bob');
        expect(submittedReview.comment).toBe('Amazing fruit!');
        expect(submittedReview.date).toBeDefined();
    });

    it('resets form after submit', async () => {
        const user = userEvent.setup();
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        await user.type(screen.getByPlaceholderText('Your name'), 'Bob');
        await user.type(screen.getByPlaceholderText('Your review'), 'Amazing!');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your review')).toHaveValue('');
    });

    it('has aria-labelledby on dialog', () => {
        const { container } = render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        const dialog = container.querySelector('dialog');
        expect(dialog).toHaveAttribute('aria-labelledby', 'review-modal-heading');
    });

    it('heading has correct id', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        const heading = screen.getByText('Reviews for Apple');
        expect(heading).toHaveAttribute('id', 'review-modal-heading');
    });

    it('has modal-dialog class on dialog', () => {
        const { container } = render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        const dialog = container.querySelector('dialog');
        expect(dialog).toHaveClass('modal-dialog');
    });

    it('has close-button class', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('close-button');
    });

    it('name and comment inputs are required', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(screen.getByPlaceholderText('Your name')).toBeRequired();
        expect(screen.getByPlaceholderText('Your review')).toBeRequired();
    });

    it('closes dialog when product changes from non-null to null', () => {
        // We need to test that the useEffect's else-if branch fires.
        // When product goes from non-null to null, the effect cleanup runs first (closing dialog),
        // then the component returns null removing the DOM. The else-if branch (lines 18-19)
        // handles the case where product is null but dialog is still open.
        // Since React unmounts the dialog before the new effect, this is practically dead code,
        // but we still verify the cleanup works correctly.
        const { rerender, container } = render(
            <ReviewModal product={mockProductWithReviews} onClose={onClose} onSubmit={onSubmit} />
        );
        const dialog = container.querySelector('dialog');
        expect(dialog).toBeInTheDocument();
        
        // Rerender with null product — triggers cleanup + re-render
        rerender(
            <ReviewModal product={null} onClose={onClose} onSubmit={onSubmit} />
        );
        expect(container.querySelector('dialog')).not.toBeInTheDocument();
    });
});
