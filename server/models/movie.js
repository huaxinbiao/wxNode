const dbUtils = require('./../utils/db-util')

const movie = {
	getList(start, end) {
		return new Promise((resolve, reject) => {
			dbUtils.count('video').then((result) => {
				if (start > result[0].total_count) {
					reject({
						message: '数据不存在'
					})
				}else{
					return result[0].total_count
				}
			}).then((count) => {
				dbUtils.findDataByPage('video', ['id', 'title', 'image', 'actor', 'video_time'], start, end).then(result => {
					// console.log(result)
					resolve({
						count: count,
						list: result
					})
				}).catch((error) => {
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