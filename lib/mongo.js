var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

mongolass.connect(config.mongodb);

//设置模版骨架
exports.User = mongolass.model('User',{
	name:{type:'string'},
	password:{type:'string'},
	avatar:{type:'string'},
	gender:{type:'string',enum:['m','f','x']},
	bio:{type:'string'}
});

//设置文章模版骨架
exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});

//设置留言模版骨架
exports.Comment = mongolass.model('Comment',{
	author:{type:Mongolass.Types.ObjectId},
	content:{type:'string'},
	postId:{type:Mongolass.Types.ObjectId}
});

exports.Comment.index({postId:1,_id:1}).exec();
exports.Comment.index({author:1,_id:1}).exec();

//降序查看用户文章列表
exports.Post.index({author:1,_id:-1}).exec();

//根据用户名找到用户，用户名全局唯一
exports.User.index({name:1},{unique:true}).exec();

//根据id生成创建时间
mongolass.plugin('addCreatedAt',{
	afterFind:function(results){
		results.forEach(function (item){
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		});
		return results;
	},
	afterFindOne:function(result){
		if(result){
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
		}
		return result;
	}
});
