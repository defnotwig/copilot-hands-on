import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="app-header">
            <h1>The Daily Harvest</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/login" className="admin-login-link">
                    Admin Login
                </Link>
            </nav>
        </header>
    );
};

export default Header;
