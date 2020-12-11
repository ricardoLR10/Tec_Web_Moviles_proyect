
const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
  console.log("Servidor", 3000);
});


const io = socket(server);

io.on('connection', (socket) => {
  console.log('Nueva conexion', socket.id);

  socket.on('msg', (data) => {
    io.sockets.emit('msg', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('msgj', (data)=>{
    socket.broadcast.emit('msgj', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});
