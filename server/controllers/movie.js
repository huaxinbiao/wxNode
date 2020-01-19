const movieModel = require('./../models/movie')
const Token =  require('./../utils/jwt')

module.exports = {
	async movieList(ctx) {
		let limit = 12
		let page = ctx.query.page || 1
		let end = page * limit
		let start = end - limit
		await movieModel.getList(start, end).then((data) => {
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