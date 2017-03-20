/* Streaming */
// Socket.io y asincronismo
var async = require('async');
var socketio = require('socket.io');

var messages = [];
var sockets = [];

module.exports = function(io) {
  var module = {};
  
  module.init = function(){
    io.on('connection', function (socket) {
      var address = socket.handshake.address;
      console.log('New connection from ' + address);
        // convenience function to log server messages on the client
      function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
      }
    
      socket.on('message', function(message) {
        log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit('message', message);
      });
    
      socket.on('create or join', function(room) {
        log('Received request to create or join room ' + room);
    
        //var clientsInRoom = io.nsps['/'];
        //var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom).length
        // socket.io 1.4.8
        //var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
        
        //Las habitaciones creadas se borran y quedan solamente los usuarios conectados
        
        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom).length;
        
        
        log('Room ' + room + ' now has ' + (numClients) + ' client(s)');
        
        //No hay usuarios
        if (numClients === 0) {
          socket.join(room);
          log('Client ID ' + socket.id + ' created room ' + room);
          socket.emit('created', room, socket.id);
        
        } else if (numClients === 1) {
          //ya habia un usuario
          log('Client ID ' + socket.id + ' joined room ' + room); // Mensaje a la consola del usuario
          socket.broadcast.in(room).emit('join', room);
          //io.sockets.in(room).emit('join', room); // Envia un mensaje a todos
          socket.join(room); // Conecta al usuario a la habitacion/room
          socket.emit('joined', room, socket.id); // Envia un mensaje joined al usuario
          socket.broadcast.in(room).emit('ready');
          //io.sockets.in(room).emit('ready'); // Envia mensaje ready
        }else{
          // Está lleno max 2
          socket.emit('full', room);
          return;
        }
      });
    
        socket.on('identify', function (name) {
          socket.set('name', String(name || 'Anonymous'), function (err) {
            updateRoster();
          });
        });
        
        socket.on('ipaddr', function() {
          var ifaces = os.networkInterfaces();
          for (var dev in ifaces) {
            ifaces[dev].forEach(function(details) {
              if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                socket.emit('ipaddr', details.address);
              }
            });
          }
        });
      
      /*socket.on('disconnect', function() {
       // this returns a list of all rooms this user is in
       var rooms = io.sockets.manager.roomClients[socket.id];
       for(var room in rooms) {
           socket.leave(room);
      }
    });*/
      
    });
    
    function updateRoster() {
      async.map(
        sockets,
        function (socket, callback) {
          socket.get('name', callback);
        },
        function (err, names) {
          broadcast('roster', names);
        }
      );
    }
    
    function broadcast(event, data) {
      sockets.forEach(function (socket) {
        socket.emit(event, data);
      });
    }
  }
  
  return module;

}
