const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const requestRoutes = require('./routes/requests');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'harvest-hub-frontend.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

connectDB();

app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Handle new donation event
    socket.on('newDonation', (donation) => {
        console.log('Broadcasting new donation:', donation._id);
        socket.broadcast.emit('newDonation', donation);
    });
    
    // Handle new request event
    socket.on('newRequest', (request) => {
        console.log('Broadcasting new request:', request._id);
        socket.broadcast.emit('newRequest', request);
    });
    
    // Handle request status update
    socket.on('requestStatusUpdated', (request) => {
        console.log('Broadcasting request status update:', request._id, request.status);
        socket.broadcast.emit('requestStatusUpdated', request);
    });
    
    // Handle donation status update
    socket.on('donationStatusUpdated', (donation) => {
        console.log('Broadcasting donation status update:', donation._id, donation.status);
        socket.broadcast.emit('donationStatusUpdated', donation);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
