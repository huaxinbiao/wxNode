const dbUtils = require('./../utils/db-util')

const movie = {
	getList(start, end, type) {
		return new Promise((resolve, reject) => {
			dbUtils.count('video', 'video_type', type).then((result) => {
				if (start > result[0].total_count) {
					reject({
						message: '数据不存在'
					})
				}else{
					return result[0].total_count
				}
			}).then((count) => {
        console.log(start, end)
				dbUtils.findDataConditionalByPage('video', ['id', 'title', 'image', 'actor', 'video_time', 'video_type'], 'video_type', type, start, end).then(result => {
					resolve({
						count: count,
						list: result
					})
				}).catch((error) => {
					console.log(error)
					reject(error)
				})
			}).catch(() => {
				reject(error)
			})
		})
	},
	getInfo(id) {
		return new Promise((resolve, reject) => {
			dbUtils.findDataById('video', id).then(result => {
				resolve(result[0])
			}).catch((error) => {
				reject(error)
			})
		})
	}
}

module.exports = movie