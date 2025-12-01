import { io } from 'socket.io-client';

// Connect to backend - use environment variable or fallback to localhost
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');

export default socket;
