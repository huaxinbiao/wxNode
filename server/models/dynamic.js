const config = require('./../../config')
const dbUtils = require('./../utils/db-util')
const utilsFile =  require('./../utils/upload')
const Joi = require('joi')

const dynamic = {
	/*
	 * 验证数据,移动文件
	 */
	setImage(parameter) {
		return new Promise((resolve, reject) => {
			let schema = Joi.object().keys({
				type: Joi.string().required(),
				images: Joi.array().max(9).items(Joi.object().keys({path: Joi.string()})),
				content: Joi.string().max(1000).allow('')
			}).or('images', 'content')
			let Verif = Joi.validate(parameter, schema, {allowUnknown: true})
			if (Verif.error) {
				reject(Verif.error.details[0].message)
			} else {
				var images = []
				for (let i=0; i<parameter.images.length; i++) {
					if (parameter.images[i].path) {
						images.push(parameter.images[i].path)
					}
				}
				utilsFile.moveFile(images).then((result) => {
					resolve({
						message: '成功',
						data: result
					})
				}).catch((error) => {
					reject(error.message)
				})
			}
		})
	}
}


module.exports = dynamic
