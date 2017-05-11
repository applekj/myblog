var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var path = require('path');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

var router = require('./routes/index');

app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static('./public'));

app.use(session({
  name:config.session.key,//设置cookie中保存session id的字段名称
  secret:config.session.secret,//设置保存在cookie中的name的hash计算密钥
  resave:true,//强制更新session
  saveUninitialized: false,//强制创建session，即使没有登录
  cookie:{
  	maxAge:config.session.maxAge
  },
  store:new MongoStore({
  	url:config.mongodb
  })
}));

app.use(flash());

app.use(require('express-formidable')({
  uploadDir:path.join(__dirname,'public/img'),
  keepExtensions:true//保留后缀
}));

app.locals.blog = {
	title:pkg.name,
	description:pkg.description
};

app.use(function(req,res,next){
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});

//记录正常请求的日志
app.use(expressWinston.logger({
  transports:[
    new (winston.transports.Console)({
      colorize:true
    }),
    new winston.transports.File({
      filename:'logs/success.log'
    })
  ]
}));

router(app);

//记录错误请求的日志
app.use(expressWinston.errorLogger({
  transports:[
    new winston.transports.Console({
      json:true,
      colorize:true
    }),
    new winston.transports.File({
      filename:'logs/error.log'
    })
  ]
}));

app.use(function(err,req,res,next){
  res.render('error',{
    error:err
  });
});

app.listen(config.port,function(){
  console.log(`${pkg.name} listening on port ${config.port}`);
});