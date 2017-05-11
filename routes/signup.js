var fs = require('fs');
var express = require('express');
var path = require('path');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');
var crypto = require('crypto');

router.get('/',checkNotLogin,function(req,res,next){
	res.render('signup');
});

router.post('/',checkNotLogin,function(req,res,next){
  var name = req.fields.name;
  var password = req.fields.password;
  var gender = req.fields.gender;
  var repassword = req.fields.repassword;
  var avatar = req.files.avatar.path.split(path.sep).pop();
  var bio = req.fields.bio;

  try{
    if(!(name.length>=1&&name.length<=10)){
  	  throw new Error('名字请限制在1-10个字符');
	  }
	  if(['m','f','x'].indexOf(gender)===-1){
	  	throw new Error('性别只能是m、f、x');
	  }
	  if(!(bio.length>=1&&bio.length<=30)){
	  	throw new Error('个人简介限制在30个字符内');
	  }
	  if(password.length < 6){
	  	throw new Error('密码至少6个字符');
	  }
	  if(password !== repassword){
	  	throw new Error('两次输入密码不一致');
	  }
	  if(!req.files.avatar.name){
	  	throw new Error('缺少头像');
	  }
  }catch(e){
    fs.unlink(req.files.avatar.name);
    req.flash('error',e.message);
    return res.redirect('/signup');
  }

  password = crypto.createHash('sha1').update(password).digest('hex');

  var user = {
  	name:name,
  	password:password,
  	gender:gender,
  	bio:bio,
  	avatar:avatar
  };

  UserModel.create(user)
    .then(function(result){
    	user = result.ops[0];
    	delete user.password;
    	req.session.user = user;
    	req.flash('success','注册成功');
    	res.redirect('/posts');
    })
    .catch(function(e){
    	fs.unlink(req.files.avatar.path);
    	if(e.message.match('E11000 duplicate key')){//判断用户名被占用
    		req.flash('error','用户名被占用');
    		return res.redirect('/signup');
    	}
    	next(e);
    });
	/*var password = crypto.createHash('sha1').update('yanjie1226').digest('hex');
	var user = {
		name:'yanjie',
		password:password,
		gender: 'm',
		bio:'haha',
		avatar:'nimabi'
	};
	UserModel.create(user);*/
});

module.exports = router;