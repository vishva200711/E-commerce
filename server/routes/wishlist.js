import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// GET /api/wishlist — the current user's saved wishlist
router.get('/', (req, res) => {
  const items = db.data.wishlists[req.userId] || [];
  res.json({ items });
});

// PUT /api/wishlist — replace the current user's wishlist
router.put('/', async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items must be an array.' });
  }
  db.data.wishlists[req.userId] = items;
  await db.write();
  res.json({ items });
});

export default router;
