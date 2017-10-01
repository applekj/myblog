var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../index');
var User = require('../lib/mongo').User;

var testName1 = 'testName1';
var testName2 = 'yanjingjie';
describe('signup',function(){
	describe('POST /signup',function(){
		var agent = request.agent(app);
		beforeEach(function (done){
			User.create({
				name:testName1,
				password:'123456',
				avatar:'',
				gender:'x',
				bio:''
			})
			.exec()
			.then(function (){
				done();
			})
			.catch(done);
		});

		afterEach(function (done){
			User.remove({name:{$in:[testName1,testName2]}})
			  .exec()
			  .then(function (){
			  	done();
			  })
			  .catch(done);
		});

		it('wrong name',function(done){
			agent.post('/signup')
			  .type('form')
			  .attach('avatar',path.join(__dirname,'avatar.png'))
			  .field({name:''})
			  .redirects()
			  .end(function(err,res){
			  	if (err) return done(err);
          //console.log(res.text);
			  	assert(res.text.match(/名字请限制在1-10个字符/));
			  	done();
			  });
		});

		it('wrong gender', function(done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: testName2, gender: 'a' })
        .redirects()
        .end(function(err, res) {
        	console.log(path.join(__dirname, 'avatar.png'));
          if (err) return done(err);
          assert(res.text.match(/性别只能是m、f、x/));
          done();
        });
    });
	});
});