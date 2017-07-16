var Index = require('../app/controllers/index')
var Music = require('../app/controllers/music')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')


module.exports = function(app) {
    app.get('/', Index.index);

    app.get('/recommendList', Music.recommendList); // 定义根据歌单id获得歌单详细信息的API

    app.get('/playlist/:playlistId', Music.playlistDetail); // 定义根据歌单id获得歌单所有歌曲列表的API

    app.get('/song_list/:playlistId', Music.getSongList); // express 开放 /song API

    app.get('/song/:songId', Music.getSong); // user signup

    app.get('/user/signup', User.getSignup);

    app.post('/user/signup', User.postSignup)

    app.get('/user/userlist', User.list);

    app.get('/user/login', User.getLogin); // user login

    app.post('/user/login', User.postLogin)

    app.get('/user/userInfo/:id', User.userInfo)

    app.post('/user/addFav/:id', User.addFav)

    app.delete('/user/userlist', User.deleteUser)
        //Comment
    app.get('/user/comment/:id', Comment.commentFinder)

    app.post('/user/comment', Comment.save)

    app.get('/music/sMusic/:musicId', Music.getMusic)

    app.get('/musiclist/save', Music.getSave)

    app.post('/musiclist/save', Music.saveMusic)

    app.get('/music/searchResult', Music.searchMusic)

    app.get('/music/getLyric/:songId', Music.getLyric)

    app.post('/user/userInfo/updateInfo/:id', User.updateUser)

    app.get('/user/userInfo/updateInfo/:id', User.getUserAfterUpdate)
}