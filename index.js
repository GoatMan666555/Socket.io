var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//  DO NOT EDIT CODE ABOVE!

// Template of handling an event
//
/// socket.on('<event name>', function('<variable name>') {
/// < whenever this event is called by a client, stuff inside will execute >
/// }

// Example of handling an event
//
/// socket.on('move', function(data) {
///  io.in(socket.room).emit('move', data);
///  });
//
// In this example, when the "move" function has been called, send data from the function to all clients in the room that is is currently in

io.on('connection', function(socket) {
  io.emit('chat message', 'New Socket Connected.')
  socket.room = 'lobby';
  socket.join('lobby')
  
  socket.on('create', function(data) {
    io.emit('chat message', 'Socket Joined Room: ' + data)
    socket.room = data;
    socket.join(data);
  });
  
  socket.on('join', function(data) {
    io.emit('chat message', 'Socket Joined Room: ' + data)
    socket.room = data;
    socket.join(data);
  });
  
  socket.on('chat', function(data) {
    io.emit('chat message', ('Socket said: ' + data + ' in ' + socket.room));
    io.in(socket.room).emit('chat', data);
  });
  
  socket.on('global chat', function(data) {
    io.emit('chat message', ('Socket said: ' + data + ' in global chat'));
    io.in('lobby').emit('global chat', data);
  });
  
  socket.on('event', function(data) {
    io.in(socket.room).emit('event', data);
  });
  
  socket.on('move', function(data) {
    io.in(socket.room).emit('move', data);
  });
  
  socket.on('shoot', function(data) {
    io.in(socket.room).emit('shoot', data);
  });
  
  socket.on('reload', function(data) {
    io.in(socket.room).emit('reload', data);
  });
  
  socket.on('damage', function(data) {
    io.in(socket.room).emit('damage', data);
  });
  
  socket.on('change', function(data) {
    io.in(socket.room).emit('change', data);
  });
  
  socket.on('leave', function(data) {
    io.emit('chat message', ('Socket Left Room: ' + data));
    socket.leave(data);
    socket.room = 'none';
  });
  socket.on('getRoomNames', (data, callback) => {
    const roomNames = [];
    for (const id in rooms) {
      const {name} = rooms[id];
      const room = {name, id};
      roomNames.push(room);
    }

    callback(roomNames);
  });
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
