import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const HomePage = lazy(() => import('./components/HomePage'));
const ProductsPage = lazy(() => import('./components/ProductsPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const CartPage = lazy(() => import('./components/CartPage'));

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
};

const pageTransition = {
    type: 'tween' as const,
    ease: [0.16, 1, 0.3, 1],
    duration: 0.35,
};

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                className="page-transition"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
            >
                <Suspense fallback={<div className="app"><main className="main-content"><div className="loading">Loading...</div></main></div>}>
                    <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Routes>
                </Suspense>
            </motion.div>
        </AnimatePresence>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <CartProvider>
                <AnimatedRoutes />
            </CartProvider>
        </ErrorBoundary>
    );
}

export default App;