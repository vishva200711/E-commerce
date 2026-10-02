import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductDetail = ({ products, onAddToCart, wishlist = [], onToggleWishlist }) => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        if (product) {
            setMainImage(product.image);
            setSelectedSize(null);
            setSelectedColor(null);
            setWarning('');
            // Scroll to top when component mounts
            window.scrollTo(0, 0);
        }
    }, [product]);

    if (!product) {
        return <div className="container section">Product not found</div>;
    }

    const isWishlisted = wishlist.some(w => w.id === product.id);

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            setWarning('Please select a size first');
            return;
        }
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            setWarning('Please select a color first');
            return;
        }
        setWarning('');
        onAddToCart({ ...product, size: selectedSize, color: selectedColor });
    };

    const whatsappNumber = "8807345596";
    const whatsappMessage = `Hi, I am interested in knowing more about ${product.title} (ID: ${product.id}).`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    const emailSubject = `Inquiry about ${product.title}`;
    const mailtoUrl = `mailto:contact@ladiesworld.com?subject=${encodeURIComponent(emailSubject)}`;

    return (
        <div className="container section" style={{ paddingBottom: '5rem' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: '#666' }}>&larr; Back to Shopping</Link>

            <div className="product-detail-grid">
                {/* Image Section */}
                <div>
                    <div style={{
                        height: '500px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <img
                            src={mainImage || product.image}
                            alt={product.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {product.images && product.images.map((img, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(img)}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: mainImage === img ? '2px solid var(--color-primary)' : '2px solid transparent',
                                    opacity: mainImage === img ? 1 : 0.7
                                }}
                            >
                                <img src={img} alt={`View ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div>
                    <h1 className="product-title">{product.title}</h1>
                    <p className="product-price">
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>

                    <div style={{ marginBottom: '2rem', lineHeight: '1.6', color: '#555' }}>
                        {product.description}
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Available Sizes:</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {product.sizes && product.sizes.map(size => {
                                const isSelected = selectedSize === size;
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        className="size-badge"
                                        style={{
                                            border: isSelected ? '1px solid var(--color-dark)' : '1px solid #ddd',
                                            backgroundColor: isSelected ? 'var(--color-dark)' : 'transparent',
                                            color: isSelected ? 'white' : 'inherit',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >{size}</button>
                                );
                            })}
                        </div>
                        {selectedSize && (
                            <p style={{ marginTop: '0.75rem', color: '#555', fontSize: '0.95rem' }}>
                                Selected size: <strong>{selectedSize}</strong>
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Colors:</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {product.colors && product.colors.map(color => {
                                const isSelected = selectedColor === color;
                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className="color-badge"
                                        style={{
                                            border: isSelected ? '1px solid var(--color-primary)' : '1px solid transparent',
                                            backgroundColor: isSelected ? 'var(--color-primary)' : '#f5f5f5',
                                            color: isSelected ? 'white' : 'inherit',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >{color}</button>
                                );
                            })}
                        </div>
                        {selectedColor && (
                            <p style={{ marginTop: '0.75rem', color: '#555', fontSize: '0.95rem' }}>
                                Selected color: <strong>{selectedColor}</strong>
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Length:</h4>
                        <p>{product.length || 'Standard'}</p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {warning && (
                            <p style={{ color: '#e63946', fontSize: '0.95rem', fontWeight: '500', margin: 0 }}>{warning}</p>
                        )}
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-primary"
                            style={{
                                padding: '1rem',
                                fontSize: '1.1rem',
                                textAlign: 'center',
                                width: '100%'
                            }}
                        >
                            Add to Cart
                        </button>

                        {onToggleWishlist && (
                            <button
                                onClick={() => onToggleWishlist({ id: product.id, title: product.title, price: product.price, image: product.image, sizes: product.sizes, colors: product.colors })}
                                className="btn"
                                style={{
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    width: '100%',
                                    border: '1px solid #e63946',
                                    color: isWishlisted ? 'white' : '#e63946',
                                    backgroundColor: isWishlisted ? '#e63946' : 'transparent'
                                }}
                            >
                                {isWishlisted ? '♥ Saved to Wishlist' : '♡ Add to Wishlist'}
                            </button>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <a
                                href={mailtoUrl}
                                className="btn"
                                style={{
                                    backgroundColor: '#333',
                                    color: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    border: 'none'
                                }}
                            >
                                Contact Support
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{
                                    backgroundColor: '#25D366',
                                    color: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    border: 'none'
                                }}
                            >
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '5rem', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>You Might Also Like</h3>
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    overflowX: 'auto',
                    paddingBottom: '1rem'
                }}>
                    {products
                        .filter(p => p.id !== product.id)
                        .slice(0, 4) // Just taking the first 4 for now as "related"
                        .map(p => (
                            <div key={p.id} style={{ minWidth: '300px' }}>
                                <ProductCard {...p} onAddToCart={onAddToCart} isWishlisted={wishlist.some(w => w.id === p.id)} onToggleWishlist={onToggleWishlist} />
                            </div>
                        ))}
                </div>
            </div>

        </div >
    );
};

export default ProductDetail;
