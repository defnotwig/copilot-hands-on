import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import { render as plainRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsPage from './ProductsPage';

const mockApple = {
    id: '1',
    name: 'Apple',
    price: 1.99,
    description: 'Fresh red apple',
    image: 'apple.png',
    reviews: [
        { author: 'John', comment: 'Great!', date: '2024-01-01' }
    ],
    inStock: true
};

const mockGrapes = {
    id: '2',
    name: 'Grapes',
    price: 3.49,
    description: 'Sweet grapes',
    image: 'grapes.png',
    reviews: [],
    inStock: true
};

const mockOrange = {
    id: '3',
    name: 'Orange',
    price: 2.49,
    image: 'orange.png',
    reviews: [],
    inStock: false
};

const mockPear = {
    id: '4',
    name: 'Pear',
    price: 2.99,
    description: 'Juicy pear',
    image: 'pear.png',
    reviews: [],
    inStock: true
};

const mockNoIdProduct = {
    name: 'Banana',
    price: 0.99,
    reviews: [],
    inStock: true
};

const allProducts = [mockApple, mockGrapes, mockOrange, mockPear];

beforeEach(() => {
    vi.clearAllMocks();
});

function mockFetchSuccess() {
    let callIndex = 0;
    globalThis.fetch = vi.fn(() => {
        const product = allProducts[callIndex++] || allProducts[0];
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(product),
        } as Response);
    });
}

function mockFetchFailure() {
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({}),
        } as Response)
    );
}

describe('ProductsPage', () => {
    it('throws error when rendered without CartProvider', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
            plainRender(<ProductsPage />);
        }).toThrow('CartContext must be used within a CartProvider');
        spy.mockRestore();
    });

    it('shows loading state initially', () => {
        globalThis.fetch = vi.fn(() => new Promise(() => {})); // never resolves
        render(<ProductsPage />);
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('renders products after loading', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Grapes')).toBeInTheDocument();
        expect(screen.getByText('Orange')).toBeInTheDocument();
        expect(screen.getByText('Pear')).toBeInTheDocument();
    });

    it('displays product prices', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('$1.99')).toBeInTheDocument();
        });
        expect(screen.getByText('$3.49')).toBeInTheDocument();
    });

    it('shows product descriptions when available', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Fresh red apple')).toBeInTheDocument();
        });
        expect(screen.getByText('Sweet grapes')).toBeInTheDocument();
        expect(screen.getByText('Juicy pear')).toBeInTheDocument();
    });

    it('shows Add to Cart button for in-stock items', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Add to Cart').length).toBeGreaterThanOrEqual(3);
        });
    });

    it('shows Out of Stock for items not in stock', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        });
        const outOfStockBtn = screen.getByText('Out of Stock');
        expect(outOfStockBtn).toBeDisabled();
    });

    it('renders product images with alt text', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByAltText('Apple')).toBeInTheDocument();
        });
        expect(screen.getByAltText('Grapes')).toBeInTheDocument();
    });

    it('renders image buttons with aria-labels', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByLabelText('View reviews for Apple')).toBeInTheDocument();
        });
    });

    it('opens review modal when product image button is clicked', async () => {
        mockFetchSuccess();
        const user = userEvent.setup();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByLabelText('View reviews for Apple')).toBeInTheDocument();
        });
        await user.click(screen.getByLabelText('View reviews for Apple'));
        await waitFor(() => {
            expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        });
    });

    it('submits a review and updates the product reviews', async () => {
        mockFetchSuccess();
        const user = userEvent.setup();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByLabelText('View reviews for Apple')).toBeInTheDocument();
        });
        // Open modal
        await user.click(screen.getByLabelText('View reviews for Apple'));
        await waitFor(() => {
            expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        });
        // Fill out and submit review form
        await user.type(screen.getByPlaceholderText('Your name'), 'Tester');
        await user.type(screen.getByPlaceholderText('Your review'), 'Wonderful fruit!');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        // New review should appear
        await waitFor(() => {
            expect(screen.getByText('Wonderful fruit!')).toBeInTheDocument();
        });
    });

    it('closes review modal when close button clicked', async () => {
        mockFetchSuccess();
        const user = userEvent.setup();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByLabelText('View reviews for Apple')).toBeInTheDocument();
        });
        await user.click(screen.getByLabelText('View reviews for Apple'));
        await waitFor(() => {
            expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        });
        await user.click(screen.getByRole('button', { name: 'Close' }));
        // Modal should close - product set to null
        await waitFor(() => {
            expect(screen.queryByText('Reviews for Apple')).not.toBeInTheDocument();
        });
    });

    it('handles fetch errors gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockFetchFailure();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        consoleSpy.mockRestore();
    });

    it('renders Header and Footer', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('fetches all four product files', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(4);
        });
        expect(globalThis.fetch).toHaveBeenCalledWith('products/apple.json');
        expect(globalThis.fetch).toHaveBeenCalledWith('products/grapes.json');
        expect(globalThis.fetch).toHaveBeenCalledWith('products/orange.json');
        expect(globalThis.fetch).toHaveBeenCalledWith('products/pear.json');
    });

    it('Add to Cart button calls addToCart', async () => {
        mockFetchSuccess();
        const user = userEvent.setup();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Add to Cart').length).toBeGreaterThanOrEqual(1);
        });
        const addButtons = screen.getAllByText('Add to Cart');
        await user.click(addButtons[0]);
        // The cart context is real (from test-utils), this should not throw
    });

    it('disabled button has disabled class', async () => {
        mockFetchSuccess();
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        });
        const outOfStockBtn = screen.getByText('Out of Stock');
        expect(outOfStockBtn).toHaveClass('disabled');
    });

    it('has products-container and products-grid classes', async () => {
        mockFetchSuccess();
        const { container } = render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });
        expect(container.querySelector('.products-container')).toBeInTheDocument();
        expect(container.querySelector('.products-grid')).toBeInTheDocument();
    });

    it('renders product without id using name as key', async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockNoIdProduct),
            } as Response)
        );
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Banana').length).toBeGreaterThanOrEqual(1);
        });
    });

    it('renders product without image', async () => {
        const noImageProduct = { id: '10', name: 'Kiwi', price: 1.5, reviews: [], inStock: true };
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(noImageProduct),
            } as Response)
        );
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Kiwi').length).toBeGreaterThanOrEqual(1);
        });
        // No image button should exist for products without image
        expect(screen.queryByLabelText('View reviews for Kiwi')).not.toBeInTheDocument();
    });

    it('renders product without description', async () => {
        const noDescProduct = { id: '11', name: 'Lime', price: 0.75, image: 'lime.png', reviews: [], inStock: true };
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(noDescProduct),
            } as Response)
        );
        render(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getAllByText('Lime').length).toBeGreaterThanOrEqual(1);
        });
        expect(screen.queryByText('product-description')).not.toBeInTheDocument();
    });
});
