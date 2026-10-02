import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/dress_red.png';

const Hero = () => {
    return (
        <section className="section hero-section" style={{
            backgroundColor: 'var(--color-secondary)',
            minHeight: '600px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container hero-content">
                <div className="hero-text" style={{ flex: 1, zIndex: 1 }}>
                    <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-dark)' }}>
                        Elegance for <br /> Every Occasion
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '500px', color: '#555' }}>
                        Discover the latest collection of premium dresses designed to make you shine.
                    </p>
                    <Link to="/dresses" className="btn btn-primary">
                        Shop Collection
                    </Link>
                </div>
                <div style={{ flex: 1, height: '500px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <div className="hero-image-container" style={{
                        width: '400px',
                        height: '550px',
                        backgroundColor: '#fcebe6',
                        borderRadius: '200px 200px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <img src={heroImage} alt="Featured Dress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
