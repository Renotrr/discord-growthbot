const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const storage = require('./storage');

const router = express.Router();

// Session middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
});

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.redirect('/login');
}

// ─── ROUTES ───────────────────────────────────────────────

// Login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/public/login.html'));
});

router.post('/login', express.json(), (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword) {
    req.session.loggedIn = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Wrong password' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Dashboard (protected)
router.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/public/index.html'));
});

// ─── API ROUTES ───────────────────────────────────────────

// Get all servers
router.get('/api/servers', requireAuth, (req, res) => {
  const servers = storage.getServers();
  res.json(Object.values(servers));
});

// Add a server
router.post('/api/servers', requireAuth, express.json(), (req, res) => {
  const { guildId, name, inviteLink, welcomeMessage } = req.body;

  if (!guildId || !inviteLink) {
    return res.status(400).json({ error: 'Server ID and Invite Link are required' });
  }

  const server = storage.addServer(guildId, { name, inviteLink, welcomeMessage });
  res.json({ success: true, server });
});

// Update a server
router.put('/api/servers/:guildId', requireAuth, express.json(), (req, res) => {
  const { guildId } = req.params;
  const updates = req.body;
  const server = storage.updateServer(guildId, updates);
  if (!server) return res.status(404).json({ error: 'Server not found' });
  res.json({ success: true, server });
});

// Delete a server
router.delete('/api/servers/:guildId', requireAuth, (req, res) => {
  storage.removeServer(req.params.guildId);
  res.json({ success: true });
});

// Toggle server active/inactive
router.patch('/api/servers/:guildId/toggle', requireAuth, (req, res) => {
  const server = storage.getServer(req.params.guildId);
  if (!server) return res.status(404).json({ error: 'Server not found' });
  const updated = storage.updateServer(req.params.guildId, { active: !server.active });
  res.json({ success: true, server: updated });
});

// Get logs
router.get('/api/logs', requireAuth, (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const logs = storage.getLogs(limit);
  res.json(logs);
});

// Stats
router.get('/api/stats', requireAuth, (req, res) => {
  const servers = Object.values(storage.getServers());
  const logs = storage.getLogs(500);
  const today = new Date().toDateString();

  res.json({
    totalServers: servers.length,
    activeServers: servers.filter(s => s.active).length,
    totalInvitesSent: logs.filter(l => l.inviteSent).length,
    todayJoins: logs.filter(l => new Date(l.timestamp).toDateString() === today).length
  });
});

module.exports = { router, sessionMiddleware };
