var express = require('express');
var router = express.Router();
var cors = require('express-cors')
 
 /*https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913*/

express.use(cors({
    allowedOrigins: [
        'computeengineondemand.appspot.com', '*.appspot.com'
    ]
}))
// TWIG
var Twig = require('twig'), // Twig module
    twig = Twig.twig;       // Render function


//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


// Define the home page route
// router.get('/', function(req, res) {
//   res.send('home page');
// });

// Define the about route
router.get('/about', function(req, res) {
  res.send('About us');
});

router.get('/login', function(req, res){
  res.render('index.html.twig', {
    message : "Hello World"
  });
});

module.exports = router;