const path = require('path');
const fs = require('fs');
const stringRandom = require('string-random');

const filePaths = (file_path) => {
	// 文件夹是否存在, 不存在创建
	var date = new Date()
	var time = date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
	var absolute_path = path.join(__dirname, file_path, time)
	if (mkdirsSync(absolute_path)) {
		// 返回相对路径
		return path.join(file_path, time)
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
	
const upload = (file, folder) => {
	return new Promise((resolve, reject) => {
		try{
			// 创建可读流
			const reader = fs.createReadStream(file.path)
			let file_path = filePaths(`../../upload/interim/${folder}`)
			let file_name = new Date().getTime() + '-' + stringRandom(16, {}) +path.extname(file.name)
			let filePath = path.join(__dirname, file_path) + `/${file_name}`
			try{
				// 创建可写流
				const upStream = fs.createWriteStream(filePath)
				// 可读流通过管道写入可写流
				reader.pipe(upStream)
				reader.on('end', () => {
				  resolve({
						path: file_path + `/${file_name}`
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

module.exports = upload
