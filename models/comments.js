var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml',{
	afterFind:function(comments){
		return comments.map(function(comment){
			comment.content = marked(comment.content);
			return comment;
		});
	}
});

module.exports = {
	create:function create(comment){
		return Comment.create(comment).exec();
	},

	//通过用户id和留言id删除一个留言
	delCommentById:function delCommentById(commentId,author){
		return Comment.remove({author:author,_id:commentId}).exec();
	},

	//通过文章id删除该文章下所有的留言
	delCommentsByPostId:function delCommentsByPostId(postId){
		return Comment.remove({postId:postId}).exec();
	},

	//通过文章id获取该文章下所有留言，按留言创建时间升序
	getComments:function getComments(postId){
		return Comment
		  .find({postId:postId})
		  .populate({path:'author',model:'User'})
		  .sort({_id:1})
		  .addCreatedAt()
		  .contentToHtml()
		  .exec();
	},

	//通过文章id获取该文章下留言数
	getCommentsCount:function getCommentsCount(postId){
		return Comment.count({postId:postId}).exec();
	}
};