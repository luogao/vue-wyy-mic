var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var PlaylistSchema = new mongoose.Schema({
	wyyId: Number,
	playlistCover: String,
	playlistName: String,
	Liked: {
		isLiked: Boolean,
		likedInfo: [{
			likedBy: {
				type: ObjectId,
				ref: 'User'
			},
			likedCount: String,
		}]
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})


PlaylistSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

PlaylistSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	}
}

module.exports = PlaylistSchema