const config = require('./../../config')
const dbUtils = require('./../utils/db-util')
const utilsFile =  require('./../utils/upload')
const Joi = require('joi')

const dynamic = {
	/*
	 * 验证数据,移动文件
	 */
	setImage(parameter, uuid) {
		return new Promise((resolve, reject) => {
			let schema = Joi.object().keys({
				type: Joi.number().required(),
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
					return dbUtils.insertData('dynamics', {
						uuid: uuid,
						type: parameter.type,
						img_url: images.join(';'),
						content: parameter.content,
						create_time: new Date().getTime()
					})
				}).then(result => {
					resolve({
						message: '成功'
					})
				}).catch((error) => {
					reject(error.message)
				})
			}
		})
	}
}


module.exports = dynamic
