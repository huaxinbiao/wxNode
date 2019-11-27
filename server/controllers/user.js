const userModel = require('./../models/user')
const Token =  require('./../utils/jwt')
const Upload =  require('./../utils/upload')
const noToken = ['/api/user/wxlogin', '/api/user/loginUserInfo']
module.exports = {
	/*
	 * 验证token
	 * @param    {obejct} ctx 上下文对象
	 */
	async verifToken(ctx, next) {
		if (noToken.indexOf(ctx.path) > -1) {
			await next()
			return
		}
		var query = {}
		switch(ctx.method.toUpperCase()){
			case 'GET':
				query = ctx.query
				break;
			case 'POST':
				query = ctx.request.body
				break;
			default:
				break;
		}
		var tokenInfo = Token.decrypt(query.token)
		if (tokenInfo.token) {
			ctx.unionid = tokenInfo.data.unionid,
			ctx.uuid = tokenInfo.data.uuid
			await next(ctx)
		}else{
			if (tokenInfo.data.name = 'TokenExpiredError') {
				ctx.body = {
					code: 705,
					message: 'token已过期',
					data: null,
				}
			} else {
				ctx.body = {
					code: 700,
					message: 'token不存在',
					data: null,
				}
			}
			return
		}
	},
	
	/**
	 * 微信登录
	 * @param    {obejct} ctx 上下文对象
	 */
	async wxLogin(ctx, i) {
		let code = ctx.query.code
		let result = {
			code: 200,
			message: '',
			data: null,
		}
		let wxJson = await userModel.wxLogin(code).catch((err) => {
       console.log(err)
			 result.code = 401
			 result.message = err
    })
		result.data = wxJson ? wxJson : '' 
		ctx.body = result
	},
	
	/**
	 * 获取用户信息
	 * @param    {obejct} ctx 上下文对象
	 */
	async loginUserInfo(ctx) {
		await userModel.getWxUserInfo(ctx.request.body.encryptedData, ctx.request.body.iv, ctx.request.body.openid).then((data) => {
			let result = {
				code: 200,
				message: '成功',
				data: data,
			}
			ctx.body = result
		}).catch((error) => {
			let result = {
				code: 401,
				message: error.message,
				data: null
			}
			if (error.message == 'Illegal Buffer') {
				result.code = 705
			}
			ctx.body = result
		})
	},
	
	/* 
	 * 用户动态列表
	 */
	async dynamicList(ctx) {
		let result = {
			code: 200,
			message: '',
			data: {
				unionid: ctx.unionid,
				uuid: ctx.uuid
			}
		}
		ctx.body = result
	},
	
	/* 
	 * 文件上传
	 */
	async upload(ctx) {
		let result = {
			code: 200,
			message: '',
			data: null
		}
		const file = ctx.request.files.file; // 获取上传文件
		if (file.type.indexOf('image') > -1 && ctx.request.body.type == 'image'){
			// 图片
			Upload(file, 'images')
		} else if (file.type.indexOf('video') > -1 && ctx.request.body.type == 'video') {
			// 视频
			Upload(file, 'video')
		} else if (file.type.indexOf('audio') > -1 && ctx.request.body.type == 'audio') {
			// 音频
			Upload(file, 'audio')
		} else {
			result.code = 401
			result.message = '不允许上传的文件类型'
		}
		ctx.body = result
	}
}
