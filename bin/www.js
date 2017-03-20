// var debug = require('debug')('passport-mongo');
var debug = require('debug');
var http = require('http');
var express = require('express');
var app = require('../app');
var router = express();
var fs = require('fs');
/* Este es el peerjs server del branch michelle-express-rewrite github*/
var ExpressPeerServer = require('peerjs-server').ExpressPeerServer;

/* Este es el peerjs server de branch master desde el package.json npm*/
// var ExpressPeerServer = require('peer').ExpressPeerServer;

app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "0.0.0.0");


var server = http.createServer(app);


/* Streaming */
var options = {
	debug: true,
	allow_discovery: true
	// ssl: {
	//     key: fs.readFileSync('private.key'),
	//     cert: fs.readFileSync('certificate.crt')

	// },
};

/* URL del servidor */
var peerServer = ExpressPeerServer(server, options)
app.use('/peer', peerServer);



peerServer.on('connection', function(id) {
    // # we get a socket object as id :( 
    // # should be a string
    console.log(id)
});

peerServer.on('disconnect', function(id) { console.log(id + "deconnected") });


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   var addr = server.address();
   console.log("Chat server listening at", addr.address + ":" + addr.port);
 });


exports.server = server;
