const allConfig = require("./../../config")
const config = allConfig.database
const mysql = require("mysql")

const pool = mysql.createPool({
	host: config.HOST,
	user: config.USERNAME,
	password: config.PASSWORD,
	database: config.DATABASE
})

let query = function(sql, values) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				resolve(err)
			} else {
				let querys = connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err)
					} else {
						resolve(rows)
					}
					connection.release()
				})
        console.log(querys.sql)
			}
		})
	})

}

let createTable = function(sql) {
	return query(sql, [])
}


let findDataById = function(table, id) {
	let _sql = "SELECT * FROM ?? WHERE id = ? "
	return query(_sql, [table, id])
}

let findDataByOneId = function(table, name, id) {
	let _sql = "SELECT * FROM ?? WHERE " + name + " = ? "
	return query(_sql, [table, id])
}


let findDataByPage = function(table, keys, start, end) {
	let _sql = "SELECT ?? FROM ??  LIMIT ? , ?"
	return query(_sql, [keys, table, start, end])
}

let findDataConditionalByPage = function(table, keys, key, value, start, end) {
	let _sql = "SELECT ?? FROM ?? WHERE ?? = ? LIMIT ? , ?"
	return query(_sql, [keys, table, key, value, start, end])
}


let insertData = function(table, values) {
	let _sql = "INSERT INTO ?? SET ?"
	return query(_sql, [table, values])
}


let updateData = function(table, values, name, id) {
	let _sql = "UPDATE ?? SET ? WHERE " + name + " = ?"
	return query(_sql, [table, values, id])
}


let deleteDataById = function(table, id) {
	let _sql = "DELETE FROM ?? WHERE id = ?"
	return query(_sql, [table, id])
}


let select = function(table, keys) {
	let _sql = "SELECT ?? FROM ?? "
	return query(_sql, [keys, table])
}

let count = function(table, key, value) {
  if (key) {
    let _sql = "SELECT COUNT(*) AS total_count FROM ?? WHERE ?? = ?"
    return query(_sql, [table, key, value])
  } else {
    let _sql = "SELECT COUNT(*) AS total_count FROM ??"
    return query(_sql, [table])
  }
}

module.exports = {
	query,
	createTable,
	findDataById,
	findDataByOneId,
	findDataByPage,
	findDataConditionalByPage,
	deleteDataById,
	insertData,
	updateData,
	select,
	count,
}
