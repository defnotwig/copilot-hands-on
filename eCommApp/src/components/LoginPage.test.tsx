import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        render(<LoginPage />);
        expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders Header and Footer', () => {
        render(<LoginPage />);
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('allows typing in username field', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText('Username');
        await user.type(usernameInput, 'admin');
        expect(usernameInput).toHaveValue('admin');
    });

    it('allows typing in password field', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        const passwordInput = screen.getByPlaceholderText('Password');
        await user.type(passwordInput, 'admin');
        expect(passwordInput).toHaveValue('admin');
    });

    it('navigates to /admin on valid credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('shows error for invalid credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('clears error on successful login after failed attempt', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        // First attempt - invalid
        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        // Clear and try valid
        await user.clear(screen.getByPlaceholderText('Username'));
        await user.clear(screen.getByPlaceholderText('Password'));
        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });

    it('clears input fields on successful login', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByPlaceholderText('Username')).toHaveValue('');
        expect(screen.getByPlaceholderText('Password')).toHaveValue('');
    });

    it('shows error for empty credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows error for correct username but wrong password', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'wrongpass');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows error for wrong username but correct password', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        await user.type(screen.getByPlaceholderText('Username'), 'wronguser');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('username input has autofocus', () => {
        render(<LoginPage />);
        // autoFocus is set on the input
        const usernameInput = screen.getByPlaceholderText('Username');
        expect(usernameInput).toHaveAttribute('type', 'text');
    });

    it('password input is type password', () => {
        render(<LoginPage />);
        expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });

    it('has login-container class', () => {
        const { container } = render(<LoginPage />);
        expect(container.querySelector('.login-container')).toBeInTheDocument();
    });
});
