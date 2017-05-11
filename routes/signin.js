var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');
var crypto = require('crypto');

router.get('/',checkNotLogin,function(req,res,next){
	res.render('signin');
});

router.post('/',checkNotLogin,function(req,res,next){
  var name = req.fields.name;
  var password = req.fields.password;

  UserModel.getUserByName(name)
    .then(function(user){
    	if(!user){
    		req.flash('error','用户不存在');
    		return res.redirect('back');
    	}
    	//检查密码是否匹配
    	if(crypto.createHash('sha1').update(password).digest('hex') !== user.password){
         req.flash('error','密码不匹配');
         return res.redirect('back');
    	}
    	req.flash('success','登录成功');
    	delete user.password;
    	req.session.user = user;
    	res.redirect('/posts');
    })
    .catch(next);
});

module.exports = router;