import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// GET /api/cart — the current user's saved cart
router.get('/', (req, res) => {
  const items = db.data.carts[req.userId] || [];
  res.json({ items });
});

// PUT /api/cart — replace the current user's cart
router.put('/', async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items must be an array.' });
  }
  db.data.carts[req.userId] = items;
  await db.write();
  res.json({ items });
});

export default router;
