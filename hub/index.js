
var express = require('express');
var app = express();
var scanner = require('./lib/scanner')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

//
app.use(express.static('client'));

io.on('connection', function(socket) {
  socket.emit('found', scanner.get());

  scanner.on('found', function(service) {
    socket.emit('found', [service]);
  });

  scanner.on('lost', function(service) {
    socket.emit('lost', [service]);
  });
});
