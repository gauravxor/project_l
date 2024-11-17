const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sync', (data) => {
        socket.broadcast.emit('sync', data); // Broadcast sync data to other users
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
