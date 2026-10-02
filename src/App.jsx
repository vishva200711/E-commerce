import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BackButton from './components/BackButton';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import Orders from './components/Orders';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { api } from './api';

// Import images
import dressRed from './assets/dress_red.png';
import dressFloral from './assets/dress_floral.png';
import dressBlack from './assets/dress_black.png';
import sareeRed from './assets/saree_red.png';
import sareeBlue from './assets/saree_blue.png';
import sareeGreen from './assets/saree_green.png';

const PRODUCTS = [
  {
    id: 1,
    title: 'Elegant Red Evening Gown',
    price: 24999,
    image: dressRed,
    images: [dressRed, dressRed, dressRed],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red', 'Maroon'],
    length: 'Maxi',
    description: 'Stunning red evening gown perfect for formal events. Features a fitted bodice and flowing skirt.',
    category: 'women'
  },
  {
    id: 2,
    title: 'Floral Summer Breeze Dress',
    price: 7499,
    image: dressFloral,
    images: [dressFloral, dressFloral, dressFloral],
    sizes: ['S', 'M', 'L'],
    colors: ['Multicolor'],
    length: 'Knee-length',
    description: 'Light and airy floral dress, ideal for summer days and casual outings.',
    category: 'girls'
  },
  {
    id: 3,
    title: 'Chic Black Cocktail Dress',
    price: 12999,
    image: dressBlack,
    images: [dressBlack, dressBlack, dressBlack],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    length: 'Mini',
    description: 'A classic black cocktail dress that never goes out of style. keyhole back detail.',
    category: 'women'
  },
  {
    id: 4,
    title: 'Royal Blue Silk Dress',
    price: 17500,
    image: dressRed, // Using red as placeholder if blue dress image missing, but variable name was dressRed in original too? Check imports. Ah, dressRed was used for id 4 in original.
    images: [dressRed, dressRed, dressRed],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Royal Blue'],
    length: 'Maxi',
    description: 'Elegant silk dress in a striking royal blue shade.',
    category: 'women'
  },
  // New Saree Collection
  {
    id: 5,
    title: 'Traditional Red Silk Saree',
    price: 15999,
    image: sareeRed,
    images: [sareeRed, sareeRed, sareeRed],
    sizes: ['Free Size'],
    colors: ['Red', 'Gold'],
    length: '6.5 meters',
    description: 'Authentic traditional silk saree with intricate zari work.',
    category: 'women'
  },
  {
    id: 6,
    title: 'Royal Blue Georgette Saree',
    price: 11500,
    image: sareeBlue,
    images: [sareeBlue, sareeBlue, sareeBlue],
    sizes: ['Free Size'],
    colors: ['Royal Blue'],
    length: '6 meters',
    description: 'Lightweight georgette saree, easy to drape and perfect for parties.',
    category: 'women'
  },
  {
    id: 7,
    title: 'Elegant Green Banarasi Saree',
    price: 18999,
    image: sareeGreen,
    images: [sareeGreen, sareeGreen, sareeGreen],
    sizes: ['Free Size'],
    colors: ['Green', 'Gold'],
    length: '6.5 meters',
    description: 'Rich Banarasi saree featuring classic motifs and borders.',
    category: 'women'
  },
  {
    id: 8,
    title: 'Pink Mysore Silk Saree',
    price: 21000,
    image: sareeRed,
    images: [sareeRed, sareeRed, sareeRed],
    sizes: ['Free Size'],
    colors: ['Pink'],
    length: '6.5 meters',
    description: 'Luxurious Mysore silk saree known for its smooth texture and sheen.',
    category: 'women'
  },
  {
    id: 9,
    title: 'Midnight Blue Party Saree',
    price: 9500,
    image: sareeBlue,
    images: [sareeBlue, sareeBlue, sareeBlue],
    sizes: ['Free Size'],
    colors: ['Midnight Blue'],
    length: '6 meters',
    description: 'Gorgeous party wear saree with sequin embellishments.',
    category: 'women'
  },
  {
    id: 10,
    title: 'Emerald Green Wedding Saree',
    price: 25000,
    image: sareeGreen,
    images: [sareeGreen, sareeGreen, sareeGreen],
    sizes: ['Free Size'],
    colors: ['Emerald Green'],
    length: '6.5 meters',
    description: 'Heavy wedding saree with elaborate embroidery and stone work.',
    category: 'women'
  },
  {
    id: 11,
    title: 'Golden Border Zari Saree',
    price: 13500,
    image: sareeRed,
    images: [sareeRed, sareeRed, sareeRed],
    sizes: ['Free Size'],
    colors: ['Red', 'Gold'],
    length: '6 meters',
    description: 'Classic saree with a prominent golden zari border.',
    category: 'women'
  },
  {
    id: 12,
    title: 'Modern Fusion Drape',
    price: 8999,
    image: dressFloral,
    images: [dressFloral, dressFloral, dressFloral],
    sizes: ['Free Size'],
    colors: ['Pastel'],
    length: '5.5 meters',
    description: 'Contemporary fusion drape for the modern woman.',
    category: 'girls'
  },
  {
    id: 13,
    title: 'Classic Noir Saree',
    price: 10500,
    image: dressBlack,
    images: [dressBlack, dressBlack, dressBlack],
    sizes: ['Free Size'],
    colors: ['Black'],
    length: '6 meters',
    description: 'Sophisticated black saree for evening events.',
    category: 'women'
  },
  {
    id: 14,
    title: 'Festive Blue Gown',
    price: 14500,
    image: sareeBlue,
    images: [sareeBlue, sareeBlue, sareeBlue],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue'],
    length: 'Floor Length',
    description: 'Festive gown with delicate embroidery, perfect for celebrations.',
    category: 'women'
  },
  {
    id: 15,
    title: 'Cute Pink Party Dress',
    price: 3500,
    image: dressFloral,
    images: [dressFloral],
    sizes: ['2T', '3T', '4T'],
    colors: ['Pink'],
    length: 'Knee Length',
    description: 'Adorable pink party dress for little princesses.',
    category: 'kids'
  },
  {
    id: 16,
    title: 'Kids Summer Frock',
    price: 2100,
    image: dressRed,
    images: [dressRed],
    sizes: ['4T', '5T', '6T'],
    colors: ['Red'],
    length: 'Short',
    description: 'Comfortable cotton frock for summer play.',
    category: 'kids'
  }
];

const Home = ({ products, onAddToCart, wishlist, onToggleWishlist }) => (
  <>
    <Hero />
    <div className="container section">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Featured Categories</h2>
      <div className="grid grid-cols-3">
        <Link to="/category/kids" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            height: '250px', backgroundColor: '#e0f7fa', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            fontFamily: 'var(--font-serif)', borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'transform 0.3s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            For Kids
          </div>
        </Link>
        <Link to="/category/girls" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            height: '250px', backgroundColor: '#fce4ec', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            fontFamily: 'var(--font-serif)', borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'transform 0.3s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            For Mid Range Girls
          </div>
        </Link>
        <Link to="/category/women" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            height: '250px', backgroundColor: '#f3e5f5', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            fontFamily: 'var(--font-serif)', borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'transform 0.3s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            For Women's Dress
          </div>
        </Link>
      </div>
      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Latest Arrivals</h2>
        <ProductList products={products.slice(0, 3)} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
      </div>
    </div>
  </>
);

const CategoryPage = ({ products, onAddToCart, wishlist, onToggleWishlist }) => {
  const { categoryName } = useParams();
  const filteredProducts = products.filter(p => p.category === categoryName);

  const getCategoryTitle = (cat) => {
    switch (cat) {
      case 'kids': return 'Kids Collection';
      case 'girls': return 'Girls Collection';
      case 'women': return "Women's Collection";
      default: return 'Collection';
    }
  };

  return (
    <div className="section">
      <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-serif)' }}>
        {getCategoryTitle(categoryName)}
      </h2>
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
      ) : (
        <div className="container" style={{ textAlign: 'center', fontSize: '1.2rem' }}>
          No products found in this category.
        </div>
      )}
    </div>
  );
};

const Dresses = ({ products, onAddToCart, wishlist, onToggleWishlist }) => (
  <ProductList products={products} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
);

const SearchPage = ({ products, onAddToCart, wishlist, onToggleWishlist }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.colors && p.colors.some(c => c.toLowerCase().includes(q))) ||
        (p.category && p.category.toLowerCase().includes(q))
      )
    : [];

  return (
    <div className="section">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
        {query ? `Search results for "${query}"` : 'Search'}
      </h2>
      {query && (
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          {results.length} {results.length === 1 ? 'item' : 'items'} found
        </p>
      )}
      {results.length > 0 ? (
        <ProductList products={results} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
      ) : (
        <div className="container" style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
          {query ? 'No products match your search. Try a different keyword.' : 'Type something in the search bar above.'}
        </div>
      )}
    </div>
  );
};

const WishlistPage = ({ wishlist, onAddToCart, onToggleWishlist }) => {
  return (
    <div className="section">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
        My Wishlist
      </h2>
      {wishlist.length > 0 ? (
        <ProductList products={wishlist} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
      ) : (
        <div className="container" style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
          Your wishlist is empty. Tap the ♡ on any product to save it here.
        </div>
      )}
    </div>
  );
};

const Cart = ({ cartItems, removeFromCart, user, onOrderPlaced }) => {
  const handleCheckout = async () => {
    // Save the order to the backend when logged in
    if (user) {
      try {
        await api.placeOrder(cartItems);
        if (onOrderPlaced) onOrderPlaced();
      } catch (err) {
        alert(`Could not save your order: ${err.message}`);
        return;
      }
    }

    const phoneNumber = "8807345596";
    const itemsList = cartItems.map(item => {
      const details = [item.size ? `Size: ${item.size}` : '', item.color ? `Color: ${item.color}` : ''].filter(Boolean).join(', ');
      return `• ${item.title}${details ? ` (${details})` : ''} - ₹${item.price.toLocaleString('en-IN')}`;
    }).join('\n');
    const total = cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN');

    const message = `*New Order Request*\n\nitems:\n${itemsList}\n\n*Total: ₹${total}*\n\nPlease confirm availability and payment details.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container section">
      <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Your cart is currently empty.</p>
      ) : (
        <div className="grid grid-cols-1">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem' }}>{item.title}</h4>
                {item.size && (<p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>Size: {item.size}</p>)}
                {item.color && (<p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>Color: {item.color}</p>)}
                <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => removeFromCart(index)} style={{ color: '#ff4444', fontWeight: '500' }}>
                Remove
              </button>
            </div>
          ))}
          <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Total: ₹{cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}</h3>
            <button onClick={handleCheckout} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState('');
  const { user } = useAuth();
  // Skip the very first save so we don't overwrite the server with empty arrays on load
  const hydrated = useRef(false);

  // When the user logs in, load their saved cart & wishlist from the server.
  // When they log out, clear the in-memory cart & wishlist.
  useEffect(() => {
    if (user) {
      hydrated.current = false;
      Promise.all([api.getCart(), api.getWishlist()])
        .then(([cart, wish]) => {
          setCartItems(cart.items || []);
          setWishlist(wish.items || []);
        })
        .catch((err) => console.error('Failed to load saved data:', err))
        .finally(() => { hydrated.current = true; });
    } else {
      setCartItems([]);
      setWishlist([]);
      hydrated.current = false;
    }
  }, [user]);

  // Persist cart to the server whenever it changes (only while logged in & after hydration)
  useEffect(() => {
    if (user && hydrated.current) {
      api.saveCart(cartItems).catch((err) => console.error('Failed to save cart:', err));
    }
  }, [cartItems, user]);

  // Persist wishlist to the server whenever it changes
  useEffect(() => {
    if (user && hydrated.current) {
      api.saveWishlist(wishlist).catch((err) => console.error('Failed to save wishlist:', err));
    }
  }, [wishlist, user]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    setToast(`Added ${product.title} to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.some(w => w.id === product.id)
        ? prev.filter(w => w.id !== product.id)
        : [...prev, product]
    );
  };

  const handleOrderPlaced = () => {
    // Order saved on the server (which also cleared the server cart) — clear locally too
    setCartItems([]);
    setToast('Order placed successfully! 🎉');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header cartCount={cartItems.length} wishlistCount={wishlist.length} />
        <BackButton />
        {toast && (
          <div style={{
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-dark)', color: 'white', padding: '0.9rem 1.5rem',
            borderRadius: '50px', boxShadow: 'var(--shadow-lg)', zIndex: 2000,
            fontSize: '0.95rem', fontWeight: '500'
          }}>
            ✓ {toast}
          </div>
        )}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home products={PRODUCTS} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />
            <Route path="/dresses" element={<Dresses products={PRODUCTS} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />
            <Route path="/search" element={<SearchPage products={PRODUCTS} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />
            <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} user={user} onOrderPlaced={handleOrderPlaced} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/category/:categoryName" element={<CategoryPage products={PRODUCTS} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />
            <Route path="/product/:id" element={<ProductDetail products={PRODUCTS} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />
          </Routes>
        </main>
        <footer style={{ backgroundColor: 'var(--color-dark)', color: 'white', padding: '3rem 0', marginTop: 'auto' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p>&copy; 2024 Ladies World. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
