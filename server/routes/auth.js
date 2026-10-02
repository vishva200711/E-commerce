import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

function makeToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = db.data.users.find((u) => u.email === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = {
    id: db.data.nextUserId++,
    name: name.trim(),
    email: normalizedEmail,
    password_hash: bcrypt.hashSync(password, 10),
    created_at: new Date().toISOString(),
  };
  db.data.users.push(user);
  db.data.carts[user.id] = [];
  db.data.wishlists[user.id] = [];
  await db.write();

  const token = makeToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = db.data.users.find((u) => u.email === normalizedEmail);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = makeToken(user);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me — returns the current user (used to restore a session)
router.get('/me', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.data.users.find((u) => u.id === payload.id);
    if (!user) return res.status(401).json({ error: 'User not found.' });
    res.json({ user: publicUser(user) });
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
});

export default router;
