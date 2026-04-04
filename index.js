require('dotenv').config();
const express = require('express');
const path = require('path');
const { router, sessionMiddleware } = require('./src/dashboard');
const { startBot } = require('./src/bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'dashboard/public')));

// Routes
app.use('/', router);

// Start Express server
app.listen(PORT, () => {
  console.log(`🌐 Admin dashboard running on port ${PORT}`);
});

// Start Discord bot
startBot().catch(err => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});
