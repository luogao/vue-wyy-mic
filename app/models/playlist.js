var mongoose = require('mongoose')
var PlaylistSchema = require('../schemas/playlist')
var Playlist = mongoose.model('Playlist',PlaylistSchema)

module.exports = Playlist