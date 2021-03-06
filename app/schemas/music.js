var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MusicSchema = new mongoose.Schema({
	name: String,
	wyyId: Number,
	picUrl: String,
	score: Number,
	duration: Number,
	artistName: String,
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


MusicSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

MusicSchema.statics = {
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

module.exports = MusicSchema