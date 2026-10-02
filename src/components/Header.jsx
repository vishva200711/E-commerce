import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ cartCount = 0, wishlistCount = 0 }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value.trim())}`);
        }
    };

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div className="header-content" style={{ width: '100%', padding: '0 1rem', justifyContent: 'space-between' }}>
                <Link to="/" className="logo" style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-dark)', letterSpacing: '1px' }}>
                    Ladies World
                </Link>

                <form onSubmit={handleSearch} style={{
                    flex: 1,
                    maxWidth: '400px',
                    margin: '0 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Search dresses, sarees..."
                        style={{
                            width: '100%',
                            padding: '0.6rem 2.5rem 0.6rem 1rem',
                            borderRadius: '50px',
                            border: '1px solid #ddd',
                            fontSize: '0.95rem',
                            fontFamily: 'inherit',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        style={{
                            position: 'absolute',
                            right: '0.75rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            color: 'var(--color-primary)'
                        }}
                    >
                        🔍
                    </button>
                </form>

                <nav>
                    <ul className="nav-links">
                        <li><Link to="/" style={{ fontWeight: '500' }}>Home</Link></li>
                        <li><Link to="/dresses" style={{ fontWeight: '500' }}>Dresses</Link></li>
                        <li><Link to="/wishlist" style={{ fontWeight: '500', position: 'relative' }}>
                            Wishlist <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-12px',
                                background: '#e63946',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '10px'
                            }}>{wishlistCount}</span>
                        </Link></li>
                        <li><Link to="/cart" style={{ fontWeight: '500', position: 'relative' }}>
                            Cart <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-12px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '10px'
                            }}>{cartCount}</span>
                        </Link></li>
                        {user ? (
                            <>
                                <li><Link to="/orders" style={{ fontWeight: '500' }}>Orders</Link></li>
                                <li><Link to="/admin" style={{ fontWeight: '500' }}>Admin</Link></li>
                                <li style={{ fontWeight: '500', color: 'var(--color-dark)' }}>Hi, {user.name.split(' ')[0]}</li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            fontWeight: '500',
                                            color: 'var(--color-primary)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            fontSize: 'inherit',
                                            padding: 0
                                        }}
                                    >Logout</button>
                                </li>
                            </>
                        ) : (
                            <li><Link to="/login" style={{ fontWeight: '500' }}>Login</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
