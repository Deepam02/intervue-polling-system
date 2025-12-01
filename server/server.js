const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pollHandlers = require('./socket/pollHandlers');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);

// Get frontend URL from environment variable or use default for dev
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL.split(','), // Support multiple origins separated by comma
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    pollHandlers(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
