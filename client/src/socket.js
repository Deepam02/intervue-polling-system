import { io } from 'socket.io-client';

// Connect to backend - use environment variable or fallback to localhost
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 10000,
});

// Connection event handlers
socket.on('connect', () => {
    console.log('✅ Connected to server:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
    console.error('🔴 Connection error:', error.message);
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Reconnected to server after', attemptNumber, 'attempts');
});

socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Attempting to reconnect... Attempt:', attemptNumber);
});

socket.on('reconnect_error', (error) => {
    console.error('🔴 Reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
    console.error('❌ Failed to reconnect to server');
});

export default socket;
