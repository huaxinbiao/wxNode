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
	}
}
