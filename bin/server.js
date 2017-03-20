var express = require('express');
var app = require('../app');
// var app = express();

app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "0.0.0.0");

app.get('/', function(req, res, next) {
    console.log("get /")
    res.send('INDEX');
});


/* Servidor node.js */
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   console.log("Chat server start");
 });
//app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");
// app.listen(process.env.PORT || 3000);