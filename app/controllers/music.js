var request = require('superagent');
var cheerio = require('cheerio');
var Music = require('../models/music') //引入user 模型

exports.recommendList = function(req, res) {
	// 初始化返回对象
	var resObj = {
		code: 200,
		data: []
	};

	// 使用 superagent 访问 discover 页面
	request.get('http://music.163.com/discover')
		.end(function(err, _response) {
			if (!err) {
				// 请求成功
				var dom = _response.text;
				// 使用 cheerio 加载 dom
				var $ = cheerio.load(dom);
				// 定义我们要返回的数组
				var recommendLst = [];
				// 获得 .m-cvrlst 的 ul 元素
				$('.m-cvrlst').eq(0).find('li').each(function(index, element) {
					// 获得 a 链接
					var cvrLink = $(element).find('.u-cover').find('a');
					console.log(cvrLink.html());
					// 获得 cover 歌单封面
					var cover = $(element).find('.u-cover').find('img').attr('src');
					// 组织单个推荐歌单对象结构
					var recommendItem = {
						id: cvrLink.attr('data-res-id'),
						title: cvrLink.attr('title'),
						href: 'http://music.163.com' + cvrLink.attr('href'),
						type: cvrLink.attr('data-res-type'),
						cover: cover
					};
					// 将单个对象放在数组中
					recommendLst.push(recommendItem);
				});
				// 替换返回对象
				resObj.data = recommendLst;
			} else {
				resObj.code = 404;
				console.log('Get data error !');
			}
			// 响应数据
			res.send(resObj);
		});
}

exports.getSong = function(req, res) {
	// 获得歌单ID
	var songId = req.params.songId;
	// 定义返回对象
	var resObj = {
		code: 200,
		data: []
	};
	// 使用 superagent 访问 discover 页面
	request.get(`http://music.163.com/api/song/detail/?ids=[${songId}]`)
		.end(function(err, _response) {
			if (!err) {
				// 请求成功
				res.send(_response.text);
			} else {
				console.log('Get data error !');
			}

		});
}




exports.playlistDetail = function(req, res) {

	// 获得歌单ID
	var playlistId = req.params.playlistId;
	// 定义返回对象
	var resObj = {
		code: 200,
		data: {}
	};

	/**
	 * 使用 superagent 请求
	 * 在这里我们为什么要请求 http://music.163.com/playlist?id=${playlistId}
	 * 简友们应该还记得 网易云音乐首页的 iframe
	 * 应该还记得去打开 调试面板的 Sources 选项卡
	 * 那么就可以看到在歌单页面 iframe 到底加载了什么 url
	 */
	request.get(`http://music.163.com/playlist?id=${playlistId}`)
		.end(function(err, _response) {

			if (!err) {
				// 定义歌单对象
				var playlist = {
					id: playlistId
				};
				// 成功返回 HTML, decodeEntities 指定不把中文字符转为 unicode 字符
				// 如果不指定 decodeEntities 为 false , 例如 " 会解析为 "
				var $ = cheerio.load(_response.text, {
					decodeEntities: false
				});
				// 获得歌单 dom
				var dom = $('#m-playlist');
				// 歌单标题
				playlist.title = dom.find('.tit').text();
				// 歌单图片
				playlist.cover = dom.find('.u-cover img').attr('src');
				// 歌单拥有者
				playlist.owner = dom.find('.user').find('.name').text();
				// 创建时间
				playlist.create_time = dom.find('.user').find('.time').text();
				// 歌单被收藏数量
				playlist.collection_count = dom.find('#content-operation').find('.u-btni-fav').attr('data-count');
				// 分享数量
				playlist.share_count = dom.find('#content-operation').find('.u-btni-share').attr('data-count');
				// 评论数量
				playlist.comment_count = dom.find('#content-operation').find('#cnt_comment_count').html();
				// 标签
				playlist.tags = [];
				dom.find('.tags').eq(0).find('.u-tag').each(function(index, element) {
					playlist.tags.push($(element).text());
				});
				// 歌单描述
				playlist.desc = dom.find('#album-desc-more').html();
				// 歌曲总数量
				playlist.song_count = dom.find('#playlist-track-count').text();
				// 播放总数量
				playlist.play_count = dom.find('#play-count').text();

				resObj.data = playlist;

			} else {
				resObj.code = 404;
				console.log('Get data error!');
			}
			res.send(resObj);
		});
}

exports.getSongList = function(req, res) {
	// 获得歌单ID
	var playlistId = req.params.playlistId;
	// 定义返回对象
	var resObj = {
		code: 200,
		data: []
	};
	request.get(`http://music.163.com/api/playlist/detail?id=${playlistId}`)
		.end(function(err, _response) {

			if (!err) {
				resObj.data = JSON.parse(_response.text).result.tracks;
			} else {
				resObj.code = 404;
				console.log('Get data error!');
			}

			res.send(resObj);

		});
}

exports.getMusic = function(req, res) {
	var resObj = {
		code: 200,
		data: []
	};
	var id = req.params.musicId
	Music.findOne({
		wyyId: id
	}, function(err, music) {
		resObj.data = music
		res.send(resObj.data)
	})
}

exports.searchMusic = function(req, res) {
	var resObj = {
		code: 200,
		data: []
	}
	const keyWords = req.query.keyWords
	const type = req.query.type || 1
	const limit = req.query.limit || 10
	const offset = req.query.offset || 0
		// 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002) *(type)*
	const data = 's=' + keyWords + '&limit=' + limit + '&type=' + type + '&offset=' + offset
	request.post('http://music.163.com/api/search/pc/', data)
		.end((err, result) => {
			if (err) {
				console.log(err)
			} else {
				resObj.data = JSON.parse(result.text)
				res.send(resObj)
			}
		})
}

exports.getLyric = function(req, res) {
	// 获得歌单ID
	var songId = req.params.songId;
	// 定义返回对象
	var resObj = {
		code: '',
		data: []
	};
	// 使用 superagent 访问 discover 页面
	request.get(`http://music.163.com/api/song/media?id=${songId}`)
		.end(function(err, _response) {
			if (!err) {
				// 请求成功
				res.send(_response.text)
			} else {
				console.log('Get data error !');
			}

		});
}


exports.saveMusic = function(req, res) {
	var _music = {
		name: req.body.musicName,
		wyyId: req.body.wyyId,
		score: req.body.score,
		artistName: req.body.artistName,
		duration: req.body.duration,
		picUrl: req.body.picUrl,
		Liked: {
			isLiked: req.body.isLiked,
		}
	}
	var music = new Music(_music)
	music.save(function(err, user) {
		if (err) {
			console.log(err)
		}
		console.log('music save success')
	})
	console.log(_music)
}

exports.getSave = function(req, res) {
	res.send('hello world !!!!')
}