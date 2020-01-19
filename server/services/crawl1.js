var Crawler = require("crawler");
const dbUtils = require('./../utils/db-util')
var URL = 'https://m.slodm.com'
var BOX = {}
var Count = 0
var Total = 0
var c = new Crawler({
	rotateUA: true,
	userAgent: [
		"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
		"Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Mobile Safari/537.36",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
	],
	// 两次请求之间将闲置1000ms
	rateLimit: 1000,
	// 在每个请求处理完毕后将调用此回调函数
	callback: function(error, res, done) {
		if (error) {
			console.log(error);
		} else {
			var $ = res.$;
			// $ 默认为 Cheerio 解析器
			// 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素
			console.log(res.options.type)
			if (res.options.type === 'list') {
				let list = $('#con_zanpiantv_1 li>a')
				let strong = $('.ui-pages strong').text()
				strong = strong.split('/')
				let next = URL + $('.next.pagegbk').attr('href') || ''
				if (strong[0] === strong[1]) {
					next = ''
				}
				let listBox = []
				Total = list.length
				for (let i = 0; i < list.length; i++) {
					let title = list.eq(i).attr('title')
					let id = list.eq(i).attr('href').split('/')
					if (list[i].attribs && list[i].attribs.href) {
						listBox.push({
							uri: URL + list[i].attribs.href,
							type: 'info',
							title: title,
							next: next,
							id: id[id.length - 2]
						})
					}
				}
				// console.log(listBox)
				// 将多个URL加入请求队列
				c.queue(listBox)
			} else if (res.options.type === 'info') {
				let urlList = $(".plau-ul-list a").eq(0)
				let list = []
				let title = $('.vod-n-l>h1').text()
				let image = $(".vod-n-img>img").attr('src')
				let actor_a = $(".vod-n-l>p").eq(2).find('a')
				let actor = []
				for (let i = 0; i < actor_a.length; i++) {
					actor.push(actor_a.eq(i).text())
				}
				let video_quality = $(".vod-n-l>p").eq(1).text()
				let video_type = $(".vod-n-l>p").eq(3).text()
				let video_time = $(".vod-n-l>p").eq(0).text()
				if (urlList && urlList.attr('href')) {
					list.push({
						uri: URL + urlList.attr('href'),
						type: 'js',
						title: title,
						id: res.options.id,
						image: image,
						actor: actor.join(','),
						video_type: video_type.split('：')[1],
						video_quality: video_quality.split('：')[1],
						video_time: video_time.split('：')[1],
						next: res.options.next
					})
				}
				// console.log(list)
				// 将多个URL加入请求队列
				c.queue(list)
			} else if(res.options.type === 'js') {
				let urlText = $('.play').html()
				let jsUrl = urlText.match(/src="(\S*)">/)[1]
				let obj = {
					uri: URL + jsUrl,
					type: 'video',
					title: res.options.title,
					id: res.options.id,
					image: res.options.image,
					actor: res.options.actor,
					video_type: res.options.video_type,
					video_quality: res.options.video_quality,
					video_time: res.options.video_time,
					next: res.options.next
				}
				// console.log(obj)
				c.queue(obj)
			} else if (res.options.type === 'video') {
					Count++
					try{
						let videoUrl = res.body.match(/VideoListJson=(\S*),urlinfo/)
						if (videoUrl && videoUrl[1]) {
							videoUrl = JSON.parse(videoUrl[1].replace(/'/g, '"'))
						} else {
							return false
						}
						var urlList = []
						for(let i = 0; i<videoUrl.length; i++){
							let listTab = {
								title: videoUrl[i][0],
								list: []
							}
							for (let k=0; k<videoUrl[i][1].length; k++) {
								if(videoUrl[i][1][k].indexOf('$') > -1){
									let info = videoUrl[i][1][k].split('$')
									let list = {
										name: info[0],
										url: info[1]
									}
									listTab.list.push(list)
								}
							}
							urlList.push(listTab)
						}
						if(Count === Total && res.options.next){
							Count = 0
							Total = 0
							c.queue({
								uri: res.options.next,
								type: 'list'
							})
						}
						// console.log(JSON.stringify(urlList))
						let obj = {}
						obj.type = 2
						obj.title = res.options.title
						obj.web_id = res.options.id
						obj.image = res.options.image
						obj.actor = res.options.actor
						obj.video = JSON.stringify(urlList)
						obj.video_quality = res.options.video_quality
						obj.video_type = res.options.video_type
						obj.video_time = res.options.video_time
						console.log('完成一部', Count)
						dbUtils.insertData('video', obj).then(result => {
							console.log('写入成功')
						}).catch((error) => {
							console.log('写入失败')
							console.log(error)
						})
					}catch(e){
						//TODO handle the exception
						console.log(e, '失败')
						return
					}
			}
		}
		done();
	}
});

// 将一个URL加入请求队列，并使用默认回调函数
c.queue({
	uri: URL + '/dianying/zhubo/',
	type: 'list'
});

// 对单个URL使用特定的处理参数并指定单独的回调函数
// c.queue([{
//     uri: 'http://parishackers.org/',
//     jQuery: false,
//     // The global callback won't be called
//     callback: function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             console.log('Grabbed', res.body.length, 'bytes');
//         }
//         done();
//     }
// }]);

// 将一段HTML代码加入请求队列，即不通过抓取，直接交由回调函数处理（可用于单元测试）
// c.queue([{
//     html: '<p>This is a <strong>test</strong></p>'
// }]);
