import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login(email, password);
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
                    Welcome Back
                </h2>
                <p style={{ textAlign: 'center', color: '#777', marginBottom: '2rem' }}>
                    Log in to your Ladies World account
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
                            style={inputStyle}
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.9rem', opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting ? 'Logging in…' : 'Log In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#777' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Sign up</Link>
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

export default Login;
