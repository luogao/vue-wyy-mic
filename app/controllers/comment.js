var Comment = require('../models/comment')

exports.save = function(req, res) {
	var _comment = {
		content: req.body.content,
		from: req.body.from,
		playlistId: req.body.playlistId,
		commentId: req.body.commentId
	}

	if (_comment.commentId) {
		Comment.findById(_comment.commentId, function(err, comment) {
			var reply = {
				from: req.body.fromId,
				to: req.body.toId,
				content: req.body.replyContent
			}
			comment.reply.push(reply)
			comment.save(function(err, comment) {
				if (err) {
					console.log(err)
				} else {
					console.log(comment)
				}
			})
		})
	} else {
		var comment = new Comment(_comment);

		comment.save(function(err, comment) {
			if (err) {
				console.log(err)
			} else {
				console.log(comment)
			}
		})
	}
}

exports.commentFinder = function(req, res) {
	var resObj = {
		code: 200,
		data: []
	};
	var _id = req.params.id
	Comment
		.find({
			playlistId: _id
		})
		.populate('from', 'nickName')
		.populate('reply.from reply.to', 'nickName')
		.exec(function(err, comments) {
			resObj.data = comments
			res.send(resObj)
		})
}