import { io } from 'socket.io-client';

const socket = io(
  process.env.NODE_ENV === 'production' 
    ? 'https://harvesthub-backend.onrender.com' 
    : 'http://localhost:5000',
  {
    transports: ['websocket', 'polling']
  }
);

export default socket;
