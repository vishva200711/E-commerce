# 👗 Ladies World

A full-stack e-commerce store for dresses & sarees — built with **React + Vite** on the frontend and **Node.js + Express** on the backend, with **real-time order updates** via Socket.IO.

---

## ✨ Features

- **Product catalog** — dresses & sarees across Kids / Girls / Women categories
- **Product detail pages** with image gallery, selectable **sizes** & **colors**
- **Live search** — filter products as you type
- **Cart** with size/color selections and WhatsApp checkout
- **Wishlist** — save favourites with a heart toggle
- **User accounts** — signup / login with JWT auth (passwords hashed with bcrypt)
- **Per-user cart & wishlist** — saved to the backend, persist across refreshes & devices
- **Orders** — checkout saves the order; users get an **order history** page
- **Admin dashboard** — view all orders, update status, with **real-time** live updates (Socket.IO)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v6 |
| Backend | Node.js, Express |
| Database | lowdb (JSON file — zero-config, no native build) |
| Auth | JWT + bcryptjs |
| Real-time | Socket.IO |

---

## 📁 Project Structure

```
new project dress shop/
├── src/                    # React frontend
│   ├── components/         # UI components (Header, ProductCard, Login, Orders, AdminDashboard, …)
│   ├── context/            # AuthContext (auth state)
│   ├── api.js              # API client
│   ├── socket.js           # Socket.IO client
│   └── App.jsx             # Routes + app state
├── server/                 # Express backend
│   ├── routes/             # auth, cart, wishlist, orders
│   ├── middleware/         # JWT auth guard
│   ├── db.js               # lowdb setup
│   ├── server.js           # Express + Socket.IO entry
│   └── .env                # backend config (not committed)
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
# Frontend (project root)
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Configure the backend

Copy the example env file and adjust if needed:

```bash
cd server
copy .env.example .env   # Windows
# cp .env.example .env    # macOS/Linux
```

### 3. Run everything

**Option A — run both together (recommended):**
```bash
npm run dev:all
```

**Option B — two terminals:**
```bash
# Terminal 1 — backend
npm run server

# Terminal 2 — frontend
npm run dev
```

- Frontend → http://localhost:5173
- Backend API → http://localhost:4000

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Create an account |
| POST | `/api/auth/login` | — | Log in |
| GET | `/api/auth/me` | ✓ | Restore session |
| GET/PUT | `/api/cart` | ✓ | Read / save cart |
| GET/PUT | `/api/wishlist` | ✓ | Read / save wishlist |
| GET | `/api/orders` | ✓ | Current user's orders |
| GET | `/api/orders/all` | ✓ | All orders (admin) |
| POST | `/api/orders` | ✓ | Place an order |
| PATCH | `/api/orders/:id/status` | ✓ | Update order status |

**Socket.IO events:** `order:new`, `order:updated` (emitted by the server, consumed by the admin dashboard).

---

## 📝 License

Private project — all rights reserved.
