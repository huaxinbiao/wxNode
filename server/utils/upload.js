const path = require('path');
const fs = require('fs');



const upload = (file, folder) => {
  // 创建可读流
	const reader = fs.createReadStream(file.path)
	
	let filePath = path.resolve(__dirname, '../../upload/interim/' + folder) + `/${file.name}`
	// 创建可写流
	const upStream = fs.createWriteStream(filePath)
	// 可读流通过管道写入可写流
	reader.pipe(upStream)
}

module.exports = upload