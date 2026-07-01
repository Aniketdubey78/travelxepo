const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://travelxepo.vercel.app',
    'https://travelxepo-frontend.vercel.app',
    '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage
const forums = [];
const messages = {};
const users = {};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'API is running', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/api/ping', (req, res) => {
  res.json({ 
    message: 'pong', 
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Forum endpoints
app.get('/api/forums', (req, res) => {
  try {
    res.json({ success: true, data: forums, count: forums.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/forums', (req, res) => {
  try {
    const { title, description, category, userId } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description required' });
    }
    
    const forum = {
      id: Date.now().toString(),
      title,
      description,
      category: category || 'general',
      createdAt: new Date(),
      createdBy: userId,
      members: userId ? [userId] : [],
      messageCount: 0
    };
    
    forums.push(forum);
    messages[forum.id] = [];
    
    res.status(201).json({ success: true, data: forum });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/forums/:id', (req, res) => {
  try {
    const forum = forums.find(f => f.id === req.params.id);
    if (!forum) {
      return res.status(404).json({ success: false, error: 'Forum not found' });
    }
    res.json({ success: true, data: forum });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/forums/:id/messages', (req, res) => {
  try {
    const msgs = messages[req.params.id] || [];
    res.json({ success: true, data: msgs, count: msgs.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/forums/:id/messages', (req, res) => {
  try {
    const { id } = req.params;
    const { userId, message, userName } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message required' });
    }
    
    const forum = forums.find(f => f.id === id);
    if (!forum) {
      return res.status(404).json({ success: false, error: 'Forum not found' });
    }
    
    if (!messages[id]) {
      messages[id] = [];
    }
    
    const msg = {
      id: Date.now().toString(),
      userId,
      userName: userName || 'Anonymous',
      message,
      createdAt: new Date()
    };
    
    messages[id].push(msg);
    forum.messageCount = messages[id].length;
    
    res.status(201).json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User endpoints
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    
    // Mock authentication
    const user = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      createdAt: new Date()
    };
    
    users[user.id] = user;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        user,
        token: `token_${user.id}_${Date.now()}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    
    const user = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      createdAt: new Date()
    };
    
    users[user.id] = user;
    
    res.status(201).json({ 
      success: true, 
      data: { 
        user,
        token: `token_${user.id}_${Date.now()}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Notification endpoints
app.post('/api/notifications/send', (req, res) => {
  try {
    const { userId, message, type } = req.body;
    
    const notification = {
      id: Date.now().toString(),
      userId,
      message,
      type: type || 'info',
      read: false,
      createdAt: new Date()
    };
    
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'TravelXepo API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      ping: '/api/ping',
      forums: '/api/forums',
      messages: '/api/forums/:id/messages',
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register'
      },
      notifications: '/api/notifications/send'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[v0] Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
