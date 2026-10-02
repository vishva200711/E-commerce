import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColor = (status) => ({
    Pending: '#d4a373',
    Confirmed: '#4a90d9',
    Shipped: '#9b59b6',
    Delivered: '#2e9e5b',
    Cancelled: '#e63946',
}[status] || '#999');

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        api.getOrders()
            .then((data) => setOrders(data.orders || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <div className="container section" style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>My Orders</h2>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Please <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>log in</Link> to view your orders.
                </p>
            </div>
        );
    }

    return (
        <div className="container section">
            <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '2rem' }}>My Orders</h2>
            {loading ? (
                <p style={{ color: '#666' }}>Loading your orders…</p>
            ) : error ? (
                <p style={{ color: '#e63946' }}>{error}</p>
            ) : orders.length === 0 ? (
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    You haven't placed any orders yet. <Link to="/dresses" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Start shopping →</Link>
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <strong style={{ fontSize: '1.1rem' }}>Order #{order.id}</strong>
                                    <span style={{ color: '#999', marginLeft: '1rem', fontSize: '0.9rem' }}>
                                        {new Date(order.createdAt).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <span style={{
                                    backgroundColor: statusColor(order.status),
                                    color: 'white',
                                    padding: '0.3rem 0.9rem',
                                    borderRadius: '50px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600
                                }}>{order.status}</span>
                            </div>
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.95rem' }}>
                                        <span>
                                            {item.title}
                                            {item.size ? ` · Size: ${item.size}` : ''}
                                            {item.color ? ` · Color: ${item.color}` : ''}
                                        </span>
                                        <span>₹{Number(item.price).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
                                Total: ₹{Number(order.total).toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
