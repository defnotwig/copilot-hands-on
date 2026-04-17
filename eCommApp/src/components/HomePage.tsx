import { motion, useReducedMotion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
    const prefersReducedMotion = useReducedMotion();
    const animate = prefersReducedMotion ? { opacity: 1, y: 0 } : undefined;
    const initial = prefersReducedMotion ? false : { opacity: 0, y: 20 };

    return (
        <div className="app">
            <Header />
            <main className="main-content" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                <motion.h2
                    initial={initial}
                    animate={animate ?? { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    Welcome to the The Daily Harvest!
                </motion.h2>
                <motion.p
                    initial={initial}
                    animate={animate ?? { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                    Check out our products page for some great deals.
                </motion.p>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
