const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// JSON file-based database (no native compilation needed)
const dbPath = path.join(__dirname, '../../weathergpt_data.json');

// Initialize data structure
const defaultData = {
  chat_sessions: [],
  chat_messages: [],
  favorite_locations: [],
  alert_log: []
};

// Load or create database
function loadDb() {
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading database, creating new one:', err.message);
  }
  return { ...defaultData };
}

function saveDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err.message);
  }
}

// Initialize
let db = loadDb();
console.log('📦 Database initialized (JSON file store)');

module.exports = {
  createSession: () => {
    const id = uuidv4();
    db.chat_sessions.push({ id, created_at: new Date().toISOString() });
    saveDb(db);
    return id;
  },
  saveMessage: (sessionId, role, content, weatherData = null) => {
    const id = uuidv4();
    db.chat_messages.push({
      id,
      session_id: sessionId,
      role,
      content,
      weather_data: weatherData || null,
      created_at: new Date().toISOString()
    });
    saveDb(db);
    return id;
  },
  getSessionMessages: (sessionId) => {
    return db.chat_messages
      .filter(msg => msg.session_id === sessionId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },
  saveFavorite: (city, lat, lon, country) => {
    const id = uuidv4();
    db.favorite_locations.push({ id, city, lat, lon, country });
    saveDb(db);
    return id;
  },
  getFavorites: () => {
    return db.favorite_locations;
  },
  saveAlert: (title, description, severity, city) => {
    const id = uuidv4();
    db.alert_log.push({
      id,
      title,
      description,
      severity,
      city,
      created_at: new Date().toISOString()
    });
    saveDb(db);
    return id;
  },
  getRecentAlerts: () => {
    return db.alert_log
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);
  }
};
