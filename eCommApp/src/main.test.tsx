import { describe, it, expect, vi } from 'vitest';

const mockRender = vi.fn();

vi.mock('react-dom/client', () => ({
    default: {
        createRoot: () => ({ render: mockRender }),
    },
    createRoot: () => ({ render: mockRender }),
}));

describe('main', () => {
    it('renders the app into root element', async () => {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);

        await import('./main');

        expect(mockRender).toHaveBeenCalled();

        root.remove();
    });
});
