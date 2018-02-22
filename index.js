// 初始化 express
var app = require('express')();
var express = require('express')
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');
var dbUrl = 'mongodb://103.202.94.6:27017/wyy-mic'
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8099');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};

mongoose.Promise = global.Promise
mongoose.connect(dbUrl)

app.locals.moment = require('moment') // .........检测数据库连接是否正常
app.use(allowCrossDomain);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

mongoose.connection.on('connected', function() {
    console.log('Connection success!');
});
mongoose.connection.on('error', function(err) {
    console.log('Connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Connection disconnected');
});

require('./config/routers')(app)
    /**
     * 开启express服务,监听本机3011端口
     * 第二个参数是开启成功后的回调函数
     */
var server = app.listen(3011, function() {
    // 如果 express 开启成功,则会执行这个方法
    var port = server.address().port;

    console.log(`Express app listening at http://localhost:${port}`);
});