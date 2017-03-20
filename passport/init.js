var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');

module.exports = function(passport, connection){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        /*User.findById(id, connection, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });*/
        var mysql      = require('mysql');
        var connection = mysql.createConnection({
            host     : 'sql10.freesqldatabase.com',
            user     : 'sql10155556',
            password : 'AP3eubDeby',
            database : 'sql10155556'
          });
        
        connection.connect();
        
        connection.query("select * from Usuarios where id = "+id,function(err,rows){	
			done(err, rows[0]);
		});
		
		connection.end();
		
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}