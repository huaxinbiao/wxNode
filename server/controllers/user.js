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
		let loginInfo = await userModel.verifToken(query.token).catch((err) => {
		   console.log(err, 'err')
		})
		if (loginInfo) {
			ctx.loginInfo = loginInfo[0]
			await next(ctx)
		}else{
			ctx.body = {
				code: 705,
				message: 'token不存在',
				data: null,
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
		result.data = wxjson ? wxjson : '' 
		ctx.body = result
	},
	
	/**
	 * 获取用户信息
	 * @param    {obejct} ctx 上下文对象
	 */
	async loginUserInfo(ctx) {
		let userJson = userModel.getWxUserInfo(ctx.request.body.encryptedData, ctx.request.body.iv, ctx.loginInfo.session_key)
		console.log('userJson', userJson)
		let result = {
			code: 200,
			message: '',
			data: userJson,
		}
		ctx.body = result
	}
}
