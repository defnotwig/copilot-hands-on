import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const prefersReducedMotion = useReducedMotion();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            setLoginError('');
            setUsername('');
            setPassword('');
            navigate('/admin');
        } else {
            setLoginError('Invalid credentials');
        }
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <motion.div
                    className="login-container"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            aria-label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoFocus
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            aria-label="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                        {loginError && <p style={{ color: 'var(--color-error)', marginTop: '1rem' }}>{loginError}</p>}
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
