const userModel = require('./../models/user')

module.exports = {
	/**
	 * 获取用户信息
	 * @param    {obejct} ctx 上下文对象
	 */
	getLoginUserInfo(ctx) {
		let result = {
			success: false,
			message: '',
			data: null,
		}

		ctx.body = result
	},

	/* 
	 * 微信登录
	 * @param ｛string｝code
	 */
	/**
	 * 微信登录
	 * @param    {obejct} ctx 上下文对象
	 */
	async wxLogin(ctx) {
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
