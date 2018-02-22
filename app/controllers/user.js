var User = require('../models/user') //引入user 模型

// user signup
exports.getSignup = function(req, res, next) {
    res.send();
}

exports.postSignup = function(req, res) {
    var errMsg = {
        data: '',
    }

    var _user = {
        name: req.body.name,
        nickName: req.body.nickName,
        password: req.body.password,
        role: 0,
    }
    User.findOne({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err)
            return false
        }
        if (user) {
            errMsg.data = 'repeat'
            res.send(errMsg.data)
            return false
        } else {
            var user = new User(_user)
            user.save(function(err, user) {
                if (err) {
                    console.log(err)
                }
                console.log(_user)
            })
            errMsg.data = 'success'
            res.send(errMsg.data)
        }
    })
}

//user list
exports.list = function(req, res) {
    var resObj = {
        code: 200,
        data: []
    };

    User.fetch(function(err, users) {
        if (err) {
            console.log(err)
        }
        resObj.data = users
        res.send(resObj)
    })
}

exports.deleteUser = function(req, res, next) {
    var id = req.query._id
    if (id) {
        User.remove({
            _id: id
        }, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                res.send("success");
            }
        });
    }
}

exports.updateUser = function(req, res, next) {
    var id = req.query._id
    var whereData = {
        '_id': '5900ba427545fe0ba7ca8f17'
    }
    var whereUpdate = {
        $set: {
            'role': 10
        }
    }
    User.update(whereData, whereUpdate, function(err, user) {
        if (err) {
            console.log(err)
        } else {
            console.log(user)
        }
    })
}

exports.getUserAfterUpdate = function(req, res) {
    res.send('success')
}

// user login
exports.getLogin = function(req, res, next) {
    res.send();
}

exports.postLogin = function(req, res) {
    var loginMsg = {
        data: '',
        inSession: '',
        _user: null,
    }
    var _user = {
        name: req.body.name,
        password: req.body.password
    }
    var name = _user.name
    var password = _user.password

    User.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            loginMsg.data = 'user not exist !'
            loginMsg.inSession = 'false'
            res.send(loginMsg)
            return false
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                loginMsg.data = 'success'
                loginMsg.inSession = 'true'
                loginMsg._user = user
                res.send(loginMsg)
            } else {
                loginMsg.data = 'wrong password'
                loginMsg.inSession = 'false'
                res.send(loginMsg)
            }
        })
    })
}

exports.userInfo = function(req, res) {
    var resObj = {
        code: 200,
        data: []
    };
    var _id = req.params.id
    User.findById(_id, function(err, user) {
        resObj.data = user
        res.send(resObj)
    })
}



exports.addFav = function(req, res) {
    if (req.body.musicId) {
        var favMusic = {
            userId: req.body.userId,
            musicId: req.body.musicId,
            musicName: req.body.musicName,
        }
        User.findById(favMusic.userId, function(err, user) {
            user.favMusic.push(favMusic)
            user.save(function(err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('success')
                }
            })
        })
    } else {
        var favPlayList = {
            userId: req.body.userId,
            playlistId: req.body.playlistId,
            playlistName: req.body.playlistName,
            playlistCover: req.body.playlistCover,
        }
        var resObj = {
            code: 200,
            data: []
        };

        User.findById(favPlayList.userId, function(err, user) {
            user.favPlayList.push(favPlayList)
            user.save(function(err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    var _id = favPlayList.userId
                    User.findById(_id, function(err, user) {
                        resObj.data = user
                        res.send(resObj)
                        console.log('success')
                    })
                }
            })
        })
    }
}


var cacheFolder = 'public/images/uploadcache/';
exports.upload = function(req, res) {
    var currentUser = req.session.user;
    var userDirPath = cacheFolder + currentUser.id;
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        switch (files.upload.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
            res.send({
                code: 202,
                msg: '只支持png和jpg格式图片'
            });
            return;
        } else {
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            displayUrl = UPLOAD_FOLDER + currentUser.id + avatarName;
            fs.renameSync(files.upload.path, newPath); //重命名
            res.send({
                code: 200,
                msg: displayUrl
            });
        }
    });
};