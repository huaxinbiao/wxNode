const userModel = require('./../models/user')
const noToken = ['/api/user/wxlogin']
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
		let isToken = await userModel.verifToken(query.token).catch((err) => {
		   console.log(err, 'err')
		})
		if (isToken) {
			await next()
		}else{
			ctx.body = {
				code: 401,
				message: 'token不存在',
				data: null,
			}
			return
		}
	},
	
	/**
	 * 获取用户信息
	 * @param    {obejct} ctx 上下文对象
	 */
	loginUserInfo(ctx) {
		let result = {
			success: false,
			message: '',
			data: null,
		}

		ctx.body = result
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
		let wxjson = await userModel.wxLogin(code).catch((err) => {
       console.log(err)
			 result.code = 401
			 result.message = err
    })
		result.data = wxjson ? wxjson : '' 
		ctx.body = result
	}
}
