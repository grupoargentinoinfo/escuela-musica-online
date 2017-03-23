var express = require('express');
var Twig = require('twig'); // Twig module

var auth = require("../controllers/authenticated.js");

var isAuthenticated = auth.isAuthenticated();

module.exports = function(passport){
    var router = express.Router();
    
    // TWIG
    var  twig = Twig.twig;       // Render function
        
    //Middle ware that is specific to this router
    router.use(function timeLog(req, res, next) {
      console.log(req.method +' '+ req.url);
      console.log('Time: ', Date.now());
      next();
    });
    
    
    // Aula
    router.get('/stream/aula/:room', function(req, res) {
      res.render('stream/index.html.twig', 
        { 
          message: req.flash('message'),
          room: req.params.room
        });
    });


    // PeerJs Servidor propio con autenticación entrar!
    router.get('/stream', isAuthenticated, function(req, res) {
      res.render('stream/peerjs.html.twig', { user: req.user });
    });

    // PeerJs NO ANDA
    router.get('/chat', function(req, res) {
      res.render('stream/simple-peerjs.html.twig');
    });
    
  
	return router;
};
