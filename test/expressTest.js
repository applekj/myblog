var express = require('express');
var app = express();

app.get('/',function(req,res){
	console.log(res.headersSent);
	res.send('ok');
	console.log(res.headersSent);
});

app.listen('3000',function(){
	console.log('3000端口正在被监听');
});