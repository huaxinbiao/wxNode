const movieModel = require('./../models/movie')
const Token =  require('./../utils/jwt')

module.exports = {
	async movieList(ctx) {
		let limit = 30
		let type = ctx.query.type || ''
		let page = ctx.query.page || 1
		let start = page * limit - limit
		await movieModel.getList(start, limit, type).then((data) => {
			let result = {
				code: 200,
				message: '成功',
				data: data,
			}
			ctx.body = result
		}).catch(() => {
			let result = {
				code: 401,
				message: ''
			}
			ctx.body = result
		})
	},
	async movieInfo(ctx) {
		let id = ctx.query.id
		await movieModel.getInfo(id).then((data) => {
			let result = {
				code: 200,
				message: '成功',
				data: data,
			}
			ctx.body = result
		}).catch(() => {
			let result = {
				code: 401,
				message: ''
			}
			ctx.body = result
		})
	}
}