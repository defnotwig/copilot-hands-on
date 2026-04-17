import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const AdminPage = () => {
    const [salePercent, setSalePercent] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>('0');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <motion.div
                    className="admin-portal"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2>Welcome to the admin portal.</h2>
                    <div style={{ marginTop: '2rem' }}>
                        {errorMessage && (
                            <div style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>
                                <span>{errorMessage}</span>
                            </div>
                        )}
                        <label htmlFor="salePercent">Set Sale Percent (% off for all items): </label>
                        <input
                            id="salePercent"
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            style={{ marginLeft: '1rem', width: '80px' }}
                        />
                        <div style={{ marginTop: '1rem' }}>
                            <button
                                onClick={() => {
                                    const sanitizedValue = Number(inputValue);
                                    if (Number.isNaN(sanitizedValue)) {
                                        setErrorMessage(`Invalid input "${inputValue}". Please enter a valid number.`);
                                    } else {
                                        setSalePercent(sanitizedValue);
                                    }
                                }}
                                style={{ marginRight: '1rem' }}
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => { setSalePercent(0); setInputValue('0'); }}
                            >
                                End Sale
                            </button>
                        </div>
                    </div>
                    <p style={{ marginTop: '1rem', color: 'var(--color-success)' }}>
                        {salePercent > 0 ? `All products are ${salePercent}% off!` : 'No sale active.'}
                    </p>
                    <Link to="/" className="back-to-store-link">
                        Back to Storefront
                    </Link>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminPage;
