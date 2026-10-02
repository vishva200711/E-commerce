import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BackButton = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Do not show on homepage
    if (location.pathname === '/') {
        return null;
    }

    return (
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-dark)',
                    padding: '0.8rem 1.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(212, 163, 115, 0.3)',
                    borderRadius: '50px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'rgba(212, 163, 115, 0.3)';
                    e.currentTarget.style.color = 'var(--color-dark)';
                }}
            >
                &larr; Back
            </button>
        </div>
    );
};

export default BackButton;
