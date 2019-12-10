const userModel = require('./../models/user')
const Token =  require('./../utils/jwt')
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
	}
}
