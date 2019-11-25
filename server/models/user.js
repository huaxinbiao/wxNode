const config = require('./../../config')
const dbUtils = require('./../utils/db-util')
const Token =  require('./../utils/jwt')
const https = require('https')
const querystring = require("querystring")
const crypto = require("crypto")  //加密
var WXBizDataCrypt = require('./../utils/WXBizDataCrypt')

const user = {
	async findToken (openid) {
		return await dbUtils.findDataByOneId('login', 'openid', openid)
	},
	/*
	 * 路由token验证
	 */
	verifToken(token) {
		return new Promise((resolve, reject) => {
			var _sql = 'SELECT * FROM `login` WHERE `token` = "' + token + '"'
			dbUtils.query(_sql).then(data => {
				if (Array.isArray(data) && data.length > 0) {
					resolve(data)
				}else {
					resolve(false)
				}
			}).catch((err) => {
				console.log(err)
				reject(false)
			})
		})
	},
	wxLogin(code) {
		// 小程序获取openid
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
						user.findToken(chunk.openid).then(data => {
							// var token = crypto.createHash("sha256").update(chunk.openid + new Date().getTime() + 'node_token').digest('hex');
							if (Array.isArray(data) && data.length > 0) {
								dbUtils.updateData('login', {
									session_key: chunk.session_key,
									// token: token
								}, data[0].id).then(result => {
									resolve({
										openid: chunk.openid,
										// token: token
									})
								})
							}else {
								dbUtils.insertData('login', {
									session_key: chunk.session_key,
									openid: chunk.openid,
									// token: token
								}).then(result => {
									resolve({
										openid: chunk.openid,
										// token: token
									})
								})
							}
						}).catch(() => {
							reject('获取openid失败')
						})
					}
				});
			});

			req.on('error', function(err) {
				reject({
					code: 401,
					data: '',
					message: '操作失败'
				})
			});

			req.end()
		})
	},
	getWxUserInfo(encryptedData, iv, openid) {
		return new Promise((resolve, reject) => {
			var appId = config.AppId
			var wxUser = null
			dbUtils.findDataByOneId('login', 'openid', openid).then((result) => {
				// 查找session_key
				if (Array.isArray(result) && result.length > 0) {
					return result[0].session_key
				}else {
					return Promise.reject({
						message: 'openid不存在'
					})
				}
			}).then((session_key) => {
				// 解密unionId
				var sessionKey = session_key
				var pc = new WXBizDataCrypt(appId, sessionKey)
				wxUser = pc.decryptData(encryptedData , iv)
				return dbUtils.findDataByOneId('user', 'unionid', wxUser.unionId)
			}).then((result) => {
				// 根据 unionId 查找用户信息
				if (Array.isArray(result) && result.length > 0) {
					delete wxUser.watermark
					return {
						unionid: result[0].unionid
					}
				}else {
					delete wxUser.watermark
					wxUser.create_time = new Date().getTime()
					return dbUtils.insertData('user', wxUser)
				}
			}).then((result) => {
				// 生成token
				var token = Token.encrypt({
					unionid: wxUser.unionId
				}, '2d')
				delete wxUser.unionId
				delete wxUser.openId
				wxUser.token = token
				resolve(wxUser)
			}).catch((result) => {
				console.log('error', result)
				reject(result)
			})
		})
	}
}


module.exports = user
