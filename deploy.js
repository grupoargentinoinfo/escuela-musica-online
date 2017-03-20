var deploy = require('heroku-deploy-tarball');
 
var config = {
  app: 'arcane-temple-42667',
  tarball: 'coturn_4.2.1.2.orig.tar.gz'
}
 
deploy(config);