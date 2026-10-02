import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, title, price, image, sizes = [], colors = [], onAddToCart, isWishlisted = false, onToggleWishlist }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [warning, setWarning] = useState('');

    const handleAddToCart = () => {
        if (sizes && sizes.length > 0 && !selectedSize) {
            setWarning('Please select a size first');
            return;
        }
        if (colors && colors.length > 0 && !selectedColor) {
            setWarning('Please select a color first');
            return;
        }
        setWarning('');
        onAddToCart({ id, title, price, image, size: selectedSize, color: selectedColor });
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img
                        src={image}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Link>
                {onToggleWishlist && (
                    <button
                        type="button"
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleWishlist({ id, title, price, image, sizes, colors });
                        }}
                        style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span style={{ color: isWishlisted ? '#e63946' : '#bbb' }}>{isWishlisted ? '♥' : '♡'}</span>
                    </button>
                )}
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{
                        fontSize: '1.2rem',
                        marginBottom: '0.5rem',
                        fontFamily: 'var(--font-serif)'
                    }}>{title}</h3>
                </Link>
                <p style={{
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    marginBottom: '1rem'
                }}>{`₹${price.toLocaleString('en-IN')}`}</p>

                {sizes && sizes.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginBottom: '1rem'
                    }}>
                        {sizes.map((size) => {
                            const isSelected = selectedSize === size;
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => { setSelectedSize(size); setWarning(''); }}
                                    style={{
                                        padding: '0.25rem 0.6rem',
                                        border: isSelected ? '1px solid var(--color-dark)' : '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: isSelected ? 'white' : '#555',
                                        backgroundColor: isSelected ? 'var(--color-dark)' : '#faf9f7',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >{size}</button>
                            );
                        })}
                    </div>
                )}

                {colors && colors.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginBottom: '1rem'
                    }}>
                        {colors.map((color) => {
                            const isSelected = selectedColor === color;
                            return (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => { setSelectedColor(color); setWarning(''); }}
                                    style={{
                                        padding: '0.25rem 0.6rem',
                                        border: isSelected ? '1px solid var(--color-primary)' : '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: isSelected ? 'white' : '#555',
                                        backgroundColor: isSelected ? 'var(--color-primary)' : '#f5f5f5',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >{color}</button>
                            );
                        })}
                    </div>
                )}

                {warning && (
                    <p style={{
                        color: '#e63946',
                        fontSize: '0.8rem',
                        marginBottom: '0.75rem',
                        fontWeight: '500'
                    }}>{warning}</p>
                )}

                <button
                    onClick={handleAddToCart}
                    className="btn"
                    style={{
                        marginTop: 'auto',
                        width: '100%',
                        backgroundColor: 'var(--color-dark)',
                        color: 'white'
                    }}
                >
                    Add to Order
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
