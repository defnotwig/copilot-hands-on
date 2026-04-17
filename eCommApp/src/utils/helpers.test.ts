import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from '../utils/helpers';

describe('helpers', () => {
    describe('formatPrice', () => {
        it('formats a whole number price', () => {
            expect(formatPrice(10)).toBe('$10.00');
        });

        it('formats a decimal price', () => {
            expect(formatPrice(29.99)).toBe('$29.99');
        });

        it('formats zero', () => {
            expect(formatPrice(0)).toBe('$0.00');
        });

        it('formats large numbers with comma separator', () => {
            expect(formatPrice(1234.56)).toBe('$1,234.56');
        });

        it('formats negative prices', () => {
            expect(formatPrice(-5.99)).toBe('-$5.99');
        });
    });

    describe('calculateTotal', () => {
        it('calculates total for multiple items', () => {
            const items = [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 3 },
            ];
            expect(calculateTotal(items)).toBe(35);
        });

        it('returns 0 for empty array', () => {
            expect(calculateTotal([])).toBe(0);
        });

        it('calculates total for single item', () => {
            const items = [{ price: 29.99, quantity: 1 }];
            expect(calculateTotal(items)).toBeCloseTo(29.99);
        });

        it('handles quantity of zero', () => {
            const items = [{ price: 10, quantity: 0 }];
            expect(calculateTotal(items)).toBe(0);
        });
    });

    describe('validateEmail', () => {
        it('returns true for valid email', () => {
            expect(validateEmail('user@example.com')).toBe(true);
        });

        it('returns false for missing @', () => {
            expect(validateEmail('userexample.com')).toBe(false);
        });

        it('returns false for missing domain', () => {
            expect(validateEmail('user@')).toBe(false);
        });

        it('returns false for empty string', () => {
            expect(validateEmail('')).toBe(false);
        });

        it('returns false for spaces', () => {
            expect(validateEmail('user @example.com')).toBe(false);
        });

        it('returns true for email with subdomain', () => {
            expect(validateEmail('user@mail.example.com')).toBe(true);
        });
    });
});
