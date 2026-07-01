const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'https://travelxepo.vercel.app',
      'https://travelxepo-frontend.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://travelxepo.vercel.app',
    'https://travelxepo-frontend.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toISOString() });
});

// Forum routes
const forums = [];
const messages = {};

app.get('/api/forums', (req, res) => {
  res.json(forums);
});

app.post('/api/forums', (req, res) => {
  const { title, description, category } = req.body;
  const forum = {
    id: Date.now().toString(),
    title,
    description,
    category,
    createdAt: new Date(),
    members: []
  };
  forums.push(forum);
  messages[forum.id] = [];
  io.emit('forum_created_global', forum);
  res.status(201).json(forum);
});

app.get('/api/forums/:id/messages', (req, res) => {
  const { id } = req.params;
  res.json(messages[id] || []);
});

app.post('/api/forums/:id/messages', (req, res) => {
  const { id } = req.params;
  const { userId, message, userName } = req.body;
  
  if (!messages[id]) {
    messages[id] = [];
  }
  
  const msg = {
    id: Date.now().toString(),
    userId,
    userName,
    message,
    createdAt: new Date()
  };
  
  messages[id].push(msg);
  io.to(id).emit('receive_forum_message', msg);
  res.status(201).json(msg);
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('[v0] New socket connection:', socket.id);

  socket.on('join_room', (data) => {
    const { userId } = data;
    socket.join(userId);
    console.log('[v0] User joined room:', userId);
    io.emit('user_connected', { userId, socketId: socket.id });
  });

  socket.on('join_forum_room', (data) => {
    const { forumId, userId } = data;
    socket.join(forumId);
    console.log('[v0] User joined forum:', forumId, userId);
  });

  socket.on('send_forum_message', (data) => {
    const { forumId, userId, message, userName } = data;
    const msg = {
      id: Date.now().toString(),
      userId,
      userName,
      message,
      createdAt: new Date()
    };
    
    if (!messages[forumId]) {
      messages[forumId] = [];
    }
    messages[forumId].push(msg);
    io.to(forumId).emit('receive_forum_message', msg);
  });

  socket.on('fetch_initial_forums', () => {
    socket.emit('initial_forums_loaded', forums);
  });

  socket.on('create_new_forum', (data) => {
    const { title, description, category } = data;
    const forum = {
      id: Date.now().toString(),
      title,
      description,
      category,
      createdAt: new Date(),
      members: []
    };
    forums.push(forum);
    messages[forum.id] = [];
    io.emit('forum_created_global', forum);
  });

  socket.on('notification_trigger', (data) => {
    const { userId, message } = data;
    io.to(userId).emit('notification_received', { message, timestamp: new Date() });
  });

  socket.on('private_notification', (data) => {
    const { userId, message } = data;
    io.to(userId).emit('private-notification', { message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('[v0] User disconnected:', socket.id);
    io.emit('user_disconnected', { socketId: socket.id });
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[v0] Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`);
  console.log(`[v0] Socket.IO server ready`);
});

module.exports = server;
