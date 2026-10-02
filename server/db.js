import { JSONFilePreset } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbFile = join(__dirname, 'ladiesworld.json');

// Pure-JS JSON database — no native compilation needed.
const db = await JSONFilePreset(dbFile, {
  users: [],
  carts: {},
  wishlists: {},
  orders: [],
  nextUserId: 1,
  nextOrderId: 1,
});

export default db;
