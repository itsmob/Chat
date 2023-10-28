const SocketIO = require('socket.io');
const { server } = require('./index.js');

const io = SocketIO(server);

//s stands for socket
io.on('connection', (socket) => {
  console.log('new connection', socket.id);

  socket.on('client:chat:message', (payload) => {
    io.sockets.emit('server:chat:message', payload);
  });

  socket.on('client:chat:typing', (payload) => {
    socket.broadcast.emit('server:chat:typing', payload);
  });

  socket.on('client:chat:nottyping', (payload) => {
    socket.broadcast.emit('server:chat:nottyping', payload);
  });
});
