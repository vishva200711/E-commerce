import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await signup(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container section" style={{ maxWidth: '440px' }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)'
            }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Create Account
                </h2>
                <p style={{ textAlign: 'center', color: '#777', marginBottom: '2rem' }}>
                    Join Ladies World to save your cart & wishlist
                </p>

                {error && (
                    <p style={{
                        color: '#e63946',
                        backgroundColor: '#fdecee',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        marginBottom: '1.5rem'
                    }}>{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Name</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </label>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </label>
                    <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                        <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            style={inputStyle}
                        />
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>At least 6 characters</span>
                    </label>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.9rem', opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting ? 'Creating account…' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#777' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none'
};

export default Signup;
