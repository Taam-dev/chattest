const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user-join', (username) => {
    const user = {
      id: socket.id,
      username: username
    };
    onlineUsers.push(user);
    
    io.emit('update-users', onlineUsers);
    
    socket.broadcast.emit('user-joined', username);
  });

  socket.on('send-message', (data) => {
    io.emit('receive-message', {
      username: data.username,
      message: data.message,
      time: new Date().toLocaleTimeString()
    });
  });

  // when user disconnect
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.id !== socket.id);
    io.emit('update-users', onlineUsers);
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});
