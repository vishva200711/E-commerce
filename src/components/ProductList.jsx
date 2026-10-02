import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCart, wishlist = [], onToggleWishlist }) => {
    return (
        <div className="section">
            <h2 style={{
                textAlign: 'center',
                marginBottom: '3rem',
                fontSize: '2.5rem',
                color: 'var(--color-dark)'
            }}>
                Our Collection
            </h2>
            <div className="container grid grid-cols-3" style={{ gap: '3rem' }}>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        onAddToCart={onAddToCart}
                        isWishlisted={wishlist.some(w => w.id === product.id)}
                        onToggleWishlist={onToggleWishlist}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
