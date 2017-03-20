var app = require("../bin/www.js");
describe('homepage', function(){
  it('should respond to GET',function(done){
    app
      .get('http://'+process.env.IP+':'+process.env.PORT)
      .end(function(res){
        expect(res.status).to.equal(200);
        done();
    })
  })
});

describe('login', function(){
  it('should respond to GET',function(done){
    app
      .post('http://'+process.env.IP+':'+process.env.PORT+'/login')
      .end(function(res){
        expect(res.status).to.equal(200);
        done();
    })
  })
});