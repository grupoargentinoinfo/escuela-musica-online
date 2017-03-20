var express = require('express');
var Twig = require('twig'); // Twig module

/*var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};*/

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
    
    
    // Login
    router.get('/', function(req, res) {
      res.render('index.html.twig', { message: req.flash('message') });
    });
    

    /* Handle Login POST */
  	router.post('/login', passport.authenticate('login', {
  		successRedirect: '/home',
  		failureRedirect: '/',
  		badRequestMessage : 'Missing username or password.',
  		failureFlash : true  
  	}));
  	
  	/* Devuelve un json con el mensaje de respuesta del middleware */
  	/*
  	router.post('/login', function(req, res, next ){
      passport.authenticate('login', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) { return res.json( { message: info.message }) }
        res.json(user);
      })(req, res, next);   
    });*/
  
  	/* GET Registration Page */
  	router.get('/signup-:tipoUsuario', function(req, res){
  	  var tipo = null;
  	  if(req.params.tipoUsuario === 'alumno' || req.params.tipoUsuario === 'docente'){
  	    tipo = req.params.tipoUsuario
  	  }else{
  	    res.redirect('/');
  	  }
  	  
  		res.render('register.html.twig',{tipo: tipo, message: req.flash('message')});
  	});
  
  	/* Handle Registration POST */
  	router.post('/signup', passport.authenticate('signup', {
  		successRedirect: '/home',
  		failureRedirect: '/signup',
  		failureFlash : true  
  	}));
  
  	/* GET Home Page */
  	router.get('/home', isAuthenticated, function(req, res){
  		res.render('home.html.twig', { user: req.user });
  	});
  
  	/* Handle Logout */
  	router.get('/signout', function(req, res) {
  		req.logout();
  		res.redirect('/');
  	});
  
	return router;
};
