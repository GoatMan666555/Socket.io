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
// In this example, when the "move" function has been called, send data from the function to all clients

io.on('connection', function(socket) {
  io.emit('chat message', 'New Socket Connected.')
  socket.room = 'none';
  
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
    let rooms = socket.rooms;
    rooms.forEach(element => socket.leave(element));
    socket.room = 'none';
  });
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
