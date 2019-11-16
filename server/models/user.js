const config = require('./../../config')
const dbUtils = require('./../utils/db-util')
const https = require('https');
const querystring = require("querystring");

const user = {
	async findToken (openid) {
		let _sql = `
		    SELECT * from login
		      where openid="${openid}"
		      limit 1`
		return await dbUtils.query(_sql)
	},
	wxLogin(code) {
		return new Promise((resolve, reject) => {
			//这是需要提交的数据  
			var data = {
				appid: config.AppId,
				secret: config.AppSecret,
				js_code: code,
				grant_type: 'authorization_code'
			};
			var content = querystring.stringify(data);
			var options = {
				hostname: 'api.weixin.qq.com',
				port: 443,
				path: '/sns/jscode2session?' + content,
				method: 'GET'
			};
			var req = https.request(options, (res) => {
				res.setEncoding('utf8')
				res.on('data', function(chunk) {
					typeof(chunk) === 'string' ? chunk = JSON.parse(chunk) : ''
					if (chunk.errcode) {
						reject('获取openid失败')
					} else {
						user.findToken('123').then(data => {
							console.log(data);
						})
						resolve(chunk)
					}
				});
			});

			req.on('error', function(err) {
				reject({
					code: 1,
					data: '',
					message: '操作失败'
				})
			});

			req.end()
		})
	}
}


module.exports = user
