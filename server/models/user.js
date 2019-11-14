const config = require('./../../config')
const dbUtils = require('./../utils/db-util')
const https = require('https');
const querystring = require("querystring");

const user = {
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
					resolve(chunk)
				});
			});

			req.on('error', function(err) {
				reject(err)
			});

			req.end()
		})
	}
}


module.exports = user
