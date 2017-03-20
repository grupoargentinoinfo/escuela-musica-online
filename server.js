//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//

var os = require('os');
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));



router.use(express.static('public'));

//Routes
router.use(require('./routes'));  //http://127.0.0.1:8000/    http://127.0.0.1:8000/about



var options = {
  ssl: {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt')

  }
};

app.use('/peerjs', ExpressPeerServer(server, options));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   var addr = server.address();
   console.log("Chat server listening at", addr.address + ":" + addr.port);
 });
