const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pollHandlers = require('./socket/pollHandlers');
require('dotenv').config();

const app = express();

// Get frontend URL from environment variable or use default for dev
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Enable CORS for Express routes
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Polling System API is running',
        timestamp: new Date().toISOString()
    });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    pollHandlers(io, socket);
});

// Self-ping to prevent Render free tier from sleeping
const SELF_PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
setInterval(() => {
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    http.get(backendUrl, (res) => {
        console.log(`Self-ping: ${new Date().toISOString()} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`Self-ping error: ${err.message}`);
    });
}, SELF_PING_INTERVAL);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
