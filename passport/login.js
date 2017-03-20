var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var debug = require("debug");
var mysql      = require('mysql');

module.exports = function(passport, connection){
	passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {// callback with email and password from our form
  
      var connection = mysql.createConnection({
        host     : 'sql10.freesqldatabase.com',
        user     : 'sql10155556',
        password : 'AP3eubDeby',
        database : 'sql10155556'
      });
      
      connection.connect();
      
      connection.query("SELECT * FROM `Usuarios` WHERE `username` = '" + username + "'",function(err,rows){
  			if (err) return done(err);
  			
  			if (!rows.length) {
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        } 
  			
  			// if the user is found but the password is wrong
        if (!( rows[0].password == password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
  			
  		  // all is well, return successful user
        return done(null, rows[0]);			
      });
      
      connection.end();
    }));

};