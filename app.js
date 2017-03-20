var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debugMiddleware = require('debug-middleware');


/* Configuracion node.js */

//var dbConfig = require('./db');

//var mongoose = require('mongoose')
/*Connect to DB*/
//mongoose.connect(dbConfig.url);

var app = express(); //var router = express();

/*Creación del servidor*/
var os = require('os');
var http = require('http');
var path = require('path');
var fs = require('fs');




/*view engine setup*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('view engine', 'twig');

/*This section is optional and used to configure twig. */
app.set("twig options", {
    strict_variables: false
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

/* Colocando contenido en publico de las carpetas public y client */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'client')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);


var routes = require('./routes/index')(passport);
app.use('/', routes);

var routesUsers = require('./routes/users')(passport);
app.use('/users', routesUsers);

app.on('listening', function() {
  debugMiddleware.debug(app);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html.twig', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;