/* Streaming */
// Socket.io y asincronismo
var async = require('async');
var socketio = require('socket.io');

var messages = [];
var sockets = [];

module.exports = function(io) {
  var module = {};
  
  module.init = function(){
    io.sockets.on('connection', function (socket){

  	function log(){
  		var array = [">>> "];
  	  for (var i = 0; i < arguments.length; i++) {
  	  	array.push(arguments[i]);
  	  }
  	    socket.emit('log', array);
  	}
  
  	socket.on('message', function (message) {
  		log('Got message: ', message);
  		socket.broadcast.emit('message', message); // should be room only
  	});
  
  	socket.on('create or join', function (room) {
  		//var numClients = io.sockets.clients(room).length;
      var numClients = io.sockets.adapter.rooms[room]!=undefined ? Object.keys(io.sockets.adapter.rooms[room]).length:0;
      
  		log('Room ' + room + ' has ' + numClients + ' client(s)');
  		log('Request to create or join room', room);
  
  		if (numClients == 0){
  			socket.join(room);
  			socket.emit('created', room);
  		} else if (numClients == 1) {
  			io.sockets.in(room).emit('join', room);
  			socket.join(room);
  			socket.emit('joined', room);
  		} else { // max two clients
  			socket.emit('full', room);
  		}
  		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
  		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
  
  	});
  
  });
    
  }
  
  return module;

}
