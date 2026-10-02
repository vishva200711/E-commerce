import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { getSocket } from '../socket';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColor = (status) => ({
    Pending: '#d4a373',
    Confirmed: '#4a90d9',
    Shipped: '#9b59b6',
    Delivered: '#2e9e5b',
    Cancelled: '#e63946',
}[status] || '#999');

const AdminDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [live, setLive] = useState(false);
    const [flashId, setFlashId] = useState(null);

    // Load all orders once
    useEffect(() => {
        if (!user) { setLoading(false); return; }
        api.getAllOrders()
            .then((data) => setOrders(data.orders || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    // Real-time: listen for new orders & status updates
    useEffect(() => {
        let socket = null;
        let cancelled = false;
        const onConnect = () => setLive(true);
        const onDisconnect = () => setLive(false);
        const onNew = (order) => {
            setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
            setFlashId(order.id);
            setTimeout(() => setFlashId(null), 2000);
        };
        const onUpdated = (order) => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
        };

        getSocket().then((s) => {
            if (!s || cancelled) return;
            socket = s;
            setLive(s.connected);
            s.on('connect', onConnect);
            s.on('disconnect', onDisconnect);
            s.on('order:new', onNew);
            s.on('order:updated', onUpdated);
        });

        return () => {
            cancelled = true;
            if (socket) {
                socket.off('connect', onConnect);
                socket.off('disconnect', onDisconnect);
                socket.off('order:new', onNew);
                socket.off('order:updated', onUpdated);
            }
        };
    }, []);

    const changeStatus = async (id, status) => {
        try {
            await api.updateOrderStatus(id, status);
            // The socket 'order:updated' event will sync state; optimistic update too:
            setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        } catch (err) {
            alert(err.message);
        }
    };

    if (!user) {
        return (
            <div className="container section" style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Admin Dashboard</h2>
                <p style={{ color: '#666' }}>
                    Please <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>log in</Link> to access the dashboard.
                </p>
            </div>
        );
    }

    const revenue = orders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + Number(o.total || 0), 0);

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>Admin Dashboard</h2>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.85rem', color: live ? '#2e9e5b' : '#999', fontWeight: 600
                }}>
                    <span style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        backgroundColor: live ? '#2e9e5b' : '#bbb',
                        boxShadow: live ? '0 0 0 4px rgba(46,158,91,0.15)' : 'none'
                    }} />
                    {live ? 'Live' : 'Offline'}
                </span>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
                <StatCard label="Total Orders" value={orders.length} />
                <StatCard label="Pending" value={orders.filter((o) => o.status === 'Pending').length} />
                <StatCard label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} />
            </div>

            {loading ? (
                <p style={{ color: '#666' }}>Loading orders…</p>
            ) : error ? (
                <p style={{ color: '#e63946' }}>{error}</p>
            ) : orders.length === 0 ? (
                <p style={{ color: '#666' }}>No orders yet. New orders will appear here in real time. ⚡</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-sm)',
                            border: flashId === order.id ? '2px solid #2e9e5b' : '2px solid transparent',
                            transition: 'border 0.4s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <strong>Order #{order.id}</strong>
                                    <span style={{ color: '#999', marginLeft: '1rem', fontSize: '0.85rem' }}>
                                        {order.customerName} · {order.customerEmail}
                                    </span>
                                    <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                                        {new Date(order.createdAt).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <select
                                    value={order.status}
                                    onChange={(e) => changeStatus(order.id, e.target.value)}
                                    style={{
                                        border: `1px solid ${statusColor(order.status)}`,
                                        color: statusColor(order.status),
                                        borderRadius: '50px',
                                        padding: '0.35rem 0.9rem',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        backgroundColor: 'white',
                                        height: 'fit-content'
                                    }}
                                >
                                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', fontSize: '0.9rem' }}>
                                        <span>
                                            {item.title}
                                            {item.size ? ` · ${item.size}` : ''}
                                            {item.color ? ` · ${item.color}` : ''}
                                        </span>
                                        <span>₹{Number(item.price).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '0.75rem', fontWeight: 700 }}>
                                Total: ₹{Number(order.total).toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-dark)' }}>{value}</div>
        <div style={{ color: '#888', marginTop: '0.25rem' }}>{label}</div>
    </div>
);

export default AdminDashboard;
