const jwt = require('jsonwebtoken');
const key = 'token_key'
const Token = {
	encrypt: function(data, time) { //data加密数据，time过期时间
		return jwt.sign(data, key, {
			expiresIn: time
		})
	},
	decrypt: function(token) {
		try {
			let data = jwt.verify(token, key)
			return {
				token: true,
				data: data
			};
		} catch (e) {
			return {
				token: false,
				data: e
			}
		}
	}
}
module.exports = Token;
