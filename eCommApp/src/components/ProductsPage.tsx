import { useState, useEffect, useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Product, Review } from '../types';
import Header from './Header';
import Footer from './Footer';
import ReviewModal from './ReviewModal';
import { CartContext } from '../context/CartContext';

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const cartContext = useContext(CartContext);
    const prefersReducedMotion = useReducedMotion();

    if (!cartContext) {
        throw new Error('CartContext must be used within a CartProvider');
    }

    const { addToCart } = cartContext;

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productFiles = [
                    'apple.json',
                    'grapes.json',
                    'orange.json',
                    'pear.json'
                ];
                const productPromises = productFiles.map(async (file) => {
                    const response = await fetch(`products/${file}`);
                    if (!response.ok) throw new Error(`Failed to load ${file}`);
                    return await response.json();
                });
                const loadedProducts = await Promise.all(productPromises);
                setProducts(loadedProducts);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleReviewSubmit = (review: Review) => {
        if (selectedProduct) {
            const updatedProduct = {
                ...selectedProduct,
                reviews: [review, ...selectedProduct.reviews],
            };
            const updatedProducts = products.map(p =>
                p.id === updatedProduct.id ? updatedProduct : p
            );
            setProducts(updatedProducts);
            setSelectedProduct(updatedProduct);
        }
    };

    if (loading) {
        return (
            <div className="app">
                <Header />
                <main className="main-content">
                    <div className="loading">Loading products...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="products-container">
                    <motion.h2
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Our Products
                    </motion.h2>
                    <div className="products-grid">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id || product.name}
                                className="product-card"
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={prefersReducedMotion ? { duration: 0 } : {
                                    duration: 0.5,
                                    delay: Math.min(index * 0.1, 0.5),
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            >
                                {product.image && (
                                    <button
                                        type="button"
                                        className="product-image-btn"
                                        onClick={() => setSelectedProduct(product)}
                                        aria-label={`View reviews for ${product.name}`}
                                    >
                                        <img
                                            src={`products/productImages/${product.image}`}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    </button>
                                )}
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">${product.price.toFixed(2)}</p>
                                    {product.description && (
                                        <p className="product-description">{product.description}</p>
                                    )}
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className={`add-to-cart-btn ${product.inStock ? '' : 'disabled'}`}
                                        disabled={!product.inStock}
                                    >
                                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
            <ReviewModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onSubmit={handleReviewSubmit}
            />
        </div>
    );
};

export default ProductsPage;
