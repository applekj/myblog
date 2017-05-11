var Mongolass = require('mongolass');
var mongolass = new Mongolass();

mongolass.connect('mongodb://localhost:27017/myblog');

var Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});

var a = {};
a.author = '58f31d0f039b160dd09f5df0';

Post.find(a).then(function(result){
	console.log(result);
});