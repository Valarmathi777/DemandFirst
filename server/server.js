const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

app.use(cors());
app.use(express.json());

// ── Database Setup ──────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'marketplace.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    specialty TEXT,
    offerType TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    budget TEXT NOT NULL,
    budgetText TEXT,
    timeline TEXT NOT NULL,
    timelineText TEXT,
    postedBy TEXT NOT NULL,
    postedAt TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'active',
    bidsCount INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reqId INTEGER NOT NULL,
    reqTitle TEXT NOT NULL,
    sellerName TEXT NOT NULL,
    buyerName TEXT NOT NULL,
    amount TEXT NOT NULL,
    delivery TEXT NOT NULL,
    proposal TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (reqId) REFERENCES requirements(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomId TEXT NOT NULL,
    senderName TEXT NOT NULL,
    senderRole TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  );
`);

// ── Helpers ─────────────────────────────────────────────────────
const getReqWithBids = (id) => {
  const req = db.prepare('SELECT * FROM requirements WHERE id = ?').get(id);
  if (!req) return null;
  req.bids = db.prepare('SELECT * FROM bids WHERE reqId = ?').all(id);
  return req;
};

const getAllReqsWithBids = () => {
  const reqs = db.prepare('SELECT * FROM requirements ORDER BY id DESC').all();
  return reqs.map(r => ({ ...r, bids: db.prepare('SELECT * FROM bids WHERE reqId = ?').all(r.id) }));
};

// ── Auth Routes ──────────────────────────────────────────────────
app.post('/api/signup', (req, res) => {
  const { name, email, password, role, specialty, offerType } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields required' });
  if (role === 'seller' && (!specialty || !offerType)) return res.status(400).json({ error: 'Sellers must select a specialty and offer type' });
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hashed = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (name, email, password, role, specialty, offerType) VALUES (?, ?, ?, ?, ?, ?)').run(name, email, hashed, role, specialty || null, offerType || null);
  res.json({ name, email, role, specialty, offerType });
});

app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'No account found with this email' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Incorrect password' });
  if (user.role !== role) return res.status(403).json({ error: `This account is registered as a ${user.role}, not a ${role}` });
  res.json({ name: user.name, email: user.email, role: user.role, specialty: user.specialty, offerType: user.offerType });
});

// ── Requirements Routes ──────────────────────────────────────────
app.get('/api/requirements', (req, res) => res.json(getAllReqsWithBids()));

app.post('/api/requirements', (req, res) => {
  const { title, description, type, category, budget, budgetText, timeline, timelineText, postedBy } = req.body;
  const result = db.prepare(
    'INSERT INTO requirements (title, description, type, category, budget, budgetText, timeline, timelineText, postedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, type, category, budget, budgetText, timeline, timelineText, postedBy);
  const newReq = getReqWithBids(result.lastInsertRowid);
  io.emit('new_requirement', newReq);
  res.status(201).json(newReq);
});

// ── Bids Routes ──────────────────────────────────────────────────
app.get('/api/bids/:sellerName', (req, res) => {
  const bids = db.prepare('SELECT * FROM bids WHERE sellerName = ? ORDER BY id DESC').all(req.params.sellerName);
  res.json(bids);
});

// ── Products Route ───────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', price: '₹24,999', numPrice: 24999, seller: 'TechDirect', rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80', category: 'Electronics' },
    { id: 2, name: 'Ergonomic Mesh Office Chair', price: '₹15,499', numPrice: 15499, seller: 'OfficePro Supplies', rating: 4.6, reviews: 89, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80', category: 'Furniture' },
    { id: 3, name: 'Custom Printed Cotton T-Shirts (Pack of 50)', price: '₹37,500', numPrice: 37500, seller: 'MerchFactory', rating: 4.9, reviews: 42, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80', category: 'Bulk Merchandise' },
    { id: 4, name: 'Logitech MX Master 3S Mouse', price: '₹8,299', numPrice: 8299, seller: 'Peripheral World', rating: 5.0, reviews: 215, image: 'https://images.unsplash.com/photo-1615663245857-ac1eeb536fae?auto=format&fit=crop&q=80', category: 'Electronics' },
    { id: 5, name: 'Matte Black Coffee Mugs (Set of 4)', price: '₹2,899', numPrice: 2899, seller: 'Home Essentials', rating: 4.4, reviews: 12, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80', category: 'Home & Kitchen' },
    { id: 6, name: 'Used iPhone 13 Pro - 256GB Excellent', price: '₹48,500', numPrice: 48500, seller: 'MobileResell', rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&q=80', category: 'Electronics' },
    { id: 7, name: 'Mechanical Keyboard (Cherry MX Blue)', price: '₹6,499', numPrice: 6499, seller: 'KeyMaster', rating: 4.5, reviews: 310, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80', category: 'Electronics' },
    { id: 8, name: 'Noise Cancelling Earbuds', price: '₹4,999', numPrice: 4999, seller: 'AudioTech', rating: 4.3, reviews: 88, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80', category: 'Electronics' },
    { id: 9, name: '4K Ultra HD Monitor 27"', price: '₹22,999', numPrice: 22999, seller: 'DisplayKing', rating: 4.7, reviews: 145, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80', category: 'Electronics' },
    { id: 10, name: 'Standing Desk Converter', price: '₹12,499', numPrice: 12499, seller: 'OfficePro Supplies', rating: 4.8, reviews: 201, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80', category: 'Furniture' },
  ]);
});

// ── Chat Route ───────────────────────────────────────────────────
app.get('/api/chat/:roomId', (req, res) => {
  const msgs = db.prepare('SELECT * FROM messages WHERE roomId = ? ORDER BY id ASC').all(req.params.roomId);
  res.json(msgs);
});

// ── Stats Route ──────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const requirements = db.prepare('SELECT COUNT(*) as c FROM requirements').get().c;
  const totalBids = db.prepare('SELECT COUNT(*) as c FROM bids').get().c;
  res.json({ requirements, totalBids, onlineUsers: Object.keys(onlineUsers).length });
});

// ── Sockets ──────────────────────────────────────────────────────
const onlineUsers = {};

io.on('connection', (socket) => {
  socket.on('user_online', ({ userName, userRole }) => {
    onlineUsers[socket.id] = { userName, userRole };
    io.emit('online_count', Object.keys(onlineUsers).length);
  });

  socket.on('place_bid', (data) => {
    const { reqId, reqTitle, sellerName, buyerName, amount, delivery, proposal } = data;
    const req = db.prepare('SELECT * FROM requirements WHERE id = ?').get(reqId);
    if (!req) return;
    db.prepare('INSERT INTO bids (reqId, reqTitle, sellerName, buyerName, amount, delivery, proposal) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(reqId, reqTitle, sellerName, buyerName, amount, delivery, proposal);
    db.prepare('UPDATE requirements SET bidsCount = bidsCount + 1 WHERE id = ?').run(reqId);
    const updatedReq = getReqWithBids(reqId);
    io.emit('update_requirement', updatedReq);
    const newBid = updatedReq.bids[updatedReq.bids.length - 1];
    io.emit(`bid_received_${reqId}`, { bid: newBid, reqTitle });
  });

  socket.on('accept_bid', ({ reqId, bidId }) => {
    // accept this bid, reject all other pending bids on same req
    db.prepare("UPDATE bids SET status = 'accepted' WHERE id = ?").run(bidId);
    db.prepare("UPDATE bids SET status = 'rejected' WHERE reqId = ? AND id != ? AND status = 'pending'").run(reqId, bidId);
    db.prepare("UPDATE requirements SET status = 'hired' WHERE id = ?").run(reqId);
    const updatedReq = getReqWithBids(reqId);
    io.emit('update_requirement', updatedReq);
    const accepted = updatedReq.bids.find(b => b.id === bidId);
    if (accepted) io.emit(`bid_status_${accepted.sellerName}`, { bidId, status: 'accepted', reqTitle: updatedReq.title });
  });

  socket.on('reject_bid', ({ reqId, bidId }) => {
    db.prepare("UPDATE bids SET status = 'rejected' WHERE id = ?").run(bidId);
    const updatedReq = getReqWithBids(reqId);
    io.emit('update_requirement', updatedReq);
    const rejected = updatedReq.bids.find(b => b.id === bidId);
    if (rejected) io.emit(`bid_status_${rejected.sellerName}`, { bidId, status: 'rejected', reqTitle: updatedReq.title });
  });

  socket.on('send_message', ({ roomId, text, senderName, senderRole }) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const result = db.prepare('INSERT INTO messages (roomId, senderName, senderRole, text, time) VALUES (?, ?, ?, ?, ?)').run(roomId, senderName, senderRole, text, time);
    const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
    io.emit(`room_message_${roomId}`, msg);
    io.emit('incoming_message', { roomId, msg });
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('online_count', Object.keys(onlineUsers).length);
  });
});

server.listen(5000, () => console.log('Server with SQLite DB running on http://localhost:5000'));
