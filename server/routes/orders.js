import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// GET /api/orders — the current user's order history (newest first)
router.get('/', (req, res) => {
  const orders = db.data.orders
    .filter((o) => o.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
});

// GET /api/orders/all — ALL orders (admin dashboard), newest first
router.get('/all', (req, res) => {
  const orders = [...db.data.orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({ orders });
});

// POST /api/orders — place a new order from the given items
router.post('/', async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item.' });
  }

  const user = db.data.users.find((u) => u.id === req.userId);
  const total = items.reduce((sum, it) => sum + (Number(it.price) || 0), 0);

  const order = {
    id: db.data.nextOrderId++,
    userId: req.userId,
    customerName: user ? user.name : 'Unknown',
    customerEmail: user ? user.email : '',
    items,
    total,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  db.data.orders.push(order);
  // Clear the user's cart after ordering
  db.data.carts[req.userId] = [];
  await db.write();

  // Broadcast the new order to any connected admin dashboards in real time
  const io = req.app.get('io');
  if (io) io.emit('order:new', order);

  res.status(201).json({ order });
});

// PATCH /api/orders/:id/status — update an order's status (admin)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body || {};
  const allowed = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  }

  const order = db.data.orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.status = status;
  await db.write();

  const io = req.app.get('io');
  if (io) io.emit('order:updated', order);

  res.json({ order });
});

export default router;
