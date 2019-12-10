const dynamicModel = require('./../models/dynamic')
const utilsFile =  require('./../utils/upload')

module.exports = {
	/* 
	 * 文件上传
	 */
	async upload(ctx) {
		let result = {
			code: 200,
			message: '',
			data: null
		}
		const file = ctx.request.files.file; // 获取上传文件
		if (file.type.indexOf('image') > -1 && ctx.request.body.type == 'image'){
			// 图片
			result.data = await utilsFile.uploadFile(file, 'images')
		} else if (file.type.indexOf('video') > -1 && ctx.request.body.type == 'video') {
			// 视频
			result.data = await utilsFile.uploadFile(file, 'video')
		} else if (file.type.indexOf('audio') > -1 && ctx.request.body.type == 'audio') {
			// 音频
			result.data = await utilsFile.uploadFile(file, 'audio')
		} else {
			result.code = 401
			result.message = '不允许上传的文件类型'
		}
		ctx.body = result
	},
	
	/* 
	 * 发布动态
	 */
	async dynamicSave(ctx) {
		let result = {
			code: 200,
			message: '',
			data: ctx.request.body
		}
		let parameter = ctx.request.body
		switch (parameter.type){
			case 'image':
				if (parameter.content || (parameter.images && parameter.images.length>0)) {
					await dynamicModel.setImage(parameter).then((res) => {
						result.message = res.message
						result.data = res.data
					}).catch((error) => {
						result.code = 401
						result.message = error
					})
				} else {
					result.code = 401
					result.message = '图片和内容不能都为空'
				}
				break;
			default:
				result.code = 401
				result.message = '缺少type参数'
				break;
		}
		ctx.body = result
	},
	
	/* 
	 * 用户动态列表
	 */
	async dynamicList(ctx) {
		let result = {
			code: 200,
			message: '',
			data: {
				unionid: ctx.unionid,
				uuid: ctx.uuid
			}
		}
		ctx.body = result
	}
}
