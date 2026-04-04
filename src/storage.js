const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/config.json');

// Default structure
const DEFAULT_DATA = {
  servers: {},
  logs: []
};

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      saveData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading data:', e);
    return DEFAULT_DATA;
  }
}

function saveData(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

function getServers() {
  return loadData().servers;
}

function getServer(guildId) {
  return loadData().servers[guildId] || null;
}

function addServer(guildId, config) {
  const data = loadData();
  data.servers[guildId] = {
    guildId,
    name: config.name || 'Unknown Server',
    inviteLink: config.inviteLink || '',
    welcomeMessage: config.welcomeMessage || '',
    active: true,
    addedAt: new Date().toISOString(),
    ...config
  };
  saveData(data);
  return data.servers[guildId];
}

function updateServer(guildId, updates) {
  const data = loadData();
  if (!data.servers[guildId]) return null;
  data.servers[guildId] = { ...data.servers[guildId], ...updates };
  saveData(data);
  return data.servers[guildId];
}

function removeServer(guildId) {
  const data = loadData();
  delete data.servers[guildId];
  saveData(data);
}

function addLog(entry) {
  const data = loadData();
  data.logs.unshift({
    ...entry,
    timestamp: new Date().toISOString()
  });
  // Keep only last 500 logs
  if (data.logs.length > 500) data.logs = data.logs.slice(0, 500);
  saveData(data);
}

function getLogs(limit = 100) {
  return loadData().logs.slice(0, limit);
}

module.exports = {
  getServers,
  getServer,
  addServer,
  updateServer,
  removeServer,
  addLog,
  getLogs
};
