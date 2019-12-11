const path = require('path');
const fs = require('fs');
const stringRandom = require('string-random');

const filePaths = (filePath) => {
	// 文件夹是否存在, 不存在创建
	var date = new Date()
	var time = date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
	var absolutePath = path.join(__dirname, filePath, time)
	if (mkdirsSync(absolutePath)) {
		// 返回相对路径
		return path.join(filePath, time)
	}
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}
	
const uploadFile = (file, folder) => {
	return new Promise((resolve, reject) => {
		try{
			// 创建可读流
			const reader = fs.createReadStream(file.path)
			let interimPath = filePaths(`../../upload/interim/${folder}`)
			let fileName = new Date().getTime() + '-' + stringRandom(16, {}) + path.extname(file.name)
			let filePath = path.join(__dirname, interimPath, fileName)
			try{
				// 创建可写流
				const upStream = fs.createWriteStream(filePath)
				// 可读流通过管道写入可写流
				reader.pipe(upStream)
				reader.on('end', () => {
				  resolve({
						path: filePath.slice(filePath.indexOf("upload")-1)
					})
				});
			}catch(e){
				//TODO handle the exception
				reject({
					message: '上传失败'
				})
			}
		}catch(e){
			//TODO handle the exception
			reject({
				message: '上传失败'
			})
		}
		
	})
}
/*
 * 移动文件
 * interimPath 数组,文件路径
 */
const moveFile = (interimPath) => {
	return new Promise((resolve, reject) => {
		let images = []
		let error = []
		try{
			for (let i = 0; i < interimPath.length; i++) {
				pasteFile(interimPath[i], (res) => {
					images.push(res.path)
					if (i+1 == interimPath.length) {
						resolve({
							images: images,
							error: error
						})
					}
				}, () => {
					error.push({
						index: i,
						path: interimPath[i]
					})
					if (i+1 == interimPath.length) {
						if (error.length == interimPath.length) {
							reject({
								message: '文件不存在'
							})
						} else {
							resolve({
								images: images,
								error: error
							})
						}
					}
				})
			}
		}catch(e){
			//TODO handle the exception
			reject({
				message: '文件移动失败'
			})
		}
	})
}

/* 
 * 移动文件
 * interimPath 文件路径
 */
const pasteFile = (interimPath, callback, error) => {
	try{
		// 创建可读流
		let interimWholePath = path.resolve(__dirname, '../../' + interimPath)
		if (!fs.existsSync(interimWholePath)) {
			error({
				message: '文件不存在'
			})
		}
		const reader = fs.createReadStream(interimWholePath)
		// 创建可写流
		let formalPath = interimWholePath.replace(/interim/, 'formal')
		// let filePath = path.join(__dirname, formalPath)
		mkdirsSync(path.dirname(formalPath))
		let upStream = fs.createWriteStream(formalPath)
		// 可读流通过管道写入可写流
		reader.pipe(upStream)
		reader.on('end', () => {
			fs.unlink(interimWholePath, (err) => {
			  if (err) throw err;
			  // console.log('文件已删除')
			})
			callback({
				path: interimPath.replace(/interim/, 'formal')
			})
		});
		// 监听错误
		reader.on('error',function (err) {
			error({
				message: '文件不存在'
			})
		})
	}catch(e){
		//TODO handle the exception
		console.log(e)
		error({
			message: '文件不存在'
		})
	}
}

module.exports = {
	uploadFile: uploadFile,
	moveFile: moveFile
}
